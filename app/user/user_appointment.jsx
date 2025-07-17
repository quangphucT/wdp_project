import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
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
import { getAppointmentPatient } from "../../services/user/getAppointmentPatient";
import useAuthStore from "../../stores/authStore";

const UserAppointment = () => {

  const [appointmentData, setAppointmentData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);
  
  const { user } = useAuthStore();

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
        setAppointmentData(response.data.data.data);
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
      case 'ONLINE':
        return 'videocam';
      case 'OFFLINE':
        return 'location';
      default:
        return 'calendar';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 1000); // Assuming price is in thousands
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

  const renderAppointmentItem = ({ item }) => {
    const { date, time } = formatDateTime(item.appointmentTime);
    
    return (
      <View className="bg-white rounded-xl p-4 mb-4 shadow-lg">
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
                {item.type === 'ONLINE' ? 'Trực tuyến' : 'Trực tiếp'}
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
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar" size={16} color="#666" />
            <Text className="text-sm text-gray-800 ml-2">{date}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="time" size={16} color="#666" />
            <Text className="text-sm text-gray-800 ml-2">{time}</Text>
          </View>
          {item.notes && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text" size={16} color="#666" />
              <Text className="text-sm text-gray-800 ml-2">{item.notes}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
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
      <Ionicons name="calendar-outline" size={64} color="#9E9E9E" />
      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">Chưa có cuộc hẹn nào</Text>
      <Text className="text-base text-gray-600 text-center">
        Các cuộc hẹn của bạn sẽ hiển thị ở đây
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

      <View className="bg-white px-5 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800 mb-1">Cuộc hẹn của tôi</Text>
        <Text className="text-sm text-gray-600">
          {appointmentData.length} cuộc hẹn
        </Text>
      </View>

      <FlatList
        data={appointmentData}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={renderEmptyState}
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
