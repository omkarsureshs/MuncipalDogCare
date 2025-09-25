// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
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

const LoginScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('USER');

  useEffect(() => {
    if (route.params?.selectedRole) {
      setSelectedRole(route.params.selectedRole);
    }
  }, [route.params]);

  const roles = {
    USER: { name: 'Citizen', icon: 'user', color: '#3182ce' },
    WORKER: { name: 'Worker', icon: 'tool', color: '#38a169' },
    ADMIN: { name: 'Admin', icon: 'settings', color: '#e53e3e' },
  };

  const demoCredentials = {
    USER: { username: 'citizen', password: 'citizen123' },
    WORKER: { username: 'worker', password: 'worker123' },
    ADMIN: { username: 'admin', password: 'admin123' },
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const creds = demoCredentials[selectedRole];
      if (username === creds.username && password === creds.password) {
        navigation.replace('Home', {
          user: {
            username,
            role: selectedRole,
            name: `${roles[selectedRole].name} User`,
          },
        });
      } else {
        Alert.alert('Login Failed', 'Invalid credentials for the selected role');
      }
    }, 1500);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setUsername(demoCredentials[role].username);
    setPassword(demoCredentials[role].password);
  };

  const RoleSelector = () => (
    <View style={styles.roleSelector}>
      <Text style={styles.roleLabel}>Login as:</Text>
      <View style={styles.roleButtons}>
        {Object.entries(roles).map(([key, role]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.roleButton,
              selectedRole === key && styles.roleButtonActive,
              { borderColor: role.color },
            ]}
            onPress={() => handleRoleChange(key)}
          >
            <Feather
              name={role.icon}
              size={16}
              color={selectedRole === key ? '#ffffff' : role.color}
            />
            <Text
              style={[
                styles.roleButtonText,
                selectedRole === key && styles.roleButtonTextActive,
                { color: selectedRole === key ? '#ffffff' : role.color },
              ]}
            >
              {role.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />

      <LinearGradient
        colors={['#1a365d', '#2d3748', '#4a5568']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
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

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Sign In as {roles[selectedRole].name}</Text>
            <Text style={styles.loginSubtitle}>
              Access your {roles[selectedRole].name.toLowerCase()} account
            </Text>

            <RoleSelector />

            {/* Username */}
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                placeholderTextColor="#a0aec0"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#a0aec0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#718096"
                />
              </TouchableOpacity>
            </View>

            {/* Demo Info */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Demo Credentials Auto-filled</Text>
              <Text style={styles.demoText}>
                Username: {demoCredentials[selectedRole].username}
                {'\n'}
                Password: {demoCredentials[selectedRole].password}
              </Text>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Register Button/Link */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerButtonText}>
                Don't have an account? Register
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Secure {roles[selectedRole].name.toLowerCase()} authentication
              </Text>
            </View>
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
  loginTitle: { fontSize: 24, fontWeight: '700', color: '#2d3748', marginBottom: 8, textAlign: 'center' },
  loginSubtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 32, lineHeight: 20 },
  roleSelector: { marginBottom: 24 },
  roleLabel: { fontSize: 14, fontWeight: '600', color: '#4a5568', marginBottom: 12 },
  roleButtons: { flexDirection: 'row', justifyContent: 'space-between' },
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 16, color: '#2d3748', height: '100%' },
  eyeIcon: { padding: 4 },
  demoSection: { backgroundColor: '#f0fff4', borderRadius: 8, padding: 16, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#48bb78' },
  demoTitle: { fontSize: 12, fontWeight: '600', color: '#2f855a', marginBottom: 8 },
  demoText: { fontSize: 11, color: '#38a169', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', lineHeight: 16 },
  loginButton: { backgroundColor: '#3182ce', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', shadowColor: '#3182ce', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  loginButtonDisabled: { backgroundColor: '#a0aec0', shadowOpacity: 0 },
  loginButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
  registerButton: { marginTop: 16, alignItems: 'center' },
  registerButtonText: { color: '#3182ce', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  footer: { alignItems: 'center', marginTop: 16 },
  footerText: { color: '#a0aec0', fontSize: 12 },
});

export default LoginScreen;
