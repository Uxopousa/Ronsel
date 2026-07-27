import { cn } from '../../lib/utils';

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

function Avatar({ src, name, size = 'md', className }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover bg-surface-alt', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center',
        'dark:bg-brand-950 dark:text-brand-300',
        sizeMap[size],
        className
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

export { Avatar };
