import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function FootImagePicker() {
  const [images, setImages] = useState([]);

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5, // Set a limit for multiple selections
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your camera to take pictures.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Foot Images</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImageFromLibrary}>
          <Text style={styles.imagePickerText}>
            {images.length > 0 ? `${images.length} image(s) selected` : 'Select Foot Images'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePicker} onPress={takePhoto}>
          <Text style={styles.imagePickerText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {images.length > 0 && (
        <ScrollView horizontal style={styles.imagePreview}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.previewImage} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePicker: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  imagePickerText: {
    color: 'white',
    textAlign: 'center',
  },
  imagePreview: {
    marginTop: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
});
