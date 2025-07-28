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

const DoctorDashboard = () => {
  const router = useRouter();
  const { logout, isAuthenticated, isLoading: authLoading, user, checkAuth } = useAuthStore(state => state);

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

  // Kiểm tra role doctor
  if (user?.role !== "DOCTOR") {
    Alert.alert("Lỗi", "Bạn không có quyền truy cập vào trang này");
    router.replace("/");
    return null;
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
  const firstName = user?.name?.split(' ').pop() || 'Doctor';
  const userInitial = user?.name?.[0] || 'D';

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-500 p-4 pt-12">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mr-3">
              <Text className="text-blue-500 text-lg font-bold">{userInitial}</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-bold">Bác sĩ {firstName}</Text>
              <Text className="text-blue-100 text-sm">{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} className="px-3 py-1 bg-red-500 rounded-full">
            <Text className="text-white text-sm">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      {/* <View className="flex-row justify-between p-4">
        <View className="bg-white rounded-lg p-4 flex-1 mr-2 shadow-sm">
          <Text className="text-2xl font-bold text-blue-500">12</Text>
          <Text className="text-gray-600 text-sm">Cuộc hẹn hôm nay</Text>
        </View>
        <View className="bg-white rounded-lg p-4 flex-1 ml-2 shadow-sm">
          <Text className="text-2xl font-bold text-green-500">35</Text>
          <Text className="text-gray-600 text-sm">Giờ làm tuần này</Text>
        </View>
      </View> */}

      {/* Main Features */}
      <View className="p-4">
        {/* <Text className="text-lg font-bold text-gray-800 mb-4">Chức năng chính</Text>
         */}
        {/* Weekly Schedule */}
        <TouchableOpacity 
          className="bg-blue-500 rounded-xl p-6 mb-4 shadow-lg"
          onPress={() => router.push("/doctor/schedule")}
        >
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-white bg-opacity-20 justify-center items-center mr-4">
              <Text className="text-white text-2xl">📅</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">Lịch làm việc tuần</Text>
              <Text className="text-blue-100 text-sm">Xem lịch theo timeline weekly, điều hướng qua các tuần</Text>
            </View>
            <Text className="text-white text-xl">›</Text>
          </View>
        </TouchableOpacity>

        {/* Daily Appointments */}
        <TouchableOpacity 
          className="bg-green-500 rounded-xl p-6 mb-4 shadow-lg"
          onPress={() => router.push("/doctor/appointment")}
        >
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-white bg-opacity-20 justify-center items-center mr-4">
              <Text className="text-white text-2xl">🩺</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">Cuộc hẹn hôm nay</Text>
              <Text className="text-green-100 text-sm">Chi tiết thời gian, thông tin bệnh nhân và cuộc hẹn</Text>
            </View>
            <Text className="text-white text-xl">›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Current Week Overview */}
      {/* <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">Tổng quan tuần này</Text>
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-semibold text-gray-800">Thứ 2 - 08/07</Text>
            <View className="bg-blue-100 px-2 py-1 rounded">
              <Text className="text-blue-600 text-xs font-semibold">8 cuộc hẹn</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-semibold text-gray-800">Thứ 3 - 09/07</Text>
            <View className="bg-green-100 px-2 py-1 rounded">
              <Text className="text-green-600 text-xs font-semibold">5 cuộc hẹn</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-semibold text-gray-800">Thứ 4 - 10/07</Text>
            <View className="bg-yellow-100 px-2 py-1 rounded">
              <Text className="text-yellow-600 text-xs font-semibold">12 cuộc hẹn</Text>
            </View>
          </View>
          <TouchableOpacity 
            className="mt-2"
            onPress={() => router.push("/doctor/schedule")}
          >
            <Text className="text-blue-500 text-center font-semibold">Xem chi tiết lịch tuần →</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </ScrollView>
  );
};

export default DoctorDashboard;
