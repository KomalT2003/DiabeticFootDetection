import json
from server import db
from server.models.validations import Validation

# model: id = db.Column(db.Integer, primary_key=True)
    # timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    # username = db.Column(db.String(80))
    # validation_diabetes_correct = db.Column(db.String(80))
    # validation_diabetes_rating = db.Column(db.String(80))
    # validation_diabetes_feedback = db.Column(db.String(80))
    # validation_foot_correct = db.Column(db.String(80))
    # validation_foot_rating = db.Column(db.String(80))
    # validation_foot_feedback = db.Column(db.String(80))
    
def add_validation_record(username, validation_diabetes_correct, validation_diabetes_rating, validation_diabetes_feedback, validation_foot_correct, validation_foot_rating, validation_foot_feedback):
    try:
        validation = Validation(
            username=username,
            validation_diabetes_correct=validation_diabetes_correct,
            validation_diabetes_rating=validation_diabetes_rating,
            validation_diabetes_feedback=validation_diabetes_feedback,
            validation_foot_correct=validation_foot_correct,
            validation_foot_rating=validation_foot_rating,
            validation_foot_feedback=validation_foot_feedback
        )
        
        db.session.add(validation)
        db.session.commit()
        
        return validation.id
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in add_validation_record: {str(e)}")
        raise e
    
def get_validation_record(username):
    try:
        validation = Validation.query.filter_by(username=username).first()
        return validation.serialize() if validation else None
        
    except Exception as e:
        print(f"Error in get_validation_record: {str(e)}")
        raise e
    
def get_all_validation_records():
    try:
        validations = Validation.query.all()
        return [validation.serialize() for validation in validations]
        
    except Exception as e:
        print(f"Error in get_all_validation_records: {str(e)}")
        raise e
    
def update_validation_record(username, validation_diabetes_correct, validation_diabetes_rating, validation_diabetes_feedback, validation_foot_correct, validation_foot_rating, validation_foot_feedback):
    try:
        validation = Validation.query.filter_by(username=username).first()
        validation.validation_diabetes_correct = validation_diabetes_correct
        validation.validation_diabetes_rating = validation_diabetes_rating
        validation.validation_diabetes_feedback = validation_diabetes_feedback
        validation.validation_foot_correct = validation_foot_correct
        validation.validation_foot_rating = validation_foot_rating
        validation.validation_foot_feedback = validation_foot_feedback
        
        db.session.commit()
        
        return validation.id
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in update_validation_record: {str(e)}")
        raise e
    
def delete_validation_record(username):
    try:
        validation = Validation.query.filter_by(username=username).first()
        db.session.delete(validation)
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in delete_validation_record: {str(e)}")
        raise e
    