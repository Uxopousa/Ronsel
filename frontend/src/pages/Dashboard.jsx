import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ListTodo, Flame, Target, ChevronRight, ChevronLeft, CalendarDays,
  AlertCircle, Plus, ChevronDown, ChevronUp, X,
} from 'lucide-react';
import api from '../services/api';
import * as taskService from '../services/tasks';
import TaskModal from '../components/shared/TaskModal';
import { useToast } from '../components/ui/Toast';

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');
  const [calDate, setCalDate] = useState(new Date());
  const [monthTasks, setMonthTasks] = useState({});
  const [dayPanel, setDayPanel] = useState(null);
  const [goalExpanded, setGoalExpanded] = useState({});
  const [quickTask, setQuickTask] = useState(null);
  const addToast = useToast();

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  useEffect(() => {
    api.get('/dashboard').then(res => setData(res.data)).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadMonthTasks = useCallback(async (year, month) => {
    try {
      const from = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const to = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
      const tasks = await taskService.getTasks({ dueDateFrom: from, dueDateTo: to });
      const grouped = {};
      for (const t of tasks) {
        if (!t.dueDate) continue;
        const d = t.dueDate.slice(0, 10);
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(t);
      }
      setMonthTasks(grouped);
    } catch {
      addToast('Error al cargar tareas del mes', 'error');
    }
  }, []);

  useEffect(() => {
    if (view === 'month') loadMonthTasks(calDate.getFullYear(), calDate.getMonth() + 1);
  }, [view, calDate, loadMonthTasks]);

  if (loading) return <p className="text-gray-400 dark:text-neutral-500 text-sm py-8 text-center">Cargando...</p>;
  if (!data) return <p className="text-gray-400 dark:text-neutral-500 text-sm py-8 text-center">Error al cargar el dashboard.</p>;

  const overdue = (data.tasksToday || []).filter(t => t.dueDate && t.dueDate.slice(0, 10) < todayStr);
  const todayTasks = (data.tasksToday || []).filter(t => !t.dueDate || t.dueDate.slice(0, 10) === todayStr);
  const pendingHabits = data.pendingHabits || [];

  function toggleGoal(id) { setGoalExpanded(prev => ({ ...prev, [id]: !prev[id] })); }
  function navMonth(dir) { const d = new Date(calDate); d.setMonth(d.getMonth() + dir); setCalDate(d); }
  function handleDayClick(dateStr, tasks) { setDayPanel({ date: dateStr, tasks: tasks || [] }); }

  const hasContent = data.tasksToday?.length || pendingHabits.length || data.activeGoals?.length;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
          Hoy, {today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SummaryCard title="Pendientes" count={todayTasks.length} detail={overdue.length > 0 ? `${overdue.length} vencidas` : null} link="/tasks" icon={ListTodo} color="primary" />
        <SummaryCard title="Hábitos" count={pendingHabits.length} link="/habits" icon={Flame} color="amber" />
        <SummaryCard title="Objetivos activos" count={data.activeGoals?.length || 0} link="/goals" icon={Target} color="primary" />
      </div>

      {overdue.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-6 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-md text-sm text-red-700 dark:text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">{overdue.length} tarea{overdue.length !== 1 ? 's' : ''} vencida{overdue.length !== 1 ? 's' : ''}</span>
          <Link to="/tasks" className="text-xs font-medium hover:underline">Ver</Link>
        </div>
      )}

      {todayTasks.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title mb-3">Tareas de hoy ({todayTasks.length})</h2>
          <div className="card divide-y divide-gray-50 dark:divide-neutral-800">
            {todayTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${t.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600'}`} />
                <span className={`text-sm flex-1 truncate ${t.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-900 dark:text-neutral-100'}`}>{t.title}</span>
                {t.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: t.category.color + '18', color: t.category.color }}>{t.category.name}</span>}
                {t.dueDate && t.dueDate.slice(0, 10) < todayStr && <span className="text-[0.625rem] text-red-500 dark:text-red-400 font-medium">Vencida</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {pendingHabits.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title mb-3">Hábitos pendientes ({pendingHabits.length})</h2>
          <div className="flex flex-wrap gap-2">
            {pendingHabits.map(h => (
              <div key={h.id} className="card px-3 py-2 flex items-center gap-2 text-sm">
                <Flame size={14} className="text-orange-400 dark:text-orange-500" />
                <span className="text-gray-700 dark:text-neutral-200">{h.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Calendario</h2>
          <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-md p-0.5 gap-0.5">
            <button onClick={() => setView('week')} className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${view === 'week' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'}`}>Semana</button>
            <button onClick={() => setView('month')} className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${view === 'month' ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'}`}>Mes</button>
          </div>
        </div>
        {view === 'week' ? <WeekView data={data} todayStr={todayStr} onDayClick={handleDayClick} /> : <MonthView date={calDate} monthTasks={monthTasks} todayStr={todayStr} onPrev={() => navMonth(-1)} onNext={() => navMonth(1)} onDayClick={handleDayClick} />}
      </section>

      {dayPanel && <DayPanel date={dayPanel.date} tasks={dayPanel.tasks} onClose={() => setDayPanel(null)} onQuickTask={() => setQuickTask({ dueDate: dayPanel.date })} />}

      {data.activeGoals?.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title mb-3">Objetivos activos</h2>
          <div className="space-y-1.5">
            {data.activeGoals.map(goal => (
              <div key={goal.id} className="card overflow-hidden">
                <button onClick={() => toggleGoal(goal.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <Target size={16} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-neutral-100 flex-1 truncate">{goal.title}</span>
                  <span className="text-xs text-gray-400 dark:text-neutral-500 tabular-nums">{goal.progress}%</span>
                  <div className="w-20 bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5">
                    <div className="bg-primary-500 dark:bg-primary-400 h-1.5 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                  </div>
                  {goalExpanded[goal.id] ? <ChevronUp size={14} className="text-gray-400 dark:text-neutral-500" /> : <ChevronDown size={14} className="text-gray-400 dark:text-neutral-500" />}
                </button>
                {goalExpanded[goal.id] && (
                  <div className="px-4 pb-3 pt-1 border-t border-gray-50 dark:border-neutral-800">
                    <p className="text-xs text-gray-400 dark:text-neutral-500 mb-2">
                      {goal.totalTasks || 0} tareas · {goal.completedTasks || 0} completadas
                      {goal.targetDate && ` · Hasta ${new Date(goal.targetDate).toLocaleDateString('es-ES')}`}
                    </p>
                    <Link to="/goals" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">Ver detalle</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasContent && (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
            <ListTodo size={20} className="text-gray-400 dark:text-neutral-500" />
          </div>
          <p className="text-sm text-gray-400 dark:text-neutral-500 mb-4">Bienvenido a Ronsel. No tienes nada pendiente hoy.</p>
          <Link to="/tasks" className="btn-primary btn-md">Crear tu primera tarea</Link>
        </div>
      )}

      {quickTask !== null && (
        <TaskModal task={quickTask} categories={[]} goals={[]}
          onSave={async (t) => {
            try { await taskService.createTask(t); addToast('Tarea creada', 'success'); setQuickTask(null); api.get('/dashboard').then(res => setData(res.data)).catch(() => {}); }
            catch (err) { addToast(err.response?.data?.error || 'Error al crear la tarea', 'error'); }
          }}
          onClose={() => setQuickTask(null)} />
      )}
    </div>
  );
}

function SummaryCard({ title, count, detail, link, icon: Icon, color }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
    amber: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  };
  return (
    <Link to={link} className="card p-4 flex items-center gap-3 hover:border-gray-200 dark:hover:border-neutral-700 transition-colors">
      <div className={`w-9 h-9 rounded-md ${colors[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xl font-semibold text-gray-900 dark:text-neutral-100 leading-none">{count}</p>
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{title}</p>
        {detail && <p className="text-[0.625rem] text-gray-400 dark:text-neutral-500 mt-0.5">{detail}</p>}
      </div>
      <ChevronRight size={14} className="text-gray-300 dark:text-neutral-600 ml-auto flex-shrink-0" />
    </Link>
  );
}

function WeekView({ data, todayStr, onDayClick }) {
  if (!data.week) return null;
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {data.week.map(day => {
        const date = new Date(day.date + 'T00:00:00');
        const isToday = day.date === todayStr;
        return (
          <button key={day.date} onClick={() => onDayClick(day.date, day.tasks)}
            className={`rounded-md p-2 min-h-[80px] text-left transition-all ${isToday ? 'ring-1 ring-primary-300 dark:ring-primary-600 bg-white dark:bg-neutral-900' : 'bg-white dark:bg-neutral-900 card'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[0.625rem] text-gray-400 dark:text-neutral-500 font-medium">{weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1]}</span>
              <span className={`text-xs font-medium ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-neutral-400'}`}>{date.getDate()}</span>
            </div>
            <div className="space-y-0.5">
              {day.tasks.slice(0, 3).map(t => (
                <div key={t.id} className={`text-[0.625rem] px-1 py-0.5 rounded truncate leading-tight ${t.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 line-through' : 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'}`}>{t.title}</div>
              ))}
              {day.tasks.length > 3 && <p className="text-[0.625rem] text-gray-400 dark:text-neutral-500">+{day.tasks.length - 3} más</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MonthView({ date, monthTasks, todayStr, onPrev, onNext, onDayClick }) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  return (
    <div className="card p-3">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrev} className="btn-ghost btn-sm p-1.5"><ChevronLeft size={16} /></button>
        <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{months[month - 1]} {year}</span>
        <button onClick={onNext} className="btn-ghost btn-sm p-1.5"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map(d => <div key={d} className="text-[0.625rem] text-gray-400 dark:text-neutral-500 font-medium text-center py-1">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const dayTasks = monthTasks[dateStr] || [];
          return (
            <button key={day} onClick={() => onDayClick(dateStr, dayTasks)}
              className={`p-1.5 rounded-md text-left min-h-[56px] transition-all hover:bg-gray-50 dark:hover:bg-neutral-800 ${isToday ? 'ring-1 ring-primary-300 dark:ring-primary-600 bg-primary-50/30 dark:bg-primary-950/30' : ''}`}>
              <span className={`text-xs font-medium ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-neutral-400'}`}>{day}</span>
              {dayTasks.length > 0 && (
                <div className="mt-0.5 space-y-0.5">
                  {dayTasks.slice(0, 2).map(t => (
                    <div key={t.id} className={`text-[0.5rem] px-0.5 py-0.5 rounded truncate leading-tight ${t.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' : 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'}`}>{t.title}</div>
                  ))}
                  {dayTasks.length > 2 && <p className="text-[0.5rem] text-gray-400 dark:text-neutral-500">+{dayTasks.length - 2}</p>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayPanel({ date, tasks, onClose, onQuickTask }) {
  const d = new Date(date + 'T00:00:00');
  const dayName = dayNames[d.getDay()];
  const displayDate = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  return (
    <section className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">{dayName}, {displayDate}</h2>
        <div className="flex gap-2">
          <button onClick={onQuickTask} className="btn-ghost btn-sm gap-1"><Plus size={12} />Tarea</button>
          <button onClick={onClose} className="btn-ghost btn-sm p-1.5"><X size={14} /></button>
        </div>
      </div>
      {tasks.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-neutral-500 py-4 text-center card">Sin tareas para este día</p>
      ) : (
        <div className="card divide-y divide-gray-50 dark:divide-neutral-800">
          {tasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
              <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${t.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600'}`} />
              <span className={`text-sm flex-1 truncate ${t.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-900 dark:text-neutral-100'}`}>{t.title}</span>
              {t.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: t.category.color + '18', color: t.category.color }}>{t.category.name}</span>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
