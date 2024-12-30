# set up routes for users
from flask import request, jsonify
from server.controllers.user_controllers import add_user, get_user, get_all_users

def register_user_routes(app):
    @app.route('/users', methods=['POST'])
    def add_user_route():
        data = request.json
        new_user = add_user(**data)
        return jsonify(new_user), 201

    @app.route('/users/<username>', methods=['GET'])
    def get_user_route(username):
        user = get_user(username)
        return jsonify(user), 200

    @app.route('/users', methods=['GET'])
    def get_all_users_route():
        users = get_all_users()
        print(users)
        return jsonify(users), 200