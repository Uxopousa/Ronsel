export default function ProgressBar({ progress, color = 'primary' }) {
  const isComplete = progress >= 100;
  const barColor = isComplete ? 'bg-green-500 dark:bg-green-400' : color === 'primary' ? 'bg-primary-500 dark:bg-primary-400' : '';

  return (
    <div className="w-16 bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all ${barColor}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}
