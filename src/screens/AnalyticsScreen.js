// src/screens/AnalyticsScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const AnalyticsScreen = () => {
  // Example data with safe fallback
  const dailyReports = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [5, 10, 8, 12, 6, 14, 10] || [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(246, 173, 85, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const resolvedStats = [
    { name: "Resolved", population: 85, color: "#48bb78", legendFontColor: "#4a5568", legendFontSize: 12 },
    { name: "Pending", population: 15, color: "#e53e3e", legendFontColor: "#4a5568", legendFontSize: 12 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Analytics</Text>
        <Text style={styles.headerSubtitle}>Detailed metrics of reports and users</Text>
      </View>

      {/* Line Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reports Over the Week</Text>
        <LineChart
          data={dailyReports}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#fff3e0",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(246, 173, 85, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#f6ad55" },
          }}
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Pie Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resolved vs Pending Reports</Text>
        <PieChart
          data={resolvedStats}
          width={screenWidth - 40}
          height={220}
          chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Summary Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>120</Text>
            <Text style={styles.summaryLabel}>Active Users</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>35</Text>
            <Text style={styles.summaryLabel}>Reports Today</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>85%</Text>
            <Text style={styles.summaryLabel}>Resolved</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: { padding: 20, backgroundColor: "#f6ad55", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: "#fff" },

  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2d3748", marginBottom: 12 },

  summaryContainer: { flexDirection: "row", justifyContent: "space-between" },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  summaryNumber: { fontSize: 20, fontWeight: "700", color: "#f6ad55" },
  summaryLabel: { fontSize: 14, color: "#4a5568", marginTop: 4 },
});

export default AnalyticsScreen;
