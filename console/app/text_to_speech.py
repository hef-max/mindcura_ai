import os
from elevenlabs import ElevenLabs, VoiceSettings
from pydub import AudioSegment

# Define the root of your project
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# Function to convert text to speech using Eleven Labs API
def text_to_speech_elevenlabs(text):
    
    try:
        client = ElevenLabs(
            api_key= os.environ.get("ELEVEN_LABS_API_KEY"),
        )
        audio_stream = client.text_to_speech.convert(
            voice_id= os.environ.get("VOICE_ID") ,
            optimize_streaming_latency="0",
            output_format="mp3_22050_32",
            text=text,
            voice_settings=VoiceSettings(
                stability=0.1,
                similarity_boost=0.3,
                style=0.2,
            ),
        )

        audio_file_path = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.mp3')
        with open(audio_file_path, 'wb') as audio_file:
            for chunk in audio_stream:
                audio_file.write(chunk)

        audio_path_mp3 = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.mp3')
        audio = AudioSegment.from_file(audio_path_mp3)

        audio_path_wav = os.path.join(PROJECT_ROOT, 'public', 'audios', 'message_0.wav')
        audio.export(audio_path_wav, format='wav')

    except Exception as e:
        print(f"Error converting text to speech: {e}")
