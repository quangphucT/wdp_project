import axiosClient from '../../configs/axiosClient';

export const getAppointmentPatient = async (userId, page = 1, limit = 100000) => {
  try {
    console.log('Fetching appointments for user ID:', userId, 'with pagination:', { page, limit });
    const response = await axiosClient.get(`/appointments/user/${userId}?page=${page}&limit=${limit}`);
    console.log('Appointments API Response:', response.data);
    return response;
  } catch (error) {
    console.error('Get Appointments API Error:', error.response?.data || error.message);
    throw error; 
  }
};
