export const isNumber = (args: string[] | number[]): boolean => {
  return args.every((arg) => !isNaN(Number(arg))) ? true : false;
};

export const toNumber = (args: string[]): number[] => {
  return args.map((arg) => Number(arg));
};

export const parseArgs = (args: string[]): number[] => {
  if (!isNumber(args)) {
    throw new Error('Provided values were not numbers!');
  }
  return args.map((arg) => Number(arg));
};
