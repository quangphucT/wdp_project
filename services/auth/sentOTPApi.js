import axiosClient from '../../configs/axiosClient';

export const sentOTPApi = async (email) => {
  try {
    const response = await axiosClient.post('/auth/sent-otp', {
      email: email,
      type: "REGISTER"
    });
    return response;
  } catch (error) {
    console.error('Send OTP API Error:', error.response?.data || error.message);
    throw error; 
  }
};
