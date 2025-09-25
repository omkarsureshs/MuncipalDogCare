// App.js - Updated navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import WelcomeScreen from './src/screens/WelcomeScreen';
import ComplaintSelection from './src/screens/ComplaintSelection';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DogIssuesScreen from './src/screens/DogIssuesScreen';
import WasteReportScreen from './src/screens/WasteReportScreen';
import WorkerAssignmentsScreen from './src/screens/WorkerAssignmentsScreen';
import AssignmentDetailScreen from './src/screens/AssignmentDetails';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: '#1A1F2B',
          },
        }}
      >
       
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Complaint" component={ComplaintSelection} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DogIssues" component={DogIssuesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WasteReport" component={WasteReportScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerAssignments"
  component={WorkerAssignmentsScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
          name="AssignmentDetail" 
          component={AssignmentDetailScreen} 
        />
<Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />    
      </Stack.Navigator>
    </NavigationContainer>
  );
}