import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const days = [
  { label: 'T2', date: '03/6' },
  { label: 'T3', date: '04/6' },
  { label: 'T4', date: '05/6' },
  { label: 'T5', date: '06/6' },
  { label: 'T6', date: '07/6' },
  { label: 'T7', date: '08/6' },
  { label: 'CN', date: '09/6' },
];

const schedule = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Xin chào, Mai</Text>
        <Text style={styles.subText}>Chúc bạn một ngày tốt lành</Text>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Lịch uống thuốc</Text>
        <Text style={styles.subtitle}>Theo dõi chi tiết lịch dùng thuốc</Text>
      </View>

      {/* Date List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayBox, index === 0 && styles.activeDay]}
          >
            <Text style={[styles.dayText, index === 0 && styles.activeText]}>{day.label}</Text>
            <Text style={[styles.dateText, index === 0 && styles.activeText]}>{day.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Medication Schedule */}
      <View style={styles.timeSection}>
        <Text style={styles.timeLabel}>☀️ Buổi sáng (07:00)</Text>
        <View style={styles.medBox}>
          <Text style={styles.medName}>🔵 Paracetamol 500mg</Text>
          <Text style={styles.medDetail}>Liều lượng: 1 viên</Text>
          <Text style={styles.medNote}>* Uống sau khi ăn</Text>
        </View>
        <View style={styles.medBox}>
          <Text style={styles.medName}>🟢 Vitamin C</Text>
          <Text style={styles.medDetail}>Liều lượng: 1 viên sủi</Text>
          <Text style={styles.medNote}>* Hòa tan trong nước</Text>
        </View>

        <Text style={styles.timeLabel}>🧡 Buổi trưa (12:00)</Text>
        <View style={styles.medBox}>
          <Text style={styles.medName}>🟠 Aspirin 81mg</Text>
          <Text style={styles.medDetail}>Liều lượng: 1 viên</Text>
          <Text style={styles.medNote}>* Uống trước khi ăn</Text>
        </View>

        <Text style={styles.timeLabel}>🌙 Buổi tối (20:00)</Text>
        <View style={styles.medBox}>
          <Text style={styles.medName}>🟣 Omeprazol 20mg</Text>
          <Text style={styles.medDetail}>Liều lượng: 1 viên</Text>
          <Text style={styles.medNote}>* Uống trước khi ngủ</Text>
        </View>
      </View>

      {/* Add button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Thêm thuốc mới</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default schedule;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { marginBottom: 12 },
  welcome: { fontSize: 18, fontWeight: '600' },
  subText: { fontSize: 14, color: 'gray' },

  titleSection: { marginTop: 10 },
  title: { fontSize: 18, fontWeight: '600', color: '#1e1e1e' },
  subtitle: { fontSize: 14, color: 'gray' },

  dateScroll: { marginTop: 12, flexDirection: 'row' },
  dayBox: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    marginRight: 8,
  },
  activeDay: {
    backgroundColor: '#4B39EF',
  },
  dayText: { fontSize: 14, fontWeight: '600', color: '#333' },
  dateText: { fontSize: 12, color: '#666' },
  activeText: { color: '#fff' },

  timeSection: { marginTop: 20 },
  timeLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  medBox: {
    backgroundColor: '#f6f7fb',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  medName: { fontSize: 15, fontWeight: '600' },
  medDetail: { fontSize: 13, color: '#444' },
  medNote: { fontSize: 12, color: '#666', fontStyle: 'italic' },

  addButton: {
    backgroundColor: '#4B39EF',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
