import { useState, useEffect, useMemo } from 'react';
import * as habitService from '../services/habits';
import * as categoryService from '../services/categories';
import HabitModal from '../components/shared/HabitModal';
import { useToast } from '../components/ui/Toast';
import {
  Plus, Edit3, Trash2, Check, Zap, TrendingUp, CalendarDays, ChevronDown, ChevronUp, Flame,
} from 'lucide-react';

const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState({});

  function load() {
    habitService.getHabits().then(setHabits).catch(() => {});
    categoryService.getCategories().then(setCategories).catch(() => {});
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

  function toggleExpand(id) { setExpanded(prev => ({ ...prev, [id]: !prev[id] })); }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Hábitos</h1>
        <button onClick={() => setModal({})} className="btn-primary btn-sm gap-1.5"><Plus size={14} /> Nuevo hábito</button>
      </div>

      {habits.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Check} value={stats.completed} label="Hoy" color="green" />
          <StatCard icon={Flame} value={`${stats.pct}%`} label="Completado" color="orange" />
          <StatCard icon={Zap} value={stats.currentStreakTotal} label="Racha total" color="primary" />
          <StatCard icon={TrendingUp} value={stats.maxStreak} label="Máxima racha" color="primary" />
        </div>
      )}

      {habits.length === 0 && (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3"><Flame size={20} className="text-gray-400 dark:text-neutral-500" /></div>
          <p className="text-sm text-gray-400 dark:text-neutral-500">No hay hábitos. Crea tu primer hábito.</p>
        </div>
      )}

      <div className="space-y-1.5">
        {habits.map(habit => (
          <HabitCard key={habit.id} habit={habit} expanded={!!expanded[habit.id]}
            onToggle={() => handleToggle(habit.id)} onEdit={() => setModal(habit)}
            onDelete={() => handleDelete(habit.id)} onExpand={() => toggleExpand(habit.id)} />
        ))}
      </div>

      {modal && <HabitModal habit={modal} categories={categories} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  const colors = { primary: 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400', green: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400', orange: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400' };
  return (
    <div className="card p-3 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-md ${colors[color]} flex items-center justify-center flex-shrink-0`}><Icon size={15} /></div>
      <div><p className="text-base font-semibold text-gray-900 dark:text-neutral-100 leading-none">{value}</p><p className="text-[0.625rem] text-gray-400 dark:text-neutral-500 mt-0.5">{label}</p></div>
    </div>
  );
}

function HabitCard({ habit, expanded, onToggle, onEdit, onDelete, onExpand }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onToggle}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${habit.completedToday ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-50 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-500 dark:hover:text-green-400 border border-gray-100 dark:border-neutral-700'}`}>
          <Check size={14} strokeWidth={habit.completedToday ? 3 : 2} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{habit.name}</span>
            {habit.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: habit.category.color + '18', color: habit.category.color }}>{habit.category.name}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-neutral-500">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="flex items-center gap-0.5"><Zap size={11} /><strong className="text-gray-600 dark:text-neutral-300">{habit.currentStreak}</strong></span>
            <span className="text-gray-200 dark:text-neutral-700">·</span>
            <span className="flex items-center gap-0.5"><TrendingUp size={11} /><strong className="text-gray-600 dark:text-neutral-300">{habit.longestStreak}</strong></span>
            <span className="text-gray-200 dark:text-neutral-700">·</span>
            <span className="capitalize text-[0.625rem]">{habit.frequency === 'DAILY' ? 'Diario' : 'Semanal'}</span>
          </div>
          <div className="flex gap-1 sm:gap-3">
            <button onClick={onEdit} className="btn-ghost btn-sm p-1"><Edit3 size={12} /></button>
            <button onClick={onDelete} className="btn-ghost btn-sm p-1 hover:text-red-500 dark:hover:text-red-400"><Trash2 size={12} /></button>
          </div>
          <button onClick={onExpand} className="btn-ghost btn-sm p-1">{expanded ? <ChevronUp size={14} /> : <CalendarDays size={14} />}</button>
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 pb-3">
        {getWeekDays().map((day, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${day.completed ? 'bg-green-400 dark:bg-green-600' : day.future ? 'bg-gray-100 dark:bg-neutral-800' : 'bg-gray-200 dark:bg-neutral-700'}`} title={`${weekDays[i]}: ${day.completed ? '✓' : day.future ? '—' : '✗'}`} />
        ))}
        <span className="text-[0.625rem] text-gray-400 dark:text-neutral-500 ml-1.5">Esta semana</span>
      </div>

      {expanded && <HabitCalendarInline habitId={habit.id} />}
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
    <div className="px-4 pb-4 pt-3 border-t border-gray-50 dark:border-neutral-800 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          <button onClick={() => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); }} className="btn-ghost btn-sm p-1"><ChevronDown size={12} className="rotate-90" /></button>
          <span className="text-xs font-medium text-gray-600 dark:text-neutral-300">{months[month - 1]} {year}</span>
          <button onClick={() => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); }} className="btn-ghost btn-sm p-1"><ChevronDown size={12} className="-rotate-90" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map(d => <div key={d} className="text-[0.5rem] text-gray-400 dark:text-neutral-500 font-medium text-center py-0.5">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const completed = days.days?.[day];
          return (
            <div key={day} className={`py-1 text-center text-xs rounded-sm ${completed === true ? 'bg-green-500 text-white font-medium' : completed === false ? 'bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-neutral-400'} ${isToday ? 'ring-1 ring-primary-300 dark:ring-primary-600' : ''}`}>{day}</div>
          );
        })}
      </div>
    </div>
  );
}

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today); monday.setDate(today.getDate() + mondayOffset); monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    return { date: d, completed: false, future: d > today };
  });
}
