import axiosClient from '../../configs/axiosClient';

export const getAppointmentPatient = async (userId, page = 1, limit = 100000) => {
  try {
    const response = await axiosClient.get(`/appointments/user/${userId}?page=${page}&limit=${limit}`);
    
    return response;
  } catch (error) {
    throw error; 
  }
};
