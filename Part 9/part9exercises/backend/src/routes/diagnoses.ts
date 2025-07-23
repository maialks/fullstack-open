import express, { Response } from 'express';
import { Diagnose } from '../types';
import diagnosesService from '../services/diagnosesService';
const router = express.Router();

router.get('/', (_req, res: Response<Diagnose[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

export default router;
