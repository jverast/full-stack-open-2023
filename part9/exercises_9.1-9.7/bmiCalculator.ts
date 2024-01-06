import { isNumber } from './utils';

interface ArgValues {
  value1: number;
  value2: number;
}

export const parseArgs = (args: string[]): ArgValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (isNumber([args[2], args[3]])) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateBmi = (h: number, w: number): string => {
  const bmi: number = w / (h / 100) ** 2;

  if (bmi <= 16) {
    return 'Underweight (Severe thinness)';
  } else if (bmi > 16.0 && bmi <= 17.0) {
    return 'Underweight (Moderate thinness)';
  } else if (bmi > 17.0 && bmi <= 18.5) {
    return 'Underweight (Mild thinness)';
  } else if (bmi > 18.5 && bmi <= 25.0) {
    return 'Normal (healthy weight)';
  } else if (bmi > 25.0 && bmi <= 30.0) {
    return 'Overweight (Pre-obese)';
  } else if (bmi > 30.0 && bmi <= 35.0) {
    return 'Obese (Class I)';
  } else if (bmi > 35.0 && bmi <= 40.0) {
    return 'Obese (Class II)';
  } else {
    return 'Obese (Class III)';
  }
};

try {
  const { value1, value2 } = parseArgs(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
