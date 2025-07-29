import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4B39EF',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        // tabBarStyle: { display: 'none' },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'home') iconName = 'home';
          else if (route.name === 'profile_patient') iconName = 'person';
          else if (route.name === 'chat') iconName = 'chatbubble-ellipses';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Trang chủ', href: null }} />
      <Tabs.Screen name="chat" options={{ title: 'Trợ lý AI' }} />
      <Tabs.Screen name="profile_patient" options={{ title: 'Cá nhân' }} />
      {/* Ẩn file profile.jsx khỏi tab bar */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
