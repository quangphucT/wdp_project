import axiosClient from '../../configs/axiosClient';

export const getAllAppointmentStaffApi = async () => {
  try {
    const response = await axiosClient.get('/appointments/staff?page=1&limit=20000');
    return response;
  } catch (error) {
    console.error('Get Appointment Staff API Error:', error.response?.data || error.message);
    throw error; 
  }
};
