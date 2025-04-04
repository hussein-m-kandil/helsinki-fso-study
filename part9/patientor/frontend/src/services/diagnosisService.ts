import axios from 'axios';
import { Diagnosis } from '../types';
import { apiBaseUrl as baseUrl } from '../constants';

export default {
  async getAll() {
    return (await axios.get<Diagnosis[]>(`${baseUrl}/diagnoses`)).data;
  },
};
