import parseArguments from './parseArguments';
type Result = 'underweight' | 'healthy' | 'overweight' | 'obese';

export function calculateBmi(heigth: number, weight: number): Result | void {
  try {
    const bmi = Number(weight) / Number(heigth) ** 2;
    switch (true) {
      case bmi < 18.5:
        return 'underweight';
      case bmi >= 18.5 && bmi < 25:
        return 'healthy';
      case bmi >= 25 && bmi < 30:
        return 'overweight';
      case bmi >= 30:
        return 'obese';
      default:
        throw new Error('invalid bmi');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
}

if (require.main === module) {
  try {
    const { value1, value2 } = parseArguments(process.argv);
    if (typeof value1 === 'number') {
      console.log(calculateBmi(value1, value2));
    } else {
      throw new Error('both arguments must be single numbers');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('error:', err.message);
    }
  }
}
