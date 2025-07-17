import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { getPatientMedicalRecordApi } from "../../services/user/getPatientMedicalRecord";

const PatientRecordScreen = () => {
  const [patientMedicalRecord, setPatientMedicalRecord] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        const patientId = await SecureStore.getItemAsync("userId");
        const userName = await SecureStore.getItemAsync("name");
        const userEmail = await SecureStore.getItemAsync("email");
        
        
        setCurrentUser({
          id: patientId,
          name: userName,
          email: userEmail
        });

        if (patientId) {
          await fetchingPatientMedicalRecord(patientId);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      const patientId = await SecureStore.getItemAsync("userId");
      
      if (patientId) {
        await fetchingPatientMedicalRecord(patientId);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      Alert.alert("Lỗi", "Không thể tải lại dữ liệu");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchingPatientMedicalRecord = async (patientId) => {
    try {
      const response = await getPatientMedicalRecordApi(patientId);
      
      if (response.data && response.data.data && response.data.data.data) {
        setPatientMedicalRecord(response.data.data.data);
      } else if (response.data && response.data.data) {
        // Handle case where response structure might be different
        setPatientMedicalRecord(response.data.data);
      } else {
        setPatientMedicalRecord([]);
      }
    } catch (error) {
      console.error("Error fetching patient medical record:", error);
      Alert.alert("Lỗi", "Không thể tải hồ sơ bệnh án. Vui lòng thử lại sau.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getMedicationText = (record) => {
    let medications = [];
    
    // Add protocol medicines
    if (record.protocol?.medicines) {
      record.protocol.medicines.forEach(pm => {
        medications.push(
          `- ${pm.medicine.name} ${pm.medicine.dose}: ${pm.dosage}, ${pm.durationValue} ${pm.durationUnit.toLowerCase()}` +
          (pm.notes ? ` (${pm.notes})` : '')
        );
      });
    }
    
    // Add custom medications
    if (record.customMedications) {
      record.customMedications.forEach(cm => {
        medications.push(
          `- Thuốc bổ sung: ${cm.dosage}` +
          (cm.note ? ` (${cm.note})` : '')
        );
      });
    }
    
    return medications.length > 0 ? medications.join('\n') : 'Chưa có phác đồ điều trị';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <Text style={styles.title}>Hồ sơ bệnh án</Text>
      <Text style={styles.subtitle}>Chi tiết & lịch sử khám</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
        </View>
      ) : (
        <>
          {/* Hồ sơ hiện tại - Record gần nhất */}
          {patientMedicalRecord.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hồ sơ hiện tại</Text>
              <View style={styles.cardCurrent}>
                <View style={styles.row}>
                  <Image
                    source={{
                      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85xmFlsis_5EgtGHMT9BMdnX-ges1HSov4A&s",
                    }}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.patientName}>
                      {currentUser?.name || patientMedicalRecord[0]?.patient?.name || "Bệnh nhân"}
                    </Text>
                    <Text style={styles.infoText}>
                      {currentUser?.phone || "Chưa có số điện thoại"}
                    </Text>
                    <Text style={styles.infoText}>
                      {currentUser?.email || patientMedicalRecord[0]?.patient?.email || "Chưa có email"}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {patientMedicalRecord[0]?.endDate ? "Đã hoàn thành" : "Đang điều trị"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.label}>
                  Ngày khám: <Text style={styles.value}>{formatDate(patientMedicalRecord[0]?.startDate)}</Text>
                </Text>
                <Text style={styles.label}>
                  Bác sĩ: <Text style={styles.value}>
                    {patientMedicalRecord[0]?.doctor?.user?.name || "Chưa xác định"}
                  </Text>
                </Text>
                <Text style={styles.label}>
                  Chuyên khoa: <Text style={styles.value}>
                    {patientMedicalRecord[0]?.doctor?.specialization || "Chưa xác định"}
                  </Text>
                </Text>
                <Text style={styles.label}>Chuẩn đoán:</Text>
                <Text style={styles.value}>
                  {patientMedicalRecord[0]?.protocol?.name} - {patientMedicalRecord[0]?.protocol?.description}
                </Text>

                <Text style={styles.label}>Phác đồ điều trị:</Text>
                <Text style={styles.value}>
                  {getMedicationText(patientMedicalRecord[0])}
                </Text>

                {patientMedicalRecord[0]?.notes && (
                  <>
                    <Text style={styles.label}>Ghi chú:</Text>
                    <Text style={styles.value}>{patientMedicalRecord[0].notes}</Text>
                  </>
                )}
              </View>
            </View>
          )}

          {/* Lịch sử khám bệnh */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lịch sử khám bệnh</Text>

            {patientMedicalRecord.length > 0 ? (
              patientMedicalRecord.map((record, index) => (
                <View key={record.id} style={styles.historyItem}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="calendar" size={18} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyDate}>{formatDate(record.startDate)}</Text>
                    <Text style={styles.historyDoctor}>
                      {record.doctor?.user?.name || "Bác sĩ chưa xác định"}
                    </Text>
                    <Text style={styles.label}>Chuẩn đoán:</Text>
                    <Text style={styles.value}>
                      {record.protocol?.name} - {record.protocol?.targetDisease}
                    </Text>
                    <Text style={styles.label}>Phác đồ:</Text>
                    <Text style={styles.value}>
                      {getMedicationText(record)}
                    </Text>
                    {record.notes && (
                      <>
                        <Text style={styles.label}>Ghi chú:</Text>
                        <Text style={styles.value}>{record.notes}</Text>
                      </>
                    )}
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      {record.endDate ? "Đã hoàn thành" : "Đang điều trị"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chưa có hồ sơ bệnh án nào</Text>
                <Text style={styles.emptySubText}>
                  Hồ sơ bệnh án sẽ được tạo sau khi bạn khám bệnh
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f9f9f9", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", color: "#222" },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e88e5",
    marginBottom: 12,
  },
  cardCurrent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderColor: "#1e88e5",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  patientName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  infoText: { fontSize: 13, color: "#666" },
  statusBadge: {
    backgroundColor: "#e8eaf6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: { color: "#3f51b5", fontSize: 12, fontWeight: "600" },
  label: { fontSize: 13, color: "#333", marginTop: 6, fontWeight: "600" },
  value: { fontSize: 13, color: "#444", marginTop: 2 },
  historyItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  historyDate: { fontSize: 14, fontWeight: "bold", color: "#222" },
  historyDoctor: { fontSize: 13, color: "#555", marginBottom: 6 },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
  },
  tagText: { fontSize: 12, fontWeight: "600", color: "#00796b" },
  loadingContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
  },
});

export default PatientRecordScreen;
