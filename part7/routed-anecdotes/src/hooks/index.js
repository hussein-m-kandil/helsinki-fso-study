import { useState } from 'react';

export const useField = (name, type = 'text') => {
  const [value, setValue] = useState('');
  const onChange = ({ target }) => setValue(target.value);
  const reset = () => setValue('');
  return { name, type, value, onChange, reset };
};
