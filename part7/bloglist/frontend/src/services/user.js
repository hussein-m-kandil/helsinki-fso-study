import axios from 'axios';

const returnResData = (res) => res.data;

export default {
  getAll: () => axios.get('/api/users').then(returnResData),
  getOne: (id) => axios.get(`/api/users/${id}`).then(returnResData),
  login: (body) => axios.post('/api/login', body).then(returnResData),
};
