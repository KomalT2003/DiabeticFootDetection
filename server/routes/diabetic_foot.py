
from flask import request
from server.controllers.diabetic_foot_controllers import add_diabetic_foot_record, get_diabetic_foot_record, get_all_diabetic_foot_records
import json
from server.ml.diabetic_foot_detection import predict_diabetic_foot
from server.ml.diabetic_foot_image import get_image_score
from server.controllers.diabetes_controllers import get_diabetes_detection



def register_diabetic_foot_routes(app):
    @app.route('/add_diabetic_foot', methods=['POST'])
    def add_diabetic_foot_route():
        data = data = request.form  # Use form data to get non-file parameters
    # Extracting image files
        back_image = request.files.get('image_back')
        front_image = request.files.get('image_front')
        username = data['username']
        history_amputation = data['history_amputation']
        history_foot_ulcer = data['history_foot_ulcer']
        history_calf_pain = data['history_calf_pain']
        history_healing_wound = data['history_healing_wound']
        redness = data['redness']
        swelling = data['swelling']
        pain = data['pain']
        numbness = data['numbness']
        sensation = data['sensation']
        recent_cut = data['recent_cut']
        result = add_diabetic_foot_record(
            username,
            history_amputation,
            history_foot_ulcer,
            history_calf_pain,
            history_healing_wound,
            redness,
            swelling,
            pain,
            numbness,
            sensation,
            recent_cut,
            back_image,
            front_image
        )
        return json.dumps(result)
    @app.route('/get_diabetic_foot', methods=['POST'])
    def get_diabetic_foot_route():
        data = json.loads(request.data)
        username = data['username']
        print(username)
        return get_diabetic_foot_record(username)
    @app.route('/get_all_diabetic_foot', methods=['GET'])
    def get_all_diabetic_foot_route():
        return json.dumps(get_all_diabetic_foot_records())
    
    @app.route('/predict_diabetic_foot', methods=['POST'])
    def predict_diabetic_foot_route():
        data = request.form 
        back_image = request.files.get('image_back')
        front_image = request.files.get('image_front')
        
        # get image score 
        back_image_score = get_image_score(back_image)
        front_image_score = get_image_score(front_image)
        
        # get all the values and create a new dictionary
        data = data.to_dict()

    
        # add the image scores to the data
        data['back_image'] = back_image_score
        data['front_image'] = front_image_score
        

        # get the score
        score = predict_diabetic_foot(data)

        # after getting the score, check if username in result.json, if yes then append else add
        def get_users():
            with open('results.json', 'r') as f:
                return json.loads(f.read())

       
        return json.dumps({'score': score})

        
