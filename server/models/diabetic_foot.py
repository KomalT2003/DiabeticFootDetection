from server import db
from sqlalchemy import Column, String, Integer
from werkzeug.utils import secure_filename
import os

class DiabeticFoot(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Add primary key
    username = db.Column(db.String(80))
    history_amputation = db.Column(db.String(80))
    history_foot_ulcer = db.Column(db.String(80))
    history_calf_pain = db.Column(db.String(80))
    history_healing_wound = db.Column(db.String(80))
    redness = db.Column(db.Integer)
    swelling = db.Column(db.Integer)
    pain = db.Column(db.Integer)
    numbness = db.Column(db.Integer)
    sensation = db.Column(db.Integer)
    recent_cut = db.Column(db.String(80))
    
    # Image columns with file path storage
    image_back = db.Column(db.String(255))
    image_front = db.Column(db.String(255))

    def upload_image(self, image, image_type):
        """
        Upload and save an image for the diabetic foot record
        
        :param image: FileStorage object from Flask request
        :param image_type: 'back' or 'front'
        :return: path of the saved image
        """
        if not image:
            return None

        # Create a directory named after the username inside the uploads folder
        upload_dir = os.path.join('./uploads/diabetic_foot', self.username)
        os.makedirs(upload_dir, exist_ok=True)  # Create the username folder if it doesn't exist

        # Secure filename to prevent malicious uploads
        filename = secure_filename(f"{self.id}_{image_type}_{image.filename}")
        filepath = os.path.join(upload_dir, filename)

        # Save the image
        image.save(filepath)

        # Update the appropriate image column in the database
        if image_type == 'back':
            self.image_back = filepath
        elif image_type == 'front':
            self.image_front = filepath

        return filepath


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
            'id': self.id,
            'username': self.username,
            'history_amputation': self.history_amputation,
            'history_foot_ulcer': self.history_foot_ulcer,
            'history_calf_pain': self.history_calf_pain,
            'history_healing_wound': self.history_healing_wound,
            'redness': self.redness,
            'swelling': self.swelling,
            'pain': self.pain,
            'numbness': self.numbness,
            'sensation': self.sensation,
            'recent_cut': self.recent_cut,
            'image_back': self.image_back,
            'image_front': self.image_front
        }
    
    def __repr__(self):
        return '<DiabeticFoot %r>' % self.id
    
    def __init__(self, username, history_amputation, history_foot_ulcer, history_calf_pain, history_healing_wound, redness, swelling, pain, numbness, sensation, recent_cut):
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

# export
