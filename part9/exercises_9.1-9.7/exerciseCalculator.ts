import { isNumber, toNumber } from './utils';

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export type Exercises = number[];

export const parseArgs = (args: string[]): number[] => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const [, , ...argsn]: string[] = args;
  if (isNumber(argsn)) {
    return [...toNumber(argsn)];
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateExercises = (
  daylyExercises: number[],
  target: number
): Result => {
  const periodLength: number = daylyExercises.length;
  const trainingDays: number = daylyExercises.filter((n) => n).length;
  const hoursTraining: number = daylyExercises.reduce((sum, n) => sum + n, 0);
  const average: number = hoursTraining / periodLength;
  const success: boolean = average > target ? true : false;

  let rating: number;
  let ratingDescription: string;

  if (average < target) {
    rating = 1;
    ratingDescription = 'Frequently fell short of the target training hours';
  } else if (average === target) {
    rating = 2;
    ratingDescription = 'Met the target training hours most of the time';
  } else {
    rating = 3;
    ratingDescription = 'Consistently exceeded the target training hours';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  // const [target, ...daylyExcr] = parseArgs(process.argv);
  // console.log(calculateExercises(daylyExcr, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
