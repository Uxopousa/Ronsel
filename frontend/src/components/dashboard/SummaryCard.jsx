import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle } from 'lucide-react';

const colorMap = {
  primary: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-950 dark:text-accent-300',
  amber: 'bg-warning-bg text-warning-text dark:bg-warning-bg dark:text-warning',
};

export default function SummaryCard({ title, count, doneLabel, link, icon: Icon, color = 'primary' }) {
  const isDone = count === 0;
  return (
    <Link to={link} className="group bg-surface-card rounded-lg border border-border p-4 flex items-center gap-3 hover:border-border-hover hover:shadow-card-hover transition-all">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isDone ? 'bg-success-bg text-success dark:bg-success-bg dark:text-success' : colorMap[color]}`}>
        {isDone ? <CheckCircle size={18} strokeWidth={2.5} /> : <Icon size={18} strokeWidth={2} />}
      </div>
      <div className="flex-1 min-w-0">
        {isDone ? (
          <p className="text-xs font-semibold text-success dark:text-success">{doneLabel}</p>
        ) : (
          <p className="text-xl font-bold text-text-primary leading-none font-display">{count}</p>
        )}
        <p className="text-xs text-text-tertiary mt-0.5">{title}</p>
      </div>
      <ChevronRight size={14} className="text-text-tertiary group-hover:text-text-secondary transition-colors flex-shrink-0" />
    </Link>
  );
}
