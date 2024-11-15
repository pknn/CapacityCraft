import { ChangeEvent } from 'react';
import CoreComponentProps from './CoreComponentProps';

type InputProps<T> = {
  value: T;
  onValueChange: (value: T) => void;
  label?: string;
  name: string;
  placeholder: string;
} & CoreComponentProps;

const Input = <T extends string | number | ''>({
  className,
  value,
  onValueChange,
  label,
  name,
  placeholder,
}: InputProps<T>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value as T);
  };

  return (
    <div className={`my-4 ${className}`}>
      {label && label.length > 0 && (
        <label htmlFor={`${name}-field`}>Room ID</label>
      )}
      <input
        className="px-4 py-2 rounded caret-stone-500 outline-stone-500 text-stone-500"
        id={`${name}-field`}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
