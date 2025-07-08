import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useAuthStore from "../../stores/authStore";
import useFeatureStore from "../../stores/featureStore";

const HomeScreen = () => {
  const router = useRouter();

  // Zustand store
  const { logout, isAuthenticated, isLoading: authLoading, user, checkAuth } = useAuthStore(state => state);
  const features = useFeatureStore(state => state.features);

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    checkAuth(router);
  }, [checkAuth, router]);

  const isLoading = authLoading;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Router sẽ tự redirect sang màn hình login
  }

  const handleLogout = () => {
    logout(router);
  };

  // Lấy tên và chữ cái đầu từ thông tin user
  const firstName = user?.name?.split(' ').pop() || 'User';
  const userInitial = user?.name?.[0] || 'U';

  return (
    <ScrollView className="flex-1 bg-slate-50 mt-[20px]">
      {/* Greeting */}
      <View className="flex-row items-center p-4">
        <View className="w-12 h-12 rounded-full bg-blue-500 justify-center items-center mr-3">
          <Text className="text-white text-lg font-bold">{userInitial}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">Xin chào, {firstName}</Text>
          <Text className="text-xs text-gray-500">Chúc bạn một ngày tốt lành</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="px-3 py-1 bg-red-50 rounded-full">
          <Text className="text-red-500 text-sm">Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Features Grid */}
      <View className="flex-row flex-wrap justify-between px-3 mt-2">
        {features.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[47%] rounded-xl p-4 mb-3 ${item.bgColor}`}
            onPress={() => {
              const route = item.route;
              if (route) {
                router.push(route);
              }
            }}
          >
            <Text className="text-2xl text-white">{item.icon}</Text>
            <Text className="text-sm font-semibold text-gray-900 mt-2">{item.title}</Text>
            <Text className="text-xs text-gray-500">{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today */}
      {/* <View className="bg-white mx-3 my-3 rounded-xl p-4 shadow-sm">
        <Text className="text-base font-bold text-blue-500 mb-3">Hôm nay</Text>
        <View className="mb-2">
          <Text className="font-semibold text-sm">💊 Thuốc cần uống</Text>
          <Text className="text-xs text-gray-600">3 loại thuốc vào buổi sáng</Text>
        </View>
        <View className="mb-2">
          <Text className="font-semibold text-sm">📅 Lịch tái khám</Text>
          <Text className="text-xs text-gray-600">15:00 - Bác sĩ Nguyễn Văn A</Text>
        </View>
      </View>

      {/* News */}
      <View className="bg-white mx-3 my-3 rounded-xl p-4 shadow-sm">
        <Text className="text-base font-bold text-blue-500 mb-3">Tin tức mới nhất</Text>
        <View className="flex-row items-center gap-2">
          <View className="w-20 h-15 rounded-lg bg-gray-300" />
          <View>
            <Text className="text-sm font-semibold text-gray-800">Cách phòng ngừa bệnh mùa hè</Text>
            <Text className="text-xs text-gray-500">Các biện pháp bảo vệ sức khỏe</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
