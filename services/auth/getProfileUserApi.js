import axiosClient from '../../configs/axiosClient';

export const getProfileUserApi = async () => {
  try {
    const response = await axiosClient.get('/auth/profile');
    return response;
  } catch (error) {
    console.error('Login API Error:', error.response?.data || error.message);
    throw error; 
  }
};
