export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatientData = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatitent = Omit<Patient, 'id' | 'entries'>;

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export const entryTypes = [
  'Hospital',
  'HealthCheck',
  'OccupationalHealthcare',
] as const;

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: { date: string; criteria: string };
}

interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  sickLeave?: { startDate: string; endDate: string };
  employerName: string;
}

export type Entry =
  | HospitalEntry
  | HealthCheckEntry
  | OccupationalHealthcareEntry;

type UnionOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;
