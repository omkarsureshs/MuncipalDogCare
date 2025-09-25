import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
        <View />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Admin Dashboard</Text>
        <Text style={styles.description}>Manage system settings and user accounts</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: { fontSize: 18, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default AdminDashboardScreen;