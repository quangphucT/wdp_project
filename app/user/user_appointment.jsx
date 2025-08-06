import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { deleteAppointmentApi } from "../../services/appointment/deleteAppointmentApi";
import { getAppointmentPatient } from "../../services/user/getAppointmentPatient";
import useAuthStore from "../../stores/authStore";

const UserAppointment = () => {

  const [appointmentData, setAppointmentData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [showCancelledOnly, setShowCancelledOnly] = useState(false);
  
  const { user } = useAuthStore();
  const router = useRouter();
  const fetchAppointments = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (!user?.id) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      const response = await getAppointmentPatient(user.id);
      
      if (response?.data?.data) {
        // Sắp xếp cuộc hẹn theo thời gian (gần nhất lên đầu)
        const sortedData = response.data.data.data.sort((a, b) => {
          return new Date(a.appointmentTime) - new Date(b.appointmentTime);
        });
        setAppointmentData(sortedData);
      } else {
        setAppointmentData([]);
      }
    } catch (err) {
    
      setError(err.message || 'Không thể tải danh sách cuộc hẹn');
      Alert.alert('Lỗi', err.message || 'Không thể tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const onRefresh = () => {
    fetchAppointments(true);
  };

  // Lọc dữ liệu cuộc hẹn dựa trên filter
  const getFilteredAppointments = () => {
    if (showCancelledOnly) {
      return appointmentData.filter(item => item.status === 'CANCELLED');
    }
    return appointmentData.filter(item => item.status !== 'CANCELLED');
  };

  // Thống kê cuộc hẹn
  const getAppointmentStats = () => {
    const total = appointmentData.length;
    const cancelled = appointmentData.filter(item => item.status === 'CANCELLED').length;
    const active = total - cancelled;
    return { total, cancelled, active };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#FF9800';
      case 'CONFIRMED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      case 'COMPLETED':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'COMPLETED':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'CONSULT':
        return 'videocam';
      case 'OFFLINE':
        return 'location';
      default:
        return 'calendar';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    
    // Format ngày theo YYYY-MM-DD (UTC)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // Format giờ theo HH:mm:ss (UTC)
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
    return {
      date: formattedDate,
      time: formattedTime,
      fullDateTime: `${formattedDate} ${formattedTime}`
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price); // Bỏ * 1000 vì price từ API đã đúng
  };

  // Kiểm tra xem cuộc hẹn có thể xóa được không (trước 1 ngày)
  const canCancelAppointment = (appointmentTime) => {
    const now = new Date();
    const appointmentDate = new Date(appointmentTime);
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    return daysDiff >= 1; // Cho phép hủy nếu còn ít nhất 1 ngày
  };

  // Xóa cuộc hẹn
  const handleDeleteAppointment = async (appointment) => {
    try {
      if (!canCancelAppointment(appointment.appointmentTime)) {
        Alert.alert(
          'Không thể hủy cuộc hẹn',
          'Bạn chỉ có thể hủy cuộc hẹn trước ít nhất 1 ngày. Vui lòng liên hệ trực tiếp với phòng khám để được hỗ trợ.',
          [{ text: 'Đóng' }]
        );
        return;
      }

      Alert.alert(
        'Xác nhận hủy cuộc hẹn',
        `Bạn có chắc chắn muốn hủy cuộc hẹn với ${appointment.doctor?.user?.name || 'bác sĩ'} vào ${formatDateTime(appointment.appointmentTime).fullDateTime}?`,
        [
          { text: 'Không', style: 'cancel' },
          {
            text: 'Hủy cuộc hẹn',
            style: 'destructive',
            onPress: async () => {
              try {
                setLoading(true);
                await deleteAppointmentApi(appointment.id);
                
                Alert.alert(
                  'Thành công',
                  'Cuộc hẹn đã được hủy thành công.',
                  [{ text: 'OK' }]
                );
                
                // Refresh danh sách cuộc hẹn
                await fetchAppointments();
              } catch (error) {
                console.error('Error deleting appointment:', error);
                
                let errorMessage = 'Không thể hủy cuộc hẹn. Vui lòng thử lại.';
                
                if (error.response?.data?.message) {
                  errorMessage = error.response.data.message;
                } else if (error.message) {
                  errorMessage = error.message;
                }
                
                Alert.alert('Lỗi', errorMessage);
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in handleDeleteAppointment:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xử lý yêu cầu hủy cuộc hẹn.');
    }
  };

//   const handleJoinMeeting = async (meetingUrl) => {
//     if (!meetingUrl) {
//       Alert.alert('Thông báo', 'Chưa có link cuộc họp');
//       return;
//     }

//     try {
//       const supported = await Linking.canOpenURL(meetingUrl);
//       if (supported) {
//         await Linking.openURL(meetingUrl);
//       } else {
//         Alert.alert('Lỗi', 'Không thể mở link cuộc họp');
//       }
//     } catch (error) {
//       console.error('Error opening meeting URL:', error);
//       Alert.alert('Lỗi', 'Không thể mở link cuộc họp');
//     }
//   };

  const renderAppointmentItem = ({ item, index }) => {
    const { date, time } = formatDateTime(item.appointmentTime);
    
    // Kiểm tra xem có phải cuộc hẹn sắp tới không
    const now = new Date();
    const appointmentTime = new Date(item.appointmentTime);
    const isUpcoming = appointmentTime > now;
    const isNextAppointment = index === 0 && isUpcoming;
    
    return (
      <View 
        className={`rounded-xl p-4 mb-4 shadow-lg ${
          isNextAppointment ? 'bg-blue-50 border-2 border-blue-400' : 'bg-white'
        }`}
        style={isNextAppointment ? {
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        } : {}}
      >
        {/* Badge cho cuộc hẹn sắp tới */}
        {isNextAppointment && (
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-500 px-3 py-2 rounded-full flex-row items-center">
              <Ionicons name="time" size={14} color="white" />
              <Text className="text-white text-xs font-bold ml-2">🔥 CUỘC HẸN SẮP TỚI</Text>
            </View>
          </View>
        )}
        {/* Header */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-row items-center gap-2">
            <View 
              className="px-2 py-1 rounded-xl"
              style={{ backgroundColor: getStatusColor(item.status) }}
            >
              <Text className="text-white text-xs font-semibold">{getStatusText(item.status)}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons 
                name={getTypeIcon(item.type)} 
                size={16} 
                color="#666" 
              />
              <Text className="text-xs text-gray-600">
                {item.service.type === 'CONSULT' ? 'Trực tuyến' : 'Trực tiếp'}
              </Text>
            </View>
          </View>
          <Text className="text-xs text-gray-400 font-medium">#{item.id}</Text>
        </View>

        {/* Doctor Info */}
        <View className="mb-4">
          <View className="flex-row items-center">
            {item.doctor?.user?.avatar ? (
              <Image 
                source={{ uri: item.doctor.user.avatar }} 
                className="w-12 h-12 rounded-full mr-3"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center mr-3">
                <Ionicons name="person" size={24} color="#9E9E9E" />
              </View>
            )}
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800 mb-0.5">{item.doctor?.user?.name}</Text>
              <Text className="text-sm text-gray-600">{item.doctor?.user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Service Info */}
        <View className="bg-gray-50 p-3 rounded-lg mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="medical" size={20} color="#2196F3" />
            <Text className="text-base font-semibold text-gray-800 ml-2">{item.service?.name}</Text>
          </View>
          <Text className="text-sm text-gray-600 mb-2">{item.service?.description}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-bold text-blue-600">{formatPrice(item.service?.price)}</Text>
            <Text className="text-sm text-gray-600">
              {item.service?.startTime} - {item.service?.endTime}
            </Text>
          </View>
        </View>

        {/* Appointment Details */}
        <View className="mb-4">
          <View className={`flex-row items-center mb-2 p-2 rounded-lg ${
            isNextAppointment ? 'bg-white border border-blue-300' : ''
          }`}>
            <Ionicons 
              name="calendar" 
              size={16} 
              color={isNextAppointment ? "#2563EB" : "#666"} 
            />
            <Text className={`text-sm ml-2 ${
              isNextAppointment ? 'text-blue-700 font-bold' : 'text-gray-800'
            }`}>
              {date}
            </Text>
          </View>
          <View className={`flex-row items-center mb-2 p-2 rounded-lg ${
            isNextAppointment ? 'bg-white border border-blue-300' : ''
          }`}>
            <Ionicons 
              name="time" 
              size={16} 
              color={isNextAppointment ? "#2563EB" : "#666"} 
            />
            <Text className={`text-sm ml-2 ${
              isNextAppointment ? 'text-blue-700 font-bold' : 'text-gray-800'
            }`}>
              {time}
            </Text>
          </View>
          {item.notes && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text" size={16} color="#666" />
              <Text className="text-sm text-gray-800 ml-2">{item.notes}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          {/* Warning cho tư vấn trực tuyến */}
          {item.type === 'ONLINE' && (
            <View className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <View className="flex-row items-center mb-2">
                <Ionicons name="warning" size={20} color="#F59E0B" />
                <Text className="text-amber-700 font-semibold ml-2">Lưu ý quan trọng</Text>
              </View>
              <Text className="text-amber-700 text-sm leading-5">
                Để tham gia cuộc hẹn tư vấn trực tuyến, bạn cần đăng nhập vào hệ thống web của chúng tôi. 
                Vui lòng truy cập website và sử dụng tài khoản này để meeting với bác sĩ.
              </Text>
            </View>
          )}

          {/* Nút hủy cuộc hẹn - chỉ hiển thị nếu chưa hoàn thành và chưa bị hủy */}
          {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
            <View className="flex-row space-x-3">
              {canCancelAppointment(item.appointmentTime) ? (
                <TouchableOpacity 
                  className="flex-1 bg-red-500 flex-row items-center justify-center py-3 px-4 rounded-lg"
                  onPress={() => handleDeleteAppointment(item)}
                >
                  <Ionicons name="trash" size={20} color="white" />
                  <Text className="text-white text-base font-semibold ml-2">Hủy cuộc hẹn</Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-1 bg-gray-300 flex-row items-center justify-center py-3 px-4 rounded-lg">
                  <Ionicons name="lock-closed" size={20} color="#6B7280" />
                  <Text className="text-gray-600 text-base font-semibold ml-2">Không thể hủy</Text>
                </View>
              )}
              
              {/* Thông tin thời gian hủy */}
              <View className="flex-2 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="information-circle" size={16} color="#3B82F6" />
                  <Text className="text-blue-700 font-medium text-sm ml-1">Chính sách hủy</Text>
                </View>
                <Text className="text-blue-600 text-xs leading-4">
                  {canCancelAppointment(item.appointmentTime) 
                    ? 'Có thể hủy cuộc hẹn này' 
                    : 'Chỉ được hủy trước 1 ngày'
                  }
                </Text>
              </View>
            </View>
          )}

          {/* Hiển thị trạng thái đã hủy hoặc hoàn thành */}
          {(item.status === 'CANCELLED' || item.status === 'COMPLETED') && (
            <View className={`p-4 rounded-lg border ${
              item.status === 'CANCELLED' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <View className="flex-row items-center">
                <Ionicons 
                  name={item.status === 'CANCELLED' ? "close-circle" : "checkmark-circle"} 
                  size={20} 
                  color={item.status === 'CANCELLED' ? "#EF4444" : "#10B981"} 
                />
                <Text className={`font-semibold ml-2 ${
                  item.status === 'CANCELLED' ? 'text-red-700' : 'text-green-700'
                }`}>
                  {item.status === 'CANCELLED' ? 'Cuộc hẹn đã bị hủy' : 'Cuộc hẹn đã hoàn thành'}
                </Text>
              </View>
            </View>
          )}
        </View>
        {/* {item.type === 'ONLINE' && item.patientMeetingUrl && item.status === 'CONFIRMED' && (
          <TouchableOpacity 
            className="bg-green-500 flex-row items-center justify-center py-3 px-4 rounded-lg"
            onPress={() => handleJoinMeeting(item.patientMeetingUrl)}
          >
            <Ionicons name="videocam" size={20} color="white" />
            <Text className="text-white text-base font-semibold ml-2">Tham gia cuộc họp</Text>
          </TouchableOpacity>
        )} */}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center pt-24">
      <Ionicons 
        name={showCancelledOnly ? "close-circle-outline" : "calendar-outline"} 
        size={64} 
        color="#9E9E9E" 
      />
      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        {showCancelledOnly ? 'Chưa có cuộc hẹn nào bị hủy' : 'Chưa có cuộc hẹn nào'}
      </Text>
      <Text className="text-base text-gray-600 text-center">
        {showCancelledOnly 
          ? 'Các cuộc hẹn đã hủy sẽ hiển thị ở đây'
          : 'Các cuộc hẹn của bạn sẽ hiển thị ở đây'
        }
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center px-5">
      <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
      <Text className="text-xl font-bold text-red-600 mt-4 mb-2">Có lỗi xảy ra</Text>
      <Text className="text-base text-gray-600 text-center mb-6">{error}</Text>
      <TouchableOpacity 
        className="bg-blue-600 px-6 py-3 rounded-lg"
        onPress={() => fetchAppointments()}
      >
        <Text className="text-white text-base font-semibold">Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2196F3" />
        <Text className="mt-4 text-base text-gray-600">Đang tải cuộc hẹn...</Text>
      </View>
    );
  }

  if (error && appointmentData.length === 0) {
    return renderErrorState();
  }
 
  return (
    <View className="flex-1 bg-gray-50">

      <View className="bg-white px-5 py-6 border-b border-gray-200 mt-[15px]">
        <View className="flex-row items-center mb-3">
                 <TouchableOpacity 
                   onPress={() => router.back()}
                   className="mr-3 p-2 -ml-2"
                 >
                   <Ionicons name="arrow-back" size={24} color="#374151" />
                 </TouchableOpacity>
                 <View className="flex-1">
                   <Text className="text-2xl font-bold text-gray-800">Cuộc hẹn của tôi </Text>
                 </View>
               </View>
        
        {/* Filter Buttons */}
        <View className="flex-row space-x-3 mb-4">
          <TouchableOpacity 
            className={`flex-1 py-3 px-4 rounded-xl flex-row items-center justify-center ${
              !showCancelledOnly ? 'bg-blue-600' : 'bg-gray-100'
            }`}
            onPress={() => setShowCancelledOnly(false)}
          >
            <Ionicons 
              name="calendar" 
              size={16} 
              color={!showCancelledOnly ? "white" : "#6B7280"} 
            />
            <Text className={`ml-2 font-bold ${
              !showCancelledOnly ? 'text-white' : 'text-gray-600'
            }`}>
              Đang hoạt động ({getAppointmentStats().active})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-3 px-4 rounded-xl flex-row items-center justify-center ${
              showCancelledOnly ? 'bg-red-600' : 'bg-gray-100'
            }`}
            onPress={() => setShowCancelledOnly(true)}
          >
            <Ionicons 
              name="close-circle" 
              size={16} 
              color={showCancelledOnly ? "white" : "#6B7280"} 
            />
            <Text className={`ml-2 font-bold ${
              showCancelledOnly ? 'text-white' : 'text-gray-600'
            }`}>
              Đã hủy ({getAppointmentStats().cancelled})
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-gray-600">
          {showCancelledOnly 
            ? `${getAppointmentStats().cancelled} cuộc hẹn đã hủy`
            : `${getAppointmentStats().active} cuộc hẹn đang hoạt động`
          }
        </Text>
        
        {/* Hiển thị thông tin cuộc hẹn sắp tới - chỉ khi không xem cuộc hẹn đã hủy */}
        {!showCancelledOnly && appointmentData.length > 0 && (() => {
          const activeAppointments = getFilteredAppointments();
          const nextAppointment = activeAppointments.find(apt => new Date(apt.appointmentTime) > new Date());
          if (nextAppointment) {
            const { fullDateTime } = formatDateTime(nextAppointment.appointmentTime);
            return (
              <View className="mt-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                <View className="flex-row items-center">
                  <Ionicons name="alarm" size={16} color="#2563EB" />
                  <Text className="text-blue-700 text-sm font-semibold ml-2">
                    Cuộc hẹn tiếp theo: {fullDateTime}
                  </Text>
                </View>
              </View>
            );
          }
          return null;
        })()}
      </View>

      <FlatList
        data={getFilteredAppointments()}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={() => renderEmptyState()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      />
    </View>
  );
};

export default UserAppointment;
