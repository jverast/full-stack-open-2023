import express from 'express';
import { parseArgs } from './utils';
import { calculateBmi } from './bmiCalculator';

const app = express();
const PORT = 3003;

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  try {
    if (typeof height === 'string' && typeof weight === 'string') {
      const [h, w]: number[] = parseArgs([height, weight]);
      const bmi: string = calculateBmi(h, w);
      res.json({ weight, height, bmi });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      res.json({ error: 'malformatted parameters' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
