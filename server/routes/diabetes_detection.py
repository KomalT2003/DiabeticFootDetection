from flask import request, jsonify
from server.controllers.diabetes_controllers import (
    add_diabetes_detection,
    get_diabetes_detection,
    get_all_diabetes_detections
)
from server.ml.diabetes_detection import predict_diabetes
import json

def register_diabetes_routes(app):
    @app.route('/add_diabetic_detection', methods=['POST'])
    def add_diabetic_detection_route():
        data = json.loads(request.data)
        username = data['username']
        high_glucose = data['high_glucose']
        close_family = data['close_family']
        far_family = data['far_family']
        waist_circumference = data['waist_circumference']
        kidney = data['kidney']
        thyroid = data['thyroid']
        blood_pressure = data['blood_pressure']
        cholestral = data['cholestral']
        heart_disease = data['heart_disease']
        smoke = data['smoke']
        alcohol = data['alcohol']
        diet = data['diet']
        symptom_fatigue = data['symptom_fatigue']
        symptom_blurred_vision = data['symptom_blurred_vision']
        symptom_fruity_breath = data['symptom_fruity_breath']
        symptom_excessive_thirst = data['symptom_excessive_thirst']
        symptom_increased_urination = data['symptom_increased_urination']
        symptom_nausea = data['symptom_nausea']

        result = add_diabetes_detection(
            username,
            high_glucose,
            close_family,
            far_family,
            waist_circumference,
            kidney,
            thyroid,
            blood_pressure,
            cholestral,
            heart_disease,
            smoke,
            alcohol,
            diet,
            symptom_fatigue,
            symptom_blurred_vision,
            symptom_fruity_breath,
            symptom_excessive_thirst,
            symptom_increased_urination,
            symptom_nausea,
        )
        return jsonify(result)

    @app.route('/get_diabetic_detection', methods=['POST'])
    def get_diabetic_detection_route():
        data = json.loads(request.data)
        username = data['username']
        result = get_diabetes_detection(username)
        return jsonify(result)

    @app.route('/get_all_diabetic_detection', methods=['GET'])
    def get_all_diabetic_detection_route():
        result = get_all_diabetes_detections()
        return jsonify(result)
    
    @app.route('/predict_diabetes', methods=['POST'])
    def predict_diabetes_route():
        data = json.loads(request.data)
        score = predict_diabetes(data)

        with open('results.json', 'a') as f:

            # check if username present then append else new
            if 'username' in data:
                f.write(json.dumps({'username': data['username'], 'Diabetic_Assessment': data, 'diabetes_score': score}))
            else:
                f.write(json.dumps({'Diabetic_Assessment': data, 'diabetes_score': score}))
        

        return jsonify({'score': score})
