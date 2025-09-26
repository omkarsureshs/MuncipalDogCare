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
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const DogIssuesScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [numDogs, setNumDogs] = useState(''); // ✅ Added state for number of dogs
  const [issueLocation, setIssueLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow access to your photos to upload an image');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoadingLocation(false);
        Alert.alert('Permission Denied', 'Please allow location access to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setIssueLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoadingLocation(false);
    } catch (error) {
      setLoadingLocation(false);
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to fetch current location.');
    }
  };

  // Open external maps
  const openInMaps = () => {
    if (!issueLocation) {
      Alert.alert('No Location', 'Please select or fetch a location first.');
      return;
    }
    const url = Platform.select({
      ios: `maps:${issueLocation.latitude},${issueLocation.longitude}`,
      android: `geo:${issueLocation.latitude},${issueLocation.longitude}?q=${issueLocation.latitude},${issueLocation.longitude}`,
    });
    
    Linking.openURL(url).catch(() => {
      const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${issueLocation.latitude},${issueLocation.longitude}`;
      Linking.openURL(googleUrl);
    });
  };

  // Submit report
  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of the issue');
      setSubmitted(false);
      return;
    }
    if (!image) {
      Alert.alert('Error', 'Please upload an image');
      setSubmitted(false);
      return;
    }
    if (!issueLocation) {
      Alert.alert('Error', 'Please select or fetch a location');
      setSubmitted(false);
      return;
    }
    if (!numDogs.trim()) {
      Alert.alert('Error', 'Please enter number of dogs');
      setSubmitted(false);
      return;
    }

    const reportData = {
      description: description.trim(),
      image,
      numDogs,
      location: issueLocation,
      timestamp: new Date().toISOString(),
    };
    console.log('Report Data:', reportData);

    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        setSubmitted(true);
        setDescription('');
        setImage(null);
        setIssueLocation(null);
        setNumDogs('');
      } else {
        setSubmitted(false);
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={['#1A1F2B', '#2D3748']} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1F2B" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <Text style={styles.title}>Report a Dog Issue</Text>
          <Text style={styles.subtitle}>Upload an image, select location, and describe the issue</Text>

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

          {/* Map Section */}
          <Text style={styles.label}>Select Issue Location *</Text>
          {issueLocation ? (
            <MapView
              style={styles.map}
              region={issueLocation}
              onPress={(e) =>
                setIssueLocation({
                  ...e.nativeEvent.coordinate,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                })
              }
            >
              <Marker coordinate={issueLocation} draggable
                onDragEnd={(e) =>
                  setIssueLocation({
                    ...e.nativeEvent.coordinate,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  })
                }
                title="Dog Issue Location"
              />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>No location selected</Text>
            </View>
          )}

          {/* Location Buttons */}
          <View style={styles.locationControls}>
            <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
              {loadingLocation ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Feather name="crosshair" size={18} color="white" />
                  <Text style={styles.locationButtonText}>Use My Location</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.locationButton} onPress={openInMaps}>
              <Feather name="navigation" size={18} color="white" />
              <Text style={styles.locationButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Number of Dogs Input */}
          <Text style={styles.label}>Number of Dogs *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of dogs"
            placeholderTextColor="#CBD5E0"
            value={numDogs}
            onChangeText={setNumDogs}
            keyboardType="numeric"
          />

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the dog issue"
            placeholderTextColor="#CBD5E0"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!description.trim() || !image || !issueLocation || !numDogs.trim()) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!description.trim() || !image || !issueLocation || !numDogs.trim()}
          >
            <Feather name="send" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>

          {/* Feedback */}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#CBD5E0', marginBottom: 24 },
  imageUpload: { 
    borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', 
    marginBottom: 20, height: 200, justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)'
  },
  imagePreview: { width: '100%', height: '100%', borderRadius: 14 },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imageText: { color: '#CBD5E0', marginTop: 8, fontSize: 16 },
  label: { fontSize: 14, color: '#FFFFFF', marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, marginBottom: 20, color: '#FFFFFF', fontSize: 16 },
  textArea: { height: 100, paddingTop: 12 },
  map: { width: '100%', height: 250, borderRadius: 16, marginBottom: 12 },
  mapPlaceholder: { height: 250, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  mapPlaceholderText: { color: '#CBD5E0', fontSize: 16 },
  locationControls: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  locationButton: { backgroundColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, flex: 1, marginHorizontal: 4, justifyContent: 'center' },
  locationButtonText: { color: '#FFFFFF', marginLeft: 8, fontWeight: '600' },
  submitButton: { backgroundColor: '#FF6B35', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 20, flexDirection: 'row', justifyContent: 'center' },
  submitButtonDisabled: { backgroundColor: '#666' },
  submitButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  feedbackContainerSuccess: { justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  feedbackContainerFail: { justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  feedbackText: { color: '#FFFFFF', fontSize: 16, marginTop: 8, fontWeight: '600' },
});

export default DogIssuesScreen;
