// front/app/_layout.jsx (MODIFIED to add technicianDashboard route)
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 

export default function RootLayout() {
  return (
    <SafeAreaProvider> 
      <Stack screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
        <Stack.Screen name="chat" options={{ title: 'Chat' }} /> 
        <Stack.Screen name="IndividualChatScreen" options={{ title: 'Conversation' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="userPage" options={{ title: 'Client Home' }} />
        <Stack.Screen name="TechnicianProfile" options={{ title: 'Technician Profile' }} />
        <Stack.Screen name="technicianDashboard" options={{ title: 'Technician Dashboard' }} /> {/* <-- ADD THIS LINE */}
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
    </SafeAreaProvider>
  );
}