import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Store quản lý trạng thái xác thực người dùng
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setIsLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),

      /**
       * Đăng nhập người dùng
       * @param {Object} loginData - Dữ liệu đăng nhập từ API
       */
      login: async (loginData) => {
        try {
          set({ isLoading: true, error: null });
          
          const { accessToken, refreshToken, user } = loginData;
          
          // Lưu token vào SecureStore
          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('refreshToken', refreshToken);
          
          // Cập nhật state
          set({ 
            isAuthenticated: true,
            accessToken,
            refreshToken,
            user,
            isLoading: false
          });
          
          return true;
        } catch (error) {
          console.error("Login Error:", error);
          set({ 
            error: error.message,
            isLoading: false
          });
          return false;
        }
      },

      /**
       * Kiểm tra trạng thái xác thực
       * @param {Function} router - Router instance từ expo-router
       * @param {string} redirectPath - Đường dẫn chuyển hướng khi chưa đăng nhập
       */
      checkAuth: async (router, redirectPath = "/auth/login") => {
        try {
          set({ isLoading: true, error: null });
          
          // Ưu tiên dùng token trong store nếu có
          let token = get().accessToken;
          
          // Nếu không có trong store, thử lấy từ SecureStore
          if (!token) {
            token = await SecureStore.getItemAsync("accessToken");
            
            if (token) {
              // Nếu có token trong SecureStore nhưng không có trong store,
              // cập nhật store
              const refreshToken = await SecureStore.getItemAsync("refreshToken");
              set({ 
                accessToken: token,
                refreshToken: refreshToken || null
              });
            }
          }
          
          if (!token) {
            set({ isAuthenticated: false, user: null });
            if (router) {
              router.replace(redirectPath);
            }
            return false;
          } else {
            // Nếu chưa có thông tin user nhưng có token, có thể gọi API lấy thông tin user ở đây
            set({ isAuthenticated: true });
            return true;
          }
        } catch (error) {
          console.error("Authentication check error:", error);
          set({ error: error.message, isAuthenticated: false, user: null });
          if (router) {
            router.replace(redirectPath);
          }
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Đăng xuất người dùng
       * @param {Function} router - Router instance từ expo-router
       * @param {string} redirectPath - Đường dẫn chuyển hướng sau khi đăng xuất
       */
      logout: async (router, redirectPath = "/auth/login") => {
        try {
          set({ isLoading: true, error: null });
          
          // Xoá token trong SecureStore
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          
          // Cập nhật state
          set({ 
            isAuthenticated: false, 
            user: null,
            accessToken: null,
            refreshToken: null 
          });
          
          // Điều hướng
          if (router) {
            router.replace(redirectPath);
          }
          
          return true;
        } catch (error) {
          console.error("Logout Error:", error);
          set({ error: error.message });
          return false;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage', // tên của storage
      storage: createJSONStorage(() => AsyncStorage), // adapter với AsyncStorage
      partialize: (state) => ({
        // chỉ lưu những state cần thiết
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;
