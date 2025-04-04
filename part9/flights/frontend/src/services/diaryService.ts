import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const BASE_URL = '/api/diaries';

export default {
  async getAll() {
    return (await axios.get<unknown>(BASE_URL)).data;
  },
  async addOne(diary: NewDiaryEntry) {
    return (await axios.post<DiaryEntry>(BASE_URL, diary)).data;
  },
};
