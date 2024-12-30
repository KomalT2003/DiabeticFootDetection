import json
from server import db
from server.models.diabetic_foot import DiabeticFoot

#id = db.Column(db.Integer, primary_key=True)  # Add primary key
    # username = db.Column(db.String(80), unique=True)
    # history_amputation = db.Column(db.String(80))
    # history_foot_ulcer = db.Column(db.String(80))
    # history_calf_pain = db.Column(db.String(80))
    # history_healing_wound = db.Column(db.String(80))
    # redness = db.Column(db.Integer)
    # swelling = db.Column(db.Integer)
    # pain = db.Column(db.Integer)
    # numbness = db.Column(db.Integer)
    # sensation = db.Column(db.Integer)
    # recent_cut = db.Column(db.String(80))
    # foot_risk_score = db.Column(db.Float)
    # observed_foot = db.Column(db.String(80))
    
    # # Image columns with file path storage
    # image_back = db.Column(db.String(255))
    # image_front = db.Column(db.String(255))

def add_diabetic_foot_record(username, history_amputation, history_foot_ulcer, history_calf_pain,
                           history_healing_wound, redness, swelling, pain, numbness,
                           sensation, recent_cut, back_image, front_image, foot_risk_score, observed_foot):
    try:
        diabetic_foot = DiabeticFoot(
            username=username,
            history_amputation=history_amputation,
            history_foot_ulcer=history_foot_ulcer,
            history_calf_pain=history_calf_pain,
            history_healing_wound=history_healing_wound,
            redness=redness,
            swelling=swelling,
            pain=pain,
            numbness=numbness,
            sensation=sensation,
            recent_cut=recent_cut,
            foot_risk_score=foot_risk_score,
            observed_foot=  observed_foot
        )
        
        # Save the record first to generate an ID
        db.session.add(diabetic_foot)
        db.session.commit()
        
        # Now upload the images
        if front_image:
            diabetic_foot.upload_image(front_image, 'front')
        if back_image:
            diabetic_foot.upload_image(back_image, 'back')
            
        # Save again with the image paths
        db.session.commit()
        
        return diabetic_foot.id
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in add_diabetic_foot_record: {str(e)}")
        raise e


def get_diabetic_foot_record(username):
    """
    Get a diabetic foot record by username
    
    :param username: Username of the user
    :return: Serialized diabetic foot record
    """
    try:
        diabetic_foot = DiabeticFoot.query.filter_by(username=username).first()
        
        if diabetic_foot is None:
            return None
            
        return diabetic_foot.serialize()
        
    except Exception as e:
        print(f"Error in get_diabetic_foot_record: {str(e)}")
        return None

def get_all_diabetic_foot_records():
    """
    Get all diabetic foot records
    
    :return: List of serialized diabetic foot records
    """
    diabetic_foot_records = DiabeticFoot.query.all()
    return [diabetic_foot.serialize() for diabetic_foot in diabetic_foot_records]

