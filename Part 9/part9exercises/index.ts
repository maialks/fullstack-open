import express from 'express';
import bmiRouter from './routes/bmiRouter';
import exercisesRouter from './routes/exercisesRouter';
const app = express();

app.use(express.json());
app.use('/bmi', bmiRouter);
app.use('/exercises', exercisesRouter);
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
