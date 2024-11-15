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
    className={`bg-stone-500 hover:bg-stone-400 px-4 py-2 rounded text-stone-100 ${className}`}
    type="button"
  >
    {children}
  </button>
);

export default Button;
