import {
  NonSensitivePatientData,
  NewPatitent,
  Patient,
  Entry,
  EntryWithoutId,
} from '../types';
import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

function getNonSensitivePatientData(): NonSensitivePatientData[] {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
}

function addNewPatient(newPatitentData: NewPatitent): Patient {
  const patient = { ...newPatitentData, id: uuid(), entries: [] };
  patients.push(patient);
  return patient;
}

function findPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

const addEntryToPatient = (
  patientId: string,
  entry: EntryWithoutId
): Patient | undefined => {
  const patient = findPatient(patientId);
  if (!patient) return undefined;

  const newEntry: Entry = {
    ...entry,
    id: uuid(),
  };

  patient.entries.push(newEntry);

  return patient;
};

export default {
  getNonSensitivePatientData,
  addEntryToPatient,
  addNewPatient,
  findPatient,
};
