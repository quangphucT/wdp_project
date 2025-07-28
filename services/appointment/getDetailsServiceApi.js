import axiosClient from '../../configs/axiosClient';

export const getDetailsServiceApi = async (serviceId) => {
  try {
    const response = await axiosClient.get(`/services/${serviceId}`);
    return response;
  } catch (error) {
    console.error('Login API Error:', error.response?.data || error.message);
    throw error; 
  }
};
