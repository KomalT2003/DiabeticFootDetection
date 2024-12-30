from server import db
from datetime import datetime

class DiabetesDetection(db.Model):
    __tablename__ = 'diabetes_detection'
    
    # Use a combination of id and timestamp to ensure uniqueness
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Remove all unique constraints
    username = db.Column(db.String(80))
    high_glucose = db.Column(db.String(80))
    close_family = db.Column(db.String(80))
    far_family = db.Column(db.String(80))
    waist_circumference = db.Column(db.String(80))
    kidney = db.Column(db.String(80))
    thyroid = db.Column(db.String(80))
    blood_pressure = db.Column(db.String(80))
    cholestral = db.Column(db.String(80))
    heart_disease = db.Column(db.String(80))
    smoke = db.Column(db.String(80))
    alcohol = db.Column(db.String(80))
    diet = db.Column(db.String(80))
    symptom_fatigue = db.Column(db.String(80))
    symptom_blurred_vision = db.Column(db.String(80))
    symptom_fruiity_breath = db.Column(db.String(80))
    symptom_excessive_thirst = db.Column(db.String(80))
    symptom_increased_urination = db.Column(db.String(80))
    symptom_nausea = db.Column(db.String(80))
    diabetes_risk_score = db.Column(db.Float)
    observed_diabetes = db.Column(db.String(80))

    def __init__(self, username, high_glucose, close_family, far_family, waist_circumference, kidney, thyroid, blood_pressure, cholestral, heart_disease, smoke, alcohol, diet, symptom_fatigue, symptom_blurred_vision, symptom_fruiity_breath, symptom_excessive_thirst, symptom_increased_urination, symptom_nausea, diabetes_risk_score, observed_diabetes, id=None):
        self.username = username
        self.high_glucose = high_glucose
        self.close_family = close_family
        self.far_family = far_family
        self.waist_circumference = waist_circumference
        self.kidney = kidney
        self.thyroid = thyroid
        self.blood_pressure = blood_pressure
        self.cholestral = cholestral
        self.heart_disease = heart_disease
        self.smoke = smoke
        self.alcohol = alcohol
        self.diet = diet
        self.symptom_fatigue = symptom_fatigue
        self.symptom_blurred_vision = symptom_blurred_vision
        self.symptom_fruiity_breath = symptom_fruiity_breath
        self.symptom_excessive_thirst = symptom_excessive_thirst
        self.symptom_increased_urination = symptom_increased_urination
        self.symptom_nausea = symptom_nausea
        self.diabetes_risk_score = diabetes_risk_score
        self.observed_diabetes = observed_diabetes
        

    def __repr__(self):
        print("Hello")
        return f'<DiabetesDetection {self.username}>'
    
    def serialize(self):
        return {
            'id': self.id,
            **{key: getattr(self, key) for key in [
                'username', 'high_glucose', 'close_family', 'far_family', 
                'waist_circumference', 'kidney', 'thyroid', 'blood_pressure', 
                'cholestral', 'heart_disease', 'smoke', 'alcohol', 'diet', 
                'symptom_fatigue', 'symptom_blurred_vision', 'symptom_fruiity_breath', 
                'symptom_excessive_thirst', 'symptom_increased_urination', 'symptom_nausea', 'diabetes_risk_score',
                'observed_diabetes'
                
            ]}
        }