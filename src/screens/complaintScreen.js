// src/screens/CustomerScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const CustomerScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const options = [
    { key: 'dog', label: 'Dog Nuisance' },
    { key: 'garbage', label: 'Garbage Issue' },
  ];

  return (
    <LinearGradient colors={['#1A1F2B', '#2C3036', '#3A3F46']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1F2B" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report an Issue</Text>
          <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
        </View>

        {/* Image Upload */}
        <View style={styles.uploadContainer}>
          <Text style={styles.sectionTitle}>Upload Image</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadContent}>
                <Feather name="upload" size={28} color="#E1994D" />
                <Text style={styles.uploadText}>Tap to upload</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Select Issue Type</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                selectedOption === option.key && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedOption(option.key)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option.key && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedOption === option.key && <Feather name="check" size={18} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !selectedOption && styles.disabledButton]}
          disabled={!selectedOption}
          onPress={() => {
            console.log('Submitted:', { image, selectedOption });
            navigation.goBack();
          }}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
          <Feather name="send" size={18} color="#1A1F2B" />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },

  uploadContainer: { marginBottom: 30 },
  uploadBox: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(225,153,77,0.3)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadContent: { justifyContent: 'center', alignItems: 'center' },
  uploadText: { marginTop: 8, fontSize: 14, color: '#E1994D' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  optionsContainer: { marginBottom: 30 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(225,153,77,0.25)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  optionButtonSelected: { backgroundColor: '#E1994D', borderColor: '#E1994D' },
  optionText: { fontSize: 15, color: '#CBD5E0' },
  optionTextSelected: { color: '#1A1F2B', fontWeight: '700' },

  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1994D',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#E1994D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: { opacity: 0.5 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#1A1F2B', marginRight: 6 },
});

export default CustomerScreen;
