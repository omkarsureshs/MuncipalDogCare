// src/screens/WorkerAssignmentsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const WorkerAssignmentsScreen = ({ navigation }) => {
  const sections = [
    {
      title: 'Assigned',
      data: [
        {
          id: '1',
          title: 'Collect stray dog report',
          location: 'Park Street, Downtown',
          deadline: '2025-09-30',
          description: 'Respond to a stray dog issue reported by a community member. The dog was last seen near the park entrance and appears to be friendly but malnourished. Please bring appropriate equipment for safe handling and transport to the animal shelter.',
          reportedBy: 'Sarah Johnson',
          reportDate: '2025-09-25',
          priority: 'High',
          estimatedTime: '2 hours',
          requiredEquipment: ['Animal carrier', 'Leash', 'Treats', 'Safety gloves'],
          status: 'assigned',
        },
      ],
    },
    {
      title: 'Pending',
      data: [
        {
          id: '2',
          title: 'Check reported pothole',
          location: '5th Avenue, City Center',
          deadline: '2025-10-02',
          description: 'Inspect and report the status of pothole issue. The pothole is approximately 3 feet wide and 8 inches deep, located near the intersection. Take photos and measurements for repair assessment.',
          reportedBy: 'Mike Chen',
          reportDate: '2025-09-24',
          priority: 'Medium',
          estimatedTime: '1 hour',
          requiredEquipment: ['Measuring tape', 'Camera', 'Safety cones', 'Report forms'],
          status: 'pending',
        },
      ],
    },
    {
      title: 'Completed',
      data: [
        {
          id: '3',
          title: 'Garbage removal at Main Road',
          location: 'Main Road, Sector 5',
          deadline: '2025-09-28',
          description: 'Pick up and dispose garbage reported by local citizen. Large pile of household waste dumped illegally near the bus stop. Sorted recyclables and disposed of non-recyclable materials properly.',
          reportedBy: 'Anna Rodriguez',
          reportDate: '2025-09-26',
          priority: 'Medium',
          estimatedTime: '3 hours',
          completedTime: '2.5 hours',
          requiredEquipment: ['Garbage truck', 'Safety gear', 'Sorting bins'],
          completionNotes: 'Task completed successfully. Area cleaned and sanitized.',
          status: 'completed',
        },
      ],
    },
  ];

  // Determine badge based on status
  const renderBadge = (status) => {
    switch (status) {
      case 'assigned':
        return (
          <View style={[styles.badge, { backgroundColor: '#FFD700' }]}>
            <Feather name="star" size={12} color="#fff" />
          </View>
        );
      case 'pending':
        return (
          <View style={[styles.badge, { backgroundColor: '#e53e3e' }]}>
            <Feather name="clock" size={12} color="#fff" />
          </View>
        );
      case 'completed':
        return (
          <View style={[styles.badge, { backgroundColor: '#38a169' }]}>
            <Feather name="check" size={12} color="#fff" />
          </View>
        );
      default:
        return null;
    }
  };

  const renderAssignment = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.assignmentCard, 
        item.status === 'completed' && { backgroundColor: '#f0fff4' }
      ]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('AssignmentDetail', { assignment: item })}
    >
      {renderBadge(item.status)}
      
      <View style={styles.assignmentContent}>
        <View style={styles.assignmentHeader}>
          <Text style={styles.assignmentTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Feather name="chevron-right" size={20} color="#E1994D" />
        </View>
        
        <View style={styles.locationContainer}>
          <Feather name="map-pin" size={14} color="#718096" />
          <Text style={styles.assignmentLocation} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E1994D" />
      <LinearGradient colors={['#E1994D', '#cc7a1c']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Assignments</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignment}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fffaf5' 
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#fff' 
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 12,
    marginTop: 16,
  },
  assignmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    position: 'relative',
    minHeight: 80,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  assignmentContent: {
    flex: 1,
    marginLeft: 28,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  assignmentTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#2d3748',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  assignmentLocation: { 
    fontSize: 14, 
    color: '#718096', 
    marginLeft: 6,
    flex: 1,
  },
});

export default WorkerAssignmentsScreen;