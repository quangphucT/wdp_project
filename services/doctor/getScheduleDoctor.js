
import axiosClient from '../../configs/axiosClient';

const getScheduleDoctorAll = {
  getScheduleDoctorAll: (doctor_id) => axiosClient.get(`/doctors/${doctor_id}/schedule`)
};

export default getScheduleDoctorAll;