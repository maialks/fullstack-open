import { Diagnose } from '../types';
import diagnoses from '../../data/diagnoses';

function getDiagnoses(): Diagnose[] {
  return diagnoses;
}

export default {
  getDiagnoses,
};
