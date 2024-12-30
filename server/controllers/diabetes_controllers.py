import json
from server import db
from server.models.diabetes_detection import DiabetesDetection
from flask import Blueprint

diabetes_detection = Blueprint('diabetes_detection', __name__)


def add_diabetes_detection(username, high_glucose, close_family, far_family, waist_circumference, kidney, thyroid, blood_pressure, cholestral, heart_disease, smoke, alcohol, diet, symptom_fatigue, symptom_blurred_vision, symptom_fruiity_breath, symptom_excessive_thirst, symptom_increased_urination, symptom_nausea, diabetes_risk_score, observed_diabetes):
    new_diabetes_detection = DiabetesDetection(username, high_glucose, close_family, far_family, waist_circumference, kidney, thyroid, blood_pressure, cholestral, heart_disease, smoke, alcohol, diet, symptom_fatigue, symptom_blurred_vision, symptom_fruiity_breath, symptom_excessive_thirst, symptom_increased_urination, symptom_nausea, diabetes_risk_score, observed_diabetes)
    db.session.add(new_diabetes_detection)
    db.session.commit()
    return new_diabetes_detection.serialize()

def get_diabetes_detection(username):
    try:
        diabetic_foot = DiabetesDetection.query.filter_by(username=username).first()
        
        if diabetic_foot is None:
            return None
            
        return diabetic_foot.serialize()
        
    except Exception as e:
        print(f"Error in get_diabetic_foot_record: {str(e)}")
        return None

def get_all_diabetes_detections():
    diabetes_detections = DiabetesDetection.query.all()
    return [diabetes_detection.serialize() for diabetes_detection in diabetes_detections]