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

const Input = <T extends string | number | undefined | ''>({
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
        <label className="mb-1 block text-sm" htmlFor={`${name}-field`}>
          {label}
        </label>
      )}
      <input
        className="rounded px-4 py-2 text-stone-500 caret-stone-500 outline-stone-500"
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
