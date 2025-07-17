import axiosClient from '../../configs/axiosClient';

export const getPatientMedicalRecordApi = async (patientId) => {
  try {
    const response = await axiosClient.get(`/patient-treatments/patient/${patientId}`);
    return response;
  } catch (error) {
    console.error('Login API Error:', error.response?.data || error.message);
    throw error; 
  }
};
