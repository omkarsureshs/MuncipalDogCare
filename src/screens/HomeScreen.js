// src/screens/HomeScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation, route }) => {
  const user = route.params?.user || { username: 'Demo User', role: 'USER' };

  const roleConfig = {
    USER: {
      greeting: 'Community Member',
      primaryAction: 'Report New Issue',
      primaryIcon: 'plus-circle',
      stats: [
        { icon: 'alert-circle', label: 'My Reports', value: 5, color: '#e53e3e' },
        { icon: 'check-circle', label: 'Resolved', value: 3, color: '#38a169' },
        { icon: 'clock', label: 'In Progress', value: 2, color: '#d69e2e' },
      ],
      features: [
        { icon: 'map-pin', title: 'Issue Map', desc: 'View issues in your area' },
        { icon: 'bell', title: 'Notifications', desc: 'Get status updates' },
        { icon: 'message-square', title: 'Feedback', desc: 'Send feedback' },
        { icon: 'info', title: 'Help', desc: 'Get app support' },
      ],
    },
    WORKER: {
      greeting: 'Service Worker',
      primaryAction: 'View Assignments',
      primaryIcon: 'briefcase',
      stats: [
        { icon: 'list', label: 'Assigned', value: 8, color: '#3182ce' },
        { icon: 'check-circle', label: 'Completed', value: 12, color: '#38a169' },
        { icon: 'clock', label: 'Pending', value: 3, color: '#d69e2e' },
      ],
      features: [
        { icon: 'navigation', title: 'Navigation', desc: 'Get directions to issues' },
        { icon: 'check-square', title: 'Update Status', desc: 'Mark issues as resolved' },
        { icon: 'tool', title: 'Equipment', desc: 'Manage tools' },
      ],
    },
    ADMIN: {
      greeting: 'Administrator',
      primaryAction: 'System Analytics',
      primaryIcon: 'bar-chart',
      stats: [
        { icon: 'users', label: 'Total Users', value: 154, color: '#3182ce' },
        { icon: 'alert-triangle', label: 'Active Issues', value: 23, color: '#e53e3e' },
        { icon: 'trending-up', label: 'Resolution Rate', value: '87%', color: '#38a169' },
      ],
      features: [
        { icon: 'settings', title: 'User Management', desc: 'Manage users and roles' },
        { icon: 'bar-chart', title: 'Analytics', desc: 'View system statistics' },
        { icon: 'database', title: 'Data Control', desc: 'Manage records' },
      ],
    },
  };

  const config = roleConfig[user.role];
// Add this function in HomeScreen.js after the config declaration
const handleFeaturePress = ({ icon, title, desc }) => {
  switch (title) {
    case 'Issue Map':
      // Navigate to map screen when you have it
      Alert.alert('Coming Soon', 'Issue map feature will be available soon');
      break;
    case 'Notifications':
      Alert.alert('Notifications', 'No new notifications');
      break;
    case 'Feedback':
      Alert.alert('Feedback', 'Send us your feedback');
      break;
    case 'Help':
      Alert.alert('Help', 'Contact support for assistance');
      break;
    case 'Navigation':
      Alert.alert('Navigation', 'GPS navigation feature');
      break;
    case 'Update Status':
      Alert.alert('Update Status', 'Mark tasks as completed');
      break;
    case 'User Management':
      Alert.alert('User Management', 'Manage users and roles');
      break;
    case 'Analytics':
      Alert.alert('Analytics', 'View system statistics');
      break;
    default:
      Alert.alert(title, desc);
  }
};
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => navigation.replace('Welcome') },
    ]);
  };

  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Feather name={icon} size={16} color="#ffffff" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

 const FeatureCard = ({ icon, title, desc }) => (
  <TouchableOpacity
    style={styles.featureCard}
    onPress={() => handleFeaturePress({ icon, title, desc })} // ✅ Role-based navigation
  >
    <View style={styles.featureIcon}>
      <Feather name={icon} size={16} color="#ffffff" />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </TouchableOpacity>
);
  // Auto scroll logic for feature list
  const scrollRef = useRef(null);
  let scrollPos = 0;
  let direction = 1;

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToOffset({
          offset: scrollPos,
          animated: true,
        });
        scrollPos += direction * 40; // scroll step
        if (scrollPos > config.features.length * 80 - 200 || scrollPos < 0) {
          direction *= -1; // reverse direction
        }
      }
    }, 2000); // scroll every 2s
    return () => clearInterval(interval);
  }, [config.features.length]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E1994D" />

      {/* Header */}
      <LinearGradient colors={['#E1994D', '#cc7a1c']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome, {user.username}</Text>
            <Text style={styles.userRole}>{config.greeting}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            <Feather name="log-out" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Primary Action */}
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => {
            if (user.role === 'USER') {
              navigation.navigate('Complaint');
            } else if (user.role === 'WORKER') {
              navigation.navigate('WorkerAssignments');
            } else if (user.role === 'ADMIN') {
              navigation.navigate('AdminDashboard');
            } else {
              Alert.alert('Error', 'Invalid user role!');
            }
          }}
        >
          <View style={styles.primaryActionIcon}>
            <Feather name={config.primaryIcon} size={22} color="#E1994D" />
          </View>
          <Text style={styles.primaryActionText}>{config.primaryAction}</Text>
          <Feather name="chevron-right" size={18} color="#a0aec0" />
        </TouchableOpacity>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {config.stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </View>
        </View>

        {/* Auto-scrolling Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.featuresContainer}>
            {config.features.map((item, index) => (
              <FeatureCard key={index} {...item} />
            ))}
          </View>
        </View>
        <View style={styles.roleSection}>
          <Text style={styles.sectionTitle}>
            {user.role === 'USER' && 'Community Issues'}
            {user.role === 'WORKER' && 'Recent Assignments'}
            {user.role === 'ADMIN' && 'System Overview'}
          </Text>
          <View style={styles.roleContent}>
            <Text style={styles.roleMessage}>
              {user.role === 'USER' &&
                'Track the issues you have reported and their current status.'}
              {user.role === 'WORKER' && 'Manage your assigned tasks and update their progress.'}
              {user.role === 'ADMIN' && 'Monitor system performance and manage user accounts.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffaf5' },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 24 },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  userRole: { color: '#fff5eb', fontSize: 14 },
  profileButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  content: { flex: 1, marginTop: -20 },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 14,
    borderRadius: 12,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  primaryActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 12,
  },
  statsSection: { paddingHorizontal: 24, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: { fontSize: 15, fontWeight: '700', color: '#2d3748', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#718096', textAlign: 'center' },
  featuresSection: { paddingHorizontal: 24, marginBottom: 24 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E1994D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: '#2d3748', marginBottom: 2 },
  featureDesc: { fontSize: 11, color: '#718096' },
  featuresContainer: {
  maxHeight: 200,
},
  roleSection: { paddingHorizontal: 24, marginBottom: 40 },
  roleContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  roleMessage: { fontSize: 13, color: '#718096', lineHeight: 18 },
});

export default HomeScreen;
