from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialize the database object
db = SQLAlchemy()

def create_app():
    # Create Flask app instance
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    db_path = os.path.join(os.path.dirname(__file__), 'diabetes.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize the database with the app
    db.init_app(app)

    # Register routes
    from server.routes.users import register_user_routes
    from server.routes.diabetes_detection import register_diabetes_routes
    from server.routes.diabetic_foot import register_diabetic_foot_routes
    from server.routes.validations import register_validation_routes

    # Register routes after initializing the app
    register_user_routes(app)
    register_diabetes_routes(app)
    register_diabetic_foot_routes(app)
    register_validation_routes(app)

    return app

def init_db(app):
    """ Function to initialize the database tables """
    # Import models here to avoid circular imports
    from server.models.users import User
    from server.models.diabetes_detection import DiabetesDetection
    from server.models.diabetic_foot import DiabeticFoot
    from server.models.validations import Validation
    
    with app.app_context():
        # Create all the tables defined in models
        db.create_all()
        print("Database and tables created successfully!")
