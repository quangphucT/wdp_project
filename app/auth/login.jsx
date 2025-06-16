import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import logoImage from "../../assets/images/logo.png";
import { loginApi } from "../services/auth/loginApi";
const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
  
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi({email, password});
      if (res?.data?.data?.accessToken) {
        await SecureStore.setItemAsync("accessToken",res.data.data.accessToken);
         await SecureStore.setItemAsync("refreshToken",res.data.data.refreshToken);
      
        Alert.alert("Thành công", "Đăng nhập thành công!");
        router.replace("/"); // điều hướng sang Home
      } else {
        Alert.alert("Thất bại", "Thông tin đăng nhập không chính xác");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể đăng nhập. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#007bff", "#0056b3"]} style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.registerLink}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Back Home */}
      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.backHomeText}>← Về trang chủ</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 320,
    height: 90,
    marginBottom: 30,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  loginButtonText: {
    color: "#007bff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  registerText: {
    fontSize: 14,
    color: "#fff",
  },
  registerLink: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  backHomeText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
