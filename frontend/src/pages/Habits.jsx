import { useState, useEffect, useMemo } from 'react';
import * as habitService from '../services/habits';
import * as categoryService from '../services/categories';
import HabitModal from '../components/shared/HabitModal';
import { useToast } from '../components/ui/Toast';
import { SkeletonHabitsPage } from '../components/ui/Skeleton';
import {
  Plus, Check, Zap, TrendingUp, Flame, Edit3, Trash2,
} from 'lucide-react';
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
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Hábitos</h1>
        <button onClick={() => setModal({})} className="btn-primary btn-sm gap-1.5"><Plus size={14} /> Nuevo hábito</button>
      </div>

      {loading && <SkeletonHabitsPage />}

      {!loading && habits.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Check} value={stats.completed} label="Hoy" color="green" />
          <StatCard icon={Flame} value={`${stats.pct}%`} label="Completado" color="orange" />
          <StatCard icon={Zap} value={stats.currentStreakTotal} label="Racha total" color="primary" />
          <StatCard icon={TrendingUp} value={stats.maxStreak} label="Máxima racha" color="primary" />
        </div>
      )}

      {!loading && habits.length === 0 && (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3"><Flame size={20} className="text-gray-400 dark:text-neutral-500" /></div>
          <p className="text-sm text-gray-400 dark:text-neutral-500">No hay hábitos. Crea tu primer hábito.</p>
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
  const colors = { primary: 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300', green: 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-300', orange: 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-300' };
  return (
    <div className="card p-3 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-md ${colors[color]} flex items-center justify-center flex-shrink-0`}><Icon size={15} /></div>
      <div><p className="text-base font-semibold text-gray-900 dark:text-neutral-100 leading-none">{value}</p><p className="text-[0.625rem] text-gray-400 dark:text-neutral-500 mt-0.5">{label}</p></div>
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
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${habit.completedToday ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-50 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 hover:bg-green-50 dark:hover:bg-green-500/15 hover:text-green-500 dark:hover:text-green-400 border border-gray-100 dark:border-neutral-700'}`}>
          <Check size={14} strokeWidth={habit.completedToday ? 3 : 2} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{habit.name}</span>
            {habit.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium truncate" style={{ backgroundColor: habit.category.color + '18', color: habit.category.color }}>{habit.category.name}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500">
          <div className="hidden sm:flex items-center gap-0.5"><Zap size={11} /><strong className="text-gray-600 dark:text-neutral-300">{habit.currentStreak}</strong></div>
          <span className="hidden sm:inline text-gray-200 dark:text-neutral-700">·</span>
          <div className="hidden sm:flex items-center gap-0.5"><TrendingUp size={11} /><strong className="text-gray-600 dark:text-neutral-300">{habit.longestStreak}</strong></div>
          <span className="hidden sm:inline text-gray-200 dark:text-neutral-700">·</span>
          <span className="hidden sm:inline text-[0.625rem]">{freqLabel()}</span>
          <span className="text-gray-200 dark:text-neutral-700">·</span>
          <div className="flex items-center gap-1">
            {getWeekDays(weekData, habit).map((day, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-sm ${day.completed ? 'bg-green-400 dark:bg-green-500' : day.future ? 'bg-gray-100 dark:bg-neutral-800' : 'bg-gray-200 dark:bg-neutral-700'}`} title={`${['D','L','M','X','J','V','S'][day.date.getDay()]}: ${day.completed ? '✓' : day.future ? '—' : '✗'}`} />
            ))}
          </div>
          <div className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-0.5">
            <button onClick={onEdit} className="btn-ghost btn-sm p-1.5 text-gray-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400" title="Editar">
              <Edit3 size={12} />
            </button>
            <button onClick={onDelete} className="btn-ghost btn-sm p-1.5 text-gray-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400" title="Eliminar">
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
    <div className="px-4 pb-4 pt-3 border-t border-gray-50 dark:border-neutral-700 animate-fade-in" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          <button onClick={() => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); }} className="btn-ghost btn-sm p-1"><ChevronDown size={12} className="rotate-90" /></button>
          <span className="text-xs font-medium text-gray-600 dark:text-neutral-300">{MONTHS[month - 1]} {year}</span>
          <button onClick={() => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); }} className="btn-ghost btn-sm p-1"><ChevronDown size={12} className="-rotate-90" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {WEEK_DAYS_SHORT.map(d => <div key={d} className="text-[0.5rem] text-gray-400 dark:text-neutral-500 font-medium text-center py-0.5">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1; const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`; const isToday = dateStr === todayStr; const completed = days.days?.[day];
          return <div key={day} className={`py-1 text-center text-xs rounded-sm ${completed === true ? 'bg-green-500 text-white font-medium' : completed === false ? 'bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-neutral-400'} ${isToday ? 'ring-1 ring-primary-300 dark:ring-primary-500' : ''}`}>{day}</div>;
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
    // Mostrar días de ambas semanas de la quincena
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
