from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from dotenv import load_dotenv
from .auth import mongo
from .auth import auth as auth_blueprint
from .models import User, db
import os

load_dotenv()

migrate = Migrate()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    app.secret_key = os.environ.get("SECRET_KEY") 
    app.config["MONGO_URI"] = os.environ.get("MONGO_URI") 
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mind.db'
    
    mongo.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["*"]
        }
    })

    with app.app_context():
        db.create_all()
        
    app.register_blueprint(auth_blueprint, url_prefix='/')

    return app

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
