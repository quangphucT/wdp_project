import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
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
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đăng xuất", 
          style: "destructive",
          onPress: () => {
            logout(router);
          }
        }
      ]
    );
  };

  // Lấy tên và chữ cái đầu từ thông tin user
  const firstName = user?.name?.split(' ').pop() || 'User';
  const userInitial = user?.name?.[0] || 'U';

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 p-6 pt-16 pb-8 shadow-lg">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-2xl bg-white/20 justify-center items-center mr-4 border border-white/30">
              <Text className="text-white text-2xl font-bold">{userInitial}</Text>
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">Xin chào, {firstName}</Text>
              <Text className="text-white/90 text-sm">{user?.email}</Text>
              <View className="flex-row items-center mt-2">
                <View className="w-2 h-2 bg-green-300 rounded-full mr-2" />
                <Text className="text-green-100 text-xs font-medium">Đang hoạt động</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            onPress={handleLogout} 
            className="px-4 py-3 bg-red-500 rounded-xl shadow-md"
          >
            <Text className="text-white text-sm font-medium">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Card */}
      <View className="px-6 -mt-4 mb-6">
        <View className="bg-white rounded-3xl p-6 border border-blue-100 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm mb-1">Chào mừng trở lại</Text>
              <Text className="text-gray-800 text-xl font-bold mb-1">
                Chúc bạn một ngày tốt lành!
              </Text>
              <Text className="text-gray-600 text-sm">
                Hãy theo dõi sức khỏe và tuân thủ phác đồ điều trị
              </Text>
            </View>
            <View className="w-16 h-16 bg-blue-500 rounded-3xl justify-center items-center ml-4">
              <Text className="text-white text-2xl">🌟</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Services Grid */}
      <View className="px-6 py-4">
        <Text className="text-xl font-bold text-gray-800 mb-6">Dịch vụ của chúng tôi</Text>
        <View className="flex-row flex-wrap justify-between">
          {features.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[47%] bg-white rounded-3xl p-6 mb-4 border border-gray-100 shadow-lg"
              onPress={() => {
                const route = item.route;
                if (route) {
                  router.push(route);
                }
              }}
            >
              <View className={`w-16 h-16 ${item.bgColor} rounded-2xl justify-center items-center mb-4`}>
                <Text className="text-2xl">{item.icon}</Text>
              </View>
              <Text className="text-gray-800 text-base font-semibold mb-2">{item.title}</Text>
              <Text className="text-gray-600 text-xs leading-4">{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Schedule */}
      {/* <View className="px-6 py-4">
        <Text className="text-xl font-bold text-gray-800 mb-6">Lịch trình hôm nay</Text>
        
        <View className="bg-white rounded-3xl p-6 border border-blue-100 shadow-lg mb-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-blue-500 rounded-2xl justify-center items-center mr-4">
              <Text className="text-white text-xl">💊</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 text-lg font-bold mb-1">Thuốc cần uống</Text>
              <Text className="text-gray-600 text-sm mb-2">3 loại thuốc vào buổi sáng</Text>
              <View className="flex-row items-center">
                <View className="bg-blue-100 px-3 py-1 rounded-full mr-2">
                  <Text className="text-blue-700 text-xs font-medium">08:00</Text>
                </View>
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-700 text-xs font-medium">Sáng</Text>
                </View>
              </View>
            </View>
            <View className="w-10 h-10 bg-blue-100 rounded-xl justify-center items-center">
              <Text className="text-blue-600 text-lg font-bold">→</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-lg">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-emerald-500 rounded-2xl justify-center items-center mr-4">
              <Text className="text-white text-xl">📅</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 text-lg font-bold mb-1">Lịch tái khám</Text>
              <Text className="text-gray-600 text-sm mb-2">15:00 - Bác sĩ Nguyễn Văn A</Text>
              <View className="flex-row items-center">
                <View className="bg-emerald-100 px-3 py-1 rounded-full mr-2">
                  <Text className="text-emerald-700 text-xs font-medium">15:00</Text>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-600 text-xs font-medium">Hôm nay</Text>
                </View>
              </View>
            </View>
            <View className="w-10 h-10 bg-emerald-100 rounded-xl justify-center items-center">
              <Text className="text-emerald-600 text-lg font-bold">→</Text>
            </View>
          </View>
        </View>
      </View> */}

     
    </ScrollView>
  );
};

export default HomeScreen;
