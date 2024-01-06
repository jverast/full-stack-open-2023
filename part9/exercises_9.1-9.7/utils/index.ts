export const isNumber = (args: string[]): boolean => {
  return args.every((arg) => !isNaN(Number(arg))) ? true : false;
};

export const toNumber = (args: string[]): number[] => {
  return args.map((arg) => Number(arg));
};
