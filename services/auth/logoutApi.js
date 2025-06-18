import axiosClient from '../../configs/axiosClient';

export const logoutApi = async (values) => {
  try {
    const response = await axiosClient.post('/auth/logout',values );
    return response;
  } catch (error) {
    console.error('Login API Error:', error.response?.data || error.message);
    throw error; // Cho phép nơi gọi biết lỗi để hiển thị thông báo phù hợp
  }
};
