// src/screens/ReportsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Sample report data
const reportsData = [
  {
    id: "1",
    citizen: "John Doe",
    type: "Dog Issue",
    worker: "Worker A",
    status: "Pending",
    date: "2025-09-25",
  },
  {
    id: "2",
    citizen: "Jane Smith",
    type: "Waste Report",
    worker: "Worker B",
    status: "Resolved",
    date: "2025-09-24",
  },
  {
    id: "3",
    citizen: "Alice Brown",
    type: "Street Issue",
    worker: "Worker C",
    status: "In Progress",
    date: "2025-09-23",
  },
];

const ReportsScreen = () => {
  const [reports, setReports] = useState(reportsData);

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportType}>{item.type}</Text>
        <Text style={[styles.status, styles[item.status.replace(" ", "")]]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.reportText}>Citizen: {item.citizen}</Text>
      <Text style={styles.reportText}>Assigned Worker: {item.worker}</Text>
      <Text style={styles.reportText}>Date: {item.date}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Feather name="edit" size={16} color="#fff" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#e53e3e" }]}>
          <Feather name="trash" size={16} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Reports Management</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 15, paddingTop: 15 },
  header: { fontSize: 22, fontWeight: "700", color: "#f6ad55", marginBottom: 15 },

  reportCard: {
    backgroundColor: "#fff7ed",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  reportHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  reportType: { fontSize: 16, fontWeight: "600", color: "#2d3748" },
  status: { fontSize: 12, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, color: "#fff" },
  Pending: { backgroundColor: "#f6ad55" },
  Resolved: { backgroundColor: "#48bb78" },
  InProgress: { backgroundColor: "#3182ce" },

  reportText: { fontSize: 14, color: "#4a5568", marginBottom: 4 },
  actions: { flexDirection: "row", marginTop: 10 },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: "#f6ad55",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  actionText: { color: "#fff", marginLeft: 4, fontWeight: "600" },
});

export default ReportsScreen;
