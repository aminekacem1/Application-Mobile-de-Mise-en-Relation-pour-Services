import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,          // <-- THIS hides the top header bar!
        tabBarStyle: { display: 'none' }, // <-- hides bottom tab bar if you want
      }}
    />
  );
}
