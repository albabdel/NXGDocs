import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[--ifm-color-primary] text-white hover:brightness-110 active:brightness-95',
        secondary: 'bg-[--glass-bg] border border-[--glass-border] text-[--text-primary] hover:bg-[--glass-bg-hover] hover:border-[--glass-border-hover]',
        ghost: 'text-[--gold-text] hover:bg-[--gold-bg] active:bg-[--gold-bg-hover]',
        destructive: 'bg-[--color-danger] text-white hover:brightness-110 active:brightness-95',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
