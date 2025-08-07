import {
  EntryWithoutId,
  Gender,
  HealthCheckRating,
  NewPatitent,
} from './types';
import z from 'zod';
import diagnoses from '../data/diagnoses';

const getDiagnosisCodes = () => diagnoses.map((d) => d.code);

const entryBaseSchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z
    .array(
      z.string().refine(
        (code) => {
          const diagnosesCodes = getDiagnosisCodes();
          return diagnosesCodes.includes(code);
        },
        { message: 'código de diagnóstico inválido' }
      )
    )
    .optional(),
});

const newEntryBaseSchema = entryBaseSchema.omit({ id: true });

const newHospitalEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({ date: z.iso.date(), criteria: z.string() }),
});

const newHealthCheckEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.enum(HealthCheckRating),
});

const newOccupationalEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({ startDate: z.iso.date(), endDate: z.iso.date() })
    .optional(),
});

export const newEntrySchema = z.discriminatedUnion('type', [
  newHospitalEntrySchema,
  newOccupationalEntrySchema,
  newHealthCheckEntrySchema,
]);

export const patientBaseSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

const toNewPatient = (object: unknown): NewPatitent => {
  return patientBaseSchema.parse(object);
};

const toNewEntry = (object: unknown): EntryWithoutId => {
  return newEntrySchema.parse(object);
};

export default {
  toNewPatient,
  toNewEntry,
};
