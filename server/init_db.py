from server import db, create_app  # Import the database and app factory
from server.models.users import User  # Import your models
from server.models.diabetes_detection import DiabetesDetection
from server.models.diabetic_foot import DiabeticFoot
from server.models.validations import Validation
app = create_app()

with app.app_context():
    db.create_all()  # Create all tables
    print("Tables created successfully!")
