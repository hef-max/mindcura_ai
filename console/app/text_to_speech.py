import os
from elevenlabs.client import ElevenLabs

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

def text_to_speech_elevenlabs(text):
    eleven_labs_api_key = os.getenv("ELEVEN_LABS_API_KEY")
    
    # Inisialisasi API Eleven Labs
    api = ElevenLabs(api_key=eleven_labs_api_key)
    
    try:
        voice_id = os.getenv("VOICE_ID")  # Ganti dengan voice ID yang sesuai
        
        response = api.text_to_speech(voice_id, text)
        
        audio_file_path = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.mp3')  # Ganti dengan path yang sesuai
        with open(audio_file_path, 'wb') as audio_file:
            audio_file.write(response.content)

        print(f"Audio saved to {audio_file_path}")

    except Exception as e:
        print(f"Error converting text to speech: {e}")
