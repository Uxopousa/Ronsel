import { Check } from 'lucide-react';

export default function CheckmarkButton({ checked, onChange, size = 'sm' }) {
  const sz = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <button
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      className={`${sz} rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
        checked
          ? 'bg-green-500 border-green-500'
          : 'border-gray-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500'
      }`}
    >
      {checked && <Check size={10} className="text-white m-auto" strokeWidth={3} />}
    </button>
  );
}
