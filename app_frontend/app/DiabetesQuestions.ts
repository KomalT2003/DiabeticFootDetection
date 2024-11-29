// Define interface for question
export interface Question {
    id: string;
    text: string;
    type: 'single' | 'multiple';
    options: string[];
    selectedOptions?: string[];
  }
  
  // Initial Questions for Diabetes Risk Assessment
  export const DIABETES_QUESTIONS: Question[] = [
    {
      id: 'high_glucose',
      text: 'Have you been diagnosed with high blood glucose levels?',
      type: 'single',
      options: ['Yes', 'No']
    },
    {
      id: 'close_family',
      text: 'Do you have a family history of diabetes? A close relation like parent, sibling, grandparent',
      type: 'single',
      options: ['Yes', 'No']
    },
    {
      id: 'far_family',
      text: 'Do you have a family history of diabetes? A far relation like cousin, aunt, uncle',
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
      id: 'cholesterol',
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
      options: ['High in processed foods', 'High in sugary drinks', 'Low in fruits and vegetables', 'Balanced diet']
    },
    {
      id: 'symptom_fatigue',
      text: 'Do you experience fatigue frequently?',
      type: 'single',
      options: ['Yes', 'No']
    },
    {
      id: 'symptom_blurred_vision',
      text: 'Do you have blurred vision?',
      type: 'single',
      options: ['Yes', 'No']
    },
    {
      id: 'symptom_fruity_breath',
      text: 'Do you notice fruity breath odor?',
      type: 'single',
      options: ['Yes', 'No']
    },
    {
      id: 'symptom_excessive_thirst',
      text: 'Do you feel excessive thirst?',
      type: 'single',
      options: ['Yes', 'No']
    },
    {
      id: 'symptom_increased_urination',
      text: 'Do you experience increased urination?',
      type: 'single',
      options: ['Yes', 'No']
    },
    {
      id: 'symptom_nausea',
      text: 'Do you feel nausea frequently?',
      type: 'single',
      options: ['Yes', 'No']
    }
  ];
  