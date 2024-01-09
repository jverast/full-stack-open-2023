import { useState } from 'react';

export const useField = (type: string) => {
  const [value, setValue] = useState('');

  const onChange = (event: { target: HTMLInputElement }): void => {
    setValue(event.target.id || event.target.value);
  };

  const reset = () => setValue('');

  return {
    type,
    value,
    onChange,
    reset
  };
};
