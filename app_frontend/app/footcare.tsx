import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import FootImagePicker from '@/components/FootImagePicker';

export default function FootCareScreen() {
  const { user } = useAuth();
  const [footRiskScore, setFootRiskScore] = useState(0.2);
  const [formData, setFormData] = useState({
    // Medical History
    username: user?.username,
    history_amputation: '',
    history_foot_ulcer: '',
    history_calf_pain: '',
    history_healing_wound: '',

    // Current Foot Condition
    redness: 0,
    swelling: 0,
    pain: 0,
    numbness: 0,
    sensation: 0,
    recent_cut: '',
    observed_foot: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // New state for modal visibility

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(prevImages => [...prevImages, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const submitFormData = new FormData();
      
      // Add text data
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value !== null ? value.toString() : '');
      });
  
      // Log the images array first
      console.log('Images array:', images);
      
      // Add all images as an array
      images.forEach((uri, index) => {
        // Create file name based on index
        const fileName = `image-${index}.jpg`;
        console.log(`Adding image ${index}:`, fileName);
        
        // Create file object from uri
        submitFormData.append('images', {
          uri: uri,
          type: 'image/jpeg',
          name: fileName
        });
      });
  
      // Log the entire FormData
      for (let [key, value] of submitFormData.entries()) {
        console.log(`${key}:`, value);
      }
  
      // First get prediction
      console.log('Sending prediction request...');
      const predictionResponse = await axios.post(
        'http://192.168.38.114:5000/predict_diabetic_foot',
        submitFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
  
      console.log('Prediction response:', predictionResponse.data);
      const score = predictionResponse.data.score;
      
      // Add score to form data
      submitFormData.append('foot_risk_score', score.toFixed(2));
  
      // Then save record
      console.log('Sending save request...');
      const saveResponse = await axios.post(
        'http://192.168.38.114:5000/add_diabetic_foot',
        submitFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
  
      console.log('Save response:', saveResponse.data);
  
      // Show result
      setResult(`${(score * 100).toFixed(2)}%`);
      setModalVisible(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(error.message || 'Failed to submit assessment');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const renderSlider = (field: string, value: number, title: string) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{title}: {value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={value}
        minimumTrackTintColor="#20b2aa"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#008080"
        onValueChange={(val) => setFormData(prev => ({ ...prev, [field]: val }))}
      />
    </View>
  );

  const renderYesNoButton = (field: string, label: string) => (
    <View style={styles.yesNoContainer}>
      <Text style={styles.yesNoLabel}>{label}</Text>
      <View style={styles.yesNoButtonGroup}>
        <TouchableOpacity
          style={[
            styles.yesNoButton,
            formData[field] === 'yes' && styles.selectedButton
          ]}
          onPress={() => setFormData(prev => ({ ...prev, [field]: 'yes' }))}
        >
          <Text style={[
            styles.yesNoButtonText,
            formData[field] === 'yes' && styles.selectedButtonText
          ]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.yesNoButton,
            formData[field] === 'no' && styles.selectedButton
          ]}
          onPress={() => setFormData(prev => ({ ...prev, [field]: 'no' }))}
        >
          <Text style={[
            styles.yesNoButtonText,
            formData[field] === 'no' && styles.selectedButtonText
          ]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderObservationOptions = () => (
    <View style={styles.observationContainer}>
      <Text style={styles.observationLabel}>
        What was the observation. Did patient have diabetic Foot Complications?
      </Text>
      <View style={styles.observationButtonGroup}>
        <TouchableOpacity
          style={[
            styles.observationButton,
            formData.observed_foot === 'yes_clear' && styles.selectedButton
          ]}
          onPress={() => setFormData(prev => ({ ...prev, observed_foot: 'yes_clear' }))}
        >
          <Text style={[
            styles.observationButtonText,
            formData.observed_foot === 'yes_clear' && styles.selectedButtonText
          ]}>Yes. Very clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.observationButton,
            formData.observed_foot === 'no' && styles.selectedButton
          ]}
          onPress={() => setFormData(prev => ({ ...prev, observed_foot: 'no' }))}
        >
          <Text style={[
            styles.observationButtonText,
            formData.observed_foot === 'no' && styles.selectedButtonText
          ]}>No</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.observationButton,
            formData.observed_foot === 'maybe' && styles.selectedButton
          ]}
          onPress={() => setFormData(prev => ({ ...prev, observed_foot: 'maybe' }))}
        >
          <Text style={[
            styles.observationButtonText,
            formData.observed_foot === 'maybe' && styles.selectedButtonText
          ]}>Maybe may develop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Diabetic Foot Health Assessment</Text>

        {/* Medical History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          {renderYesNoButton('history_amputation', 'History of Amputation')}
          {renderYesNoButton('history_foot_ulcer', 'History of Foot Ulcer')}
          {renderYesNoButton('history_calf_pain', 'History of Calf Pain')}
          {renderYesNoButton('history_healing_wound', 'History of Delayed \Healing Wound')}
        </View>

        {/* Current Foot Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Foot Condition</Text>
          {renderSlider('redness', formData.redness, 'Redness Level')}
          {renderSlider('swelling', formData.swelling, 'Swelling Level')}
          {renderSlider('pain', formData.pain, 'Pain Level')}
          {renderSlider('numbness', formData.numbness, 'Numbness Level')}
          {renderSlider('sensation', formData.sensation, 'Sensation Level')}
          {renderYesNoButton('recent_cut', 'Recent Cut')}
          {renderObservationOptions()}
        </View>

        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foot Images</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>
              {images.length > 0 ? `${images.length} image(s) selected` : 'Select Foot Images'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imagePicker} onPress={captureImage}>
            <Text style={styles.imagePickerText}>Use Camera to Capture Foot Image</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <ScrollView horizontal style={styles.imagePreview}>
              {images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.previewImage}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Assessment'}
          </Text>
        </TouchableOpacity>

        {/* Modal for displaying result */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Risk Assessment Result</Text>
              <Text style={styles.modalScore}>{result}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f3f3', // Light teal background
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#008080', // Teal color
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008080', // Teal color
  },
  observationContainer: {
    marginVertical: 10,
    padding: 10,
  },
  observationLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontWeight: '500',
  },
  observationButtonGroup: {
    flexDirection: 'column',
    gap: 10,
  },
  observationButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#20b2aa',
    backgroundColor: 'white',
  },
  observationButtonText: {
    textAlign: 'center',
    color: '#20b2aa',
    fontSize: 16,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  sliderLabel: {
    color: '#008080',
    marginBottom: 5,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  yesNoLabel: {
    color: '#008080',
    fontSize: 16,
    flex: 1,
  },
  yesNoButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  yesNoButton: {
    borderWidth: 1,
    borderColor: '#20b2aa',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#20b2aa',
  },
  yesNoButtonText: {
    color: '#20b2aa',
  },
  selectedButtonText: {
    color: 'white',
  },
  imagePicker: {
    backgroundColor: '#20b2aa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: 'white',
    fontSize: 16,
  },
  imagePreview: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#20b2aa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20b2aa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008080',
  },
  modalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#20b2aa',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#20b2aa',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
