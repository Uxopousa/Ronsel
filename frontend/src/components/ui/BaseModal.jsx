import { X } from 'lucide-react';

export default function BaseModal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-surface-card rounded-lg shadow-modal w-full max-w-md mx-4 animate-scale-in border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 h-12 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
