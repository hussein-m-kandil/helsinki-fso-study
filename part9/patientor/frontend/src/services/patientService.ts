import axios from 'axios';
import { Entry, EntryWithoutId, Patient, PatientFormValues } from '../types';

import { apiBaseUrl as baseUrl } from '../constants';

export default {
  async getAll() {
    return (await axios.get<Patient[]>(`${baseUrl}/patients`)).data;
  },

  async getOne(id: string) {
    return (await axios.get<Patient>(`${baseUrl}/patients/${id}`)).data;
  },

  async create(patient: PatientFormValues) {
    return (await axios.post<Patient>(`${baseUrl}/patients`, patient)).data;
  },

  async createEntry(id: string, NewEntry: EntryWithoutId) {
    const url = `${baseUrl}/patients/${id}/entries`;
    return (await axios.post<Entry>(url, NewEntry)).data;
  },
};
