import express from 'express';
import { parseArgs, isNumber } from './utils';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, Exercises } from './exerciseCalculator';

const app = express();
const PORT = 3003;

app.use(express.json());

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

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  const dailyExc = daily_exercises as Exercises;
  const tg = Number(target);

  if (!daily_exercises || !target)
    return res.status(400).json({ error: 'parameters missing' });
  if (!isNumber(dailyExc) || isNaN(tg))
    return res.status(400).json({ error: 'malformatted parameters' });

  const result = calculateExercises(dailyExc, tg);
  return res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
