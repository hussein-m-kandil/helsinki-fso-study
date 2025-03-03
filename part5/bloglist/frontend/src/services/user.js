import axios from 'axios';

export default {
  login: (body) => axios.post('/api/login', body).then((res) => res.data),
};
