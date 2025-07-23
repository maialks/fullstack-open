import { Gender, NewPatitent } from './types';
import z from 'zod';

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

const toNewPatient = (object: unknown): NewPatitent => {
  return newPatientSchema.parse(object);
};

export default {
  toNewPatient,
};
