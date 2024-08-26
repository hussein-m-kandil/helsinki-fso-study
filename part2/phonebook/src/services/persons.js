import axios from "axios";

const URL = "http://localhost:3001/persons";

const resolve = (r) => r.data;

const getAll = () => axios.get(URL).then(resolve);

const add = (entry) => axios.post(URL, entry).then(resolve);

const update = (id, entry) => axios.put(`${URL}/${id}`, entry).then(resolve);

const del = (id) => axios.delete(`${URL}/${id}`);

export default {
  getAll,
  add,
  update,
  del,
};
