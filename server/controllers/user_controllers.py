# handle add user, get user, get all users, delete user, update user for models/users.py
import json
from server import db
from server.models.users import User

def add_user(username, password, age, gender, occupation, height, weight, physical_activity, id=None):
    new_user = User(username, password,age, gender, occupation, height, weight, physical_activity)
    db.session.add(new_user)
    db.session.commit()
    return new_user.serialize()

def get_user(username):
    user = User.query.filter_by(username=username).first()
    return user.serialize()

def get_all_users():
    users = User.query.all()
    return [user.serialize() for user in users]


