import subprocess
import base64
import json
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

audio_path_mp3 = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.mp3')
audio_path_wav = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.wav')
audio_path_json = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.json')

def audio_file_to_base64(file_path):
    try:
        with open(file_path, "rb") as audio_file:
            encoded_string = base64.b64encode(audio_file.read()).decode()
        return encoded_string
    except Exception as e:
        print(f"Error encoding file to base64: {e}")
        return None


def read_json_transcript(file_path):
    try:
        with open(file_path, "r") as json_file:
            return json.load(json_file)
    except Exception as e:
        print(f"Error reading JSON transcript: {e}")
        return None


def lip_sync_message():
    try:
        rhubarb_executable = os.path.join(PROJECT_ROOT, "rhubarb", "./rhubarb")
        
        if not os.path.isfile(rhubarb_executable):
            raise FileNotFoundError(f"Rhubarb executable not found at {rhubarb_executable}")
        
        subprocess.run([rhubarb_executable, "-f", "json", "-o", audio_path_json, audio_path_wav, "-r", "phonetic"], check=True)
        print(f"Lip sync data successfully generated and saved to {audio_path_json}")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running Rhubarb process: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
