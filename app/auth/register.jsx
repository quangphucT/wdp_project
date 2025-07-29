import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import logoImage from '../../assets/images/logo.png';
import { registerApi } from '../../services/auth/registerApi';

const RegisterScreen = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const handleRegister = async () => {
    try {
      await registerApi(form);
      Alert.alert("Thành công", "Đăng ký thành công! Vui lòng đăng nhập.");
      router.push('/auth/login');
    } catch (error) {
      Alert.alert("Lỗi đăng ký", error.message);
    }
  };

  return (
    <LinearGradient colors={["#1e3c72", "#2a5298"]} className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center py-8">
          {/* Header Section */}
          <View className="items-center mb-8">
            {/* Logo */}
            <View className="w-24 h-24 bg-white rounded-2xl justify-center items-center mb-6 shadow-lg">
              <Image source={logoImage} className="w-16 h-16" resizeMode="contain" />
            </View>
            
            {/* Title */}
            <Text className="text-3xl text-white font-bold mb-2">HIV Care Hub</Text>
            <Text className="text-xl text-white/90 font-semibold mb-1">Đăng ký tài khoản</Text>
            <Text className="text-white/80 text-sm text-center px-4">
              Tạo tài khoản để truy cập hệ thống
            </Text>
          </View>

          {/* Form Section */}
          <View className="bg-white rounded-3xl px-8 py-8 mx-2 shadow-2xl">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Địa chỉ email</Text>
              <TextInput
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:border-blue-500 focus:bg-white"
                placeholder="Nhập địa chỉ email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Họ và tên</Text>
              <TextInput
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:border-blue-500 focus:bg-white"
                placeholder="Nhập họ và tên đầy đủ"
                placeholderTextColor="#9CA3AF"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
            </View>

            {/* Phone Number Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Số điện thoại</Text>
              <TextInput
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:border-blue-500 focus:bg-white"
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={form.phoneNumber}
                onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
              />
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm font-medium mb-2">Mật khẩu</Text>
              <TextInput
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:border-blue-500 focus:bg-white"
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 text-sm font-medium mb-2">Xác nhận mật khẩu</Text>
              <TextInput
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:border-blue-500 focus:bg-white"
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="w-full h-12 bg-blue-600 rounded-xl justify-center items-center shadow-lg"
              onPress={handleRegister}
              style={{
                shadowColor: '#1e40af',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-white font-semibold text-base">Đăng ký tài khoản</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View className="items-center mt-8 mb-8">
            <View className="flex-row items-center">
              <Text className="text-white/90 text-sm">Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-white font-bold text-sm underline">
                  Đăng nhập ngay
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Version Info */}
            <Text className="text-white/70 text-xs mt-4">
              © 2025 HIV Management System v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default RegisterScreen;
