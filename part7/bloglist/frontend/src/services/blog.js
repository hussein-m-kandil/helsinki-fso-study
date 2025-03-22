import axios from 'axios';

const request = async (method, url, token, data) => {
  const baseURL = '/api/blogs';
  const config = { baseURL, method, url };
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
    config.data = data;
  }
  return (await axios(config)).data;
};

export default {
  getAll: () => request('get', '/'),
  post: (blog, token) => request('post', '/', token, blog),
  put: (blog, token) => request('put', `/${blog.id}`, token, blog),
  delete: (blog, token) => request('delete', `/${blog.id}`, token),
  comment: (comment, blog, token) => {
    return request('post', `/${blog.id}/comments`, token, { comment });
  },
};
