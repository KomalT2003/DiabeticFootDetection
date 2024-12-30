from server import db
from datetime import datetime

# username id validation_diabetes_correct validation_diabetes_rating validation_diabetes_feedback 
# validation_foot_correct validation_foot_rating validation_foot_feedback

class Validation(db.Model):
    __tablename__ = 'validation'
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    username = db.Column(db.String(80))
    validation_diabetes_correct = db.Column(db.String(80))
    validation_diabetes_rating = db.Column(db.String(80))
    validation_diabetes_feedback = db.Column(db.String(80))
    validation_foot_correct = db.Column(db.String(80))
    validation_foot_rating = db.Column(db.String(80))
    validation_foot_feedback = db.Column(db.String(80))

    def __init__(self, username, validation_diabetes_correct, validation_diabetes_rating, validation_diabetes_feedback, validation_foot_correct, validation_foot_rating, validation_foot_feedback, id=None):
        self.username = username
        self.validation_diabetes_correct = validation_diabetes_correct
        self.validation_diabetes_rating = validation_diabetes_rating
        self.validation_diabetes_feedback = validation_diabetes_feedback
        self.validation_foot_correct = validation_foot_correct
        self.validation_foot_rating = validation_foot_rating
        self.validation_foot_feedback = validation_foot_feedback

    def __repr__(self):
        return '<Validation %r>' % self.username
    
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'validation_diabetes_correct': self.validation_diabetes_correct,
            'validation_diabetes_rating': self.validation_diabetes_rating,
            'validation_diabetes_feedback' : self.validation_diabetes_feedback,
            'validation_foot_correct' : self.validation_foot_correct,
            'validation_foot_rating' : self.validation_foot_rating,
            'validation_foot_feedback' : self.validation_foot_feedback,
            'timestamp': self.timestamp
        }
