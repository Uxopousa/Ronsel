export default function ProgressBar({ progress, color = 'primary' }) {
  const isComplete = progress >= 100;
  const barColor = isComplete
    ? 'bg-success dark:bg-success'
    : color === 'primary'
      ? 'bg-brand-500 dark:bg-brand-400'
      : '';

  return (
    <div className="w-full bg-surface-alt rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}
