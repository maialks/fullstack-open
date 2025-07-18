import express from 'express';
import {
  calculateExercises,
  Result,
} from '../features/calculators/exerciseCalculator';
const exercisesRouter = express.Router();

exercisesRouter.post('/', (req, res) => {
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target)
    res.status(400).send({ error: 'parameters missing' });

  if (isNaN(target))
    res
      .status(400)
      .send({ error: 'malformatted parameters, target must be a number' });

  if (!Array.isArray(daily_exercises) || daily_exercises.some((v) => isNaN(v)))
    res.status(400).send({
      error:
        'malformatted parameters, daily exercises must be an array of number',
    });

  const result: Result = calculateExercises(daily_exercises, target);
  res.send(result);
});

export default exercisesRouter;
