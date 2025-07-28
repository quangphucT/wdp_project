import axiosClient from '../../configs/axiosClient';

export const bookAppointmentApi = async (appointmentData) => {
  try {
    
    
    const response = await axiosClient.post('/appointments', appointmentData);
    
  
    
    return response;
  } catch (error) {
   
    
    // Thêm thông tin cụ thể cho timeout
    if (error.code === 'ECONNABORTED') {
      console.error('❌ REQUEST TIMEOUT - Server không phản hồi trong 30s');
    }
    
    throw error; 
  }
};
