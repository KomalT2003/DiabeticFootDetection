import React, { act, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal 
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: string[];
  selectedOptions?: string[];
  isObservation?: boolean;
}

const DIABETES_QUESTIONS: Question[] = [{
  id: 'high_glucose',
  text: 'Have you been diagnosed with high blood glucose levels?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'close_family',
  text: 'A close relation like parent, sibling, grandparent has/had diabetes?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'far_family',
  text: 'A far relation like cousin, aunt, uncle has/had diabetes?',
  type: 'single',
  
  options: ['Yes', 'No']
},
{
  id: 'waist_circumference',
  text: 'Select your waist circumference category:',
  type: 'single',
  options: ['Less than 80 cm', '80-94 cm', 'More than 94 cm']
},
{
  id: 'kidney',
  text: 'Have you been diagnosed with kidney issues?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'thyroid',
  text: 'Do you have thyroid problems?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'blood_pressure',
  text: 'Have you been diagnosed with high blood pressure?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'cholestral',
  text: 'Do you have high cholesterol levels?',
  type: 'single',
  options: ['Yes', 'No', 'Not sure']
},
{
  id: 'heart_disease',
  text: 'Do you have any heart disease?',
  type: 'single',
  options: ['Yes', 'No', 'Not sure']
},
{
  id: 'smoke',
  text: 'Do you smoke?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'alcohol',
  text: 'Do you consume alcohol frequently?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'diet',
  text: 'Select your typical diet patterns:',
  type: 'multiple',
  options: ['High in processed foods', 'High in sugary drinks', 'Low in fruits and vegetables', 'High in fried food', 'High in outside food']
},
{
  id: 'symptom_fatigue',
  text: 'Do you experience fatigue frequently?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'symptom_blurred_vision',
  text: 'Do you have vision problems other than cataract (eg: blurred vision)?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'symptom_fruity_breath',
  text: 'Do you notice fruity breath odor sometimes?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'symptom_excessive_thirst',
  text: 'Do you feel excessive thirst these days?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'symptom_increased_urination',
  text: 'Do you experience increased urination these days sometimes?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'symptom_nausea',
  text: 'Do you feel nausea frequently?',
  type: 'single',
  options: ['Yes', 'No']
},
{
  id: 'observed_diabetes',
  text: 'Did the patient have diabetes?',
  type: 'single',
  options: ['Yes', 'No', 'Not sure'],
  isObservation: true  // Added this flag
}
];

export default function DiabetesAssessmentScreen() {
  const [questions, setQuestions] = useState<Question[]>(DIABETES_QUESTIONS);
  const [modalVisible, setModalVisible] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({
    username: user?.username || '',
  });

  const toggleOption = (questionId: string, option: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id === questionId) {
          let selectedOptions = question.selectedOptions || [];
          if (question.type === 'single') {
            selectedOptions = [option];
          } else {
            selectedOptions = selectedOptions.includes(option)
              ? selectedOptions.filter((opt) => opt !== option)
              : [...selectedOptions, option];
          }

          // Update formData with selected options
          setFormData((prevFormData) => ({
            ...prevFormData,
            [questionId]: question.type === 'single' ? option : selectedOptions,
          }));

          return { ...question, selectedOptions };
        }
        return question;
      })
    );
  };

  const isFormComplete = () => {
    return questions.every(
      (q) => q.selectedOptions && q.selectedOptions.length > 0
    );
  };

  const submitAssessment = async () => {
    if (!isFormComplete()) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      // check if username there
      if (!formData.username) {
        alert('Please enter your username');
        return;
      }
  
      const response = await axios.post(
        'http://192.168.48.114:5000/predict_diabetes',
        formData
      );
      const diabetes_risk_score = response.data.score.toFixed(2) * 100;

      // add diabetes_risk_score to post 
      const add_record = await axios.post(
        'http://192.168.48.114:5000/add_diabetic_detection',
        {
          username: formData.username,
          high_glucose: formData.high_glucose,
          close_family: formData.close_family,
          far_family: formData.far_family,
          waist_circumference: formData.waist_circumference,
          kidney: formData.kidney,
          thyroid: formData.thyroid,
          blood_pressure: formData.blood_pressure,
          cholestral: formData.cholestral,
          heart_disease: formData.heart_disease,
          smoke: formData.smoke,
          alcohol: formData.alcohol,
          diet: formData.diet,
          symptom_fatigue: formData.symptom_fatigue,
          symptom_blurred_vision: formData.symptom_blurred_vision,
          symptom_fruity_breath: formData.symptom_fruity_breath,
          symptom_excessive_thirst: formData.symptom_excessive_thirst,
          symptom_increased_urination: formData.symptom_increased_urination,
          symptom_nausea: formData.symptom_nausea,
          diabetes_risk_score: diabetes_risk_score,
          observed_diabetes: formData.observed_diabetes
        },
      );

      console.log("posted added record with score")


      // show in percentage
      const score = `${response.data.score.toFixed(2) * 100}%`;

      setAssessmentResult(score);
      setModalVisible(true);
    } catch (error) {
      console.error('Assessment submission error:', error);
      alert('Failed to submit assessment');
    }
  };

  const renderQuestionOptions = (question: Question) => {
    return question.options.map((option) => {
      const isSelected = question.selectedOptions?.includes(option);
      return (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            isSelected && styles.selectedOption,
          ]}
          onPress={() => toggleOption(question.id, option)}
        >
          <Text
            style={[
              styles.optionText,
              isSelected && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
    <Text style={styles.title}>Diabetes Risk Assessment</Text>

    {questions.map((question) => (
      <View key={question.id} style={styles.questionContainer}>
        <Text style={question.isObservation ? styles.observationQuestionText : styles.questionText}>
          {question.text}
        </Text>
        <View style={styles.optionsContainer}>
          {renderQuestionOptions(question)}
        </View>
      </View>
    ))}

    <TouchableOpacity
      style={[
        styles.submitButton,
        !isFormComplete() && styles.disabledButton,
      ]}
      onPress={submitAssessment}
      disabled={!isFormComplete()}
    >
      <Text style={styles.submitButtonText}>Submit Assessment</Text>
    </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assessment Result</Text>
            <Text style={styles.resultText}>
              Your Diabetes Risk Score: {assessmentResult}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F2F2', // Soft teal background
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080', // Teal color
    textAlign: 'center',
    marginVertical: 20,
  },
  observationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000', // Teal color
    textAlign: 'center',
    marginVertical: 20,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080', // Teal color
    marginBottom: 10,
  },
  actualquestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000', // Teal color
    marginBottom: 10
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionButton: {
    backgroundColor: '#F0F8FF', // Very light blue
    borderWidth: 1,
    borderColor: '#20B2AA', // Light sea green
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#20B2AA', // Light sea green
  },
  optionText: {
    color: '#008080', // Teal color
    textAlign: 'center',
  },
  selectedOptionText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#008080', // Teal color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Dark gray for disabled state
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  observationQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 15,
  },
  resultText: {
    fontSize: 18,
    color: '#20B2AA',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});