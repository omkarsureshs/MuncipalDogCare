// src/screens/RegisterScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    role: 'USER',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = {
    USER: { name: 'Citizen', icon: 'user', color: '#3182ce' },
    WORKER: { name: 'Worker', icon: 'tool', color: '#38a169' },
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const validateForm = () => {
    const { fullName, email, username, password, confirmPassword, phoneNumber, address } = formData;

    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    if (!username.trim()) {
      Alert.alert('Validation Error', 'Please choose a username');
      return false;
    }

    if (username.length < 3) {
      Alert.alert('Validation Error', 'Username must be at least 3 characters long');
      return false;
    }

    if (!password) {
      Alert.alert('Validation Error', 'Please enter a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }

    if (!address.trim()) {
      Alert.alert('Validation Error', 'Please enter your address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userData = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        registeredAt: new Date().toISOString(),
      };

      Alert.alert(
        'Registration Successful',
        `Welcome to CivicCare, ${userData.fullName}!`,
        [
          {
            text: 'Continue to Login',
            onPress: () => navigation.navigate('Login', { 
              preFilledUsername: userData.username,
              selectedRole: userData.role 
            })
          }
        ]
      );
    }, 2000);
  };

  const InputField = useCallback(({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false, 
    showEyeIcon = false, 
    onToggleVisibility, 
    keyboardType = 'default', 
    autoCapitalize = 'none',
    returnKeyType = 'next',
    onSubmitEditing
  }) => (
    <View style={styles.inputContainer}>
      <Feather name={icon} size={20} color="#718096" style={styles.inputIcon} />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#a0aec0"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        enablesReturnKeyAutomatically
        blurOnSubmit={false}
      />
      {showEyeIcon && (
        <TouchableOpacity style={styles.eyeIcon} onPress={onToggleVisibility}>
          <Feather
            name={secureTextEntry ? 'eye' : 'eye-off'}
            size={20}
            color="#718096"
          />
        </TouchableOpacity>
      )}
    </View>
  ), []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#1a365d', '#2d3748', '#4a5568']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left" size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Account</Text>
            </View>

            <View style={styles.formContainer}>
              <InputField
                icon="user"
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                autoCapitalize="words"
              />

              <InputField
                icon="mail"
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
              />

              <InputField
                icon="user"
                placeholder="Username"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
              />

              <InputField
                icon="phone"
                placeholder="Phone"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
              />

              <InputField
                icon="map-pin"
                placeholder="Address"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                autoCapitalize="words"
              />

              <InputField
                icon="lock"
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                showEyeIcon={true}
                onToggleVisibility={() => setShowPassword(!showPassword)}
              />

              <InputField
                icon="lock"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                showEyeIcon={true}
                onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
             