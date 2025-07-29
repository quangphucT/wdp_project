import axiosClient from '../../configs/axiosClient';

export const getAllDoctorApi = async (doctor_id) => {
  try {
    const response = await axiosClient.get(`/doctors/${doctor_id}`);
    return response;
  } catch (error) {
    console.error('Get All Doctors API Error:', error.response?.data || error.message);
    throw error;
  }
};
