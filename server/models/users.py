# create user model with demographics, username, password and unique user id

from server import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))
    age = db.Column(db.String(80)) # in range
    gender = db.Column(db.String(80))
    occupation = db.Column(db.String(80))
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    physical_activity = db.Column(db.String(80))

    def __init__(self, username, password, age, gender, occupation, height, weight, physical_activity):
        self.username = username
        self.password = password
        self.age = age
        self.gender = gender
        self.occupation = occupation
        self.height = height
        self.weight = weight
        self.physical_activity = physical_activity

    def __repr__(self):
        return '<User %r>' % self.username
    
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'age': self.age,
            'gender' : self.gender,
            'occupation' : self.occupation,
            'height' : self.height,
            'weight' : self.weight,
            'physical_activity' : self.physical_activity
        }
    
# export

