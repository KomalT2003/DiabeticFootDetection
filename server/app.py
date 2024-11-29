from flask import Flask
from flask_cors import CORS
import os
from server import create_app, db

# Import models (ensure they are imported before db.create_all())
from server.models.users import User
from server.models.diabetes_detection import DiabetesDetection
from server.models.diabetic_foot import DiabeticFoot

# Import controllers
from server.controllers.user_controllers import add_user, get_user, get_all_users
from server.controllers.diabetes_controllers import add_diabetes_detection, get_diabetes_detection, get_all_diabetes_detections
from server.controllers.diabetic_foot_controllers import add_diabetic_foot_record, get_diabetic_foot_record, get_all_diabetic_foot_records

# Import routes
from server.routes.users import *
from server.routes.diabetes_detection import *
from server.routes.diabetic_foot import *

# Initialize Flask app
app = create_app()

# Root route
@app.route('/')
def hello_world():
    return 'Hello, World!:) I am running'

# Database initialization function
def init_db():
    try:
        with app.app_context():
            db.create_all()  # Create all tables defined in models
            print("Database and tables created successfully!")
    except Exception as e:
        print(f"Error initializing the database: {e}")

# Main entry point
if __name__ == '__main__':
    # Initialize database tables (ensure tables are created before running the app)
    init_db()

    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug = True)
