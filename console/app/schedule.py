from flask_login import current_user
from flask import jsonify
from datetime import datetime, timedelta
from .models import db, Schedule
from .models import mongo

def add_schedule():    
    status = 'danger'
    imageUrl = '/images/konsultasi-notif.jpg'
    scheduleTitle = 'Konsultasi Mingguan'
    one_week_later = datetime.datetime.utcnow() + timedelta(weeks=1)
    time = one_week_later.strftime('%Y-%m-%d %H:%M:%S')

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
