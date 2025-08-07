import { Diagnosis } from '../types';
import diagnoses from '../../data/diagnoses';

function getDiagnoses(): Diagnosis[] {
  return diagnoses;
}

function findDiagnosis(code: string): Diagnosis | undefined {
  return diagnoses.find((d) => d.code === code);
}

export default {
  getDiagnoses,
  findDiagnosis,
};
