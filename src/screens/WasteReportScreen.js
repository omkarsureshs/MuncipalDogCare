// src/screens/WasteReportScreen.js
import React, { useState, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const WasteReportScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [issueLocation, setIssueLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [submitted, setSubmitted] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const mapRef = useRef(null);

  // Pick image
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow access to photos to upload an image');
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
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Use device current location
  const useMyLocation = async () => {
    try {
      setGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGettingLocation(false);
        Alert.alert('Permission required', 'Location permission is required to use current location.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
        timeout: 10000,
      });

      const { latitude, longitude } = loc.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setIssueLocation(newRegion);

      // animate map to new region if mapRef exists
      if (mapRef.current && mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
    } catch (err) {
      console.error('Location error:', err);
      Alert.alert('Error', 'Unable to get current location. Try again.');
    } finally {
      setGettingLocation(false);
    }
  };

  // open external maps app or google maps web
  const openInMaps = () => {
    const url = Platform.select({
      ios: `maps:${issueLocation.latitude},${issueLocation.longitude}`,
      android: `geo:${issueLocation.latitude},${issueLocation.longitude}?q=${issueLocation.latitude},${issueLocation.longitude}`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${issueLocation.latitude},${issueLocation.longitude}`;
          Linking.openURL(googleUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Could not open maps.');
      });
  };

  // submit
  const handleSubmit = () => {
    if (!description.trim() || !image) {
      Alert.alert('Error', 'Please fill all fields and upload an image');
      setSubmitted(false);
      return;
    }

    const reportData = {
      description: description.trim(),
      image,
      location: issueLocation,
      timestamp: new Date().toISOString(),
    };

    console.log('Waste Report Data:', reportData);

    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        setSubmitted(true);
        setDescription('');
        setImage(null);
      } else {
        setSubmitted(false);
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#1A1F2B', '#2D3748']} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1F2B" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Report Waste Issue</Text>
          <Text style={styles.subtitle}>
            Upload an image, select location (or use your current location), and describe the problem
          </Text>

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

          {/* Map + Use my location */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Select Waste Location *</Text>

            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={issueLocation}
              region={issueLocation} // keep map centered on selected location
              onPress={(e) =>
                setIssueLocation({
                  ...e.nativeEvent.coordinate,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                })
              }
            >
              <Marker
                coordinate={issueLocation}
                draggable
                onDragEnd={(e) =>
                  setIssueLocation({
                    ...e.nativeEvent.coordinate,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  })
                }
                title="Waste Location"
              >
                <View style={styles.issueMarker}>
                  <Feather name="trash-2" size={20} color="white" />
                </View>
              </Marker>
            </MapView>

            <View style={styles.navigationControls}>
              <TouchableOpacity style={styles.navButton} onPress={openInMaps}>
                <Feather name="navigation" size={18} color="white" />
                <Text style={styles.navButtonText}>Open in Maps</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={useMyLocation}>
                {gettingLocation ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="map-pin" size={18} color="white" />
                    <Text style={styles.navButtonText}>Use My Location</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the waste issue"
            placeholderTextColor="#CBD5E0"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!description.trim() || !image) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!description.trim() || !image}
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
  subtitle: { fontSize: 16, color: '#CBD5E0', marginBottom: 12 },
  imageUpload: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  imagePreview: { width: '100%', height: '100%', borderRadius: 14 },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imageText: { color: '#CBD5E0', marginTop: 8, fontSize: 16 },
  label: { fontSize: 14, color: '#FFFFFF', marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: { height: 100, paddingTop: 12 },
  map: { width: '100%', height: 250, borderRadius: 16, marginBottom: 12 },
  issueMarker: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navButtonText: { color: '#FFFFFF', marginLeft: 8, fontWeight: '600' },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#666' },
  submitButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  feedbackContainerSuccess: { justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  feedbackContainerFail: { justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  feedbackText: { color: '#FFFFFF', fontSize: 16, marginTop: 8 },
});

export default WasteReportScreen;
