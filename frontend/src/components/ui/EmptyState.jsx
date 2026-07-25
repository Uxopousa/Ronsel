import { CheckCircle } from 'lucide-react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
        {Icon ? <Icon size={20} className="text-gray-400 dark:text-neutral-500" /> : <CheckCircle size={20} className="text-gray-400 dark:text-neutral-500" />}
      </div>
      <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">{title}</p>
      {description && <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary btn-sm mt-4 gap-1.5">
          {action.label}
        </button>
      )}
    </div>
  );
}
