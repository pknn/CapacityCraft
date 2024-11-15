import { PropsWithChildren } from 'react';
import CoreComponentProps from './CoreComponentProps';

type ButtonProps = {
  onClick?: () => void;
} & CoreComponentProps;

const Button = ({
  children,
  className,
  onClick,
}: PropsWithChildren<ButtonProps>) => (
  <button
    onClick={onClick}
    className={`rounded bg-stone-500 px-4 py-2 text-stone-100 hover:bg-stone-400 ${className}`}
    type="button"
  >
    {children}
  </button>
);

export default Button;
