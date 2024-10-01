from .models import db, QuestionnaireResponse, ConsultationHistory
from datetime import datetime
from flask_login import current_user
from flask import jsonify
from .gpt import get_gpt_explanation
from .models import mongo

def calculate_dass21():
    user_id = str(current_user.id)
    qna = QuestionnaireResponse.query.filter_by(user_id=user_id).first()
    anxiety_items = [qna.q2, qna.q5, qna.q8, qna.q11, qna.q16, qna.q19, qna.q21]
    depression_items = [qna.q3, qna.q6, qna.q10, qna.q14, qna.q17]
    stress_items = [qna.q1, qna.q4, qna.q7, qna.q9, qna.q12, qna.q13, qna.q15, qna.q18, qna.q20]

    depression = sum([int(item) for item in depression_items]) * 2
    anxiety = sum([int(item) for item in anxiety_items]) * 2
    stress = sum([int(item) for item in stress_items]) * 2

    return get_gpt_explanation(depression, anxiety, stress)

def display_levels(depression, anxiety, stress):
    if depression < 14:
        depression_result = 'Depresi: Ringan'
    elif depression < 20:
        depression_result = 'Depresi: Sedang'
    else:
        depression_result = 'Depresi: Berat'

    if anxiety <= 9:
        anxiety_result = 'Kecemasan: Ringan'
    elif anxiety <= 14:
        anxiety_result = 'Kecemasan: Sedang'
    else:
        anxiety_result = 'Kecemasan: Berat'

    if stress <= 18:
        stress_result = 'Stres: Ringan'
    elif stress <= 25:
        stress_result = 'Stres: Sedang'
    else:
        stress_result = 'Stres: Berat'

    explanation = get_gpt_explanation(depression_result, anxiety_result, stress_result)

    return explanation


def user_history(result_dass=False, result_dsm=None):
    if result_dass:
        depression, anxiety, stress = calculate_dass21()
        result_dass = f"Stress = {stress} | Anxiety = {anxiety} | Depression = {depression}"
    else:
        result_dass = "DASS-21 not available"
    
    if result_dsm:
        result_dsm = result_dsm
    else:
        result_dsm = "DSM result pending"
    
    name = current_user.username
    ava = "/icons/pdf.png" 
    date = datetime.datetime.utcnow().strftime('%d %B %Y')
    
    # chathistory = f"{display_levels(depression, anxiety, stress)}" if result_dsm != "DSM result pending" else "Consultation not completed yet"
    
    # save_summary(name, ava, date, result_dass, result_dsm, chathistory)
    
    return jsonify(message="success")

def save_summary(name, ava, date, resdass, resdsm, chathistory):
    summary = ConsultationHistory(
        name=name,
        ava=ava,
        date=date,
        resdass=resdass,
        resdsm=resdsm,
        chathistory=chathistory, # tidak perlu
        user_id=current_user.id
    )

    db.session.add(summary)
    db.session.commit()

    summary_mongo = {
        "name": name,
        "ava": ava,
        "date": date,
        "resdass": resdass,
        "resdsm": resdsm,
        "chathistory": chathistory, # tidak perlu
        "user_id": current_user.id,
        "created_at": summary.created_at
    }
    mongo.db.consultation_history.insert_one(summary_mongo)
    return summary.id  