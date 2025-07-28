import axiosClient from '../../configs/axiosClient';

export const getAllDoctorApi = async () => {
  try {
    const response = await axiosClient.get('/doctors');
    return response;
  } catch (error) {
    console.error('Get All Doctors API Error:', error.response?.data || error.message);
    throw error;
  }
};
