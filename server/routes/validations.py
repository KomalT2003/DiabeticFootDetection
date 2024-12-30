from flask import request, jsonify
from server.controllers.validations_controllers import add_validation_record, get_validation_record, get_all_validation_records, delete_validation_record, update_validation_record
import json
from server.models.validations import Validation
from server import db


def register_validation_routes(app):
    @app.route('/add_validation', methods=['POST'])
    def save_validation():
        try:
            data = request.json
            username = data.get('username')
            assessment_type = data.get('assessment_type')

            # Check if validation exists for this user
            existing_validation = Validation.query.filter_by(username=username.strip()).first()

            if existing_validation:
                # Update existing validation
                if assessment_type == 'diabetes':
                    existing_validation.validation_diabetes_correct = data['validation_diabetes_correct']
                    existing_validation.validation_diabetes_rating = data['validation_diabetes_rating']
                    existing_validation.validation_diabetes_feedback = data['validation_diabetes_feedback']
                elif assessment_type == 'foot':
                    existing_validation.validation_foot_correct = data['validation_foot_correct']
                    existing_validation.validation_foot_rating = data['validation_foot_rating']
                    existing_validation.validation_foot_feedback = data['validation_foot_feedback']
            else:
                # Create new validation record
                validation_data = {}
                
                if assessment_type == 'diabetes':
                    validation_data = {
                        'username': username.strip(),
                        'validation_diabetes_correct': data['validation_diabetes_correct'],
                        'validation_diabetes_rating': data['validation_diabetes_rating'],
                        'validation_diabetes_feedback': data['validation_diabetes_feedback'],
                        'validation_foot_correct': None,
                        'validation_foot_rating': None,
                        'validation_foot_feedback': None
                    }
                elif assessment_type == 'foot':
                    validation_data = {
                        'username': username.strip(),
                        'validation_foot_correct': data['validation_foot_correct'],
                        'validation_foot_rating': data['validation_foot_rating'],
                        'validation_foot_feedback': data['validation_foot_feedback'],
                        'validation_diabetes_correct': None,
                        'validation_diabetes_rating': None,
                        'validation_diabetes_feedback': None
                    }
                
                new_validation = Validation(**validation_data)
                db.session.add(new_validation)

            db.session.commit()
            return jsonify({
                'message': 'Validation saved successfully',
                'assessment_type': assessment_type
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"Error in save_validation: {str(e)}")
            return jsonify({'error': str(e)}), 500
        
    @app.route('/validations/<username>', methods=['GET'])
    def get_validation_route(username):
        validation = get_validation_record(username)
        return jsonify(validation), 200
    
    @app.route('/validations', methods=['GET'])
    def get_all_validations_route():
        validations = get_all_validation_records()
        return jsonify(validations), 200
    
    @app.route('/validations/<username>', methods=['DELETE'])
    def delete_validation_route(username):
        result = delete_validation_record(username)
        return jsonify(result), 200
    
    @app.route('/validations/<username>', methods=['PUT'])
    def update_validation_route(username):
        data = request.json
        result = update_validation_record(username, **data)
        return jsonify(result), 200

    
    