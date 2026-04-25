import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-md text-sm shadow-dropdown border animate-slide-up min-w-[280px] max-w-sm ${
              t.type === 'success'
                ? 'bg-white border-green-200 text-green-800 dark:bg-neutral-900 dark:border-green-800 dark:text-green-300'
                : t.type === 'error'
                ? 'bg-white border-red-200 text-red-800 dark:bg-neutral-900 dark:border-red-800 dark:text-red-300'
                : 'bg-white border-gray-200 text-gray-800 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle size={16} className="text-green-500 dark:text-green-400 flex-shrink-0" />
            ) : t.type === 'error' ? (
              <AlertTriangle size={16} className="text-red-500 dark:text-red-400 flex-shrink-0" />
            ) : null}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-300 dark:text-neutral-600 hover:text-gray-500 dark:hover:text-neutral-400 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}
