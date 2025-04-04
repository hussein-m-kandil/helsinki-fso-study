import { EntryType, Gender, HealthCheckRating } from './types';
import z from 'zod';

export class AppError extends Error {
  statusCode: number;

  constructor(name: string, msg: string, statusCode: number) {
    super(msg);
    this.name = name;
    this.statusCode = statusCode;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

export const NewPatientSchema = z.object({
  ssn: z.string().nonempty(),
  name: z.string().nonempty(),
  gender: z.nativeEnum(Gender),
  occupation: z.string().nonempty(),
  dateOfBirth: z.string().date(),
});

const NewEntryBaseSchema = z.object({
  date: z.string().date(),
  specialist: z.string().nonempty(),
  description: z.string().nonempty(),
  diagnosisCodes: z.array(z.string().nonempty()).optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  NewEntryBaseSchema.extend({
    type: z.literal(EntryType.HealthCheck),
    healthCheckRating: z.nativeEnum(HealthCheckRating),
  }),
  NewEntryBaseSchema.extend({
    type: z.literal(EntryType.Hospital),
    discharge: z.object({
      criteria: z.string().nonempty(),
      date: z.string().date(),
    }),
  }),
  NewEntryBaseSchema.extend({
    type: z.literal(EntryType.OccupationalHealthcare),
    employerName: z.string().nonempty(),
    sickLeave: z
      .object({
        startDate: z.string().date(),
        endDate: z.string().date(),
      })
      .optional(),
  }),
]);

export const isNumber = (x: unknown): x is number => {
  return typeof x === 'number' || x instanceof Number;
};
