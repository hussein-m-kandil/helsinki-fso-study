import axios from 'axios';

const BASE_URL = '/api/anecdotes';

export default {
  async getAll() {
    return (await axios.get(BASE_URL)).data;
  },
  async postOne(anecdote) {
    return (await axios.post(BASE_URL, anecdote)).data;
  },
  async putOne(anecdote) {
    return (await axios.put(`${BASE_URL}/${anecdote.id}`, anecdote)).data;
  },
};
