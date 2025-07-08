import axiosClient from '../../configs/axiosClient';

const getAppointmentDoctor = {
  getAppointmentDoctor: (doctor_id, params = {}) => {
    const searchParams = new URLSearchParams();
    
    // Thêm các filter parameters nếu có
    if (params.dateFrom) {
      searchParams.append('dateFrom', params.dateFrom);
    }
    if (params.dateTo) {
      searchParams.append('dateTo', params.dateTo);
    }
    if (params.status) {
      searchParams.append('status', params.status);
    }
    if (params.page) {
      searchParams.append('page', params.page);
    }
    if (params.limit) {
      searchParams.append('limit', params.limit);
    }
    
    const queryString = searchParams.toString();
    const url = `/appointments/doctor/${doctor_id}${queryString ? `?${queryString}` : ''}`;
    
    return axiosClient.get(url);
  },
};

export default getAppointmentDoctor;