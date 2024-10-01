import librosa
import cv2
import warnings
import numpy as np
import tensorflow as tf
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

tf.compat.v1.reset_default_graph()

cnn_model = tf.keras.models.load_model(os.path.join(PROJECT_ROOT, 'public', 'model', 'model_v1.2.h5'))
lstm_model = tf.keras.models.load_model(os.path.join(PROJECT_ROOT, 'public', 'model', 'best_audio_model.h5'))

cnn_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
lstm_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

def classify_face_emotion(image):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image, (120, 120)) 
    image = np.expand_dims(image, axis=-1)  
    image = np.expand_dims(image, axis=0)  
    image = image / 255.0  

    predictions = cnn_model.predict(image)
    emotion = np.argmax(predictions) 
    return emotion, predictions


def extract_audio_features(audio_file, n_mfcc=13, n_chroma=12, n_mels=128, duration=2.5, offset=0.6):
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", FutureWarning)
        y, sr = librosa.load(audio_file, sr=None, duration=duration, offset=offset)

    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mfccs = np.mean(mfccs.T, axis=0)

    stft = np.abs(librosa.stft(y))
    chroma = librosa.feature.chroma_stft(S=stft, sr=sr, n_chroma=n_chroma)
    chroma = np.mean(chroma.T, axis=0)

    mel = librosa.feature.melspectrogram(y= y, sr=sr, n_mels=n_mels)
    mel = np.mean(mel.T, axis=0)

    features = np.hstack([mfccs, chroma, mel])

    if len(features) < 420:
        features = np.pad(features, (0, 420 - len(features)), 'constant')
    elif len(features) > 420:
        features = features[:420]

    return features

def classify_voice_emotion(audio_file):
    features = extract_audio_features(audio_file)
    features = np.expand_dims(features, axis=0)
    features = np.expand_dims(features, axis=-1) 
    
    predictions = lstm_model.predict(features)
    emotion = np.argmax(predictions) 
    return emotion, predictions


def combinations(Ocnn, Olstm, Odass):
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


