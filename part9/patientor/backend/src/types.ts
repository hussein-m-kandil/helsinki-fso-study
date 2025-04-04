// Define special omit for unions
// https://github.com/microsoft/TypeScript/issues/42680
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type DiagnosisCode = Diagnosis['code'];

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: DiagnosisCode[];
}

export enum EntryType {
  'OccupationalHealthcare' = 'OccupationalHealthcare',
  'HealthCheck' = 'HealthCheck',
  'Hospital' = 'Hospital',
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: {
    date: string;
    criteria: string;
  };
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export type Entry =
  | HospitalEntry
  | HealthCheckEntry
  | OccupationalHealthcareEntry;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export enum Gender {
  male = 'male',
  female = 'female',
}

export interface PatientBase {
  name: string;
  gender: Gender;
  occupation: string;
  dateOfBirth: string;
  entries: Entry[];
}

export interface NewPatient extends PatientBase {
  ssn: string;
}

export interface PublicPatient extends PatientBase {
  id: string;
}

// Watch out when intersecting multiple interfaces defined with the same name
// https://www.typescriptlang.org/docs/handbook/2/objects.html#interface-extension-vs-intersection
export type Patient = PublicPatient & NewPatient;
