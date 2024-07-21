from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from .auth import auth as auth_blueprint
from .auth import mongo
from .models import User, db
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

migrate = Migrate()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    app.secret_key = '_5#y2L"F4Q8z\n\xec]//'
    app.config["MONGO_URI"] = "mongodb://localhost:27017/mind"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mind.db'
    app.config['UPLOAD_FOLDER'] = os.path.join(PROJECT_ROOT, 'public', 'images')
    
    mongo.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    # Configure CORS
    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:3001/"]
        }
    })

    with app.app_context():
        db.create_all()
        
    app.register_blueprint(auth_blueprint, url_prefix='/')

    return app

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
