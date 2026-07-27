import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 text-sm font-medium rounded-md transition-all duration-150 ease-out select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:opacity-40 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 dark:bg-brand-500 dark:hover:bg-brand-600 dark:active:bg-brand-700',
        secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-alt hover:border-border-hover active:bg-surface-alt',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-alt active:bg-surface-alt',
        danger: 'text-error hover:bg-error-bg hover:text-error-text active:bg-error-bg',
      },
      size: {
        sm: 'h-7 px-3 text-[0.8125rem]',
        md: 'h-9 px-4 text-[0.9375rem]',
        lg: 'h-10 px-5 text-[0.9375rem]',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const Button = forwardRef(({ className, variant, size, isLoading, disabled, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants({ variant, size }), className)}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </button>
));

Button.displayName = 'Button';

export { Button, buttonVariants };
