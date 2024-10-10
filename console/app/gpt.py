from dotenv import load_dotenv
from .cnn_lstm import combinations
import logging
import openai
import os
import json
from .models import mongo

load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")

def get_chatgpt_response(message):
    model = "ft:gpt-4o-mini-2024-07-18:personal::A9kj7tNX"
    
    # Retrieve previous messages from MongoDB for current user
    chat_history = list(mongo.db.ChatHistory.find({"role": {"$in": ["user", "assistant"]}}).sort("datetime", 1))

    if not chat_history:
        # If no previous conversation exists, start a new one
        messages = [
            {"role": "system", "content": """
            Kamu adalah asisten kesehatan mental, Nama kamu adalah Mira. 
            Kamu sedang berbicara dengan pasien yang bisa saja memiliki gangguan kesehatan mental. 
            Kamu harus memberikan dukungan dan saran kepada orang tersebut. 
            Pemberian saran harus melalui pendekatan CBT untuk merubah pemikiran irrasional menjadi lebih rasional. 
            Dalam melakukan sesi konseling kamu harus menggali lebih dalam mengenai gejala dan apa yang dirasakan pasien 
            sampai menemukan titik permasalahan nya sehingga kamu dapat berlanjut untuk melakukan suatu strategi teknik pernapasan."""},
            {"role": "user", "content": message}
        ]
    else:
        # Build messages array from previous conversation
        messages = [{"role": chat['role'], "content": chat['text']} for chat in chat_history]
        messages.append({"role": "user", "content": message})

    # Call the OpenAI API to get the response
    response = openai.ChatCompletion.create(
        model=model, 
        messages=messages
    )
    
    # Extract the assistant (chatbot) response    
    chatbot_response = response.choices[0].message['content']
    return chatbot_response


def get_gpt_explanation(depression, anxiety, stress):
    question = f"Dari kuisioner DASS 21 yang sudah pengguna lakukan hasil skor yang didapat Stres {stress}, Kecemasan {anxiety}, Depresi {depression}."
    response = get_chatgpt_response(question)
    return response


def get_gpt_Ofinal_exaplanation(Ocnn, Olstm, Odass):
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