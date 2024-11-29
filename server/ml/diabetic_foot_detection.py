import pandas as pd
import numpy as np

def predict_diabetic_foot(data):
    # the order of features:
    # 
    # history_amputation : 0.15
    # history_foot_ulcer : 0.1
    # history_calf_pain : 0.03
    # history_healing_wound : 0.02

    # SYMPTOMS: overall would be 0.55
    # redness : 0.11
    # swelling : 0.11
    # pain : 0.11
    # numbness : 0.11
    # sensation : 0.11


    # recent_cut : 0.04

    # IMAGE OVERALL: 0.11
    # back_image : 1
    # front_image : 1

    weights = np.array([0.15, 0.1, 0.03, 0.02, 0.11, 0.11, 0.11, 0.11, 0.11, 0.04, 0.11])

    # we will get input data in json
    # convert it to pandas dataframe
    df = pd.DataFrame(data, index=[0])
    df.drop(['username'], axis=1, inplace=True)

    print(df)

    # encode to 1 if yes else 0
    # lower case for full df
    # loop over columns to encode yes to 1 and no to 0
    for col in df.columns:
        if col != 'redness' and col != 'swelling' and col != 'pain' and col != 'numbness' and col != 'sensation' and col != 'back_image' and col != 'front_image':
            df[col] = df[col].apply(lambda x: x.lower())
            df[col] = df[col].apply(lambda x: 1 if x == 'yes' else 0)

    # convert ratings to float
    df['redness'] = df['redness'].astype(float)
    df['swelling'] = df['swelling'].astype(float)
    df['pain'] = df['pain'].astype(float)
    df['numbness'] = df['numbness'].astype(float)
    df['sensation'] = df['sensation'].astype(float)

    # normalise the ratings out of 10 in the symptoms
    df['redness'] = df['redness'] / 10
    df['swelling'] = df['swelling'] / 10
    df['pain'] = df['pain'] / 10
    df['numbness'] = df['numbness'] / 10
    df['sensation'] = df['sensation'] / 10

    # convert the image scores to float
    df['back_image'] = df['back_image'].astype(float)
    df['front_image'] = df['front_image'].astype(float)

    # get the max of the image scores and create a new column
    df['image_score'] = df[['back_image', 'front_image']].max(axis=1)

    # drop the back_image and front_image columns
    df.drop(['back_image', 'front_image'], axis=1, inplace=True)
    

    print(df)

    # get the values
    values = df.values
    print(values)

    # as all features are string convert to float
    values = values.astype(float)

    # calculate the score
    score = np.dot(weights, values.T)
    # return the score

    return score[0]

