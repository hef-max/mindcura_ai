from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask import Blueprint, jsonify, request, send_file
from .models import *
from .cnn_lstm import classify_voice_emotion, classify_face_emotion
from werkzeug.utils import secure_filename
from datetime import datetime
from io import BytesIO
from .text_to_speech import text_to_speech_elevenlabs
from .schedule import add_schedule
from .pdf_generate import *
from .google_lipsync import * 
from .forgoot_pass import *
from .dass import *
from .gpt import *
from .aws_s3 import *
import logging
import cv2
import os

logging.basicConfig(level=logging.DEBUG)
logging.getLogger('numba').setLevel(logging.WARNING)

auth = Blueprint('auth', __name__)
class_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'surprise', 'sad']

@auth.route("/", methods=['GET'])
def home():
    return jsonify(messages="Selamat Datang"), 200

@auth.route('/api/classify_lstm', methods=['POST'])
def classify_lstm():
    if 'audio_file' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio_file']
    filename = secure_filename(audio_file.filename)
    audio_file_path = os.path.join("uploads", filename)
    audio_file.save(audio_file_path)

    emotion, V_Olstm = classify_voice_emotion(audio_file_path) 

    classify_value = {1: 'neutral', 2: 'happy', 3: 'sad', 4: 'angry', 5: 'fear', 6: 'disgust', 7: 'surprise'}
    voice_classify = classify_value.get(emotion)

    return jsonify({"emotion": voice_classify}), 200


@auth.route('/api/classify_cnn', methods=['POST'])
def classify_cnn():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = os.path.join('uploads', filename)
    file.save(file_path)

    image = cv2.imread(file_path)
    emotion, V_Ocnn = classify_face_emotion(image)

    # classify_value = {1: 'neutral', 2: 'happy', 3: 'sad', 4: 'angry', 5: 'fear', 6: 'disgust', 7: 'surprise'}
    face_classify = class_labels[emotion]

    return jsonify({"emotion": face_classify}), 200


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
                return jsonify(message="Incorrect password, try again."), 401
        
        hashed_password = user_data.get('password')
        if not check_password_hash(hashed_password, password):
            logging.debug("Invalid password")
            return jsonify(message="Invalid email or password"), 401
        
        else:
            return jsonify(message="Invalid email or password"), 401

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

        # pisahkan antara hasil dari dass21 dan dsm
        user_history(result_dass=True)
        
        first_consultation = Schedule.query.filter_by(user_id=current_user.id).first()
        if first_consultation is None:
            add_schedule()
            
        return jsonify(message="Response submitted successfully"), 201
    
    except Exception as e:
        return jsonify(message=f"An error occurred: {e}"), 500


@auth.route('/api/consultation_history', methods=['GET', 'POST'])
@login_required
def consultation_history():
    if request.method == "GET":
        try:
            consultations = ConsultationHistory.query.filter_by(user_id=current_user.id).order_by(ConsultationHistory.date.desc()).all()
            consultation_list = [
                {
                    "id": consultation.id,
                    "name": consultation.name,
                    "ava": consultation.ava,
                    "date": consultation.date,
                    "resdass": consultation.resdass,
                    "resdsm": consultation.resdsm,
                    "chathistory": consultation.chathistory # tidak perlu
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
                chathistory=data['chathistory'], # tidak perlu
                user_id=current_user.id
            )
            db.session.add(new_consultation)
            db.session.commit()
            return jsonify({"message": "Consultation history added successfully"}), 201
        
        except Exception as e:
            return jsonify({"message": f"An error occurred: {e}"}), 500


@auth.route('/api/schedule', methods=['GET'])
@login_required
def schedule():
    if request.method == 'GET':
        schedule = Schedule.query.filter_by(user_id=current_user.id).first()

        if schedule is None:
            return jsonify(meesage="Belum ada jadwal"), 500

        schedule_list = {
            "status": schedule.status,
            "imageUrl": schedule.imageUrl,
            "scheduleTitle": schedule.scheduleTitle,
            "time": schedule.time
        } 
        return jsonify(schedule_list), 200


@auth.route('/api/daily_activity', methods=['GET', 'POST'])
@login_required
def daily_activity():
    if request.method == 'GET':
        daily_activities = DailyActivity.query.filter_by(user_id=current_user.id).first()
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
            "anakke": current_user.anakke,
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
        
        if 'anakke' in data:
            current_user.anakke = data['anakke']
            updates['anakke'] = data['anakke']

        if 'myfiles' in request.files:
            file = request.files['myfiles']
            
            if file:
                filename = secure_filename(file.filename)
                file_buffer = BytesIO(file.read())

                try:
                    s3_client.upload_fileobj(
                        file_buffer,
                        S3_BUCKET_NAME,
                        filename,
                        ExtraArgs={'ContentType': file.content_type}
                    )
                    
                    file_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
                    
                    current_user.myfiles = file_url
                    updates['myfiles'] = file_url
                    
                    return jsonify({"message": "Profile updated successfully"}), 200
                
                except Exception as e:
                    return jsonify({"error": f"Error uploading file: {str(e)}"}), 500

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

        text_response = ""
        initial_message = False

        if not user_message:
            depression_level, anxiety_level, stress_level = calculate_dass21()
            text_response = f"""Halo Saya Mira, asisten kesehatan mental Anda.
              Saya akan membacakan hasil dari kusioner sebelumnya, {display_levels(depression_level, anxiety_level, stress_level)}.
              Sekarang, mari kita mulai percakapannya. Bolehkah Saya tahu nama Anda?"""
            initial_message = True
        
        # if user_message:
        text_response = get_chatgpt_response(user_message)
        
        # user_chat_history = ChatHistory(
        #     role='user',
        #     text=user_message or "Generated DASS-21 levels"
        # )

        # db.session.add(user_chat_history)
        # db.session.commit()

        # user_dict = {
        #     "role": user_chat_history.role,
        #     "text": user_chat_history.text,
        #     "datetime": user_chat_history.datetime
        # }
        # mongo.db.ChatHistory.insert_one(user_dict)

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

        text_to_speech_elevenlabs(text=text_response)
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

    
@auth.route('/api/check_questionnaire', methods=['GET'])
@login_required
def check_questionnaire():
    questionnaire_response = QuestionnaireResponse.query.filter_by(user_id=current_user.id).first()
    is_filled = questionnaire_response is not None
    return jsonify({"isFilled": is_filled}), 200


@auth.route('/send_verification_code', methods=['POST'])
def send_verification_code_route():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    send_verification_code(email)
    return jsonify({"message": "Verification code sent"}), 200


@auth.route('/verify_code', methods=['POST'])
def verify_code_route():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    if not email or not code:
        return jsonify({"error": "Email and code are required"}), 400
    if verify_code(email, code):
        return jsonify({"message": "Code verified"}), 200
    else:
        return jsonify({"error": "Invalid code"}), 400


@auth.route('/update_password', methods=['POST'])
def update_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('new_password')
    if not email or not new_password:
        return jsonify({"error": "Email and new password are required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.password = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Password updated"}), 200
