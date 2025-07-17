import axiosClient from '../../configs/axiosClient';

export const updateProfileUserApi = async (profileData) => {
  try {
    const response = await axiosClient.patch('/auth/update-profile', profileData);
    return response;
  } catch (error) {
    console.error('Update Profile API Error:', error.response?.data || error.message);
    throw error; 
  }
};
