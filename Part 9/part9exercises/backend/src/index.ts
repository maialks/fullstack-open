import express from 'express';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.on('finish', () => {
    const formattedTime = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    console.log(
      `[${formattedTime}]: ${req.method} - ${res.statusCode} (${req.originalUrl})`
    );
  });
  next();
});
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

const PORT = 3000;

app.get('/ping', (_req, res) => res.send('pong'));

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
