import { useState, useEffect, useMemo } from 'react';
import * as habitService from '../services/habits';
import * as categoryService from '../services/categories';
import HabitModal from '../components/shared/HabitModal';
import { useToast } from '../components/ui/Toast';
import { SkeletonHabitsPage } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Plus, Check, Zap, TrendingUp, Flame, Edit3, Trash2, ChevronDown } from 'lucide-react';
import { WEEK_DAYS_SHORT, MONTHS } from '../constants';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  function load() {
    setLoading(true);
    Promise.all([
      habitService.getHabits(),
      categoryService.getCategories(),
    ]).then(([h, c]) => {
      setHabits(h);
      setCategories(c);
    }).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  const addToast = useToast();

  async function handleSave(data) {
    try {
      if (data.id) await habitService.updateHabit(data.id, data); else await habitService.createHabit(data);
      addToast(data.id ? 'Hábito actualizado' : 'Hábito creado', 'success'); setModal(null); load();
    } catch (err) { addToast(err.response?.data?.error || 'Error al guardar el hábito', 'error'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este hábito?')) return;
    try { await habitService.deleteHabit(id); addToast('Hábito eliminado', 'success'); load(); }
    catch (err) { addToast(err.response?.data?.error || 'Error al eliminar el hábito', 'error'); }
  }

  async function handleToggle(id) {
    try { await habitService.toggleHabit(id); load(); }
    catch (err) { addToast(err.response?.data?.error || 'Error al actualizar el hábito', 'error'); }
  }

  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter(h => h.completedToday).length;
    const maxStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0);
    const currentStreakTotal = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);
    return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0, maxStreak, currentStreakTotal };
  }, [habits]);

  return (
    <div className="max-w-[96rem] mx-auto w-full px-5 md:px-8 py-5 md:py-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary font-display">Hábitos</h1>
        <Button variant="primary" size="sm" onClick={() => setModal({})}><Plus size={13} />Nuevo hábito</Button>
      </div>

      {loading && <SkeletonHabitsPage />}

      {!loading && habits.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Check} value={stats.completed} label="Hoy" color="success" />
          <StatCard icon={Flame} value={`${stats.pct}%`} label="Completado" color="warning" />
          <StatCard icon={Zap} value={stats.currentStreakTotal} label="Racha total" color="brand" />
          <StatCard icon={TrendingUp} value={stats.maxStreak} label="Máxima racha" color="brand" />
        </div>
      )}

      {!loading && habits.length === 0 && (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center mx-auto mb-3"><Flame size={20} className="text-text-tertiary" /></div>
          <p className="text-sm text-text-tertiary">No hay hábitos. Crea tu primer hábito.</p>
        </div>
      )}

      {!loading && habits.length > 0 && <div className="space-y-1.5">
        {habits.map(habit => (
          <HabitCard key={habit.id} habit={habit}
            onToggle={() => handleToggle(habit.id)} onEdit={() => setModal(habit)}
            onDelete={() => handleDelete(habit.id)} />
        ))}
      </div>}

      {modal && <HabitModal habit={modal} categories={categories} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  const colors = { brand: 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300', success: 'bg-success-bg text-success-text', warning: 'bg-warning-bg text-warning-text' };
  return (
    <div className="card p-3 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-md ${colors[color]} flex items-center justify-center flex-shrink-0`}><Icon size={15} /></div>
      <div><p className="text-base font-semibold text-text-primary leading-none">{value}</p><p className="text-[0.625rem] text-text-tertiary mt-0.5">{label}</p></div>
    </div>
  );
}

function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const [weekData, setWeekData] = useState({});

  useEffect(() => {
    const now = new Date();
    habitService.getHabitCalendar(habit.id, now.getFullYear(), now.getMonth() + 1)
      .then(d => setWeekData(d))
      .catch(() => {});
  }, [habit.id]);

  const DAY_ABBR = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  function freqLabel() {
    if (habit.frequency === 'DAILY') return 'Diario';
    const dw = habit.daysOfWeek;
    if (habit.frequency === 'WEEKLY' && Array.isArray(dw) && dw.length > 0) {
      return dw.map(d => DAY_ABBR[d]).join(' ');
    }
    if (habit.frequency === 'BIWEEKLY' && dw?.week1) {
      const w1 = (dw.week1 || []).map(d => DAY_ABBR[d]).join(' ');
      const w2 = (dw.week2 || []).map(d => DAY_ABBR[d]).join(' ');
      if (w1 && w2) return `S1:${w1} S2:${w2}`;
      if (w1) return `Quincenal: ${w1}`;
    }
    return habit.frequency === 'BIWEEKLY' ? 'Quincenal' : 'Semanal';
  }

  return (
    <div className="card overflow-hidden group">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onToggle}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${habit.completedToday ? 'bg-success text-white' : 'bg-surface-alt text-text-tertiary hover:bg-success-bg hover:text-success-text border border-border'}`}>
          <Check size={14} strokeWidth={habit.completedToday ? 3 : 2} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">{habit.name}</span>
            {habit.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium truncate" style={{ backgroundColor: habit.category.color + '18', color: habit.category.color }}>{habit.category.name}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <div className="hidden sm:flex items-center gap-0.5"><Zap size={11} /><strong className="text-text-secondary">{habit.currentStreak}</strong></div>
          <span className="hidden sm:inline text-border">·</span>
          <div className="hidden sm:flex items-center gap-0.5"><TrendingUp size={11} /><strong className="text-text-secondary">{habit.longestStreak}</strong></div>
          <span className="hidden sm:inline text-border">·</span>
          <span className="hidden sm:inline text-[0.625rem]">{freqLabel()}</span>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1">
            {getWeekDays(weekData, habit).map((day, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-sm ${day.completed ? 'bg-success' : day.future ? 'bg-surface-alt' : 'bg-neutral-300 dark:bg-neutral-700'}`} title={`${['D','L','M','X','J','V','S'][day.date.getDay()]}: ${day.completed ? '✓' : day.future ? '—' : '✗'}`} />
            ))}
          </div>
          <div className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-0.5">
            <button onClick={onEdit} className="btn-icon text-text-tertiary hover:text-brand-600 dark:hover:text-brand-400 hover:bg-surface-alt" title="Editar">
              <Edit3 size={12} />
            </button>
            <button onClick={onDelete} className="btn-icon text-text-tertiary hover:text-error hover:bg-error-bg" title="Eliminar">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HabitCalendarInline({ habitId }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [days, setDays] = useState({});

  useEffect(() => {
    let cancelled = false;
    habitService.getHabitCalendar(habitId, year, month).then(d => { if (!cancelled) setDays(d); });
    return () => { cancelled = true; };
  }, [habitId, year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="px-4 pb-4 pt-3 border-t border-border animate-fade-in" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          <button onClick={() => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); }} className="btn-ghost btn-sm p-1"><ChevronDown size={12} className="rotate-90" /></button>
          <span className="text-xs font-medium text-text-secondary">{MONTHS[month - 1]} {year}</span>
          <button onClick={() => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); }} className="btn-ghost btn-sm p-1"><ChevronDown size={12} className="-rotate-90" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {WEEK_DAYS_SHORT.map(d => <div key={d} className="text-[0.5rem] text-text-tertiary font-medium text-center py-0.5">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1; const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`; const isToday = dateStr === todayStr; const completed = days.days?.[day];
          return <div key={day} className={`py-1 text-center text-xs rounded-sm ${completed === true ? 'bg-success text-white font-medium' : completed === false ? 'bg-error-bg text-error-text' : 'text-text-secondary'} ${isToday ? 'ring-1 ring-brand-300 dark:ring-brand-500' : ''}`}>{day}</div>;
        })}
      </div>
    </div>
  );
}

const BIWEEK_REF_HABIT = new Date('2000-01-03');

function isDayScheduled(habit, dow) {
  if (!habit || habit.frequency === 'DAILY') return true;
  if (habit.frequency === 'WEEKLY') {
    if (!habit.daysOfWeek || !Array.isArray(habit.daysOfWeek)) return true;
    return habit.daysOfWeek.includes(dow);
  }
  if (habit.frequency === 'BIWEEKLY') {
    if (!habit.daysOfWeek || !habit.daysOfWeek.week1) return true;
    return [...(habit.daysOfWeek.week1 || []), ...(habit.daysOfWeek.week2 || [])].includes(dow);
  }
  return true;
}

function getWeekDays(calendarData, habit) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today); monday.setDate(today.getDate() + mondayOffset); monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    const completed = calendarData?.days?.[d.getDate()] ?? false;
    const scheduled = isDayScheduled(habit, d.getDay());
    return { date: d, completed, future: d > today, scheduled };
  }).filter(day => day.scheduled);
}
