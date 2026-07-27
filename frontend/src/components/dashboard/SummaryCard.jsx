import { Link } from 'react-router-dom';

export default function SummaryCard({ title, count, doneLabel, link }) {
  const isDone = count === 0;

  return (
    <Link to={link} className="group bg-surface-card rounded-lg border border-border px-4 py-3 flex items-center gap-3 hover:border-border-hover transition-all">
      <span className={`text-xl font-bold tabular-nums font-display ${isDone ? 'text-success' : 'text-text-primary'}`}>
        {isDone ? '✓' : count}
      </span>
      <span className={`text-xs leading-tight ${isDone ? 'text-success font-medium' : 'text-text-secondary'}`}>
        {isDone ? doneLabel : title}
      </span>
    </Link>
  );
}
