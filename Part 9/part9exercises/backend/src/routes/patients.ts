import express, { Response } from 'express';
import { NonSensitivePatientData } from '../types';
import patientServices from '../services/patientServices';
import utils from '../utils';
const router = express.Router();
import z from 'zod';

router.get('/', (_req, res: Response<NonSensitivePatientData[]>) => {
  res.send(patientServices.getNonSensitivePatientData());
});

router.post('/', (req, res) => {
  try {
    const newPatitent = utils.toNewPatient(req.body);
    const addedPatitent = patientServices.addNewPatitent(newPatitent);
    res.send(addedPatitent);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

export default router;
