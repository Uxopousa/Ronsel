export default function ToggleSwitch({ checked, onChange, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-1.5 text-xs select-none transition-colors px-1.5 py-1 -mx-1.5 -my-1 rounded-md ${
        checked ? 'text-brand-600 dark:text-brand-400' : 'text-text-tertiary hover:text-text-primary'
      }`}
      title={label}
    >
      <div className={`w-8 h-4 rounded-full transition-colors relative ${checked ? 'bg-brand-500 dark:bg-brand-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${checked ? 'left-4' : 'left-0.5'}`} />
      </div>
      {Icon && <Icon size={13} className={checked ? 'text-brand-600 dark:text-brand-400' : 'text-text-tertiary'} />}
      <span className={checked ? 'font-medium' : ''}>{label}</span>
    </button>
  );
}
