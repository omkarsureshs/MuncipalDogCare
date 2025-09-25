// src/screens/AssignmentDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AssignmentDetailScreen = ({ navigation, route }) => {
  const { assignment } = route.params;
  const [isCompleting, setIsCompleting] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return '#FFD700';
      case 'pending':
        return '#e53e3e';
      case 'completed':
        return '#38a169';
      default:
        return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned':
        return 'Assigned';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#e53e3e';
      case 'Medium':
        return '#ed8936';
      case 'Low':
        return '#38a169';
      default:
        return '#718096';
    }
  };

  const handleCompleteTask = () => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this assignment as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: () => {
            setIsCompleting(true);
            // Simulate API call
            setTimeout(() => {
              setIsCompleting(false);
              Alert.alert('Success', 'Assignment marked as completed!', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            }, 1500);
          },
        },
      ]
    );
  };

  const DetailCard = ({ title, children, icon }) => (
    <View style={styles.detailCard}>
      <View style={styles.detailCardHeader}>
        <Feather name={icon} size={18} color="#E1994D" />
        <Text style={styles.detailCardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E1994D" />
      
      {/* Header */}
      <LinearGradient colors={['#E1994D', '#cc7a1c']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assignment Details</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(assignment.status) }]}>
          <Text style={styles.statusText}>{getStatusText(assignment.status)}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{assignment.title}</Text>

        {/* Basic Info */}
        <DetailCard title="Basic Information" icon="info">
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color="#718096" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{assignment.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color="#718096" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Deadline</Text>
              <Text style={styles.infoValue}>{assignment.deadline}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Feather name="flag" size={16} color="#718096" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Priority</Text>
              <Text style={[styles.infoValue, { color: getPriorityColor(assignment.priority) }]}>
                {assignment.priority}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Feather name="clock" size={16} color="#718096" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estimated Time</Text>
              <Text style={styles.infoValue}>{assignment.estimatedTime}</Text>
            </View>
          </View>
        </DetailCard>

        {/* Description */}
        <DetailCard title="Description" icon="file-text">
          <Text style={styles.descriptionText}>{assignment.description}</Text>
        </DetailCard>

        {/* Report Information */}
        <DetailCard title="Report Information" icon="user">
          <View style={styles.infoRow}>
            <Feather name="user" size={16} color="#718096" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Reported By</Text>
              <Text style={styles.infoValue}>{assignment.reportedBy}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color="#718096" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Report Date</Text>
              <Text style={styles.infoValue}>{assignment.reportDate}</Text>
            </View>
          </View>
        </DetailCard>

        {/* Equipment Required */}
        <DetailCard title="Required Equipment" icon="tool">
          {assignment.requiredEquipment.map((equipment, index) => (
            <View key={index} style={styles.equipmentItem}>
              <Feather name="check-square" size={14} color="#38a169" />
              <Text style={styles.equipmentText}>{equipment}</Text>
            </View>
          ))}
        </DetailCard>

        {/* Completion Info (if completed) */}
        {assignment.status === 'completed' && (
          <DetailCard title="Completion Details" icon="check-circle">
            <View style={styles.infoRow}>
              <Feather name="clock" size={16} color="#718096" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Time Taken</Text>
                <Text style={styles.infoValue}>{assignment.completedTime}</Text>
              </View>
            </View>

            {assignment.completionNotes && (
              <View style={styles.infoRow}>
                <Feather name="message-square" size={16} color="#718096" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Notes</Text>
                  <Text style={styles.infoValue}>{assignment.completionNotes}</Text>
                </View>
              </View>
            )}
          </DetailCard>
        )}

        {/* Action Button */}
        {assignment.status !== 'completed' && (
          <TouchableOpacity
            style={[styles.actionButton, isCompleting && styles.actionButtonDisabled]}
            onPress={handleCompleteTask}
            disabled={isCompleting}
          >
            <LinearGradient
              colors={isCompleting ? ['#a0aec0', '#718096'] : ['#38a169', '#2f855a']}
              style={styles.actionButtonGradient}
            >
              <Feather 
                name={isCompleting ? "clock" : "check"} 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.actionButtonText}>
                {isCompleting ? 'Processing...' : 'Mark as Complete'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf5',
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
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 24,
    lineHeight: 30,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 8,
  },
  actionButton: {
    marginVertical: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AssignmentDetailScreen;