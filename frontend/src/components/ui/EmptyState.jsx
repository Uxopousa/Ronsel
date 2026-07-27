import { CheckCircle } from 'lucide-react';
import { Button } from './Button';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center mx-auto mb-3">
        {Icon ? <Icon size={20} className="text-text-tertiary" /> : <CheckCircle size={20} className="text-text-tertiary" />}
      </div>
      <p className="text-sm text-text-secondary font-medium">{title}</p>
      {description && <p className="text-xs text-text-tertiary mt-1">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
