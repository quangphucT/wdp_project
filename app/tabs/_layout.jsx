import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({ 
        tabBarActiveTintColor: '#4B39EF',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'home') iconName = 'home';
          else if (route.name === 'schedule') iconName = 'calendar';
          else if (route.name === 'messages') iconName = 'chatbubble';
          else if (route.name === 'profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="schedule" options={{ title: 'Lịch' }} />
      <Tabs.Screen name="messages" options={{ title: 'Tin nhắn' }} />
      <Tabs.Screen name="profile" options={{ title: 'Cá nhân' }} />
    </Tabs>
  );
}
