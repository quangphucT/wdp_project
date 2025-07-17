import axiosClient from '../../configs/axiosClient';

export const getAppointmentPatient = async (userId) => {
  try {
    console.log('Fetching appointments for user ID:', userId);
    const response = await axiosClient.get(`/appointments/user/${userId}`);
    console.log('Appointments API Response:', response.data);
    return response;
  } catch (error) {
    console.error('Get Appointments API Error:', error.response?.data || error.message);
    throw error; 
  }
};
