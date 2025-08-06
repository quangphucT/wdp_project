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
import { getProfileUserApi } from "../../../services/auth/getProfileUserApi";
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
      // Gọi API profile để lấy doctorId (giống như dashboard)
      const profileResponse = await getProfileUserApi();
      const profileData = profileResponse.data.data;
      const doctorId = profileData.doctorId || profileData.doctor?.id;
      
      if (!doctorId) {
        throw new Error('Không tìm thấy thông tin bác sĩ');
      }
      
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
    case 'CHECKIN': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    case 'PAID': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'PROCESS': return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-300';
    case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};


 const getStatusText = (status) => {
  switch (status) {
    case 'PENDING': return 'Chờ';
    case 'CHECKIN': return 'Đang khám';
    case 'PAID': return 'Đã thanh toán';
    case 'PROCESS': return 'Đang xử lý';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'COMPLETED': return 'Hoàn thành';
    case 'CANCELLED': return 'Hủy';
    default: return 'Không xác định';
  }
};


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    // Sử dụng UTC methods để hiển thị đúng thời gian từ database
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Sử dụng UTC methods để hiển thị đúng ngày từ database
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
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
    <View className="flex-1 bg-gradient-to-br from-emerald-50 to-emerald-100">
      {/* Header */}
      <View className="bg-emerald-600 pt-12 pb-6 shadow-xl">
        <View className="flex-row items-center justify-between px-6 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-3 rounded-xl bg-emerald-700 shadow-lg">
            <Text className="text-white text-lg font-semibold">← Quay lại</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Tất cả cuộc hẹn</Text>
          <TouchableOpacity 
            onPress={() => setShowFilter(!showFilter)}
            className="bg-white/30 px-4 py-3 rounded-xl border border-white/50 shadow-lg"
          >
            <Text className="text-white text-sm font-bold">
              {showFilter ? '🔍 Ẩn' : '🔍 Lọc'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Filter */}
        {showFilter && (
          <View className="px-6 mb-6">
            <View className="bg-white/20 rounded-2xl p-6 border border-white/40 shadow-xl backdrop-blur-sm">
              <Text className="text-white font-bold mb-4 text-lg">Lọc theo ngày</Text>
              
              {/* Quick Filter Buttons */}
              <View className="flex-row flex-wrap mb-4 gap-2">
                <TouchableOpacity 
                  onPress={() => {
                    const params = {
                      dateFrom: getTodayString(),
                      dateTo: getTodayString()
                    };
                    fetchAppointments(params);
                  }}
                  className="bg-white/40 px-4 py-3 rounded-xl shadow-sm"
                >
                  <Text className="text-white text-sm font-semibold">Hôm nay</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom(getWeekAgoString());
                    setDateTo(getTodayString());
                  }}
                  className="bg-white/40 px-4 py-3 rounded-xl shadow-sm"
                >
                  <Text className="text-white text-sm font-semibold">7 ngày qua</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom(getMonthAgoString());
                    setDateTo(getTodayString());
                  }}
                  className="bg-white/40 px-4 py-3 rounded-xl shadow-sm"
                >
                  <Text className="text-white text-sm font-semibold">30 ngày qua</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-emerald-100 text-sm mb-2 font-semibold">Từ ngày</Text>
                  <TextInput
                    value={dateFrom}
                    onChangeText={setDateFrom}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#A7F3D0"
                    className="bg-white/40 border border-white/50 rounded-xl px-4 py-3 text-white font-medium shadow-sm"
                  />
                </View>
                
                <View className="flex-1">
                  <Text className="text-emerald-100 text-sm mb-2 font-semibold">Đến ngày</Text>
                  <TextInput
                    value={dateTo}
                    onChangeText={setDateTo}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#A7F3D0"
                    className="bg-white/40 border border-white/50 rounded-xl px-4 py-3 text-white font-medium shadow-sm"
                  />
                </View>
              </View>
              
              <View className="flex-row justify-end mt-4 space-x-3">
                <TouchableOpacity 
                  onPress={() => {
                    setDateFrom('');
                    setDateTo('');
                    fetchAppointments();
                  }}
                  className="bg-gray-200 px-6 py-3 rounded-xl shadow-sm"
                >
                  <Text className="text-gray-700 text-sm font-bold">Xóa lọc</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    const params = {};
                    if (dateFrom) params.dateFrom = dateFrom;
                    if (dateTo) params.dateTo = dateTo;
                    fetchAppointments(params);
                  }}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-xl shadow-sm ${isLoading ? 'bg-white/40' : 'bg-white'}`}
                >
                  <View className="flex-row items-center">
                    {isLoading && <ActivityIndicator size="small" color="#10B981" className="mr-2" />}
                    <Text className={`text-sm font-bold ${isLoading ? 'text-white' : 'text-emerald-700'}`}>
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
          <View className="px-6 mb-4">
            <View className="bg-white/30 border border-white/50 rounded-2xl p-4 shadow-lg">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-white text-sm mr-3 font-semibold">🔍 Đang lọc:</Text>
                  <Text className="text-emerald-100 text-sm font-bold">
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
                  className="bg-white/40 px-3 py-2 rounded-xl shadow-sm"
                >
                  <Text className="text-white text-xs font-bold">Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Stats */}
        <View className="flex-row px-6 mt-6 gap-3">
          <View className="items-center bg-white/30 py-4 px-3 rounded-2xl flex-1 shadow-lg border border-white/40">
            <Text className="text-2xl font-bold text-white">{appointments.length}</Text>
            <Text className="text-xs text-emerald-100 font-semibold mt-1">Tổng số</Text>
          </View>
          <View className="items-center bg-white/30 py-4 px-3 rounded-2xl flex-1 shadow-lg border border-white/40">
            <Text className="text-2xl font-bold text-white">
              {appointments.filter(a => a.status === 'COMPLETED').length}
            </Text>
            <Text className="text-xs text-emerald-100 font-semibold mt-1">Hoàn thành</Text>
          </View>
          <View className="items-center bg-white/30 py-4 px-3 rounded-2xl flex-1 shadow-lg border border-white/40">
            <Text className="text-2xl font-bold text-white">
              {appointments.filter(a => a.status === 'PENDING').length}
            </Text>
            <Text className="text-xs text-emerald-100 font-semibold mt-1">Đang chờ</Text>
          </View>
          <View className="items-center bg-white/30 py-4 px-3 rounded-2xl flex-1 shadow-lg border border-white/40">
            <Text className="text-2xl font-bold text-white">
              {appointments.filter(a => a.status === 'IN_PROGRESS').length}
            </Text>
            <Text className="text-xs text-emerald-100 font-semibold mt-1">Đang khám</Text>
          </View>
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 justify-center items-center bg-emerald-50/50">
          <View className="bg-white rounded-3xl p-8 shadow-2xl border border-emerald-100">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-emerald-700 mt-4 font-semibold text-center text-lg">Đang tải cuộc hẹn...</Text>
          </View>
        </View>
      )}

      {/* Appointments List */}
      {!isLoading && (
        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {appointments.map((appointment, index) => (
            <TouchableOpacity
              key={appointment.id}
              className="bg-white rounded-2xl p-6 mb-5 shadow-lg border border-emerald-50"
              // onPress={() => {
              //   // Navigate to appointment detail
              //   router.push(`/doctor/appointment/detail?id=${appointment.id}`);
              // }}
            >
              {/* Time and Status */}
              <View className="flex-row justify-between items-center mb-5">
                <View className="flex-row items-center">
                  <View className="bg-emerald-100 rounded-2xl px-5 py-3 mr-4 shadow-sm">
                    <Text className="text-emerald-700 font-bold text-lg">{formatTime(appointment.appointmentTime)}</Text>
                  </View>
                  <Text className="text-gray-600 text-sm font-semibold">{formatDate(appointment.appointmentTime)}</Text>
                </View>
                <View className="flex-col space-y-2 ">
                  <View className={`px-[39px] py-2 rounded-full border ${getStatusColor(appointment.status)} shadow-sm`}>
                    <Text className="text-xs font-bold">
                      {getStatusText(appointment.status)}
                    </Text>
                  </View>
               
                </View>
                
              </View>
              

              {/* Patient Info */}
              <View className="mb-5">
                <Text className="text-xl font-bold text-gray-800 mb-3">
                  {appointment.user.name}
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-600 text-sm">
                    📧 {appointment.user.email}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    📞 {appointment.user.phoneNumber || 'Chưa có số điện thoại'}
                  </Text>
                </View>
              </View>
       
           
              {/* Service Info */}
              
              <View className="mb-5 bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
                <Text className="text-emerald-800 font-bold mb-3 text-lg">
                  🏥 {appointment.service.name}
                </Text>
                   
                <Text className="text-emerald-700 text-base font-semibold mb-2">
                  💰 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appointment.service.price)}
                </Text>
                <Text className="text-emerald-600 text-sm">
                  ⏱️ 30 phút
                </Text>
                
              </View>
                 <View className={`px-4 py-2 rounded-full border ${getStatusColor(appointment.status)} shadow-sm`}>
                    <Text className="text-xs font-bold">
                      {appointment.service.type === 'CONSULT' ? 'Trực tuyến' : 'Trực tiếp'}
                    </Text>
                  </View>

              {/* Appointment Notes */}
              {appointment.notes && (
                <View className="border-t border-emerald-100 pt-5 mb-5">
                  <Text className="text-emerald-800 font-bold mb-3 text-base">Ghi chú:</Text>
                  <Text className="text-gray-700 text-sm leading-relaxed">{appointment.notes}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row justify-end pt-5 border-t border-emerald-100">
                {/* {appointment.status === 'PENDING' && (
                  <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg mr-2">
                    <Text className="text-white text-sm font-semibold">Xác nhận</Text>
                  </TouchableOpacity>
                )} */}
                {appointment.status === 'CONFIRMED' && (
                  <TouchableOpacity className="bg-emerald-500 px-8 py-4 rounded-2xl shadow-lg">
                    <Text className="text-white text-sm font-bold">Bắt đầu khám</Text>
                  </TouchableOpacity>
                )}
                {appointment.status === 'IN_PROGRESS' && (
                  <TouchableOpacity className="bg-emerald-600 px-8 py-4 rounded-2xl shadow-lg">
                    <Text className="text-white text-sm font-bold">Hoàn thành</Text>
                  </TouchableOpacity>
                )}
                {/* <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-lg">
                  <Text  className="text-gray-700 text-sm font-semibold">Chi tiết</Text>
                </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
          ))}

          {appointments.length === 0 && (
            <View className="bg-white rounded-2xl p-10 items-center shadow-lg border border-emerald-100 mx-2">
              <View className="bg-emerald-100 p-6 rounded-full mb-6 shadow-sm">
                <Text className="text-emerald-600 text-3xl">📅</Text>
              </View>
              <Text className="text-emerald-800 text-xl font-bold mb-3">Không có cuộc hẹn nào</Text>
              <Text className="text-emerald-600 text-center leading-relaxed">
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
