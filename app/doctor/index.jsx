import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import getAppointmentDoctor from "../../services/doctor/getAppointmentDoctor";
import useAuthStore from "../../stores/authStore";

const DoctorDashboard = () => {
  const router = useRouter();
  const { logout, isAuthenticated, isLoading: authLoading, user, checkAuth } = useAuthStore(state => state);
  
  // State cho appointments
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    checkAuth(router);
  }, [checkAuth, router]);

  // Fetch appointments data
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?.id) {
        setIsLoadingStats(true);
        try {
          // Lấy tất cả cuộc hẹn
          const allResponse = await getAppointmentDoctor.getAppointmentDoctor(user.id);
          const allAppointments = allResponse.data?.data?.data || [];
          setTotalAppointments(allAppointments.length);

          // Lấy cuộc hẹn hôm nay
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const todayResponse = await getAppointmentDoctor.getAppointmentDoctor(user.id, {
            dateFrom: today,
            dateTo: today
          });
          const todayAppts = todayResponse.data?.data?.data || [];
          setTodayAppointments(todayAppts.length);
        } catch (error) {
          console.error('Error fetching appointments:', error);
          setTodayAppointments(0);
          setTotalAppointments(0);
        } finally {
          setIsLoadingStats(false);
        }
      }
    };

    if (user?.id && isAuthenticated) {
      fetchAppointments();
    }
  }, [user?.id, isAuthenticated]);

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
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-emerald-500 p-6 pt-16 pb-8 shadow-lg">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-2xl bg-white/20 justify-center items-center mr-4 border border-white/30">
              <Text className="text-white text-2xl font-bold">{userInitial}</Text>
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">Bác sĩ {firstName}</Text>
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

      {/* Stats Cards */}
      <View className="px-6 -mt-4 mb-6">
        <View className="flex-row justify-between">
          <View className="bg-white rounded-3xl p-6 flex-1 mr-3 border border-emerald-100 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <View className="w-14 h-14 bg-emerald-500 rounded-2xl justify-center items-center">
                <Text className="text-white text-xl">📅</Text>
              </View>
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-700 text-xs font-semibold">HÔM NAY</Text>
              </View>
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-1">
              {isLoadingStats ? "..." : todayAppointments}
            </Text>
            <Text className="text-gray-600 text-sm">Cuộc hẹn hôm nay</Text>
          </View>
          
          <View className="bg-white rounded-3xl p-6 flex-1 ml-3 border border-blue-100 shadow-lg">
            <View className="flex-row items-center justify-between mb-4">
              <View className="w-14 h-14 bg-blue-500 rounded-2xl justify-center items-center">
                <Text className="text-white text-xl">📅</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-xs font-semibold">TẤT CẢ</Text>
              </View>
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-1">
              {isLoadingStats ? "..." : totalAppointments}
            </Text>
            <Text className="text-gray-600 text-sm">Tổng cuộc hẹn</Text>
          </View>
        </View>
      </View>

      {/* Feature Cards */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-8">Bảng điều khiển</Text>
        
        {/* Weekly Schedule */}
        <TouchableOpacity 
          className="bg-white rounded-3xl p-6 mb-6 border border-emerald-100 shadow-lg"
          onPress={() => router.push("/doctor/schedule")}
        >
          <View className="flex-row items-center">
            <View className="relative mr-6">
              <View className="w-20 h-20 bg-emerald-500 rounded-3xl justify-center items-center">
                <Text className="text-white text-2xl">📊</Text>
              </View>
              <View className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full justify-center items-center">
                <Text className="text-amber-900 text-xs font-bold">!</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 text-xl font-bold mb-2">Lịch làm việc tuần</Text>
              <Text className="text-gray-600 text-sm leading-6 mb-3">
               Theo dõi lịch trình tuần một cách trực quan.
              </Text>
              <View className="flex-row items-center">
                <View className="bg-emerald-100 px-3 py-1 rounded-full mr-2">
                  <Text className="text-emerald-700 text-xs font-medium">Dòng thời gian</Text>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-600 text-xs font-medium">Điều hướng</Text>
                </View>
              </View>
            </View>
            <View className="w-12 h-12 bg-emerald-100 rounded-2xl justify-center items-center">
              <Text className="text-emerald-600 text-lg font-bold">→</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Daily Appointments */}
        <TouchableOpacity 
          className="bg-white rounded-3xl p-6 mb-6 border border-blue-100 shadow-lg"
          onPress={() => router.push("/doctor/appointment")}
        >
          <View className="flex-row items-center">
            <View className="relative mr-6">
              <View className="w-20 h-20 bg-blue-500 rounded-3xl justify-center items-center">
                <Text className="text-white text-2xl">🩺</Text>
              </View>
              <View className="absolute -top-1 -right-1 w-6 h-6 bg-rose-400 rounded-full justify-center items-center">
                <Text className="text-white text-xs font-bold">
                  {isLoadingStats ? "?" : todayAppointments}
                </Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 text-xl font-bold mb-2">Cuộc hẹn hôm nay</Text>
              <Text className="text-gray-600 text-sm leading-6 mb-3">
               Thông tin chi tiết bệnh nhân và hệ thống quản lý cuộc hẹn
              </Text>
              <View className="flex-row items-center">
                <View className="bg-blue-100 px-3 py-1 rounded-full mr-2">
                  <Text className="text-blue-700 text-xs font-medium">Bệnh nhân</Text>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-600 text-xs font-medium">Lịch trình</Text>
                </View>
              </View>
            </View>
            <View className="w-12 h-12 bg-blue-100 rounded-2xl justify-center items-center">
              <Text className="text-blue-600 text-lg font-bold">→</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">Thao tác nhanh</Text>
        
        <View className="flex-row justify-between">
          {/* Profile Card */}
          <TouchableOpacity 
            className="bg-white rounded-3xl p-6 flex-1 mr-2 border border-orange-100 shadow-lg"
            onPress={() => router.push("/doctor/profile")}
          >
            <View className="items-center">
              <View className="w-16 h-16 bg-orange-500 rounded-2xl justify-center items-center mb-4">
                <Text className="text-white text-xl">👤</Text>
              </View>
              <Text className="text-gray-800 text-base font-semibold mb-2">Hồ sơ</Text>
              <Text className="text-gray-600 text-xs text-center">Quản lý thông tin</Text>
            </View>
          </TouchableOpacity>
          
          {/* Reports Card */}
          <TouchableOpacity className="bg-white rounded-3xl p-6 flex-1 ml-2 border border-indigo-100 shadow-lg">
            <View className="items-center">
              <View className="w-16 h-16 bg-indigo-500 rounded-2xl justify-center items-center mb-4">
                <Text className="text-white text-xl">📈</Text>
              </View>
              <Text className="text-gray-800 text-base font-semibold mb-2">Phân tích</Text>
              <Text className="text-gray-600 text-xs text-center">Xem thống kê</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Emergency Button */}
        {/* <TouchableOpacity className="bg-red-500 rounded-3xl p-6 mt-4 shadow-lg">
          <View className="flex-row items-center justify-center">
            <View className="w-12 h-12 bg-white/20 rounded-2xl justify-center items-center mr-4">
              <Text className="text-white text-xl">🚨</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-bold">Giao thức khẩn cấp</Text>
              <Text className="text-red-100 text-sm">Hệ thống cảnh báo tức thì</Text>
            </View>
          </View>
        </TouchableOpacity> */}
      </View>

      {/* Footer */}
      <View className="px-6 py-8 mb-6">
        <View className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-lg">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800 mb-1">HIV Care Hub</Text>
              <Text className="text-gray-600 text-sm">Hệ thống chuyên thăm khám và điều trị HIV</Text>
            </View>
            <View className="bg-emerald-500 px-4 py-2 rounded-2xl">
              <Text className="text-white text-xs font-bold">v2.1.0</Text>
            </View>
          </View>
          
          <Text className="text-gray-600 text-sm leading-6 mb-6">
            Nền tảng y tế thế hệ mới với thông tin chi tiết và quy trình liền mạch.
          </Text>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-500 text-xs">© 2025 HIV Care Hub</Text>
            <TouchableOpacity className="bg-emerald-100 px-4 py-2 rounded-2xl">
              <Text className="text-emerald-600 text-xs font-medium">Hỗ trợ kỹ thuật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DoctorDashboard;
