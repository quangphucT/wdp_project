import axiosClient from '../../configs/axiosClient';

export const getAllServiceApi = async () => {
  try {
    const response = await axiosClient.get('/services/public');
    return response;
  } catch (error) {
    console.error('Login API Error:', error.response?.data || error.message);
    throw error; 
  }
};
