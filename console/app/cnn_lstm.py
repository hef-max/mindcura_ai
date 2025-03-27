import cv2
import warnings
import numpy as np
import os
import tflite_runtime.interpreter as tflite
import librosa
import torch
from torchvision import transforms
import warnings 
warnings.filterwarnings('ignore')

device = torch.device('cpu')

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# Path ke model TFLite yang sudah dikonversi
TFLITE_MODEL_PATH = os.path.join(PROJECT_ROOT, 'public', 'model', 'audio_model.tflite')

# Load TFLite model untuk audio
try:
    audio_interpreter = tflite.Interpreter(model_path=TFLITE_MODEL_PATH)
    audio_interpreter.allocate_tensors()
    
    # Dapatkan detail input dan output
    audio_input_details = audio_interpreter.get_input_details()
    audio_output_details = audio_interpreter.get_output_details()
    print(f"Audio model loaded successfully from: {TFLITE_MODEL_PATH}")
except Exception as e:
    print(f"Error loading audio model: {str(e)}")
    audio_interpreter = None

def preprocess_frame(frame):
    transform = transforms.Compose([
        transforms.ToPILImage(),  # Konversi numpy array ke PIL image
        transforms.Resize((48, 48)),  # Resize ke ukuran input model
        transforms.Grayscale(),  # Ubah gambar menjadi grayscale 
        transforms.ToTensor(),  # Konversi gambar ke tensor
        transforms.Normalize(mean=[0.485], std=[0.229])  # Normalisasi
    ])

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    preprocessed_frame = transform(frame_rgb)
    preprocessed_frame = preprocessed_frame.unsqueeze(0)
    return preprocessed_frame

def classify_expression(frame):
    # Fungsi ini dinonaktifkan karena menggunakan model CNN yang belum dikonversi
    # Untuk implementasi perlu konversi model PyTorch ke ONNX atau TFLite
    pass

def classify_face_emotion(image):
    # Fungsi ini dinonaktifkan karena menggunakan model CNN yang belum dikonversi
    # Untuk implementasi perlu konversi model PyTorch ke ONNX atau TFLite
    pass

def extract_audio_features(audio_file, n_mfcc=13, n_chroma=12, n_mels=128, duration=2.5, offset=0.6):
    """Ekstraksi fitur audio untuk input ke model TFLite"""
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", FutureWarning)
        y, sr = librosa.load(audio_file, sr=None, duration=duration, offset=offset)

    # Ekstrak MFCC
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mfccs = np.mean(mfccs.T, axis=0)

    # Ekstrak Chroma
    stft = np.abs(librosa.stft(y))
    chroma = librosa.feature.chroma_stft(S=stft, sr=sr, n_chroma=n_chroma)
    chroma = np.mean(chroma.T, axis=0)

    # Ekstrak Mel Spectogram
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels)
    mel = np.mean(mel.T, axis=0)

    # Gabungkan semua fitur
    features = np.hstack([mfccs, chroma, mel])

    # Standardize panjang fitur ke 420
    if len(features) < 420:
        features = np.pad(features, (0, 420 - len(features)), 'constant')
    elif len(features) > 420:
        features = features[:420]

    return features

def classify_voice_emotion(audio_file):
    """Klasifikasi emosi suara menggunakan model TFLite"""
    if audio_interpreter is None:
        return "neutral"  # Default jika model tidak tersedia
        
    classify_value = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}
    current_emotion = classify_value.get(4)  # Default ke neutral
    
    try:
        # Ekstrak fitur audio
        features = extract_audio_features(audio_file)
        
        # Reshape untuk TFLite interpreter
        features = np.expand_dims(features, axis=0)  # Tambah dimensi batch
        features = np.expand_dims(features, axis=-1)  # Tambah dimensi channel
        
        # Pastikan tipe data sesuai dengan yang diharapkan oleh model
        input_tensor_dtype = audio_input_details[0]['dtype']
        features = features.astype(input_tensor_dtype)
        
        # Set input tensor
        audio_interpreter.set_tensor(audio_input_details[0]['index'], features)
        
        # Run inference
        audio_interpreter.invoke()
        
        # Dapatkan hasil
        predictions = audio_interpreter.get_tensor(audio_output_details[0]['index'])
        emotion_index = np.argmax(predictions[0])
        
        return classify_value.get(emotion_index, current_emotion)
    except Exception as e:
        print(f"Error during voice emotion classification: {str(e)}")
        return current_emotion

def convert_keras_to_tflite(keras_model_path, tflite_output_path):
    """
    Fungsi utilitas untuk mengkonversi model Keras ke TFLite
    Fungsi ini dijalankan di lingkungan development, bukan di VPS
    """
    try:
        import tensorflow as tf
        # Load model Keras
        model = tf.keras.models.load_model(keras_model_path)
        
        # Konversi ke TFLite
        converter = tf.lite.TFLiteConverter.from_keras_model(model)
        tflite_model = converter.convert()
        
        # Simpan model TFLite
        with open(tflite_output_path, 'wb') as f:
            f.write(tflite_model)
            
        print(f"Model berhasil dikonversi dan disimpan di: {tflite_output_path}")
        return True
    except Exception as e:
        print(f"Error during model conversion: {str(e)}")
        return False


def combinations(Ocnn, Olstm, Odass):
    """Kombinasi hasil dari berbagai model"""
    w1 = 0.6  # bobot untuk model CNN
    w2 = 0.4  # bobot untuk model LSTM
    
    # Gabungan hasil CNN dan LSTM
    Xgabungan = w1 * Ocnn + w2 * Olstm
    
    a = 0.7  # bobot untuk model gabungan (CNN + LSTM)
    b = 0.3  # bobot untuk model DASS
    
    # Hasil final untuk depresi, stres, dan kecemasan
    Ofinal_depresi = (a * Xgabungan) + (b * Odass[0])  # Depresi pada indeks ke-0
    Ofinal_stres = (a * Xgabungan) + (b * Odass[1])    # Stres pada indeks ke-1
    Ofinal_kecemasan = (a * Xgabungan) + (b * Odass[2])  # Kecemasan pada indeks ke-2
    
    return Ofinal_depresi, Ofinal_stres, Ofinal_kecemasan