import axios from 'axios';

const BASE_URL = '/api/blogs';

const request = (type, url, ...args) => {
  return axios[type](url, ...args).then((res) => res.data);
};

const authorizedRequest = (type, url, body, token) => {
  return request(type, url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  getAll: () => request('get', BASE_URL),
  post: (body, token) => authorizedRequest('post', BASE_URL, body, token),
};
