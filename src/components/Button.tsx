import type { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  class?: string;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className={`inline-block rounded py-2.5 px-6 text-sm font-bold uppercase text-white bg-slate-600 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400 ${props.class}`} {...props}>
      { children }
    </button>
  )
}

export default Button;