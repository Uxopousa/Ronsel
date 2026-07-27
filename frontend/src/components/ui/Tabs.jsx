import { createContext, useContext } from 'react';
import { cn } from '../../lib/utils';

const TabsContext = createContext(null);

function Tabs({ value, onChange, className, children }) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cn('flex gap-1', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children }) {
  return (
    <div className={cn('inline-flex items-center gap-1 p-1 bg-surface-alt rounded-lg', className)}>
      {children}
    </div>
  );
}

function Tab({ value, className, children }) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;

  return (
    <button
      onClick={() => ctx.onChange(value)}
      className={cn(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150',
        isActive
          ? 'bg-surface text-text-primary ring-1 ring-border'
          : 'text-text-secondary hover:text-text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}

Tabs.List = TabsList;
Tabs.Tab = Tab;

export { Tabs };
