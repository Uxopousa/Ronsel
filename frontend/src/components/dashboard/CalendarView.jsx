import { ChevronLeft, ChevronRight, Flame, Plus } from 'lucide-react';
import { WEEK_DAYS, DAY_NAMES, MONTHS } from '../../constants';
import { habitShowsOnDate, taskChipStyle } from '../../lib/dashboard-utils';
import { Button } from '../ui/Button';

const PRIORITY_LABELS = { HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' };

function DayCard({ day, dayTasks, habitsToday, showHabits, colorPriority, onDayClick }) {
  return (
    <button onClick={() => onDayClick(day.date, dayTasks)}
      className={`rounded-lg text-left transition-all p-3 ${
        day.isToday ? 'ring-2 ring-inset ring-brand-400 dark:ring-brand-500 bg-brand-50/50 dark:bg-brand-950' : 'bg-surface-card border border-border hover:border-border-hover'
      }`}
    >
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className={`text-xs font-medium ${day.isToday ? 'text-brand-600 dark:text-brand-400' : 'text-text-primary'}`}>
          {day.isAyer ? 'Ayer' : day.isManana ? 'Mañana' : day.isToday ? 'Hoy' : day.label}
        </span>
        <span className={`text-sm font-semibold ${day.isToday ? 'text-brand-600 dark:text-brand-400' : 'text-text-primary'}`}>
          {day.dayNum}
          <span className="text-[0.625rem] font-normal text-text-tertiary ml-0.5">{day.month}</span>
        </span>
      </div>
      <div className="space-y-0.5 min-w-0">
        {dayTasks.map(t => {
          const s = taskChipStyle(t, colorPriority);
          return (
            <div key={t.id} className={`block text-xs leading-tight px-1.5 py-0.5 rounded truncate ${s.bg} ${s.text}`}>
              {t.title}
            </div>
          );
        })}
        {showHabits && habitsToday.map(h => (
          <div key={h.id} className={`block text-[0.625rem] px-1 py-0.5 rounded bg-warning-bg text-warning-text truncate ${(day.isToday && h.completedToday) ? 'line-through opacity-50' : ''}`}>{h.name}</div>
        ))}
        {dayTasks.length === 0 && habitsToday.length === 0 && <span className="text-[0.625rem] text-text-tertiary">—</span>}
      </div>
    </button>
  );
}

function AgendaDay({ day, dayTasks, habitsToday, showHabits, colorPriority, onDayClick, onQuickTask }) {
  const isPast = day.date < new Date().toISOString().slice(0, 10);
  const total = dayTasks.length + (showHabits ? habitsToday.length : 0);

  return (
    <div className={`rounded-lg border ${
      day.isToday
        ? 'border-brand-300/50 dark:border-brand-700/50 bg-brand-50/30 dark:bg-brand-950/30'
        : isPast
          ? 'border-border bg-surface-card/50'
          : 'border-border bg-surface-card'
    }`}>
      <button onClick={() => onDayClick(day.date, dayTasks)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-t-lg hover:bg-white/5 transition-colors"
      >
        <span className={`text-sm font-semibold min-w-[32px] ${day.isToday ? 'text-brand-600 dark:text-brand-400' : 'text-text-primary'}`}>
          {day.isAyer ? 'Ayer' : day.isManana ? 'Mañana' : day.isToday ? 'Hoy' : day.label}
        </span>
        <span className="text-[0.6875rem] font-medium text-text-secondary">{day.dayNum} {day.month}</span>
        {day.isToday && (
          <span className="text-[0.5625rem] font-semibold px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400">Hoy</span>
        )}
        {isPast && !day.isToday && (
          <span className="text-[0.5625rem] font-medium px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-text-tertiary">Pasado</span>
        )}
        <span className="flex-1" />
        <span className="text-[0.6875rem] text-text-tertiary tabular-nums">
          {total > 0 ? `${total} ${total === 1 ? 'item' : 'items'}` : '—'}
        </span>
      </button>

      <div className="px-3 pb-2 space-y-0.5">
        {dayTasks.map(t => {
          const s = taskChipStyle(t, colorPriority);
          return (
            <div key={t.id} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[0.75rem] ${s.bg} ${s.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                t.status === 'COMPLETED'
                  ? 'bg-neutral-300 dark:bg-neutral-600'
                  : colorPriority
                    ? t.priority === 'HIGH' ? 'bg-error' : t.priority === 'MEDIUM' ? 'bg-warning' : 'bg-success'
                    : 'bg-brand-400 dark:bg-brand-500'
              }`} />
              <span className="flex-1 truncate">{t.title}</span>
              {colorPriority && t.status !== 'COMPLETED' && (
                <span className="text-[0.5625rem] opacity-70 flex-shrink-0">{PRIORITY_LABELS[t.priority]}</span>
              )}
            </div>
          );
        })}
        {showHabits && habitsToday.map(h => (
          <div key={h.id} className={`flex items-center gap-2 px-2 py-1.5 rounded text-[0.75rem] bg-warning-bg/70 text-warning-text ${h.completedToday ? 'opacity-60' : ''}`}>
            <Flame size={12} className="flex-shrink-0" />
            <span className={`flex-1 truncate ${h.completedToday ? 'line-through' : ''}`}>{h.name}</span>
          </div>
        ))}
        {total === 0 && isPast && (
          <p className="text-[0.6875rem] text-text-tertiary py-1 px-2 italic">Sin tareas</p>
        )}
        {!isPast && (
          <button onClick={() => onQuickTask(day.date)}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded text-[0.6875rem] text-text-tertiary hover:text-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-950/50 transition-colors"
          >
            <Plus size={11} />
            <span>Añadir tarea</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function AgendaView({ startDate, allTasks, allHabits, todayStr, showHabits, colorPriority, onDayClick, onQuickTask, onPrev, onNext, dayCount = 14 }) {
  const days = [];
  const start = new Date(startDate + 'T00:00:00');
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const ds = d.toISOString().slice(0, 10);
    days.push({
      date: ds,
      label: DAY_NAMES[d.getDay()],
      dayNum: d.getDate(),
      month: MONTHS[d.getMonth()].slice(0, 3),
      isToday: ds === todayStr,
    });
  }

  const labelStart = `${days[0].dayNum} ${days[0].month}`;
  const labelEnd = `${days[days.length - 1].dayNum} ${days[days.length - 1].month}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrev}
          className="flex items-center justify-center w-7 h-7 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-alt transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-xs font-medium text-text-secondary">{labelStart} — {labelEnd}</span>
        <button onClick={onNext}
          className="flex items-center justify-center w-7 h-7 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-alt transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="space-y-2 max-h-[26rem] overflow-y-auto custom-scrollbar scroll-fade pr-2 -mr-1">
        {days.map(day => {
          const dayTasks = allTasks[day.date] || [];
          const habitsToday = showHabits ? (allHabits || []).filter(h => habitShowsOnDate(h, day.date)) : [];
          return (
            <AgendaDay key={day.date} day={day} dayTasks={dayTasks} habitsToday={habitsToday}
              showHabits={showHabits} colorPriority={colorPriority}
              onDayClick={onDayClick} onQuickTask={onQuickTask}
            />
          );
        })}
      </div>
    </div>
  );
}

export function MultiDayView({ allTasks, todayStr, yesterdayStr, tomorrowStr, onDayClick, colorPriority, showHabits, allHabits }) {
  const yd = new Date(yesterdayStr + 'T00:00:00');
  const td = new Date(todayStr + 'T00:00:00');
  const tmd = new Date(tomorrowStr + 'T00:00:00');
  const days = [
    { date: yesterdayStr, label: DAY_NAMES[yd.getDay()], dayNum: yd.getDate(), month: MONTHS[yd.getMonth()].slice(0, 3), isToday: false, isAyer: true },
    { date: todayStr, label: DAY_NAMES[td.getDay()], dayNum: td.getDate(), month: MONTHS[td.getMonth()].slice(0, 3), isToday: true },
    { date: tomorrowStr, label: DAY_NAMES[tmd.getDay()], dayNum: tmd.getDate(), month: MONTHS[tmd.getMonth()].slice(0, 3), isToday: false, isManana: true },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {days.map(day => {
        const dayTasks = allTasks[day.date] || [];
        const habitsToday = showHabits ? (allHabits || []).filter(h => habitShowsOnDate(h, day.date)) : [];
        return (
          <DayCard key={day.date} day={day} dayTasks={dayTasks} habitsToday={habitsToday}
            showHabits={showHabits} colorPriority={colorPriority} onDayClick={onDayClick}
          />
        );
      })}
    </div>
  );
}

export function MonthView({ date, allTasks, todayStr, onPrev, onNext, onDayClick, colorPriority, showHabits, allHabits }) {
  const year = date.getFullYear(); const month = date.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="bg-surface-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-alt transition-all">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-text-primary">{MONTHS[month - 1]} {year}</span>
        <button onClick={onNext} className="flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-alt transition-all">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {WEEK_DAYS.map(d => (
          <div key={d} className="text-xs font-medium text-text-tertiary py-2">{d}</div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} className="py-1" />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const isToday = dateStr === todayStr;
          const dayTasks = allTasks[dateStr] || [];
          const count = dayTasks.length;
          const hasHabits = showHabits && allHabits?.length > 0 && allHabits.some(h => habitShowsOnDate(h, dateStr));
          return (
            <button key={day} onClick={() => onDayClick(dateStr, dayTasks)}
              className={`py-1.5 rounded-md text-center transition-all hover:bg-surface-alt ${isToday ? 'bg-brand-50 dark:bg-brand-950' : ''}`}
            >
              <span className={`text-xs font-semibold ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-text-primary'}`}>{day}</span>
              <div className="flex justify-center gap-0.5 mt-1 min-h-[6px]">
                {count > 0 && Array.from({ length: Math.min(count, 3) }).map((_, j) => {
                  const t = dayTasks[j];
                  const cls = t.status === 'COMPLETED'
                    ? 'bg-neutral-300 dark:bg-neutral-700'
                    : colorPriority
                      ? t.priority === 'HIGH' ? 'bg-error dark:bg-error' : t.priority === 'MEDIUM' ? 'bg-warning dark:bg-warning' : 'bg-neutral-400 dark:bg-neutral-500'
                      : 'bg-brand-400 dark:bg-brand-500';
                  return <div key={j} className={`w-1.5 h-1.5 rounded-full ${cls}`} />;
                })}
                {count > 3 && <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />}
                {hasHabits && <div className="w-1.5 h-1.5 rounded-full bg-accent-400 dark:bg-accent-500" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
