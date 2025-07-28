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
    <LinearGradient colors={["#4F46E5", "#7C3AED"]} className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center py-8">
          {/* Header Section */}
          <View className="items-center mb-8">
            {/* Logo */}
            <View className="w-20 h-20 bg-white/20 rounded-full justify-center items-center mb-4">
              <Image source={logoImage} className="w-14 h-14" resizeMode="contain" />
            </View>
            
            {/* Title */}
            <Text className="text-2xl text-white font-bold mb-1">Tạo tài khoản mới</Text>
            <Text className="text-white/80 text-sm text-center">
              Điền thông tin để tạo tài khoản
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            {/* Email Input */}
            <View className="mb-3">
              <Text className="text-white/90 text-xs font-medium mb-1">Email</Text>
              <TextInput
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg px-4 text-white text-sm"
                placeholder="Nhập email của bạn"
                placeholderTextColor="#ffffff80"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
            </View>

            {/* Name Input */}
            <View className="mb-3">
              <Text className="text-white/90 text-xs font-medium mb-1">Họ và tên</Text>
              <TextInput
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg px-4 text-white text-sm"
                placeholder="Nhập họ và tên"
                placeholderTextColor="#ffffff80"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
            </View>

            {/* Phone Number Input */}
            <View className="mb-3">
              <Text className="text-white/90 text-xs font-medium mb-1">Số điện thoại</Text>
              <TextInput
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg px-4 text-white text-sm"
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#ffffff80"
                keyboardType="phone-pad"
                value={form.phoneNumber}
                onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
              />
            </View>

            {/* Password Input */}
            <View className="mb-3">
              <Text className="text-white/90 text-xs font-medium mb-1">Mật khẩu</Text>
              <TextInput
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg px-4 text-white text-sm"
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#ffffff80"
                secureTextEntry
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-4">
              <Text className="text-white/90 text-xs font-medium mb-1">Xác nhận mật khẩu</Text>
              <TextInput
                className="w-full h-12 bg-white/10 border border-white/20 rounded-lg px-4 text-white text-sm"
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#ffffff80"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="w-full h-12 bg-white rounded-lg justify-center items-center shadow-lg mt-2"
              onPress={handleRegister}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-indigo-600 font-semibold text-sm">Đăng ký </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View className="items-center mt-6">
            <View className="flex-row items-center">
              <Text className="text-white/80 text-xs">Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-white font-semibold text-xs underline">Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default RegisterScreen;
