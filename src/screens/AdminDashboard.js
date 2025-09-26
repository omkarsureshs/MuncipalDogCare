// src/screens/AdminDashboard.js 
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Analytics Card Component
const AnalyticsCard = ({ icon, color, number, label }) => (
  <View style={[styles.analyticsCard, { borderLeftColor: color }]}>
    <Feather name={icon} size={24} color={color} />
    <Text style={styles.analyticsNumber}>{number}</Text>
    <Text style={styles.analyticsLabel}>{label}</Text>
  </View>
);

// Quick Action Button Component
const QuickButton = ({ icon, text, color, onPress }) => (
  <TouchableOpacity
    style={[styles.quickButton, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Feather name={icon} size={20} color="#fff" />
    <Text style={styles.quickText}>{text}</Text>
  </TouchableOpacity>
);

const AdminDashboard = ({ route, navigation }) => {
  const { admin } = route.params || { admin: { name: "Admin User" } };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome, {admin.name}</Text>
        <Text style={styles.headerSubtitle}>Admin Dashboard</Text>
      </View>

      {/* System Analytics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Analytics</Text>
        <View style={styles.analyticsRow}>
          <AnalyticsCard icon="users" color="#f6ad55" number={120} label="Active Users" />
          <AnalyticsCard icon="file-text" color="#f6ad55" number={35} label="Reports Today" />
          <AnalyticsCard icon="check-circle" color="#f6ad55" number="85%" label="Resolved" />
        </View>
      </View>

      {/* Overview Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewText}>
            ✅ System is running smoothly{"\n"}
            ✅ 95% of citizen reports are resolved within SLA{"\n"}
            ⚠️ 12 pending reports require attention
          </Text>
        </View>
      </View>

      {/* Quick Access Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickActions}>
          <QuickButton
            icon="activity"
            text="Analytics"
            color="#f6ad55"
            onPress={() => navigation.navigate("AnalyticsScreen")}
          />
          <QuickButton
            icon="users"
             text="Manage Users"
             color="#f6ad55"
             onPress={() => navigation.navigate("SystemUsers")}
            />
          <QuickButton
        icon="alert-circle"
        text="Reports"
        color="#f6ad55"
        onPress={() => navigation.navigate("ReportsScreen")}
        />
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Feather name="user-plus" size={16} color="#f6ad55" />
          <Text style={styles.activityText}>New user registered</Text>
        </View>
        <View style={styles.activityItem}>
          <Feather name="check" size={16} color="#48bb78" />
          <Text style={styles.activityText}>Worker completed task</Text>
        </View>
        <View style={styles.activityItem}>
          <Feather name="alert-triangle" size={16} color="#e53e3e" />
          <Text style={styles.activityText}>Pending report flagged</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    padding: 25,
    backgroundColor: "#f6ad55",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: "#fff" },

  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#2d3748", marginBottom: 12 },

  analyticsRow: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" },
  analyticsCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  analyticsNumber: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  analyticsLabel: { fontSize: 12, color: "#4a5568", marginTop: 4, textAlign: "center" },

  overviewCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  overviewText: { fontSize: 14, color: "#2d3748", lineHeight: 20 },

  quickActions: { flexDirection: "row", justifyContent: "space-between" },
  quickButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  quickText: { color: "#fff", fontWeight: "600", marginLeft: 8 },

  activityItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  activityText: { marginLeft: 8, fontSize: 14, color: "#4a5568" },
});

export default AdminDashboard;
