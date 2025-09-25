// src/screens/RegisterScreen.js
import React, { useState,useCallback  } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import uuid from "react-uuid";

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
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // In a real app, you would send this data to your backend
      const userData = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        registeredAt: new Date().toISOString(),
      };

      Alert.alert(
        'Registration Successful',
        `Welcome to CivicCare, ${userData.fullName}! Your ${roles[userData.role].name.toLowerCase()} account has been created successfully.`,
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

  const RoleSelector = () => (
    <View style={styles.roleSelector}>
      <Text style={styles.roleLabel}>Register as:</Text>
      <View style={styles.roleButtons}>
        {Object.entries(roles).map(([key, role]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.roleButton,
              formData.role === key && styles.roleButtonActive,
              { borderColor: role.color },
            ]}
            onPress={() => handleInputChange('role', key)}
          >
            <Feather
              name={role.icon}
              size={16}
              color={formData.role === key ? '#ffffff' : role.color}
            />
            <Text
              style={[
                styles.roleButtonText,
                formData.role === key && styles.roleButtonTextActive,
                { color: formData.role === key ? '#ffffff' : role.color },
              ]}
            >
              {role.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.roleDescription}>
        {formData.role === 'USER' 
          ? 'Citizen account for reporting issues and tracking requests'
          : 'Worker account for managing and resolving service requests'
        }
      </Text>
    </View>
  );

const InputField = React.memo(({ 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  showEyeIcon = false, 
  onToggleVisibility, 
  keyboardType = 'default', 
  autoCapitalize = 'none' 
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
      returnKeyType="next"
      // Add these props for better performance
      blurOnSubmit={false}
      importantForAutofill="yes"
      autoCompleteType="off"
      autoCorrect={false}
      // Add key if needed (for dynamic forms)
      key={placeholder}
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
));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Add this
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />

      <LinearGradient
        colors={['#1a365d', '#2d3748', '#4a5568']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Add this
  keyboardDismissMode="on-drag" // Add this
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Feather name="shield" size={32} color="#ffffff" />
              <Text style={styles.appName}>CivicCare</Text>
            </View>
            <View style={styles.placeholder} />
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            <Text style={styles.registerTitle}>Create Account</Text>
            <Text style={styles.registerSubtitle}>
              Join CivicCare as a {roles[formData.role].name.toLowerCase()}
            </Text>

            <RoleSelector />

            {/* Personal Information */}
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <InputField
              icon="user"
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              autoCapitalize="words"
            />

            <InputField
              icon="mail"
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
            />

            <InputField
              icon="phone"
              placeholder="Phone Number"
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

            {/* Account Information */}
            <Text style={styles.sectionTitle}>Account Information</Text>

            <InputField
              icon="at-sign"
              placeholder="Username"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
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
            />

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: { padding: 8 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  appName: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginLeft: 8 },
  placeholder: { width: 40 },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 40,
  },
  registerTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#2d3748', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  registerSubtitle: { 
    fontSize: 14, 
    color: '#718096', 
    textAlign: 'center', 
    marginBottom: 32, 
    lineHeight: 20 
  },
  roleSelector: { marginBottom: 24 },
  roleLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#4a5568', 
    marginBottom: 12 
  },
  roleButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 4,
  },
  roleButtonActive: { backgroundColor: '#3182ce' },
  roleButtonText: { fontSize: 12, fontWeight: '600', marginLeft: 6 },
  roleButtonTextActive: { color: '#ffffff' },
  roleDescription: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3182ce',
    paddingLeft: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: '#2d3748', height: '100%' },
  eyeIcon: { padding: 4 },
  termsContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  termsText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#3182ce',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#3182ce',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3182ce',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    backgroundColor: '#a0aec0',
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
    padding: 8,
  },
  loginLinkText: {
    color: '#3182ce',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;