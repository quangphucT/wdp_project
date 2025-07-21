import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import getAppointmentDoctor from "../../../services/doctor/getAppointmentDoctor";
import useAuthStore from "../../../stores/authStore";

const DailyAppointments = () => {

  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const { user } = useAuthStore();

  // Fetch tất cả appointments từ API
  const fetchAppointments = useCallback(async (filterParams = {}) => {
    if (!user?.id) {
      return;
    }
    try {
      setIsLoading(true);
      // Sử dụng doctor ID thay vì user ID nếu có
      const doctorId = user.doctor?.id || user.id;
      const response = await getAppointmentDoctor.getAppointmentDoctor(doctorId, filterParams);
      const apiAppointments = response?.data?.data?.data || [];
      setAppointments(apiAppointments);
    } catch (error) {
      Alert.alert("Lỗi", `Không thể tải dữ liệu cuộc hẹn: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-300';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Đang chờ';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'IN_PROGRESS': return 'Đang khám';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Helper functions cho date filter
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getWeekAgoString = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return weekAgo.toISOString().split('T')[0];
  };

  const getMonthAgoString = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return monthAgo.toISOString().split('T')[0];
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4">
        <View className="flex-row items-center justify-between px-4 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-500 text-lg">← Quay lại</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Tất cả cuộc hẹn</Text>
          <TouchableOpacity 
            onPress={() => setShowFilter(!showFilter)}
            className="bg-blue-100 px-3 py-1 rounded-lg"
          >
            <Text className="text-blue-600 text-sm font-semibold">
              {showFilter ? '🔍 Ẩn' : '🔍 Lọc'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Filter */}
        {showFilter && (
          <View className="px-4 mb-4">
            <View className="bg-gray-50 rounded-lg p-4">
              <Text className="text-gray-700 font-semibold mb-3">Lọc theo ngày</Text>
              
              {/* Quick Filter Buttons */}
              <View className="flex-row flex-wrap mb-3 space-x-2">
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom(getTodayString());
                    setDateTo(getTodayString());
                  }}
                  className="bg-blue-100 px-3 py-1 rounded-lg mb-2"
                >
                  <Text className="text-blue-600 text-sm">Hôm nay</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom(getWeekAgoString());
                    setDateTo(getTodayString());
                  }}
                  className="bg-green-100 px-3 py-1 rounded-lg mb-2"
                >
                  <Text className="text-green-600 text-sm">7 ngày qua</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom(getMonthAgoString());
                    setDateTo(getTodayString());
                  }}
                  className="bg-purple-100 px-3 py-1 rounded-lg mb-2"
                >
                  <Text className="text-purple-600 text-sm">30 ngày qua</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm mb-1">Từ ngày</Text>
                  <TextInput
                    value={dateFrom}
                    onChangeText={setDateFrom}
                    placeholder="YYYY-MM-DD"
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                  />
                </View>
                
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm mb-1">Đến ngày</Text>
                  <TextInput
                    value={dateTo}
                    onChangeText={setDateTo}
                    placeholder="YYYY-MM-DD"
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                  />
                </View>
              </View>
              
              <View className="flex-row justify-end mt-3 space-x-2">
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom('');
                    setDateTo('');
                    fetchAppointments();
                  }}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  <Text className="text-gray-700 text-sm font-semibold">Xóa lọc</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    const params = {};
                    if (dateFrom) params.dateFrom = dateFrom;
                    if (dateTo) params.dateTo = dateTo;
                    fetchAppointments(params);
                  }}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
                >
                  <View className="flex-row items-center">
                    {isLoading && <ActivityIndicator size="small" color="white" className="mr-1" />}
                    <Text className="text-white text-sm font-semibold">
                      {isLoading ? 'Đang tải...' : 'Áp dụng'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}



        {/* Filter Indicator */}
        {(dateFrom || dateTo) && (
          <View className="px-4 mb-2">
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-blue-600 text-sm mr-2">🔍 Đang lọc:</Text>
                  <Text className="text-blue-800 text-sm font-medium">
                    {dateFrom && dateTo 
                      ? `${dateFrom} đến ${dateTo}`
                      : dateFrom 
                        ? `Từ ${dateFrom}`
                        : `Đến ${dateTo}`
                    }
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom('');
                    setDateTo('');
                    fetchAppointments();
                  }}
                  className="bg-blue-200 px-2 py-1 rounded"
                >
                  <Text className="text-blue-700 text-xs">Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Stats */}
        <View className="flex-row justify-around px-4 mt-4">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-500">{appointments.length}</Text>
            <Text className="text-xs text-gray-500">Tổng số</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-500">
              {appointments.filter(a => a.status === 'COMPLETED').length}
            </Text>
            <Text className="text-xs text-gray-500">Hoàn thành</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-yellow-500">
              {appointments.filter(a => a.status === 'PENDING').length}
            </Text>
            <Text className="text-xs text-gray-500">Đang chờ</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-500">
              {appointments.filter(a => a.status === 'IN_PROGRESS').length}
            </Text>
            <Text className="text-xs text-gray-500">Đang khám</Text>
          </View>
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-2">Đang tải cuộc hẹn...</Text>
        </View>
      )}

      {/* Appointments List */}
      {!isLoading && (
        <ScrollView className="flex-1 px-4 py-4">
          {appointments.map((appointment, index) => (
            <TouchableOpacity
              key={appointment.id}
              className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200"
              // onPress={() => {
              //   // Navigate to appointment detail
              //   router.push(`/doctor/appointment/detail?id=${appointment.id}`);
              // }}
            >
              {/* Time and Status */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="bg-blue-100 rounded-lg px-3 py-1 mr-3">
                    <Text className="text-blue-700 font-bold">{formatTime(appointment.appointmentTime)}</Text>
                  </View>
                  <Text className="text-gray-600 text-sm">{formatDate(appointment.appointmentTime)}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full border ${getStatusColor(appointment.status)}`}>
                  <Text className="text-xs font-semibold">
                    {getStatusText(appointment.status)}
                  </Text>
                </View>

                <View className={`px-3 py-1 rounded-full border ${getStatusColor(appointment.status)}`}>
                  <Text className="text-xs font-semibold">
                    {appointment.type}
                  </Text>
                </View>
              </View>

              {/* Patient Info */}
              <View className="mb-3">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {appointment.user.name}
                </Text>
                <View className="flex-row items-center mb-1">
                  <Text className="text-gray-600 text-sm mr-4">
                    📧 {appointment.user.email}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    📞 {appointment.user.phone_number || 'Chưa có số điện thoại'}
                  </Text>
                </View>
              </View>

              {/* Service Info */}
              <View className="mb-3 bg-gray-50 rounded-lg p-3">
                <Text className="text-gray-700 font-semibold mb-1">
                  🏥 {appointment.service.name}
                </Text>
                <Text className="text-gray-600 text-sm">
                  💰 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appointment.service.price)}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  ⏱️ 30 phút
                </Text>
              </View>

              {/* Appointment Notes */}
              {appointment.notes && (
                <View className="border-t border-gray-100 pt-3 mb-3">
                  <Text className="text-gray-700 font-semibold mb-1">Ghi chú:</Text>
                  <Text className="text-gray-600 text-sm">{appointment.notes}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
                {/* {appointment.status === 'PENDING' && (
                  <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg mr-2">
                    <Text className="text-white text-sm font-semibold">Xác nhận</Text>
                  </TouchableOpacity>
                )} */}
                {appointment.status === 'CONFIRMED' && (
                  <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg mr-2">
                    <Text className="text-white text-sm font-semibold">Bắt đầu khám</Text>
                  </TouchableOpacity>
                )}
                {appointment.status === 'IN_PROGRESS' && (
                  <TouchableOpacity className="bg-purple-500 px-4 py-2 rounded-lg mr-2">
                    <Text className="text-white text-sm font-semibold">Hoàn thành</Text>
                  </TouchableOpacity>
                )}
                {/* <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-lg">
                  <Text  className="text-gray-700 text-sm font-semibold">Chi tiết</Text>
                </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
          ))}

          {appointments.length === 0 && (
            <View className="bg-white rounded-lg p-8 items-center">
              <Text className="text-gray-500 text-lg mb-2">Không có cuộc hẹn nào</Text>
              <Text className="text-gray-400 text-center">
                Bạn chưa có cuộc hẹn nào được lên lịch
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default DailyAppointments;
