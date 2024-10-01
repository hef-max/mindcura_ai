from dotenv import load_dotenv
from .cnn_lstm import combinations
import logging
import openai
import os
import json

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")

def get_chatgpt_response(message):
    response = openai.ChatCompletion.create(
        model="ft:gpt-4o-mini-2024-07-18:personal::A9kj7tNX", 
        messages=[
            {"role": "system", "content": "Anda adalah seorang Asisten Kesehatan Mental bernama Mira yang bertujuan untuk Swamedikasi"},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message['content']

def get_gpt_explanation(Ocnn, Olstm, Odass):
    Ofinal_depresi, Ofinal_stres, Ofinal_kecemasan = combinations(Ocnn, Olstm, Odass)
    
    question = (
        f"Dari kuisioner DASS 21 skor: Depresi - {Ofinal_depresi:.3f}, "
        f"Kecemasan - {Ofinal_kecemasan:.3f}, Stres - {Ofinal_stres:.3f}. "
        f"Bagaimana kondisi mental pengguna dan rekomendasi yang bisa diberikan?"
    )
    
    response = get_chatgpt_response(question)
    return response

def resume_gpt(text):
    resume = f"Buatkan kesimpulan sederhana dari kalimat ini maksimal 3 baris kalimat: {text}"
    return get_chatgpt_response(resume)

def get_chatgpt_summary(chat_history):
    prompt = f"""
    Berikut adalah riwayat percakapan antara pengguna dan avatar konsultasi.
    Buat kesimpulan berdasarkan percakapan ini, dan sebutkan kecenderungan emosi pengguna:
    
    {chat_history}
    
    Kesimpulan dalam format JSON:
    {{
        "summary": "Kesimpulan dari percakapan",
        "tendency": "Kecenderungan emosi (misal: depresi, cemas, stres)"
    }}
    """
    response = get_chatgpt_response(prompt)
    
    try:
        result = json.loads(response.text)
        return result
    except json.JSONDecodeError:
        logging.error(f"Failed to parse GPT response: {response.text}")
        return {"summary": "N/A", "tendency": "N/A"}

def get_dsm_explanation():
    question = "Bisakah Anda merangkum hasil dari konsultasi saya?"
    response = get_chatgpt_response(question)
    return response