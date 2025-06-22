
import axiosClient from '../../configs/axiosClient';

const getDetailBlogApi = {
  getDetailsBlog: (id) => axiosClient.get(`/blogs/${id}`)
};

export default getDetailBlogApi;