import { cn } from '../../lib/utils';

function Card({ className, hover, children, ...props }) {
  const Component = hover ? 'button' : 'div';
  return (
    <Component
      className={cn(
        'bg-surface-card rounded-lg border border-border',
        hover && 'hover:border-border-hover transition-all duration-150 cursor-pointer text-left',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('px-5 py-4 border-b border-border', className)} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('px-5 py-4', className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('px-5 py-3 border-t border-border flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent, CardFooter };
