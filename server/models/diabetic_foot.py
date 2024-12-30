from server import db
from sqlalchemy import Column, String, Integer
from werkzeug.utils import secure_filename
import os

class DiabeticFoot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    
    # History fields with default empty string
    history_amputation = db.Column(db.String(80), default='')
    history_foot_ulcer = db.Column(db.String(80), default='')
    history_calf_pain = db.Column(db.String(80), default='')
    history_healing_wound = db.Column(db.String(80), default='')
    
    # Numeric fields with default 0
    redness = db.Column(db.Integer, default=0)
    swelling = db.Column(db.Integer, default=0)
    pain = db.Column(db.Integer, default=0)
    numbness = db.Column(db.Integer, default=0)
    sensation = db.Column(db.Integer, default=0)
    
    # Other string fields with default empty string
    recent_cut = db.Column(db.String(80), default='')
    
    # Image paths with default empty string
    image_back = db.Column(db.String(255), default='')
    image_front = db.Column(db.String(255), default='')
    
    # Risk score and observation with defaults
    foot_risk_score = db.Column(db.Float, default=0.0)
    observed_foot = db.Column(db.String(80), default='')

    def upload_image(self, image, image_type):
        """
        Upload and save an image for the diabetic foot record.
        :param image: FileStorage object from Flask request.
        :param image_type: 'back' or 'front'.
        :return: Path of the saved image.
        """
        if not image or not image.filename:
            print(f"No {image_type} image provided.")
            return None

        # Create the upload directory for the user
        upload_dir = os.path.join('./uploads/diabetic_foot', secure_filename(self.username))
        os.makedirs(upload_dir, exist_ok=True)

        # Generate a secure file name
        filename = secure_filename(f"{self.id}_{image_type}_{image.filename}")
        filepath = os.path.join(upload_dir, filename)

        try:
            # Save the file
            image.save(filepath)
            print(f"Saved {image_type} image at {filepath}")

            # Update the respective image column in the database
            if image_type == 'back':
                self.image_back = filepath
            elif image_type == 'front':
                self.image_front = filepath

            return filepath
        except Exception as e:
            print(f"Error saving {image_type} image: {e}")
            return None

    
    def save_with_images(self, back_image=None, front_image=None):
        """
        Save the model instance with optional image uploads
        
        :param back_image: Back view image file
        :param front_image: Front view image file
        """
        # First save the model to generate an ID
        db.session.add(self)
        db.session.commit()

        # Upload images if provided
        if back_image:
            self.upload_image(back_image, 'back')
        if front_image:
            self.upload_image(front_image, 'front')

        # Save changes
        db.session.commit()
        return self
    
    def serialize(self):
        return {
            'username': self.username,
            'history_amputation': self.history_amputation or '',
            'history_foot_ulcer': self.history_foot_ulcer or '',
            'history_calf_pain': self.history_calf_pain or '',
            'history_healing_wound': self.history_healing_wound or '',
            'redness': self.redness or 0,
            'swelling': self.swelling or 0,
            'pain': self.pain or 0,
            'numbness': self.numbness or 0,
            'sensation': self.sensation or 0,
            'recent_cut': self.recent_cut or '',
            'image_back': self.image_back or '',
            'image_front': self.image_front or '',
            'foot_risk_score': self.foot_risk_score or 0.0,
            'observed_foot': self.observed_foot or ''
        }
    
    def __repr__(self):
        return '<DiabeticFoot %r>' % self.id
    
    def __init__(self, username, history_amputation, history_foot_ulcer, history_calf_pain, history_healing_wound, redness, swelling, pain, numbness, sensation, recent_cut, image_back=None, image_front=None, foot_risk_score=None, observed_foot=None):
        self.username = username
        self.history_amputation = history_amputation
        self.history_foot_ulcer = history_foot_ulcer
        self.history_calf_pain = history_calf_pain
        self.history_healing_wound = history_healing_wound
        self.redness = redness
        self.swelling = swelling
        self.pain = pain
        self.numbness = numbness
        self.sensation = sensation
        self.recent_cut = recent_cut
        self.image_back = image_back
        self.image_front = image_front
        self.foot_risk_score = foot_risk_score
        self.observed_foot = observed_foot
        

# export
