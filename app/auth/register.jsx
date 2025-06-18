import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    <LinearGradient colors={['#007bff', '#0056b3']} style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} />
      </View>

      <Text style={styles.title}>Đăng ký tài khoản</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="name.."
        placeholderTextColor="#aaa"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
      />

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={form.phoneNumber}
        onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 300,
    height: 80,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  registerButtonText: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#fff',
  },
  loginLink: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
