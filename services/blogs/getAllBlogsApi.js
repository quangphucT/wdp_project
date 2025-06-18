
import axiosClient from '../../configs/axiosClient';

const blogApi = {
  getAll: () => axiosClient.get('/blogs')
};

export default blogApi;