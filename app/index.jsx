import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import useAuthStore from '../stores/authStore';
 
export default function Index() {
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    initAuth();
  }, [checkAuth]);

  if (isChecking) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  // Kiểm tra role để redirect đúng màn hình
  if (user?.role === "DOCTOR") {
    return <Redirect href="/doctor" />;
  }
  
  return <Redirect href="/tabs/home" />;
}
