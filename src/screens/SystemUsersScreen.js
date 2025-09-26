// src/screens/SystemUsersScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Sample user data
const initialUsers = [
  { id: 1, name: "John Doe", username: "john123", role: "Citizen", status: "Active" },
  { id: 2, name: "Jane Smith", username: "jane456", role: "Worker", status: "Active" },
  { id: 3, name: "Mike Johnson", username: "mike789", role: "Citizen", status: "Suspended" },
  { id: 4, name: "Admin User", username: "admin", role: "Admin", status: "Active" },
];

const SystemUsersScreen = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  // Filter users based on search input
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Delete user
  const handleDelete = (id) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setUsers(users.filter((user) => user.id !== id)),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Users</Text>
        <Text style={styles.headerSubtitle}>Manage all users in your system</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#f6ad55" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* User List */}
      <View style={styles.section}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userInfo}>{user.username} | {user.role}</Text>
              <Text style={[styles.userStatus, 
                { color: user.status === "Active" ? "#48bb78" : "#e53e3e" }
              ]}>{user.status}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Alert.alert("Edit User", `Edit ${user.name}`)}
              >
                <Feather name="edit" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#e53e3e" }]}
                onPress={() => handleDelete(user.id)}
              >
                <Feather name="trash-2" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredUsers.length === 0 && (
          <Text style={styles.noUsers}>No users found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    padding: 20,
    backgroundColor: "#f6ad55",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: "#fff" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },

  section: { marginTop: 20, paddingHorizontal: 20 },
  userCard: {
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  userName: { fontSize: 16, fontWeight: "700", color: "#2d3748" },
  userInfo: { fontSize: 12, color: "#4a5568", marginVertical: 2 },
  userStatus: { fontSize: 12, fontWeight: "600" },

  actions: { flexDirection: "row" },
  actionButton: {
    backgroundColor: "#f6ad55",
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  noUsers: { textAlign: "center", marginTop: 20, color: "#4a5568", fontSize: 14 },
});

export default SystemUsersScreen;
