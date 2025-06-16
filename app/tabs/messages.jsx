import React from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Switch
} from 'react-native';

const Messages = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Xin chào, Mai</Text>
        <Text style={styles.sub}>Chúc bạn một ngày tốt lành</Text>
      </View>

      {/* Nhắc nhở */}
      <View style={styles.reminderBox}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.reminderTitle}>🔔 Nhắc nhở</Text>
            <Text style={styles.reminderText}>
              Cuộc hẹn với <Text style={{ fontWeight: '600' }}>BS. Nguyễn Văn Long</Text> vào 14:00, 02/06/2024
            </Text>
          </View>
          <Switch value={true} />
        </View>
      </View>

      {/* Cuộc hẹn sắp tới */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cuộc hẹn sắp tới</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>+ Đặt lịch mới</Text>
          </TouchableOpacity>
        </View>

        {/* Appointment Item */}
        <View style={styles.appointmentItem}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 18 }}>🩺</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctor}>Khám tổng quát</Text>
            <Text style={styles.name}>BS. Nguyễn Văn Long</Text>
            <Text style={styles.time}>14:00, 02/06/2024</Text>
          </View>
          <Text style={styles.statusGreen}>Đang chờ</Text>
        </View>

        <View style={styles.appointmentItem}>
          <View style={styles.iconContainerGreen}>
            <Text style={{ fontSize: 18 }}>🥗</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctor}>Tư vấn dinh dưỡng</Text>
            <Text style={styles.name}>BS. Trần Thị Hoa</Text>
            <Text style={styles.time}>09:30, 05/06/2024</Text>
          </View>
          <Text style={styles.statusYellow}>Chờ xác nhận</Text>
        </View>
      </View>

      {/* Lịch sử cuộc hẹn */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch sử cuộc hẹn</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyItem}>
          <View style={styles.iconContainerPurple}>
            <Text style={{ fontSize: 18 }}>🧴</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctor}>Khám da liễu</Text>
            <Text style={styles.name}>BS. Lê Minh Châu</Text>
            <Text style={styles.time}>10:00, 15/05/2024</Text>
          </View>
          <Text style={styles.statusGray}>Đã xong</Text>
        </View>

        <View style={styles.historyItem}>
          <View style={styles.iconContainerPink}>
            <Text style={{ fontSize: 18 }}>❤️</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.doctor}>Khám tim mạch</Text>
            <Text style={styles.name}>BS. Phạm Quốc Đạt</Text>
            <Text style={styles.time}>15:30, 28/04/2024</Text>
          </View>
          <Text style={styles.statusGray}>Đã xong</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { marginBottom: 20 },
  welcome: { fontSize: 18, fontWeight: '600' },
  sub: { fontSize: 13, color: 'gray' },

  reminderBox: {
    backgroundColor: '#E8EDFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  reminderTitle: { fontSize: 14, fontWeight: '600', color: '#4B39EF' },
  reminderText: { fontSize: 13, marginTop: 4 },

  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  linkText: { color: '#4B39EF', fontSize: 13 },

  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F4F8FF',
    borderRadius: 10,
    padding: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
  },
  iconContainer: {
    backgroundColor: '#D6E4FF',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  iconContainerGreen: {
    backgroundColor: '#DFF8E5',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  iconContainerPurple: {
    backgroundColor: '#E4DFFF',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  iconContainerPink: {
    backgroundColor: '#FFE4E4',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  appointmentInfo: { flex: 1 },
  doctor: { fontWeight: '600', fontSize: 14 },
  name: { fontSize: 13, color: 'gray' },
  time: { fontSize: 13, color: 'gray' },

  statusGreen: {
    color: '#20B26C',
    fontWeight: '600',
    fontSize: 12,
    backgroundColor: '#DFF8E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusYellow: {
    color: '#F5A623',
    fontWeight: '600',
    fontSize: 12,
    backgroundColor: '#FFF5D8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusGray: {
    color: '#888',
    fontWeight: '600',
    fontSize: 12,
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
