
from google.oauth2 import service_account
from google.cloud import texttospeech
from pydub import AudioSegment
import subprocess
import base64
import json
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

audio_path_mp3 = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.mp3')
audio_path_wav = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.wav')
audio_path_json = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.json')

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(PROJECT_ROOT, 'hefry-api-982ff5fc28df.json')
credentials = service_account.Credentials.from_service_account_file(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
tts_client = texttospeech.TextToSpeechClient(credentials=credentials)

def audio_file_to_base64(file_path):
    with open(file_path, "rb") as audio_file:
        encoded_string = base64.b64encode(audio_file.read()).decode()
    return encoded_string

def read_json_transcript(file_path):
    with open(file_path, "r") as json_file:
        return json.load(json_file)

def lip_sync_message():
    rhubarb_executable = os.path.join(PROJECT_ROOT, 'rhubarb', 'rhubarb')
    subprocess.run([rhubarb_executable, "-f", "json", "-o", audio_path_json, audio_path_wav, "-r", "phonetic"])

def text_to_speech_google(text):
    text = text.replace('.', ', ').replace(':', ',').replace('*', '')

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code="id-ID",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        pitch=-2.0,  
        speaking_rate=0.9 
    )

    response = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    
    with open(audio_path_mp3, "wb") as out:
        out.write(response.audio_content)

    audio = AudioSegment.from_file(audio_path_mp3)
    audio.export(audio_path_wav, format='wav')