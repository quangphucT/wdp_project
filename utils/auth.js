import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';

/**
 * Custom hook để sử dụng trong các component React
 * @param {Function} router - Router instance từ expo-router
 * @param {string} redirectPath - Đường dẫn chuyển hướng khi chưa đăng nhập
 * @returns {Object} - Trạng thái xác thực
 */
export const useAuthCheck = (router, redirectPath = "/auth/login") => {
  // Sử dụng Zustand store
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Gọi action từ store
    checkAuth(router, redirectPath);
  }, [checkAuth, router, redirectPath]);

  return { isAuthenticated, isLoading };
};
