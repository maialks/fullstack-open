import parseArguments from './parseArguments';

type Rating = 1 | 2 | 3;
export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

const getRatingDescription = (rating: 1 | 2 | 3): string => {
  switch (rating) {
    case 3:
      return 'ótimo trabalho! Você superou o objetivo com maestria';
    case 2:
      return 'muito bom, mas você ficou um pouco abaixo da meta.';
    case 1:
      return 'o resultado ficou bem abaixo do esperado';
    default:
      return 'nota inválida.';
  }
};

export function calculateExercises(period: number[], target: number): Result {
  const average = period.reduce((acc, cur) => (acc += cur), 0) / period.length;
  const rating = average > target ? 3 : target - average > 0.5 ? 1 : 2;

  return {
    periodLength: period.length,
    trainingDays: period.filter((hours) => hours > 0).length,
    success: average >= target,
    rating,
    ratingDescription: getRatingDescription(rating),
    target,
    average,
  };
}

if (require.main === module) {
  try {
    const { value1, value2 } = parseArguments(process.argv);
    if (Array.isArray(value1) && typeof value2 === 'number') {
      console.log(calculateExercises(value1, value2));
    } else {
      throw new Error('first argument must be an array of numbers');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('error:', err.message);
    }
  }
}
