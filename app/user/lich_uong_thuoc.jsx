

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { getPatientMedicalActiveApi } from "../../services/user/getPatientMedicalActive";

const LichUongThuoc = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTreatmentData = useCallback(async (isRefresh = false) => {

    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const patientId = await SecureStore.getItemAsync("userId");


      if (!patientId) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      const response = await getPatientMedicalActiveApi(patientId);
    
      if (response?.data?.data) {
        setTreatments(response.data.data);
      } else {
        setTreatments([]);
      }
    
    } catch (err) {
      console.error('Error fetching treatment data:', err);
      setError(err.message || 'Không thể tải dữ liệu');
      Alert.alert('Lỗi', err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
   
      fetchTreatmentData();
    }, [fetchTreatmentData])
  );

  const onRefresh = () => {

    fetchTreatmentData(true);
  };

  const renderTreatmentItem = ({ item }) => {
    // Tính toán trạng thái và màu sắc
    const getStatusInfo = (status) => {
      switch (status) {
        case 'upcoming':
          return { text: 'Sắp bắt đầu', color: 'bg-orange-100 text-orange-800', icon: 'time-outline' };
        case 'active':
          return { text: 'Đang điều trị', color: 'bg-green-100 text-green-800', icon: 'checkmark-circle-outline' };
        case 'completed':
          return { text: 'Hoàn thành', color: 'bg-blue-100 text-blue-800', icon: 'checkmark-done-outline' };
        default:
          return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: 'help-outline' };
      }
    };

    const statusInfo = getStatusInfo(item.treatmentStatus);

    return (
      <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
        {/* Header với Protocol và Status */}
        <View className="mb-3">
          <View className="flex-row justify-between items-start mb-2">
            {item.protocol && (
              <Text className="text-lg font-bold text-gray-800 flex-1">
                {item.protocol.name}
              </Text>
            )}
            <View className={`px-3 py-1 rounded-full flex-row items-center ${statusInfo.color}`}>
              <Ionicons name={statusInfo.icon} size={12} color="currentColor" />
              <Text className="text-xs font-medium ml-1">{statusInfo.text}</Text>
            </View>
          </View>
          
          {item.protocol?.description && (
            <Text className="text-sm text-gray-600 mb-2">
              {item.protocol.description}
            </Text>
          )}
          
          {item.protocol?.targetDisease && (
            <Text className="text-sm text-blue-600 font-medium">
              🎯 Mục tiêu: {item.protocol.targetDisease}
            </Text>
          )}
        </View>

        {/* Thông tin thời gian */}
        <View className="bg-gray-50 p-3 rounded-lg mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Ngày bắt đầu:</Text>
            <Text className="text-sm font-medium text-gray-800">
              {new Date(item.startDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
              })}
            </Text>
          </View>
          {/* <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Ngày kết thúc:</Text>
            <Text className="text-sm font-medium text-gray-800">
              {new Date(item.endDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
          </View> */}
          
          {/* Debug thông tin ngày */}
         
          
          {/* Hiển thị số ngày còn lại */}
          {/* {item.daysRemaining > 0 && (
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Số ngày còn lại:</Text>
              <Text className="text-sm font-bold text-orange-600">
                {item.daysRemaining} ngày
              </Text>
            </View>
          )} */}
        </View>

        {/* Protocol medicines */}
        {item.protocol?.medicines && item.protocol.medicines.length > 0 && (
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              💊 Thuốc trong protocol ({item.protocol.medicines.length} loại):
            </Text>
            {item.protocol.medicines.map((protocolMedicine, index) => (
              <View key={index} className="bg-blue-50 p-3 rounded-lg mb-2">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-sm font-medium text-gray-800 flex-1">
                    {protocolMedicine.medicine?.name || 'Không có tên'}
                  </Text>
                  <Text className="text-xs text-gray-500 ml-2">
                    {protocolMedicine.medicine?.dose}
                  </Text>
                </View>
                
                {protocolMedicine.medicine?.description && (
                  <Text className="text-xs text-gray-600 mb-1">
                    {protocolMedicine.medicine.description}
                  </Text>
                )}
                
                <View className="flex-row flex-wrap gap-2">
                  {protocolMedicine.dosage && (
                    <Text className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                      💊 {protocolMedicine.dosage}
                    </Text>
                  )}
                  {protocolMedicine.schedule && (
                    <Text className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                      ⏰ {protocolMedicine.schedule}
                    </Text>
                  )}
                  {protocolMedicine.durationValue && (
                    <Text className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                      📅 {protocolMedicine.durationValue} {protocolMedicine.durationUnit?.toLowerCase()}
                    </Text>
                  )}
                </View>
                
                {protocolMedicine.notes && (
                  <Text className="text-xs text-gray-600 mt-2 italic">
                    📝 {protocolMedicine.notes}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Custom Medications */}
        {item.customMedications && item.customMedications.length > 0 && (
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              🏥 Thuốc bổ sung ({item.customMedications.length} loại):
            </Text>
            {item.customMedications.map((customMed, index) => (
              <View key={index} className="bg-purple-50 p-3 rounded-lg mb-2">
                <Text className="text-sm font-medium text-gray-800">
                  {customMed.name}
                </Text>
                {customMed.dosage && (
                  <Text className="text-xs text-gray-600">
                    Liều lượng: {customMed.dosage}
                  </Text>
                )}
                {customMed.instructions && (
                  <Text className="text-xs text-gray-600">
                    Hướng dẫn: {customMed.instructions}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        {item.notes && (
          <View className="bg-yellow-50 p-3 rounded-lg mb-3">
            <Text className="text-sm font-medium text-gray-800 mb-1">📋 Ghi chú:</Text>
            <Text className="text-sm text-gray-600">{item.notes}</Text>
          </View>
        )}

        {/* Doctor info */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
          <View>
            <Text className="text-xs text-gray-500">
              👨‍⚕️ Bác sĩ: {item.doctor?.user?.name || 'Chưa có thông tin'}
            </Text>
            {item.doctor?.specialization && (
              <Text className="text-xs text-gray-500">
                🏥 Chuyên khoa: {item.doctor.specialization}
              </Text>
            )}
          </View>
          
          {item.total > 0 && (
            <Text className="text-sm font-bold text-green-600">
              💰 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-4 pt-20">
      <Ionicons name="medical-outline" size={64} color="#9E9E9E" />
      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Không có dữ liệu điều trị
      </Text>
      <Text className="text-base text-gray-600 text-center">
        Chưa có thông tin điều trị nào được tìm thấy
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2196F3" />
        <Text className="mt-4 text-base text-gray-600">Đang tải dữ liệu điều trị...</Text>
      </View>
    );
  }

  if (error && treatments.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
        <Text className="text-xl font-bold text-red-600 mt-4 mb-2">Có lỗi xảy ra</Text>
        <Text className="text-base text-gray-600 text-center mb-6">{error}</Text>
      </View>
    );
  }

  console.log('Current treatments state:', treatments);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800 mb-1">Điều trị đang hoạt động</Text>
        <Text className="text-sm text-gray-600">
          Tổng số: {treatments.length} liệu trình đang theo dõi
        </Text>
        
        {/* Thống kê nhanh */}
        {treatments.length > 0 && (
          <View className="flex-row mt-3 space-x-3">
            {(() => {
              const upcoming = treatments.filter(t => t.treatmentStatus === 'upcoming').length;
              const active = treatments.filter(t => t.treatmentStatus === 'active').length;
              const completed = treatments.filter(t => t.treatmentStatus === 'completed').length;
              
              return (
                <>
                  {upcoming > 0 && (
                    <View className="bg-orange-100 px-2 py-1 rounded-lg">
                      <Text className="text-xs text-orange-800 font-medium">
                        {upcoming} sắp tới
                      </Text>
                    </View>
                  )}
                  {active > 0 && (
                    <View className="bg-green-100 px-2 py-1 rounded-lg">
                      <Text className="text-xs text-green-800 font-medium">
                        {active} đang hoạt động
                      </Text>
                    </View>
                  )}
                  {completed > 0 && (
                    <View className="bg-blue-100 px-2 py-1 rounded-lg">
                      <Text className="text-xs text-blue-800 font-medium">
                        {completed} hoàn thành
                      </Text>
                    </View>
                  )}
                </>
              );
            })()}
          </View>
        )}
      </View>

      {/* Treatment List */}
      <FlatList
        data={treatments}
        renderItem={renderTreatmentItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
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

export default LichUongThuoc;
