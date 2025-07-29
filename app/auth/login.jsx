import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Sử dụng authStore
  const { login, isLoading } = useAuthStore();

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email không được để trống");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Mật khẩu không được để trống");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
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
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Không thể đăng nhập. Vui lòng thử lại";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient 
        colors={["#1e3c72", "#2a5298"]} 
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-8 py-12">
            
            {/* Header Section */}
            <View className="items-center mt-16 mb-12">
              {/* Logo Container */}
              <View className="w-32 h-32 bg-white rounded-full justify-center items-center mb-8 shadow-xl border-4 border-white/20">
                <Image 
                  source={logoImage} 
                  className="w-20 h-20" 
                  resizeMode="contain" 
                />
              </View>
              
              {/* Welcome Text */}
              <View className="items-center">
                <Text className="text-4xl text-white font-bold mb-3 tracking-wide">
                  HIV Care Hub
                </Text>
                <Text className="text-lg text-white/90 font-medium mb-4">
                  Đăng nhập hệ thống
                </Text>
                <Text className="text-white/80 text-sm text-center leading-6 px-4">
                  Vui lòng đăng nhập để truy cập vào hệ thống 
                </Text>
              </View>
            </View>

            {/* Form Section */}
            <View className="bg-white rounded-3xl p-8 mx-4 shadow-2xl border border-gray-100">
              
              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-gray-700 text-sm font-semibold mb-3">
                  Email
                </Text>
                <View className="relative">
                  <View className="absolute left-4 top-4 z-10">
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  </View>
                  <TextInput
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 text-gray-800 text-base font-medium focus:border-blue-500"
                    placeholder="example@hospital.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError("");
                    }}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                    }}
                  />
                </View>
                {emailError ? (
                  <View className="flex-row items-center mt-2 ml-1">
                    <Ionicons name="alert-circle" size={16} color="#EF4444" />
                    <Text className="text-red-500 text-sm ml-2">{emailError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Password Input */}
              <View className="mb-8">
                <Text className="text-gray-700 text-sm font-semibold mb-3">
                  Mật khẩu
                </Text>
                <View className="relative">
                  <View className="absolute left-4 top-4 z-10">
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  </View>
                  <TextInput
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 text-gray-800 text-base font-medium focus:border-blue-500"
                    placeholder="Nhập mật khẩu của bạn"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError("");
                    }}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                    }}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <View className="flex-row items-center mt-2 ml-1">
                    <Ionicons name="alert-circle" size={16} color="#EF4444" />
                    <Text className="text-red-500 text-sm ml-2">{passwordError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className="w-full h-14 bg-blue-600 rounded-xl justify-center items-center shadow-lg mb-4"
                onPress={handleLogin}
                disabled={isLoading}
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="text-white font-bold text-base ml-3">
                      Đang đăng nhập...
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                    <Text className="text-white font-bold text-base ml-2">
                      Đăng nhập
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity className="items-center">
                <Text className="text-blue-600 text-sm font-medium">
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View className="items-center mt-8 mb-8">
              <View className="flex-row items-center">
                <Text className="text-white/90 text-sm">Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/register")}>
                  <Text className="text-white font-bold text-sm underline">
                    Đăng ký ngay
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
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
