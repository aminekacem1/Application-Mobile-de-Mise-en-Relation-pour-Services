import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,   // Hide the top header (tabs header)
        tabBarStyle: { display: 'none' }, // Hide bottom tab bar if you have one
      }}
    />
  );
}
