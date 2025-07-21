

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
import { getPatientMedicalRecordApi } from "../../services/user/getPatientMedicalRecord";

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

      const response = await getPatientMedicalRecordApi(patientId);
    
      
    
     
        setTreatments(response.data.data.data);
    
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
    return (
      <View className="bg-white mx-4 mb-4 rounded-xl p-4 shadow-sm">
        {/* Header với ID và Protocol */}
        <View className="mb-3">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            Treatment ID: {item.id}
          </Text>
          {item.protocol && (
            <Text className="text-base font-semibold text-blue-600">
              Protocol: {item.protocol.name}
            </Text>
          )}
        </View>

        {/* Ngày bắt đầu và kết thúc */}
        <View className="bg-gray-50 p-3 rounded-lg mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Ngày bắt đầu:</Text>
            <Text className="text-sm font-medium text-gray-800">
              {new Date(item.startDate).toLocaleDateString('vi-VN')}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Ngày kết thúc:</Text>
            <Text className="text-sm font-medium text-gray-800">
              {new Date(item.endDate).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>

        {/* Protocol medicines */}
        {item.protocol?.medicines && item.protocol.medicines.length > 0 && (
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Thuốc trong protocol ({item.protocol.medicines.length} loại):
            </Text>
            {item.protocol.medicines.map((protocolMedicine, index) => (
              <View key={index} className="bg-blue-50 p-3 rounded-lg mb-2">
                <Text className="text-sm font-medium text-gray-800">
                  {protocolMedicine.medicine?.name || 'Không có tên'}
                </Text>
                {protocolMedicine.dosage && (
                  <Text className="text-xs text-gray-600">
                    Liều lượng: {protocolMedicine.dosage}
                  </Text>
                )}
                {protocolMedicine.schedule && (
                  <Text className="text-xs text-gray-600">
                    Lịch: {protocolMedicine.schedule}
                  </Text>
                )}
                {protocolMedicine.notes && (
                  <Text className="text-xs text-gray-600">
                    Ghi chú: {protocolMedicine.notes}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Doctor info */}
        {item.doctor?.user?.name && (
          <View className="mt-2 pt-2 border-t border-gray-200">
            <Text className="text-xs text-gray-500">
              Bác sĩ: {item.doctor.user.name}
            </Text>
          </View>
        )}
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
        <Text className="text-2xl font-bold text-gray-800 mb-1">Thông tin điều trị</Text>
        <Text className="text-sm text-gray-600">
          Tổng số: {treatments.length} liệu trình
        </Text>
        
        
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
