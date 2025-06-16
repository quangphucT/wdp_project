import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView
} from 'react-native';

const Profile = () => {
  const [email, setEmail] = useState('mai.hang@gmail.com');
  const [phone, setPhone] = useState('0912345678');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Xin chào, Mai</Text>
        <Text style={styles.subText}>Cập nhật hồ sơ</Text>
        <Text style={styles.note}>Thay đổi thông tin cá nhân và bảo mật tài khoản</Text>
      </View>

      {/* Avatar + Name */}
      <View style={styles.profileBox}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Mai Thu Hằng</Text>
        <Text style={styles.role}>Bệnh nhân</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Mật khẩu hiện tại"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mật khẩu mới"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <View style={styles.forgotBox}>
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        <Text style={styles.forgotDesc}>
          Nhận mã xác nhận qua email để đặt lại mật khẩu mới.
        </Text>
        <TouchableOpacity>
          <Text style={styles.requestText}>📩 Gửi yêu cầu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { marginBottom: 20 },
  welcome: { fontSize: 18, fontWeight: '600' },
  subText: { fontSize: 16, fontWeight: '600', marginTop: 6 },
  note: { fontSize: 13, color: 'gray' },

  profileBox: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '600' },
  role: { color: 'gray', fontSize: 13 },

  inputContainer: {},
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4B39EF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontWeight: '600' },

  forgotBox: {
    backgroundColor: '#f1f5fd',
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  forgotText: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  forgotDesc: { fontSize: 13, color: '#555' },
  requestText: { marginTop: 8, color: '#4B39EF', fontWeight: '600' },
});
