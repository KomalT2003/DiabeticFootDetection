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
    
    # # Image columns with file path storage
    # image_back = db.Column(db.String(255))
    # image_front = db.Column(db.String(255))

def add_diabetic_foot_record(username, history_amputation, history_foot_ulcer, history_calf_pain, history_healing_wound, redness, swelling, pain, numbness, sensation, recent_cut, back_image, front_image):
    """
    Add a diabetic foot record to the database
    
    :param username: Username of the user
    :param history_amputation: History of amputation
    :param history_foot_ulcer: History of foot ulcer
    :param history_calf_pain: History of calf pain
    :param history_healing_wound: History of healing wound
    :param redness: Redness level
    :param swelling: Swelling level
    :param pain: Pain level
    :param numbness: Numbness level
    :param sensation: Sensation level
    :param recent_cut: Recent cut
    :param back_image: Back view image file
    :param front_image: Front view image file
    """

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
        recent_cut=recent_cut
    )

    # Save the record
    db.session.add(diabetic_foot)
    db.session.commit()

    # Upload images
    diabetic_foot.upload_image(back_image, 'back')
    diabetic_foot.upload_image(front_image, 'front')

    return diabetic_foot.id

def get_diabetic_foot_record(username):
    """
    Get a diabetic foot record by username
    
    :param username: Username of the user
    :return: Serialized diabetic foot record
    """
    diabetic_foot = DiabeticFoot.query.filter_by(username=username).first()
    return diabetic_foot.serialize()

def get_all_diabetic_foot_records():
    """
    Get all diabetic foot records
    
    :return: List of serialized diabetic foot records
    """
    diabetic_foot_records = DiabeticFoot.query.all()
    return [diabetic_foot.serialize() for diabetic_foot in diabetic_foot_records]

