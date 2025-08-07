import express, { Response, Request } from 'express';
import { NonSensitivePatientData, Patient } from '../types';
import patientServices from '../services/patientServices';
import utils from '../utils';
const router = express.Router();
import z from 'zod';

router.get('/', (_req, res: Response<NonSensitivePatientData[]>) => {
  res.send(patientServices.getNonSensitivePatientData());
});

router.get(
  '/:id',
  (req: Request<{ id: string }>, res: Response<Patient | void>) => {
    const patientData = patientServices.findPatient(req.params.id);
    if (patientData === undefined) {
      res.status(404).send();
    } else {
      res.send(patientData);
    }
  }
);

router.post(
  '/:id/entries',
  (
    req: Request<{ id: string }>,
    res: Response<Patient | { error: string | z.core.$ZodIssue[] }>
  ) => {
    const patient = patientServices.findPatient(req.params.id);

    if (patient === undefined) {
      return res.status(404).send({ error: 'patient not found' });
    }

    try {
      const newEntry = utils.toNewEntry(req.body);
      const updatedPatient = patientServices.addEntryToPatient(
        req.params.id,
        newEntry
      );
      return res.status(201).json(updatedPatient);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).send({ error: error.issues });
      }
      if (error instanceof Error) {
        return res.status(400).send({ error: error.message });
      }
      return res.status(400).send({ error: 'an unknown error occurred' });
    }
  }
);

router.post('/', (req, res) => {
  try {
    const newPatitent = utils.toNewPatient(req.body);
    const addedPatitent = patientServices.addNewPatient(newPatitent);
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
