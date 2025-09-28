// front/app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For some icons
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5'; // For other icons like chart-bar

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide default header for all tab screens
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#a0aec0',
        tabBarStyle: {
          backgroundColor: '#1e3a8a', // Dark blue background for tab bar
          borderTopWidth: 1,
          borderTopColor: '#4a5568', // Subtle separator
          paddingBottom: insets.bottom, // Ensure it respects system safe area
          height: 65 + insets.bottom, // Adjust height based on safe area
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="technicianPage" // This is your "Emplois" page (Image 1)
        options={{
          title: 'Emplois',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MessagesScreen" // This is your "Messages" page (Image 2)
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="send-outline" size={size} color={color} />
          ),
        }}
      />
      {/* --- NEW: Statistique Tab - POINTS TO technicianDashboard.jsx --- */}
      <Tabs.Screen
        name="technicianDashboard" // This name MUST match your file front/app/(tabs)/technicianDashboard.jsx
        options={{
          title: 'Statistique', // Display "Statistique" in the tab bar
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" solid size={size} color={color} /> // Using FontAwesome5 for chart-bar
          ),
        }}
      />
      {/* --- END NEW: Statistique Tab --- */}

      <Tabs.Screen
        name="profile" // This is your "Profil" EDIT page (Image 3)
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}