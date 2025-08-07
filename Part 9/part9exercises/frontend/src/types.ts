export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;

export interface BaseEntry {
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

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: { date: string; criteria: string };
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  sickLeave?: { startDate: string; endDate: string };
  employerName: string;
}

export type Entry =
  | HospitalEntry
  | HealthCheckEntry
  | OccupationalHealthcareEntry;

export type UnionOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;
export type EntrySpecificsUinion = UnionOmit<Entry, keyof BaseEntry | 'type'>;

export type HospitalSpecific = Omit<HospitalEntry, keyof BaseEntry | 'type'>;
export type HealthCheckSpecific = Omit<
  HealthCheckEntry,
  keyof BaseEntry | 'type'
>;
export type OccupationalHealthcareSpecific = Omit<
  OccupationalHealthcareEntry,
  keyof BaseEntry | 'type'
>;
