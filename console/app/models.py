from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from flask_pymongo import PyMongo
import datetime

mongo = PyMongo()
db = SQLAlchemy()

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

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), unique=True, nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    birth = Column(DateTime, nullable=False)
    address = Column(Text, nullable=True)
    npm = Column(String(50), nullable=True)
    prodi = Column(String(50), nullable=True)
    univ = Column(String(50), nullable=True)
    anakke = Column(Integer, nullable=True)
    jeniskelamin = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Mahasiswa")
    number = Column(String(50), nullable=True)
    myfiles = Column(String(255), nullable=True, default="/icons/user.png")
    created_at = Column(DateTime, default=datetime.datetime.now)

    therapist = relationship('Therapist', backref='user', lazy=True)
    schedule = relationship('Schedule', backref='user', lazy=True)
    emotion_history = relationship('EmotionHistory', backref='user', lazy=True)
    mood_stats_per_week = relationship('MoodStatPerWeek', backref='user', lazy=True)
    daily_activities = relationship('DailyActivity', backref='user', lazy=True)
    moods_of_all_time = relationship('MoodOfAllTime', backref='user', lazy=True)
    moods = relationship("MoodList", back_populates="user")

    def __repr__(self):
        return f'<User "{self.username}">'

class ChatHistory(db.Model):
    __tablename__ = 'chat_history'

    id = db.Column(Integer, primary_key=True)
    role = db.Column(String(50), nullable=False)
    text = db.Column(Text, nullable=False)
    datetime = db.Column(DateTime, default=datetime.datetime.now)
    user_id = Column(String(50), ForeignKey('users.id'))

    __table_args__ = (
        db.UniqueConstraint('id', name='uq_id'),
    )
    
    def __repr__(self):
        return f'<Chat_history "{self.role}">'

class MoodList(db.Model):
    __tablename__ = "mood_history"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    day = Column(String(50), nullable=False)
    color = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    user_id = Column(String(50), ForeignKey('users.id'))

    user = relationship("User", back_populates="moods")

    __table_args__ = (
        db.UniqueConstraint('id', name='uq_id'),
    )

    def __repr__(self):
        return f'<Mood_history "{self.name}">'

class Therapist(db.Model):
    __tablename__ = 'therapists'

    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    user_id = Column(String(50), ForeignKey('users.id'), nullable=False)
    ava = Column(String(150), nullable=False)
    loc = Column(String(150), nullable=False)
    schedule = Column(String(150), nullable=False)
    desc = Column(Text, nullable=False)
    
    def __repr__(self):
        return f'<Therapist "{self.name}">'

class DailyActivity(db.Model):
    __tablename__ = 'daily_activities'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=False)
    short_description = Column(String(255), default="")
    imageUrl = Column(String(255), default="/images/default_activity.png")
    status = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))

    def __repr__(self):
        return f'<Daily Activity "{self.title}">'

class Schedule(db.Model):
    __tablename__ = 'schedules'
    
    id = Column(Integer, primary_key=True)
    status = Column(String(50), nullable=True)
    imageUrl = Column(String(255), nullable=True)
    scheduleTitle = Column(String(255), nullable=True)
    time = Column(String(50), nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    def __repr__(self):
        return f'<Schedule Title "{self.scheduleTitle}">'

class MoodStatPerWeek(db.Model):
    __tablename__ = 'mood_stats_per_week'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    user_id = Column(String(50), ForeignKey('users.id'), nullable=False)
    moodlvl = Column(Integer, nullable=False)

    def __repr__(self):
        return f'<Mood Stat Per Week "{self.name}">'

class MoodOfAllTime(db.Model):
    __tablename__ = 'moods_of_all_time'

    id = Column(Integer, primary_key=True)
    user_id = Column(String(50), ForeignKey('users.id'), nullable=False)
    mood = Column(String(50), nullable=False)
    date = Column(String(50), nullable=False)

    def __repr__(self):
        return f'<Mood Of All Time "{self.mood}">'

class QuestionnaireResponse(db.Model):
    __tablename__ = 'dass21_responses'
    
    id = Column(Integer, primary_key=True)
    q1 = Column(Integer, nullable=False)
    q2 = Column(Integer, nullable=False)
    q3 = Column(Integer, nullable=False)
    q4 = Column(Integer, nullable=False)
    q5 = Column(Integer, nullable=False)
    q6 = Column(Integer, nullable=False)
    q7 = Column(Integer, nullable=False)
    q8 = Column(Integer, nullable=False)
    q9 = Column(Integer, nullable=False)
    q10 = Column(Integer, nullable=False)
    q11 = Column(Integer, nullable=False)
    q12 = Column(Integer, nullable=False)
    q13 = Column(Integer, nullable=False)
    q14 = Column(Integer, nullable=False)
    q15 = Column(Integer, nullable=False)
    q16 = Column(Integer, nullable=False)
    q17 = Column(Integer, nullable=False)
    q18 = Column(Integer, nullable=False)
    q19 = Column(Integer, nullable=False)
    q20 = Column(Integer, nullable=False)
    q21 = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Questionnaire Response {self.id}>'
    
class ConsultationHistory(db.Model):
    __tablename__ = 'consultation_history'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    ava = Column(String(200), nullable=False)
    date = Column(String(50), nullable=False)
    resdass = Column(String(255), nullable=False)
    resdsm = Column(String(255), nullable=False)
    chathistory = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<ConsultationHistory Response {self.id}>'

class EmotionHistory(db.Model):
    __tablename__ = 'emotion_history'

    id = Column(Integer, primary_key=True)
    face_emotion = Column(String(50), nullable=True)
    voice_emotion = Column(String(50), nullable=True)
    sentiment = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.now)
    user_id = Column(Integer, ForeignKey('users.id'))

    def __repr__(self):
        return f'<EmotionHistory Response {self.id}>'
