// src/screens/RoleSelectionScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
  const roles = [
    
    {
      icon: 'alert-circle',
      title: 'Dog Issues',
      description: 'Report stray or aggressive dogs in your area',
      role: 'DOG_ISSUE',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#81C784'],
      navigateTo: 'DogIssues',
    },
    {
      icon: 'trash-2',
      title: 'Waste Report Issues',
      description: 'Report garbage and waste problems in your neighborhood',
      role: 'WASTE_ISSUE',
      color: '#2196F3',
      gradient: ['#2196F3', '#64B5F6'],
      navigateTo: 'WasteReport',
    },
  ];

  const RoleCard = ({ icon, title, description, role, gradient, navigateTo }) => (
    <TouchableOpacity
      style={styles.roleCard}
      onPress={() => navigation.navigate(navigateTo, { selectedRole: role })}
    >
      <LinearGradient
        colors={gradient}
        style={styles.roleGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.roleHeader}>
          <View style={styles.roleIconContainer}>
            <Feather name={icon} size={28} color="#FFFFFF" />
          </View>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </View>

        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>

        <View style={styles.roleFooter}>
          <Text style={styles.roleActionText}>Select Role</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1A1F2B', '#2D3748']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1F2B" />

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
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Choose Your Complaint</Text>
            <Text style={styles.subtitle}>Select how you'll report to CivicCare</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <RoleCard key={role.role} {...role} />
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoIcon}>
            <Feather name="info" size={20} color="#FF6B35" />
          </View>
          <Text style={styles.infoText}>
            Each role provides different features and access levels tailored to your needs
          </Text>
        </View>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#CBD5E0',
    fontWeight: '400',
  },
  placeholder: {
    width: 40,
  },
  rolesContainer: {
    gap: 20,
    marginBottom: 32,
  },
  roleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  roleGradient: {
    padding: 24,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 24,
  },
  roleFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  roleActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#CBD5E0',
    lineHeight: 20,
  },
});

export default RoleSelectionScreen;
