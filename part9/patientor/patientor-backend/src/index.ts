import express from 'express';
import cors from 'cors';

import diagnosesRouter from './routes/diagnoses';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
