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
      // console.error("Login error:", _err);
      Alert.alert("Lỗi", "Không thể đăng nhập. Vui lòng thử lại");
    }
  };

  return (
    <LinearGradient colors={["#007bff", "#0056b3"]} className="flex-1 px-6 justify-center items-center">
      {/* Logo */}
      <View className="w-80 h-[90px] mb-8">
        <Image source={logoImage} className="w-full h-full" resizeMode="contain" />
      </View>

      {/* Title */}
      <Text className="text-3xl text-white font-bold mb-8">Đăng nhập</Text>

      <TextInput
        className="w-full h-[50px] bg-white rounded-lg px-4 text-base text-gray-800 mb-4"
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full h-[50px] bg-white rounded-lg px-4 text-base text-gray-800 mb-4"
        placeholder="Mật khẩu"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity
        className="w-full h-[50px] bg-white rounded-lg justify-center items-center mt-2 mb-6"
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#007bff" />
            <Text className="text-blue-500 font-bold text-lg ml-2">Đang đăng nhập...</Text>
          </View>
        ) : (
          <Text className="text-blue-500 font-bold text-lg">Đăng nhập</Text>
        )}
      </TouchableOpacity>

      {/* Register Link */}
      <View className="flex-row mb-2">
        <Text className="text-sm text-white">Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text className="text-sm text-white font-bold underline">Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;
