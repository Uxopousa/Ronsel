import { useEffect, useRef } from 'react';
import { X, Plus, Check, Flame } from 'lucide-react';
import { Button } from '../ui/Button';
import { DAY_NAMES } from '../../constants';

export default function DayModal({ date, tasks, onClose, onToggleTask, onQuickTask, pendingHabits, onToggleHabit, showHabits }) {
  const modalRef = useRef(null);
  const d = new Date(date + 'T00:00:00');
  const dayName = DAY_NAMES[d.getDay()];
  const displayDate = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  const isToday = date === new Date().toISOString().slice(0, 10);

  useEffect(() => {
    function handleKeyDown(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleKeyDown);
    if (modalRef.current) modalRef.current.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" />
      <div ref={modalRef} tabIndex={-1} className="relative w-full max-w-md mx-4 bg-surface-card rounded-lg shadow-modal border border-border animate-scale-in max-h-[85vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 h-12 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">{dayName}, {displayDate}</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onQuickTask}><Plus size={13} />Tarea</Button>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors"><X size={16} /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {tasks.length === 0 && (!isToday || (pendingHabits.length === 0)) && (
            <p className="text-sm text-text-tertiary text-center py-4">Sin tareas para este día</p>
          )}
          {tasks.length > 0 && (
            <div>
              <h3 className="section-title mb-2">Tareas ({tasks.length})</h3>
              <div className="space-y-1">
                {tasks.map(t => (
                  <button key={t.id} onClick={() => onToggleTask(t)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-alt text-left transition-colors group"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all ${
                      t.status === 'COMPLETED'
                        ? 'bg-success border-success'
                        : 'border-neutral-300 dark:border-neutral-600 group-hover:border-brand-400'
                    }`}>
                      {t.status === 'COMPLETED' && <Check size={10} className="text-white m-auto" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm flex-1 truncate ${t.status === 'COMPLETED' ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>{t.title}</span>
                    {t.category && (
                      <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: t.category.color + '18', color: t.category.color }}>
                        {t.category.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isToday && pendingHabits.length > 0 && (
            <div>
              <h3 className="section-title mb-2">Hábitos pendientes ({pendingHabits.length})</h3>
              <div className="flex flex-wrap gap-2">
                {pendingHabits.map(h => (
                  <button key={h.id} onClick={() => onToggleHabit(h)}
                    className="bg-surface-card border border-border rounded-lg px-3 py-2 flex items-center gap-2 text-sm hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/30 dark:hover:bg-brand-950 transition-all group"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600 group-hover:border-brand-400 flex-shrink-0 transition-colors" />
                    <Flame size={14} className="text-accent-500 dark:text-accent-400" />
                    <span className="text-text-primary">{h.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
