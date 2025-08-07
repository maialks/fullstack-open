import express, { Response, Request } from 'express';
import { Diagnosis } from '../types';
import diagnosesService from '../services/diagnosesService';
const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

router.get(
  '/:code',
  (req: Request<{ code: string }>, res: Response<Diagnosis>) => {
    const response = diagnosesService.findDiagnosis(req.params.code);
    if (response !== undefined) {
      res.send(response);
    } else {
      res.status(404).send();
    }
  }
);

export default router;
