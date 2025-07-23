import { NonSensitivePatientData, NewPatitent, Patient } from '../types';
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

function addNewPatitent(newPatitentData: NewPatitent): Patient {
  const patient = { ...newPatitentData, id: uuid() };
  patients.push(patient);
  return patient;
}

export default {
  getNonSensitivePatientData,
  addNewPatitent,
};
