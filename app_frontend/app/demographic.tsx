import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal,
  TextInput
} from 'react-native';
import axios from 'axios';
//get username and password from hook
import { useAuth } from '../context/AuthContext';

export default function UserRegistrationScreen() {
  const { user, logout } = useAuth();  

  const [formData, setFormData] = useState({
    username: user?.username,
    password: '123',
    age: '',
    gender: '',
    occupation: '',
    height: '',
    weight: '',
    physical_activity: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormComplete = () => {
    return Object.values(formData).every(val => val.trim() !== '');
  };

  const submitRegistration = async () => {
    if (!isFormComplete()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://192.168.128.114:5000/users', {
        ...formData,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight)
      });
      
      setRegistrationResult(response.data.message || 'Registration Successful');
      setModalVisible(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Demographics</Text>
      
      <View style={styles.formContainer}>
  
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => updateField('age', text)}
        />
        
        {/* Gender Picker */}
        <View style={styles.pickerContainer}>
          {['Male', 'Female', 'Other'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.pickerButton,
                formData.gender === gender && styles.selectedPicker
              ]}
              onPress={() => updateField('gender', gender)}
            >
              <Text style={[
                styles.pickerText,
                formData.gender === gender && styles.selectedPickerText
              ]}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Occupation"
          value={formData.occupation}
          onChangeText={(text) => updateField('occupation', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={formData.height}
          onChangeText={(text) => updateField('height', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={formData.weight}
          onChangeText={(text) => updateField('weight', text)}
        />
        
        {/* Physical Activity Picker */}
        <Text style={styles.resultText}>Physical Activity Level</Text>
        <View style={styles.pickerContainer}>
          {['Low', 'Moderate', 'High'].map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.pickerButton,
                formData.physical_activity === activity && styles.selectedPicker
              ]}
              onPress={() => updateField('physical_activity', activity)}
            >
              <Text style={[
                styles.pickerText,
                formData.physical_activity === activity && styles.selectedPickerText
              ]}>
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            !isFormComplete() && styles.disabledButton
          ]}
          onPress={submitRegistration}
          disabled={!isFormComplete()}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registration Complete</Text>
            <Text style={styles.resultText}>
              {registrationResult}
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
    backgroundColor: '#e6f3ff', // Light blue background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3', // Material blue
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    padding: 15,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pickerButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedPicker: {
    backgroundColor: '#2196F3',
  },
  pickerText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  selectedPickerText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
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
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  resultText: {
    fontSize: 18,
    color: '#2196F3',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#2196F3',
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