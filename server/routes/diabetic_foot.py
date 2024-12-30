
from flask import request, jsonify
from server.controllers.diabetic_foot_controllers import add_diabetic_foot_record, get_diabetic_foot_record, get_all_diabetic_foot_records
import json
from server.ml.diabetic_foot_detection import predict_diabetic_foot
from server.ml.diabetic_foot_image import get_image_score
from server.controllers.diabetes_controllers import get_diabetes_detection




def register_diabetic_foot_routes(app):

    @app.route('/add_diabetic_foot', methods=['POST'])
    def add_diabetic_foot_route():
        try:
            print("=== Add Diabetic Foot Debug Info ===")
            print("Form data:", request.form.to_dict())
            print("Files:", request.files)
            
            data = request.form
            
            # Get images array
            images = request.files.getlist('images')
            if len(images) < 2:
                return json.dumps({'error': 'Two images are required'}), 400
                
            # Use first image as front, second as back
            front_image = images[0]
            back_image = images[1]
            
            print(f"Processing front image: {front_image.filename}")
            print(f"Processing back image: {back_image.filename}")
            
            result = add_diabetic_foot_record(
                username=data['username'],
                history_amputation=data['history_amputation'],
                history_foot_ulcer=data['history_foot_ulcer'],
                history_calf_pain=data['history_calf_pain'],
                history_healing_wound=data['history_healing_wound'],
                redness=int(float(data['redness'])),  # Convert string to int
                swelling=int(float(data['swelling'])),
                pain=int(float(data['pain'])),
                numbness=int(float(data['numbness'])),
                sensation=int(float(data['sensation'])),
                recent_cut=data['recent_cut'],
                back_image=back_image,
                front_image=front_image,
                foot_risk_score=float(data['foot_risk_score']),
                observed_foot=data['observed_foot']
            )
            
            return json.dumps({'success': True, 'record_id': result})
            
        except Exception as e:
            print(f"Error in add_diabetic_foot_route: {str(e)}")
            import traceback
            traceback.print_exc()
            return json.dumps({'error': str(e)}), 500

    
    @app.route('/get_diabetic_foot', methods=['POST'])
    def get_diabetic_foot_route():
        try:
            data = json.loads(request.data)
            username = data.get('username')
            
            if not username:
                return jsonify({
                    'error': 'Username is required'
                }), 400
                
            result = get_diabetic_foot_record(username)
            
            if result is None:
                return jsonify({
                    'message': 'No foot assessment record found for this user',
                    'data': None
                }), 200  # Return 200 with null data instead of 404
                
            return jsonify(result)
            
        except Exception as e:
            print(f"Error in get_diabetic_foot_route: {str(e)}")
            return jsonify({
                'error': 'Internal server error',
                'message': str(e)
            }), 500
    
    @app.route('/get_all_diabetic_foot', methods=['GET'])
    def get_all_diabetic_foot_route():
        return json.dumps(get_all_diabetic_foot_records())
    
    @app.route('/predict_diabetic_foot', methods=['POST'])
    def predict_diabetic_foot_route():
        try:
            print("=== Debug Information ===")
            print("Form data:", request.form.to_dict())
            print("Files:", request.files)
            print("Files keys:", list(request.files.keys()))
            
            # Check if we have any images
            if 'images' not in request.files:
                print("No 'images' in request.files")
                return json.dumps({'error': 'No images found in request'}), 400
                
            # Get all images
            images = request.files.getlist('images')
            print(f"Number of images received: {len(images)}")
            
            if len(images) < 2:
                return json.dumps({'error': 'At least 2 images are required'}), 400
                
            # Process images
            image_scores = []
            for idx, image in enumerate(images):
                print(f"Processing image {idx}: {image.filename}")
                score = get_image_score(image)
                image_scores.append(score)
                
            # Get form data
            data = request.form.to_dict()
            
            data.pop('observed_foot', None)
            
            # Add image scores
            data['front_image'] = image_scores[0]
            data['back_image'] = image_scores[1]
            
            # Get prediction score
            score = predict_diabetic_foot(data)
            print(f"Calculated score: {score}")
            
            return json.dumps({'score': score})
            
        except Exception as e:
            print(f"Error in predict_diabetic_foot_route: {str(e)}")
            import traceback
            traceback.print_exc()
            return json.dumps({'error': str(e)}), 500
