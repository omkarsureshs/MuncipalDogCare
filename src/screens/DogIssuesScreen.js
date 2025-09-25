// src/screens/DogIssuesScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image,
  Alert,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

const DogIssuesScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(null); // null / true / false

  // Function to pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Allow access to your photos to upload an image');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // Function to submit report
  const handleSubmit = () => {
    if (!description || !image) {
      Alert.alert('Error', 'Please provide both an image and description');
      setSubmitted(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% chance to succeed
      if (success) {
        setSubmitted(true);
        setDescription('');
        setImage(null);
      } else {
        setSubmitted(false);
      }
    }, 1000);
  };

  return (
    <LinearGradient colors={['#1A1F2B', '#2D3748']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1F2B" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.title}>Report a Dog Issue</Text>
        <Text style={styles.subtitle}>Upload an image and describe the issue</Text>

        {/* Image Upload */}
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={40} color="#CBD5E0" />
              <Text style={styles.imageText}>Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Description Input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Describe the dog issue"
          placeholderTextColor="#CBD5E0"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>

        {/* Submission Feedback */}
        {submitted === true && (
          <View style={styles.feedbackContainerSuccess}>
            <Feather name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.feedbackText}>Report submitted successfully!</Text>
          </View>
        )}
        {submitted === false && (
          <View style={styles.feedbackContainerFail}>
            <Feather name="x-circle" size={48} color="#F44336" />
            <Text style={styles.feedbackText}>Failed to submit report</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CBD5E0',
    marginBottom: 24,
  },
  imageUpload: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#CBD5E0',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  feedbackContainerSuccess: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  feedbackContainerFail: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
  },
});

export default DogIssuesScreen;
