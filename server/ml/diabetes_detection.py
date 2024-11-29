import pandas as pd
import numpy as np

def predict_diabetes(data):
    # the order of features:
    # close_family : 0.15
    # far_family : 0.05
    # waist_circumference : 0.03
    # kidney : 0.02
    # thyroid : 0.02
    # blood_pressure : 0.18
    # cholestral : 0.02
    # heart_disease : 0.17
    # smoke : 0.02
    # alcohol : 0.03
    # symptom_fatigue : 0.05
    # symptom_blurred_vision : 0.05
    # symptom_fruity_breath : 0.05
    # symptom_excessive_thirst : 0.06
    # symptom_increased_urination : 0.05
    # symptom_nausea : 0.05
    print(data)
    weights = np.array([0.15, 0.05, 0.03, 0.02, 0.02, 0.18, 0.02, 0.17, 0.02, 0.03, 0.05, 0.05, 0.05, 0.06, 0.05, 0.05])

    # we will get input data in json
    # convert it to pandas dataframe
    df = pd.DataFrame(data, index=[0])
    # get the features
    features = df.columns
    # extract relevant features
    df.drop(['username', 'high_glucose', 'diet'], axis=1, inplace=True)

    # encode to 1 if yes else 0
    # lower case for full df
    df = df.apply(lambda x: x.apply(lambda y: y.lower()))
    df = df.apply(lambda x: x.apply(lambda y: 1 if y == 'yes' else 0))
    
    # get the values
    values = df.values
    print(values)

    # as all features are string convert to float
    values = values.astype(float)

    # calculate the score
    score = np.dot(weights, values.T)
    # return the score
    return score[0]

    

