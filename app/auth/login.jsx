import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import logoImage from "../../assets/images/logo.png";
import { loginApi } from "../../services/auth/loginApi";
import useAuthStore from "../../stores/authStore";

const LoginScreen = () => {


  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Sử dụng authStore
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      const res = await loginApi({ email, password });

      if (res?.data?.data?.accessToken) {
        const loginData = {
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
          user: res.data.data.user
        };

        // Sử dụng authStore.login để lưu thông tin đăng nhập
        const success = await login(loginData);

        if (success) {
          Alert.alert("Thành công", "Đăng nhập thành công!");
          
          // Kiểm tra role để điều hướng
          const userRole = res.data.data.user?.role;
          if (userRole === "DOCTOR") {
            router.replace("/doctor"); // điều hướng sang màn hình doctor
          } else {
            router.replace("/"); // điều hướng sang Home cho user thường
          }
        } else {
          Alert.alert("Thất bại", "Có lỗi xảy ra khi lưu thông tin đăng nhập");
        }
      } else {
        Alert.alert("Thất bại", "Thông tin đăng nhập không chính xác");
      }
    } catch (_err) {
      Alert.alert("Lỗi", "Không thể đăng nhập. Vui lòng thử lại");
    }
  };

  return (
    <LinearGradient colors={["#4F46E5", "#7C3AED"]} className="flex-1">
      <View className="flex-1 px-6 justify-center">
        {/* Header Section */}
        <View className="items-center mb-12">
          {/* Logo */}
          <View className="w-24 h-24 bg-white/20 rounded-full justify-center items-center mb-6">
            <Image source={logoImage} className="w-16 h-16" resizeMode="contain" />
          </View>
          
          {/* Title */}
          <Text className="text-3xl text-white font-bold mb-2">Chào mừng trở lại</Text>
          <Text className="text-white/80 text-base text-center">
            Đăng nhập để tiếp tục sử dụng dịch vụ
          </Text>
        </View>

        {/* Form Section */}
        <View className="space-y-4">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-white/90 text-sm font-medium mb-2">Email</Text>
            <TextInput
              className="w-full h-14 bg-white/10 border border-white/20 rounded-xl px-4 text-white text-base"
              placeholder="Nhập email của bạn"
              placeholderTextColor="#ffffff80"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-white/90 text-sm font-medium mb-2">Mật khẩu</Text>
            <TextInput
              className="w-full h-14 bg-white/10 border border-white/20 rounded-xl px-4 text-white text-base"
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#ffffff80"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="w-full h-14 bg-white rounded-xl justify-center items-center shadow-lg"
            onPress={handleLogin}
            disabled={isLoading}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#4F46E5" />
                <Text className="text-indigo-600 font-semibold text-base ml-3">Đang đăng nhập...</Text>
              </View>
            ) : (
              <Text className="text-indigo-600 font-semibold text-base">Đăng nhập</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View className="items-center mt-8">
          <View className="flex-row items-center">
            <Text className="text-white/80 text-sm">Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className="text-white font-semibold text-sm underline">Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;
