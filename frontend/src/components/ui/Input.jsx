import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({ className, label, error, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-xs font-medium text-text-secondary mb-1.5">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border rounded-md transition-colors duration-150',
        'placeholder:text-text-tertiary',
        'focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15',
        'disabled:bg-surface-alt disabled:text-text-tertiary',
        error ? 'border-error focus:border-error focus:ring-error/15' : 'border-border',
        className
      )}
      {...props}
    />
    {error && (
      <p className="mt-1 text-xs text-error">{error}</p>
    )}
  </div>
));

Input.displayName = 'Input';

export { Input };
