import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // Dùng để lưu token

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// ✅ Thêm interceptor để tự động gắn token
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
