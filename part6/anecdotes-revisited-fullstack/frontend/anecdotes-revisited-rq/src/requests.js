import axios from 'axios';

const BASE_URL = '/api/anecdotes';

export const getAnecdotes = async () => {
  return (await axios.get(BASE_URL)).data;
};

export const postAnecdote = async (anecdote) => {
  return (await axios.post(BASE_URL, anecdote)).data;
};

export const putAnecdote = async (anecdote) => {
  return (await axios.put(`${BASE_URL}/${anecdote.id}`, anecdote)).data;
};

export const deleteAnecdote = async (id) => {
  return (await axios.delete(`${BASE_URL}/${id}`)).data;
};
