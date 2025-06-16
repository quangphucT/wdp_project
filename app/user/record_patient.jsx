import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const PatientRecordScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Hồ sơ bệnh án</Text>
      <Text style={styles.subtitle}>Chi tiết & lịch sử khám</Text>

      {/* Hồ sơ hiện tại */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hồ sơ hiện tại</Text>
        <View style={styles.cardCurrent}>
          <View style={styles.row}>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85xmFlsis_5EgtGHMT9BMdnX-ges1HSov4A&s' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>Mai Nguyễn</Text>
              <Text style={styles.infoText}>0901 234 567</Text>
              <Text style={styles.infoText}>mai.nguyen@email.com</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Đang điều trị</Text>
            </View>
          </View>

          <Text style={styles.label}>Ngày khám: <Text style={styles.value}>31/05/2024</Text></Text>
          <Text style={styles.label}>Bác sĩ: <Text style={styles.value}>Dr. Nguyễn Văn A</Text></Text>
          <Text style={styles.label}>Chuẩn đoán:</Text>
          <Text style={styles.value}>Viêm họng cấp - sốt nhẹ, đau họng, ho khan</Text>

          <Text style={styles.label}>Phác đồ điều trị:</Text>
          <Text style={styles.value}>
            - Kháng sinh: Amoxicillin 500mg, 2 viên/ngày, sau khi ăn{"\n"}
            - Thuốc hạ sốt: Paracetamol 500mg, 1 viên khi sốt > 38°C{"\n"}
            - Súc miệng nước muối 3 lần/ngày{"\n"}
            - Tái khám sau 5 ngày
          </Text>
        </View>
      </View>

      {/* Lịch sử khám bệnh */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lịch sử khám bệnh</Text>

        {/* Item 1 */}
        <View style={styles.historyItem}>
          <View style={styles.iconCircle}><Ionicons name="calendar" size={18} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyDate}>20/04/2024</Text>
            <Text style={styles.historyDoctor}>Dr. Nguyễn Văn A</Text>
            <Text style={styles.label}>Chuẩn đoán:</Text>
            <Text style={styles.value}>Cảm lạnh thông thường</Text>
            <Text style={styles.label}>Phác đồ:</Text>
            <Text style={styles.value}>Nghỉ ngơi, uống nước ấm, Paracetamol khi sốt</Text>
          </View>
          <View style={styles.tag}><Text style={styles.tagText}>Đã hoàn thành</Text></View>
        </View>

        {/* Item 2 */}
        <View style={styles.historyItem}>
          <View style={styles.iconCircle}><Ionicons name="calendar" size={18} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyDate}>15/02/2024</Text>
            <Text style={styles.historyDoctor}>Dr. Trần Thị B</Text>
            <Text style={styles.label}>Chuẩn đoán:</Text>
            <Text style={styles.value}>Viêm da dị ứng nhẹ</Text>
            <Text style={styles.label}>Phác đồ:</Text>
            <Text style={styles.value}>Bôi kem dưỡng ẩm, tránh tiếp xúc hóa chất</Text>
          </View>
          <View style={styles.tag}><Text style={styles.tagText}>Đã hoàn thành</Text></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f9f9f9', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1e88e5', marginBottom: 12 },
  cardCurrent: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderColor: '#1e88e5' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  infoText: { fontSize: 13, color: '#666' },
  statusBadge: { backgroundColor: '#e8eaf6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#3f51b5', fontSize: 12, fontWeight: '600' },
  label: { fontSize: 13, color: '#333', marginTop: 6, fontWeight: '600' },
  value: { fontSize: 13, color: '#444', marginTop: 2 },
  historyItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', gap: 10, marginBottom: 16 },
  iconCircle: { width: 36, height: 36, backgroundColor: '#4caf50', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  historyDate: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  historyDoctor: { fontSize: 13, color: '#555', marginBottom: 6 },
  tag: { alignSelf: 'flex-start', backgroundColor: '#e0f2f1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 6 },
  tagText: { fontSize: 12, fontWeight: '600', color: '#00796b' },
});

export default PatientRecordScreen;