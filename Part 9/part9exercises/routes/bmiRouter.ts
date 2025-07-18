import express from 'express';
import { calculateBmi } from '../features/calculators/bmiCalculator';
const bmiRouter = express.Router();

bmiRouter.get('/', (request, response): void => {
  const { height: inputHeight, weight: inputWeight } = request.query;

  if (!inputHeight || !inputWeight) {
    response.status(400).send({ error: 'missing parameters' });
    return;
  }

  const height = Number(inputHeight);
  const weight = Number(inputWeight);
  if (isNaN(height) || isNaN(weight)) {
    response.status(400).send({ error: 'malformatted parameters' });
    return;
  }

  response.send({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

export default bmiRouter;
