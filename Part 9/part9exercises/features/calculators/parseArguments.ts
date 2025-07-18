export interface Result {
  value1: number | number[]
  value2: number
}

export default function parseArguments(args: string[]): Result {
  const [arg1, arg2] = args.slice(2);

  if (!arg1 || !arg2) throw new Error('Not enough arguments');

  const parsedValue2 = Number(arg2);
  if (isNaN(parsedValue2)) throw new Error('Second value must be a number');

  if (!isNaN(Number(arg1))) {
    return {
      value1: Number(arg1),
      value2: parsedValue2,
    };
  }

  const numberArray = arg1.trim().split(/\s+/).map(Number);
  if (!numberArray.some((n) => isNaN(n))) {
    return {
      value1: numberArray,
      value2: parsedValue2,
    };
  }

  throw new Error(
    'First value must be a number or a space-separated list of numbers'
  );
}
