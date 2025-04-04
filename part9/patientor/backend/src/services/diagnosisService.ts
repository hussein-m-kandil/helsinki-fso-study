import diagnoses from '../data/diagnoses';
import { Diagnosis } from '../types';

export default {
  getAllDiagnoses(): Diagnosis[] {
    return diagnoses;
  },
};
