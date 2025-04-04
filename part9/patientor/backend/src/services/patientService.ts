import { AppError } from '../utils';
import { v4 as uuid } from 'uuid';
import {
  Entry,
  EntryWithoutId,
  NewPatient,
  Patient,
  PublicPatient,
} from '../types';
import patients from '../data/patients';

export default {
  getAllPatients(): PublicPatient[] {
    return patients.map(({ ssn: _, ...patient }) => patient);
  },
  findOnePatientById(id: string): Patient | undefined {
    return patients.find((p) => p.id === id);
  },
  addOnePatient(newPatient: NewPatient): Patient {
    const addedPatient = { id: uuid(), ...newPatient };
    if (!addedPatient.entries) addedPatient.entries = [];
    patients.push(addedPatient);
    return addedPatient;
  },
  addEntry(patientId: string, entry: EntryWithoutId): Entry {
    const patient = this.findOnePatientById(patientId);
    if (!patient) {
      throw new AppError('Validation Error', 'invalid patient id', 400);
    }
    const addedEntry = { id: uuid(), ...entry };
    patient.entries.push(addedEntry);
    return addedEntry;
  },
};
