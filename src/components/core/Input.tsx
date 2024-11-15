import { ChangeEvent, InputHTMLAttributes } from 'react';
import CoreComponentProps from './CoreComponentProps';

type InputProps<T> = {
  value: T;
  onValueChange: (value: T) => void;
  label?: string;
  name: string;
  placeholder: string;
  type: InputHTMLAttributes<HTMLInputElement>['type'];
} & CoreComponentProps;

const Input = <T extends string | number | ''>({
  className,
  value,
  onValueChange,
  label,
  name,
  placeholder,
  type,
}: InputProps<T>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value as T);
  };

  return (
    <div className={`my-4 ${className}`}>
      {label && label.length > 0 && (
        <label className="" htmlFor={`${name}-field`}>
          {label}
        </label>
      )}
      <input
        className="px-4 py-2 rounded caret-stone-500 outline-stone-500 text-stone-500"
        id={`${name}-field`}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
