// ValidationSection.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';

interface ValidationSectionProps {
  assessmentType: 'diabetes' | 'foot';
  riskScore: number;
  username: string;
}

const ValidationSection: React.FC<ValidationSectionProps> = ({ 
  assessmentType,
  riskScore,
  username
}) => {
  const [isCorrect, setIsCorrect] = useState<string>('no');
  const [riskRating, setRiskRating] = useState<string>('1');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingValidation, setExistingValidation] = useState(null);

  useEffect(() => {
    checkExistingValidation();
  }, [username]);

  const checkExistingValidation = async () => {
    try {
      const response = await axios.get(`http://192.168.48.114:5000/validations/${username}`);
      if (response.data) {
        const data = response.data;
        if (assessmentType === 'diabetes') {
          setIsCorrect(data.validation_diabetes_correct || 'no');
          setRiskRating(data.validation_diabetes_rating || '1');
          setFeedback(data.validation_diabetes_feedback || '');
        } else {
          setIsCorrect(data.validation_foot_correct || 'no');
          setRiskRating(data.validation_foot_rating || '1');
          setFeedback(data.validation_foot_feedback || '');
        }
        setExistingValidation(data);
      }
    } catch (error) {
      console.error('Error checking existing validation:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const validationData = {
        username,
        validation_diabetes_correct: assessmentType === 'diabetes' ? isCorrect : existingValidation?.validation_diabetes_correct || 'no',
        validation_diabetes_rating: assessmentType === 'diabetes' ? riskRating : existingValidation?.validation_diabetes_rating || '1',
        validation_diabetes_feedback: assessmentType === 'diabetes' ? feedback : existingValidation?.validation_diabetes_feedback || '',
        validation_foot_correct: assessmentType === 'foot' ? isCorrect : existingValidation?.validation_foot_correct || 'no',
        validation_foot_rating: assessmentType === 'foot' ? riskRating : existingValidation?.validation_foot_rating || '1',
        validation_foot_feedback: assessmentType === 'foot' ? feedback : existingValidation?.validation_foot_feedback || ''
      };

      if (existingValidation) {
        await axios.put(`http://192.168.48.114:5000/validations/${username}`, validationData);
      } else {
        await axios.post('http://192.168.48.114:5000/add_validation', validationData);
      }
      
      Alert.alert('Success', 'Validation saved successfully');
      checkExistingValidation();
    } catch (error) {
      console.error('Error saving validation:', error);
      Alert.alert('Error', 'Failed to save validation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.validationSection}>
      <Text style={styles.validationTitle}>Validation</Text>
      
      <View style={styles.validationRow}>
        <Text style={styles.validationLabel}>Assessment Accuracy:</Text>
        <View style={styles.validationButtons}>
          <TouchableOpacity 
            style={[
              styles.validationButton, 
              isCorrect === 'yes' && styles.validationButtonSelected,
              { backgroundColor: isCorrect === 'yes' ? '#4CAF50' : undefined }
            ]}
            onPress={() => setIsCorrect('yes')}
          >
            <Text style={[styles.validationButtonText, isCorrect === 'yes' && styles.validationButtonTextSelected]}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.validationButton, 
              isCorrect === 'no' && styles.validationButtonSelected,
              { backgroundColor: isCorrect === 'no' ? '#F44336' : undefined }
            ]}
            onPress={() => setIsCorrect('no')}
          >
            <Text style={[styles.validationButtonText, isCorrect === 'no' && styles.validationButtonTextSelected]}>✗</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.validationRow}>
        <Text style={styles.validationLabel}>Risk Rating (1-5):</Text>
        <View style={styles.ratingContainer}>
          {['1', '2', '3', '4', '5'].map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                riskRating === rating && styles.ratingButtonSelected
              ]}
              onPress={() => setRiskRating(rating)}
            >
              <Text style={[
                styles.ratingButtonText,
                riskRating === rating && styles.ratingButtonTextSelected
              ]}>
                {rating}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.validationLabel}>Feedback:</Text>
        <TextInput
          style={styles.feedbackInput}
          multiline
          numberOfLines={4}
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Enter validation feedback..."
        />
      </View>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {existingValidation ? 'Update Validation' : 'Save Validation'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  validationSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  validationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  validationLabel: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  validationButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  validationButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  validationButtonSelected: {
    borderColor: 'transparent',
  },
  validationButtonText: {
    fontSize: 24,
    color: '#666',
  },
  validationButtonTextSelected: {
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  ratingButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: 'transparent',
  },
  ratingButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  ratingButtonTextSelected: {
    color: 'white',
  },
  feedbackContainer: {
    marginBottom: 20,
  },
  feedbackInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ValidationSection;