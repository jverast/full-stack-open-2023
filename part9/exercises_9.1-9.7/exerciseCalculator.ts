interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (daylyExcr: number[], target: number): Result => {
  const periodLength: number = daylyExcr.length;
  const trainingDays: number = daylyExcr.filter((n) => n).length;
  const hoursTraining: number = daylyExcr.reduce((sum, n) => sum + n, 0);
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
