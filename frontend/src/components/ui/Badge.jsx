import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap',
  {
    variants: {
      variant: {
        brand: 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
        accent: 'bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300',
        success: 'bg-success-bg text-success-text dark:bg-success-bg dark:text-success',
        warning: 'bg-warning-bg text-warning-text dark:bg-warning-bg dark:text-warning',
        error: 'bg-error-bg text-error-text dark:bg-error-bg dark:text-error',
        neutral: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
      },
      dot: {
        true: 'relative pl-3 before:content-[""] before:absolute before:left-1.5 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full',
      },
    },
    compoundVariants: [
      { variant: 'brand', dot: true, class: 'before:bg-brand-500' },
      { variant: 'success', dot: true, class: 'before:bg-success' },
      { variant: 'warning', dot: true, class: 'before:bg-warning' },
      { variant: 'error', dot: true, class: 'before:bg-error' },
      { variant: 'neutral', dot: true, class: 'before:bg-neutral-400' },
    ],
    defaultVariants: {
      variant: 'brand',
    },
  }
);

function Badge({ className, variant, dot, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, dot }), className)} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
