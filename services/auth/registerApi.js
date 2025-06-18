import axiosClient from '../../configs/axiosClient';


export const registerApi = async (values) => {
  try {
    const response = await axiosClient.post('/auth/register', values);
    return response;
  } catch (error) {
    const apiError = error.response?.data;

    // Nếu có message dạng object chứa mảng errors
    if (apiError?.message?.errors) {
      const firstError = apiError.message.errors[0];
      const message = `${firstError?.path}: ${firstError?.message}`;
      throw new Error(message); // VD: "email: Invalid email"
    }

    // Nếu có message dạng string
    if (typeof apiError?.message === 'string') {
      throw new Error(apiError.message);
    }

    // Fallback: lỗi không xác định
    throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
  }
};
