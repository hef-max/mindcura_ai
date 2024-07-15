# from tensorflow.keras.models import load_model
from flask import Blueprint, jsonify, request, current_app, send_file
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from .models import *
import datetime
import logging
import json
from flask_pymongo import PyMongo
import google.generativeai as genai
import os
import cv2
import io
from pydub import AudioSegment
# from transformers import pipeline
from google.oauth2 import service_account
from google.cloud import texttospeech
from dotenv import load_dotenv
from pygame import mixer
import base64
from werkzeug.utils import secure_filename
import subprocess
import openai
import numpy as np
import librosa
from fpdf import FPDF
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

logging.basicConfig(level=logging.DEBUG)

# pretrained_name = "w11wo/indonesian-roberta-base-sentiment-classifier"

# classifier = pipeline(
#     "sentiment-analysis",
#     model=pretrained_name,
#     tokenizer=pretrained_name
# )

mongo = PyMongo()
auth = Blueprint('auth', __name__)

load_dotenv()
mixer.init()

# Model CNN dan LSTM 
# cnn_model = load_model('./model_v1.2.h5')
# lstm_model = load_model('./best_audio_model.h5')
# cnn_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
# lstm_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

cnn_model = ""
lstm_model = ""


# Save the audio to a file
audio_path_mp3 = f"D:/MindCura/apps/mindcura-ai/public/audios/message_0.mp3"
audio_path_wav = f"D:/MindCura/apps/mindcura-ai/public/audios/message_0.wav"
audio_path_json = f"D:/MindCura/apps/mindcura-ai/public/audios/message_0.json"

openai.api_key = os.environ["OPENAI_API_KEY"]

# Configure Google Generative AI
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

# Configure Google Text-to-Speech
credentials = service_account.Credentials.from_service_account_file(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
tts_client = texttospeech.TextToSpeechClient(credentials=credentials)

class QuestionnaireResponseMongo:
    def __init__(self, user_id, answers):
        self.user_id = user_id
        self.answers = answers
        self.timestamp = datetime.datetime.now()

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "answers": self.answers,
            "timestamp": self.timestamp
        }

#2gK@rT5!hL9^mD8*
def hitung_usia(tanggal_lahir):
    tanggal_lahir = f'{tanggal_lahir}'
    tanggal_lahir = datetime.datetime.strptime(tanggal_lahir, "%Y-%m-%d %H:%M:%S")
    tanggal_hari_ini = datetime.datetime.today()
    usia = tanggal_hari_ini.year - tanggal_lahir.year
    if (tanggal_hari_ini.month, tanggal_hari_ini.day) < (tanggal_lahir.month, tanggal_lahir.day):
        usia -= 1
    return usia

def resume(text):
    res = f"buatkan kesimpulan sederhana dari text ini maksimal 3 baris kalimat: {text}"
    return get_chatgpt_response(res)

def generate_pdf(consultation_id):
    print(consultation_id)
    consultation = ConsultationHistory.query.filter_by(id=consultation_id).first()
    filename = f"consultation_summary_{consultation_id}.pdf"
    document = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Define custom styles
    title_style = styles['Heading1']
    subtitle_style = styles['Heading2']
    normal_style = styles['BodyText']
    custom_style = ParagraphStyle(
        name='Custom',
        parent=normal_style,
        fontName='Helvetica',
        fontSize=12,
        leading=14,
        spaceAfter=10,
    )
    
    content = []

    # Add Title
    content.append(Paragraph("Asesmen Klinis", title_style))
    content.append(Spacer(1, 12))
    
    # Identitas Subjek
    content.append(Paragraph("Identitas Subjek", subtitle_style))
    content.append(Spacer(1, 12))
    content.append(Paragraph(f"Nama: {current_user.username}", custom_style))
    content.append(Paragraph(f"Usia: {hitung_usia(current_user.birth)}", custom_style))
    content.append(Paragraph(f"Jenis Kelamin: {current_user.jeniskelamin}", custom_style))
    content.append(Paragraph(f"Pendidikan: {current_user.univ}", custom_style))
    content.append(Paragraph(f"Pekerjaan: {current_user.status}", custom_style))
    content.append(Paragraph(f"Anak ke: {current_user.anakke}", custom_style))
    content.append(Spacer(1, 12))
    
    # Riwayat Keluhan
    content.append(Paragraph("RIWAYAT KELUHAN", subtitle_style))
    content.append(Spacer(1, 12))
    content.append(Paragraph(f"Waktu: {current_user.created_at}", custom_style))
    content.append(Paragraph(f"Deskripsi: ", custom_style))
    content.append(Spacer(1, 12))

    # Asesmen
    content.append(Paragraph("ASESMEN", subtitle_style))
    content.append(Spacer(1, 12))
    content.append(Paragraph("Hasil Observasi Aktivitas Sehari-hari: ", custom_style))
    content.append(Paragraph("Hasil Observasi Perilaku saat Wawancara: ", custom_style))
    content.append(Paragraph("Kesimpulan: ", custom_style))
    content.append(Spacer(1, 12))
    
    # Diagnosis
    content.append(Paragraph("Hasil Konsultasi", subtitle_style))
    content.append(Spacer(1, 12))
    content.append(Paragraph(f"Aksis I :", custom_style))
    content.append(Spacer(1, 12))
    
    # Hasil DASS-21
    content.append(Paragraph("B hasil DASS-21:", subtitle_style))
    content.append(Paragraph(f"Hasil DASS: {consultation.resdass}", custom_style))
    content.append(Paragraph(f"Hasil DSM: {consultation.resdsm}", custom_style))
    content.append(Spacer(1, 12))

    # Hasil Wawancara
    content.append(Paragraph("Hasil Wawancara", subtitle_style))
    content.append(Spacer(1, 12))
    content.append(Paragraph(f"Kesimpulan: {consultation.chathistory}", custom_style))

    # Build the PDF
    document.build(content)
    
    return filename


def save_summary(name, ava, date, resdass, resdsm, chathistory):
    summary = ConsultationHistory(
        name=name,
        ava=ava,
        date=date,
        resdass=resdass,
        resdsm=resdsm,
        chathistory=chathistory,
        user_id=current_user.id
    )
    db.session.add(summary)
    db.session.commit()

    # Menyimpan juga di MongoDB
    summary_mongo = {
        "name": name,
        "ava": ava,
        "date": date,
        "resdass": resdass,
        "resdsm": resdsm,
        "chathistory": chathistory,
        "user_id": current_user.id,
        "created_at": summary.created_at
    }
    mongo.db.consultation_history.insert_one(summary_mongo)

    return summary.id


def get_chatgpt_response(message):
    response = openai.ChatCompletion.create(
        model="ft:gpt-3.5-turbo-0125:personal:mindcura-llms5:9jKghIM0", 
        messages=[
            {"role": "system", "content": "Kamu adalah asisten kesehatan mental"},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message['content']

def audio_file_to_base64(file_path):
    with open(file_path, "rb") as audio_file:
        encoded_string = base64.b64encode(audio_file.read()).decode()
    return encoded_string

def read_json_transcript(file_path):
    with open(file_path, "r") as json_file:
        return json.load(json_file)

def lip_sync_message():
    subprocess.run(["rhubarb", "-f", "json", "-o", audio_path_json, audio_path_wav, "-r", "phonetic"])

def get_gemini_response(question):
    response = chat.send_message(question)
    return response

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


def classify_face_emotion(image_path):
    if not os.path.exists(image_path):
        print(f"Image file {image_path} does not exist.")
        return None

    image = cv2.imread(image_path)
    if image is None:
        print(f"Could not read the image from {image_path}")
        return None

    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image, (120, 120)) 
    image = np.expand_dims(image, axis=-1)  
    image = np.expand_dims(image, axis=0)  
    image = image / 255.0  

    predictions = cnn_model.predict(image)
    emotion = np.argmax(predictions) 
    return emotion


def classify_voice_emotion(audio_file):
    features = extract_audio_features(audio_file)
    features = np.expand_dims(features, axis=0)
    predictions = lstm_model.predict(features)
    emotion = np.argmax(predictions) 
    return emotion


def extract_audio_features(audio_file, n_mfcc=13, n_chroma=12, n_mels=128, duration=2.5, offset=0.6):
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


def calculate_levels():
    user_id = str(current_user.id)
    qna = QuestionnaireResponse.query.filter_by(user_id=user_id).first()
    anxiety_items = [qna.q2, qna.q5, qna.q8, qna.q11, qna.q16, qna.q19, qna.q21]
    depression_items = [qna.q3, qna.q6, qna.q10, qna.q14, qna.q17]
    stress_items = [qna.q1, qna.q4, qna.q7, qna.q9, qna.q12, qna.q13, qna.q15, qna.q18, qna.q20]

    depression_level = sum([int(item) for item in depression_items]) * 2
    anxiety_level = sum([int(item) for item in anxiety_items]) * 2
    stress_level = sum([int(item) for item in stress_items]) * 2

    return depression_level, anxiety_level, stress_level


def get_gpt_explanation(depression_level, anxiety_level, stress_level):
    question = (
        f"Dari kuisioner DASS-21 scores: Depresi - {depression_level}, Kecemasan - {anxiety_level}, Stres - {stress_level}. "
    )
    response = get_chatgpt_response(question)
    return response


def display_levels(depression_level, anxiety_level, stress_level):
    if depression_level < 14:
        depression_result = 'Depresi: Ringan'
    elif depression_level < 20:
        depression_result = 'Depresi: Sedang'
    else:
        depression_result = 'Depresi: Berat'

    if anxiety_level <= 9:
        anxiety_result = 'Kecemasan: Ringan'
    elif anxiety_level <= 14:
        anxiety_result = 'Kecemasan: Sedang'
    else:
        anxiety_result = 'Kecemasan: Berat'

    if stress_level <= 18:
        stress_result = 'Stres: Ringan'
    elif stress_level <= 25:
        stress_result = 'Stres: Sedang'
    else:
        stress_result = 'Stres: Berat'

    explanation = get_gpt_explanation(depression_result, anxiety_result, stress_result)

    return explanation


@auth.route('/register', methods=['POST'])
def register():
    try:
        user_data = request.get_json()
        username = user_data.get('username')
        password = generate_password_hash(user_data.get('password'))
        email = user_data.get('email')
        birth = datetime.datetime.strptime(user_data.get('birth'), '%Y-%m-%d')
        jeniskelamin = user_data.get('JK')

        new_user = User(
            username=username,
            password=password,
            email=email,
            birth=birth,
            jeniskelamin=jeniskelamin,
        )

        db.session.add(new_user)
        db.session.commit()

        user_dict = {
            "id": new_user.id,
            "username": new_user.username,
            "password": new_user.password,
            "email": new_user.email, 
            "birth": new_user.birth,
            "jeniskelamin": new_user.jeniskelamin,
            "status": new_user.status,
            "created_at": new_user.created_at
        }

        mongo.db.users.insert_one(user_dict)
        logging.debug(f"User inserted into MongoDB: {user_dict}")

        return jsonify(message="User added to both SQLAlchemy and MongoDB"), 201

    except Exception as e:
        logging.error(f"Error occurred: {e}")
        return jsonify(message="An error occurred"), 500


@auth.route('/login', methods=['POST'])
def login():
    try:
        login_data = request.get_json()
        email = login_data.get('email')
        password = login_data.get('password')
        
        user_data = mongo.db.users.find_one({"email": email})
        user = User.query.filter_by(email=email).first()

        if not user_data and user:
            logging.debug("User not found")
            return jsonify(message="Invalid email or password"), 401
        
        if user and user_data:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                return jsonify(message="Login Succesfully"), 200
            else:
                jsonify(message="Incorrect password, try again."), 401
        
        hashed_password = user_data.get('password')
        if not check_password_hash(hashed_password, password):
            logging.debug("Invalid password")
            return jsonify(message="Invalid email or password"), 401
        
        else:
            jsonify(message="Invalid email or password"), 401

    except Exception as e:
        logging.error(f"Error occurred: {e}")
        return jsonify(message="An error occurred"), 500


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify(message="Logout successful"), 200


@auth.route('/dashboard', methods=['POST'])
@login_required
def dashboard():
    if request.method == "POST":
        mood_data = request.get_json()
        name = mood_data.get('name')
        day = mood_data.get('day')
        color = mood_data.get('color')

        existing_mood = MoodList.query.filter_by(day=day, user_id=current_user.id).first()
        if existing_mood:
            return jsonify(message="Mood entry sudah ada untuk hari ini"), 400

        mood_user = MoodList(
            name=name,
            day=day,
            color=color,
            user_id=current_user.id 
        )
        db.session.add(mood_user)
        db.session.commit()

        mood_dict = {
            "name": mood_user.name,
            "day": mood_user.day,
            "color": mood_user.color,
            "created_at": mood_user.created_at
        }

        mongo.db.mood.insert_one(mood_dict)
        logging.debug(f"Mood inserted into MongoDB: {mood_dict}")

        return jsonify(message="Mood added to both SQLAlchemy and MongoDB"), 201


@auth.route('/mood_history', methods=['GET'])
@login_required
def mood_history():
    user_id = current_user.id
    moods = MoodList.query.filter_by(user_id=user_id).order_by(MoodList.day.desc()).all()
    mood_list = [
        {
            "name": mood.name,
            "day": mood.created_at.strftime('%A'), 
            "color": mood.color
        }
        for mood in moods
    ]
    return jsonify(mood_list), 200


@auth.route('/api/protected', methods=['GET'])
@login_required
def protected_route():
    return jsonify(message=f"Hello {current_user.username}, you are logged in!")


@auth.route('/api/submit_response', methods=['POST'])
@login_required
def submit_response():
    try:
        data = request.get_json()
        answers = data.get('answers')
        
        if len(answers) != 21 or any(a < 0 or a > 3 for a in answers):
            return jsonify(message="Invalid answers"), 400
        
        response = QuestionnaireResponse(
            user_id=current_user.id,
            q1=answers[0], q2=answers[1], q3=answers[2], q4=answers[3], q5=answers[4],
            q6=answers[5], q7=answers[6], q8=answers[7], q9=answers[8], q10=answers[9],
            q11=answers[10], q12=answers[11], q13=answers[12], q14=answers[13], q15=answers[14],
            q16=answers[15], q17=answers[16], q18=answers[17], q19=answers[18], q20=answers[19], q21=answers[20]
        )
        db.session.add(response)
        db.session.commit()
        
        response_mongo = QuestionnaireResponseMongo(user_id=current_user.id, answers=answers)
        mongo.db.questionnaire_responses.insert_one(response_mongo.to_dict())
        
        return jsonify(message="Response submitted successfully"), 201
    
    except Exception as e:
        return jsonify(message=f"An error occurred: {e}"), 500


@auth.route('/api/consultation_history', methods=['GET', 'POST'])
@login_required
def consultation_history():
    if request.method == "GET":
        try:
            consultations = ConsultationHistory.query.filter_by(user_id=current_user.id).all()
            consultation_list = [
                {
                    "id": consultation.id,
                    "name": consultation.name,
                    "ava": consultation.ava,
                    "date": consultation.date,
                    "resdass": consultation.resdass,
                    "resdsm": consultation.resdsm,
                    "chathistory": consultation.chathistory
                } for consultation in consultations
            ]
            return jsonify(consultation_list), 200
        except Exception as e:
            return jsonify({"message": f"An error occurred: {e}"}), 500
        
    elif request.method == "POST":
        try:
            data = request.get_json()
            new_consultation = ConsultationHistory(
                name=data['name'],
                ava=data['ava'],
                date=data['date'],
                resdass=data['resdass'],
                resdsm=data['resdsm'],
                chathistory=data['chathistory'],
                user_id=current_user.id
            )
            db.session.add(new_consultation)
            db.session.commit()
            return jsonify({"message": "Consultation history added successfully"}), 201
        except Exception as e:
            return jsonify({"message": f"An error occurred: {e}"}), 500


@auth.route('/api/schedule', methods=['GET', 'POST'])
@login_required
def schedule():
    if request.method == 'GET':
        schedule = Schedule.query.filter_by(user_id=current_user.id).first()
        schedule_list = {
                "status": schedule.status,
                "imageUrl": schedule.imageUrl,
                "scheduleTitle": schedule.scheduleTitle,
                "time": schedule.time
            } 
        return jsonify(schedule_list), 200

    elif request.method == 'POST':
        data = request.get_json()
        status = data.get('status')
        imageUrl = data.get('imageUrl')
        scheduleTitle = data.get('scheduleTitle')
        time = data.get('time')

        if not status or not imageUrl or not scheduleTitle or not time:
            return jsonify({"error": "All fields are required"}), 400

        new_schedule = Schedule(
            status=status,
            imageUrl=imageUrl,
            scheduleTitle=scheduleTitle,
            time=time,
            user_id=current_user.id
        )
        db.session.add(new_schedule)
        db.session.commit()

        schedule_dict = {
            "status": status,
            "imageUrl": imageUrl,
            "scheduleTitle": scheduleTitle,
            "time": time,
            "user_id": current_user.id
        }
        mongo.db.schedules.insert_one(schedule_dict)

        return jsonify({"message": "Schedule added successfully"}), 201

@auth.route('/api/daily_activity', methods=['GET', 'POST'])
@login_required
def daily_activity():
    if request.method == 'GET':
        daily_activities = DailyActivity.query.filter_by(user_id=current_user.id).all()
        daily_activity_list = [
            {
                "title": activity.title,
                "subtitle": activity.subtitle,
                "imageUrl": activity.imageUrl,
                "status": activity.status
            } for activity in daily_activities
        ]
        return jsonify(daily_activity_list), 200

    elif request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        subtitle = data.get('subtitle')
        imageUrl = data.get('imageUrl')
        status = data.get('status')

        if not title or not subtitle or not imageUrl or not status:
            return jsonify({"error": "All fields are required"}), 400

        new_activity = DailyActivity(
            title=title,
            subtitle=subtitle,
            imageUrl=imageUrl,
            status=status,
            user_id=current_user.id
        )
        db.session.add(new_activity)
        db.session.commit()

        # Save to MongoDB
        activity_dict = {
            "title": title,
            "subtitle": subtitle,
            "imageUrl": imageUrl,
            "status": status,
            "user_id": current_user.id
        }
        mongo.db.daily_activities.insert_one(activity_dict)

        return jsonify({"message": "Daily activity added successfully"}), 201



@auth.route('/api/stress_level', methods=['GET'])
@login_required
def get_stress_level():
    latest_consultation = ConsultationHistory.query.filter_by(user_id=current_user.id).order_by(ConsultationHistory.date.desc()).first()
    
    if not latest_consultation:
        return jsonify({"message": "No consultation history found"}), 404
    
    stress_level_data = {
        "stress": latest_consultation.resdass,  
        "description": latest_consultation.resdsm 
    }
    return jsonify(stress_level_data), 200


@auth.route('/api/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'GET':
        data = request.get_json()
        old_password = data.get('old_password')
        
        if not old_password:
            return jsonify({"error": "Old password is required"}), 400

        if not check_password_hash(current_user.password, old_password):
            return jsonify({"error": "Old password is incorrect"}), 400

        return jsonify({"message": "Old password is correct"}), 200

    elif request.method == 'POST':
        data = request.get_json()
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        if not old_password or not new_password:
            return jsonify({"error": "Old password and new password are required"}), 400

        if not check_password_hash(current_user.password, old_password):
            return jsonify({"error": "Old password is incorrect"}), 400

        current_user.password = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200


@auth.route('/api/users', methods=['GET', 'POST'])
@login_required
def users():
    if request.method == 'GET':
        user_data = {
            'username': current_user.username,
            'email': current_user.email,
            'birth': current_user.birth.strftime('%d %B %Y') if current_user.birth else None,
            'JK': current_user.jeniskelamin,
            'address': current_user.address,
            "status": current_user.status,
            'number': current_user.number,
            "univ": current_user.univ,
            "prodi": current_user.prodi,
            "npm": current_user.npm,
            'myfiles': current_user.myfiles
        }
        return jsonify(user_data)

    elif request.method == 'POST':
        data = request.form
        updates = {}

        if 'username' in data:
            current_user.username = data['username']
            updates['username'] = data['username']
        if 'email' in data:
            current_user.email = data['email']
            updates['email'] = data['email']
        if 'birth' in data:
            try:
                birth_date = datetime.datetime.strptime(data['birth'], '%d %B %Y')
                current_user.birth = birth_date
                updates['birth'] = birth_date
            except ValueError:
                return jsonify({'message': 'Invalid date format. Use "DD Month YYYY".'}), 400
            
        if 'address' in data:
            current_user.address = data['address']
            updates['address'] = data['address']
        if 'number' in data:
            current_user.number = data['number']
            updates['number'] = data['number']
        if 'jeniskelamin' in data:
            current_user.jeniskelamin = data['jeniskelamin']
            updates['jeniskelamin'] = data['jeniskelamin']
        if 'univ' in data:
            current_user.univ = data['univ']
            updates['univ'] = data['univ']
        if 'prodi' in data:
            current_user.prodi = data['prodi']
            updates['prodi'] = data['prodi']
        if 'npm' in data:
            current_user.npm = data['npm']
            updates['npm'] = data['npm']
        if 'myfiles' in request.files:
            file = request.files['myfiles']
            if file:
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                relative_file_path = f"/images/{filename}"
                current_user.myfiles = relative_file_path
                updates['myfiles'] = relative_file_path
        if 'password' in data:
            hashed_password = generate_password_hash(data['password'])
            current_user.password = hashed_password
            updates['password'] = hashed_password

        db.session.commit()

        mongo.db.users.update_one({'email': current_user.email}, {'$set': updates})

        return jsonify({'message': 'User updated successfully'})

    return jsonify({'message': 'Invalid method'}), 405


@auth.route('/chat', methods=['POST', 'GET'])
@login_required
def chatbot():
    if request.method == "POST":
        if not current_user.is_authenticated:
            return jsonify({"error": "User is not authenticated"}), 401

        chat_data = request.get_json()
        user_message = chat_data.get('message')

        # Inisialisasi variabel untuk respons teks
        text_response = ""
        initial_message = False

        # Cek apakah ada pesan dari pengguna
        if not user_message:
            # Jika tidak ada pesan, hitung level DASS-21 dan buat respons
            depression_level, anxiety_level, stress_level = calculate_levels()
            text_response = display_levels(depression_level, anxiety_level, stress_level)
            # Setelah membacakan hasil, mulai percakapan dengan menanyakan nama pengguna
            text_response += "Saya Mira asisten kesehatan mental Anda. Sekarang, mari kita mulai percakapan. Bolehkah saya tahu nama Anda?"
            initial_message = True

        text_response = get_chatgpt_response(user_message)

        # Simpan riwayat percakapan pengguna
        user_chat_history = ChatHistory(
            role='user',
            text=user_message or "Generated DASS-21 levels"
        )
        db.session.add(user_chat_history)
        db.session.commit()

        user_dict = {
            "role": user_chat_history.role,
            "text": user_chat_history.text,
            "datetime": user_chat_history.datetime
        }
        mongo.db.ChatHistory.insert_one(user_dict)

        chatbot_chat_history = ChatHistory(
            role='chatbot',
            text=text_response
        )
        db.session.add(chatbot_chat_history)
        db.session.commit()

        chat_dict = {
            "role": chatbot_chat_history.role,
            "text": text_response,
            "datetime": chatbot_chat_history.datetime
        }
        mongo.db.ChatHistory.insert_one(chat_dict)

        # Konversi teks ke suara
        text_to_speech_google(text=text_response)
        lip_sync_message()

        return jsonify({
            "messages": [
                {
                    "text": text_response,
                    "audio": audio_file_to_base64(audio_path_wav),
                    "lipsync": read_json_transcript(audio_path_json),
                    "facialExpression": "smile",
                    "animation": "Talking_1",
                }
            ]
        }), 200

@auth.route('/save_summary', methods=['POST'])
@login_required
def save_summary_endpoint():
    data = request.get_json()
    name = data.get('name')
    ava = data.get('ava')
    date = data.get('date')
    resdass = data.get('resdass')
    resdsm = data.get('resdsm')
    chathistory = data.get('chathistory')

    consultation_id, mongo_id = save_summary(name, ava, date, resdass, resdsm, chathistory)

    return jsonify({"message": "Summary saved", "consultation_id": consultation_id, "mongo_id": mongo_id}), 201


@auth.route('/download_summary/<int:consultation_id>', methods=['GET'])
@login_required
def download_summary_endpoint(consultation_id):
    pdf_path = generate_pdf(consultation_id)
    if not pdf_path:
        return jsonify({"message": "Consultation not found"}), 404
    
    return send_file(f'../{pdf_path}', as_attachment=True, download_name=f'api/consultation_summary_{consultation_id}.pdf', mimetype='application/pdf')


@auth.route('/riwayat', methods=['GET'])
@login_required
def riwayat():
    if request.method == "GET":
        # depression_level, anxiety_level, stress_level = calculate_levels()

        # name = current_user.username
        # ava = "/icons/pdf.png" 
        # date = datetime.datetime.utcnow().strftime('%d %B %Y')
        # resdass = f"Stress = {stress_level} | Anxiety = {anxiety_level} | Depression = {depression_level}"
        # resdsm = display_levels(depression_level, anxiety_level, stress_level)
        # chathistory = "Hasil konsultasi avatar." #harus ditambahkan fungsi khusus

        # save_summary(name, ava, date, resdass, resdsm, chathistory)

        return jsonify(message="succes")
    

@auth.route('/api/check_questionnaire', methods=['GET'])
@login_required
def check_questionnaire():
    questionnaire_response = QuestionnaireResponse.query.filter_by(user_id=current_user.id).first()
    is_filled = questionnaire_response is not None
    return jsonify({"isFilled": is_filled}), 200

# @auth.route('/avatar', methods=['GET'])
# @login_required
# def avatar():
#     if request.method == "GET":
#         depression_level, anxiety_level, stress_level = calculate_levels()
#         text_response = display_levels(depression_level, anxiety_level, stress_level)
#         text_to_speech_google(text=text_response)
#         lip_sync_message()

#         return jsonify({
#             "messages": [
#                 {
#                     "text": text_response,
#                     "audio": audio_file_to_base64(audio_path_wav),
#                     "lipsync": read_json_transcript(audio_path_json),
#                     "facialExpression": "smile",
#                     "animation": "Talking_1",
#                 }
#             ]
#         })
    
#     if request.method == "POST":
#         if 'image' not in request.files or 'audio' not in request.files:
#             return jsonify({"error": "No image or audio provided"}), 400

#         image = request.files['image']
#         audio = request.files['audio']

#         image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(image.filename))
#         audio_path = os.path.join(current_app.config['UPLOAD_FOLDER'], secure_filename(audio.filename))

#         image.save(image_path)
#         audio.save(audio_path)

#         face_emotion = classify_face_emotion(image_path)
#         voice_emotion = classify_voice_emotion(audio_path)

#         sentiment_result = classifier(audio_path)
#         sentiment = sentiment_result[0]["label"]

#         emotion_history = EmotionHistory(
#             user_id=current_user.id,
#             face_emotion=face_emotion,
#             voice_emotion=voice_emotion,
#             sentiment=sentiment,
#             timestamp=datetime.datetime.utcnow()
#         )

#         db.session.add(emotion_history)
#         db.session.commit()

#         emotion_dict = {
#             "user_id": current_user.id,
#             "face_emotion": face_emotion,
#             "voice_emotion": voice_emotion,
#             "sentiment": sentiment,
#             "timestamp": emotion_history.timestamp
#         }

#         mongo.db.EmotionHistory.insert_one(emotion_dict)

#         return jsonify({
#             "face_emotion": face_emotion,
#             "voice_emotion": voice_emotion,
#             "sentiment": sentiment
#         })

#     elif request.method == "GET":
#         emotion_history = EmotionHistory.query.filter_by(user_id=current_user.id).all()

#         emotion_history_list = [{
#             "face_emotion": e.face_emotion,
#             "voice_emotion": e.voice_emotion,
#             "sentiment": e.sentiment,
#             "timestamp": e.timestamp
            
#         } for e in emotion_history]

#         return jsonify({
#             "emotion_history": emotion_history_list
#         })