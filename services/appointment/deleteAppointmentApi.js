import axiosClient from '../../configs/axiosClient';

export const deleteAppointmentApi = async (id) => {
  try {
    // Sử dụng PUT để cập nhật status thành CANCELLED thay vì DELETE
    const response = await axiosClient.put(`/appointments/status/${id}?autoEndExisting=false`, {
      status: "CANCELLED"
    });
    
    return response;
  } catch (error) {
    console.error('❌ Error cancelling appointment:', error);
    
    // Thêm thông tin cụ thể cho timeout
    if (error.code === 'ECONNABORTED') {
      console.error('❌ REQUEST TIMEOUT - Server không phản hồi trong 30s');
    }
    
    throw error; 
  }
};
