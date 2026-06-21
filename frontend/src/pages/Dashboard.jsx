import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ListTodo, Flame, Target, ChevronRight, ChevronLeft, CalendarDays,
  AlertCircle, Plus, X, CheckCircle, Check, Eye, Palette,
} from 'lucide-react';
import api from '../services/api';
import * as taskService from '../services/tasks';
import * as habitService from '../services/habits';
import TaskModal from '../components/shared/TaskModal';
import { useToast } from '../components/ui/Toast';

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const LS_VIEW = 'dash_calView';
const LS_SHOW_HABITS = 'dash_showHabits';
const LS_COLOR_PRIORITY = 'dash_colorPriority';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calView, setCalView] = useState(() => localStorage.getItem(LS_VIEW) || '3day');
  const [calDate, setCalDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState({});
  const [dayModal, setDayModal] = useState(null);
  const [quickTask, setQuickTask] = useState(null);
  const [showHabits, setShowHabits] = useState(() => localStorage.getItem(LS_SHOW_HABITS) === 'true');
  const [colorPriority, setColorPriority] = useState(() => localStorage.getItem(LS_COLOR_PRIORITY) === 'true');
  const [pendingHabits, setPendingHabits] = useState([]);
  const [allHabits, setAllHabits] = useState([]);
  const addToast = useToast();

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const yesterdayStr = (() => { const d = new Date(today); d.setDate(d.getDate() - 1); return d.toISOString().slice(0,10); })();
  const tomorrowStr = (() => { const d = new Date(today); d.setDate(d.getDate() + 1); return d.toISOString().slice(0,10); })();

  function reloadDashboard() {
    api.get('/dashboard')
      .then(res => { setData(res.data); setPendingHabits(res.data.pendingHabits || []); })
      .catch(() => addToast('Error al cargar el dashboard', 'error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { reloadDashboard(); }, []);

  const loadTasks = useCallback(async (from, to) => {
    try {
      const tasks = await taskService.getTasks({ dueDateFrom: from, dueDateTo: to });
      const grouped = {};
      for (const t of tasks) {
        if (!t.dueDate) continue;
        const d = t.dueDate.slice(0, 10);
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(t);
      }
      setAllTasks(grouped);
    } catch {
      addToast('Error al cargar tareas del calendario', 'error');
    }
  }, []);

  useEffect(() => {
    let from, to;
    const afterTomorrow = (() => { const d = new Date(tomorrowStr + 'T00:00:00'); d.setDate(d.getDate() + 1); return d.toISOString().slice(0,10); })();
    if (calView === 'day') { from = todayStr; to = tomorrowStr; }
    else if (calView === '3day') { from = yesterdayStr; to = afterTomorrow; }
    else if (calView === 'week') {
      const dow = today.getDay(); const monday = new Date(today); monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1)); monday.setHours(0,0,0,0);
      const nextMonday = new Date(monday); nextMonday.setDate(monday.getDate() + 7);
      from = monday.toISOString().slice(0,10); to = nextMonday.toISOString().slice(0,10);
    } else {
      const y = calDate.getFullYear(); const m = calDate.getMonth() + 1;
      from = `${y}-${String(m).padStart(2,'0')}-01`;
      to = `${y}-${String(m).padStart(2,'0')}-${new Date(y,m,0).getDate()}`;
    }
    loadTasks(from, to);
  }, [calView, calDate, todayStr, yesterdayStr, tomorrowStr, loadTasks]);

  useEffect(() => {
    if (showHabits) {
      habitService.getHabits().then(setAllHabits).catch(() => {});
    }
  }, [showHabits]);

  function persist(key, val) { localStorage.setItem(key, val); }
  function setView(v) { setCalView(v); persist(LS_VIEW, v); }
  function toggleShowHabits(v) { setShowHabits(v); persist(LS_SHOW_HABITS, v); }
  function toggleColorPriority(v) { setColorPriority(v); persist(LS_COLOR_PRIORITY, v); }

  if (loading) return <p className="text-gray-400 dark:text-neutral-500 text-sm py-8 text-center">Cargando...</p>;
  if (!data) return <p className="text-gray-400 dark:text-neutral-500 text-sm py-8 text-center">Error al cargar el dashboard.</p>;

  const overdue = (data.tasksToday || []).filter(t => t.dueDate && t.dueDate.slice(0, 10) < todayStr);
  const todayTasks = (data.tasksToday || []).filter(t => !t.dueDate || t.dueDate.slice(0, 10) === todayStr);

  async function handleToggleTask(task) {
    try {
      const ns = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await taskService.updateTask(task.id, { status: ns });
      reloadDashboard();
      const refFrom = calView === 'month' ? `${calDate.getFullYear()}-${String(calDate.getMonth()+1).padStart(2,'0')}-01` : yesterdayStr;
      const refTo = calView === 'month' ? `${calDate.getFullYear()}-${String(calDate.getMonth()+1).padStart(2,'0')}-${new Date(calDate.getFullYear(), calDate.getMonth()+1, 0).getDate()}` : (() => { const d = new Date(tomorrowStr); d.setDate(d.getDate() + 1); return d.toISOString().slice(0,10); })();
      loadTasks(refFrom, refTo);
    } catch { addToast('Error al actualizar la tarea', 'error'); }
  }

  async function handleToggleHabit(habit) {
    try {
      await habitService.toggleHabit(habit.id);
      setPendingHabits(prev => prev.filter(h => h.id !== habit.id));
      reloadDashboard();
      if (showHabits) habitService.getHabits().then(setAllHabits).catch(() => {});
    } catch { addToast('Error al completar el hábito', 'error'); }
  }

  function handleDayClick(dateStr, tasks) { setDayModal({ date: dateStr, tasks: tasks || [] }); }
  function navMonth(dir) { const d = new Date(calDate); d.setMonth(d.getMonth() + dir); setCalDate(d); }

  const hasContent = data.tasksToday?.length || pendingHabits.length || data.activeGoals?.length;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
          Hoy, {today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SummaryCard title="Pendientes" count={todayTasks.length} doneLabel="Completadas" link="/tasks" icon={ListTodo} color="primary" />
        <SummaryCard title="Hábitos" count={pendingHabits.length} doneLabel="Completados" link="/habits" icon={Flame} color="amber" />
        <SummaryCard title="Objetivos activos" count={data.activeGoals?.length || 0} doneLabel="Sin objetivos" link="/goals" icon={Target} color="primary" />
      </div>

      {overdue.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-6 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-md text-sm text-red-700 dark:text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">{overdue.length} tarea{overdue.length !== 1 ? 's' : ''} vencida{overdue.length !== 1 ? 's' : ''}</span>
          <Link to="/tasks" className="text-xs font-medium hover:underline">Ver</Link>
        </div>
      )}

      {todayTasks.length === 0 && pendingHabits.length === 0 && data.activeGoals?.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-6 bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 rounded-md text-sm text-green-700 dark:text-green-300">
          <CheckCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">¡Todo al día! Sin tareas ni hábitos pendientes.</span>
        </div>
      )}

      {todayTasks.length > 0 && (
        <section className={`${pendingHabits.length === 0 ? 'mb-6' : 'mb-3'}`}>
          <h2 className="section-title mb-3">Tareas de hoy ({todayTasks.length})</h2>
          <div className="card divide-y divide-gray-50 dark:divide-neutral-700">
            {todayTasks.map(t => (
              <button
                key={t.id}
                onClick={() => handleToggleTask(t)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${t.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600 group-hover:border-primary-400'}`}>
                  {t.status === 'COMPLETED' && <Check size={10} className="text-white m-auto" strokeWidth={3} />}
                </div>
                <span className={`text-sm flex-1 truncate transition-colors ${t.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-900 dark:text-neutral-100'}`}>{t.title}</span>
                {t.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: t.category.color + '18', color: t.category.color }}>{t.category.name}</span>}
                {t.dueDate && t.dueDate.slice(0, 10) < todayStr && <span className="text-[0.625rem] text-red-500 dark:text-red-400 font-medium">Vencida</span>}
              </button>
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
                <button onClick={e => { e.stopPropagation(); handleToggleHabit(h); }} className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-neutral-600 hover:border-primary-400 flex-shrink-0 transition-colors" />
                <Flame size={14} className="text-orange-400 dark:text-orange-500" />
                <button
                  onClick={() => handleToggleHabit(h)}
                  className="text-gray-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {h.name}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Calendario</h2>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-md p-0.5">
              {[{k:'day',l:'Día'},{k:'3day',l:'3 días'},{k:'week',l:'Semana'},{k:'month',l:'Mes'}].map(({k,l}) => (
                <button key={k} onClick={() => setView(k)}
                  className={`px-3 py-1.5 text-xs rounded font-medium transition-all ${calView === k ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200'}`}>
                  {l}
                </button>
              ))}
            </div>
            <ToggleSwitch checked={showHabits} onChange={toggleShowHabits} icon={Eye} label="Hábitos" />
            <ToggleSwitch checked={colorPriority} onChange={toggleColorPriority} icon={Palette} label="Prioridad" />
          </div>
        </div>

        {calView === 'month' ? (
          <MonthView date={calDate} allTasks={allTasks} todayStr={todayStr} onPrev={() => navMonth(-1)} onNext={() => navMonth(1)} onDayClick={handleDayClick} colorPriority={colorPriority} showHabits={showHabits} allHabits={allHabits} />
        ) : calView === 'day' ? (
          <DayAgendaView tasks={allTasks[todayStr] || []} habits={showHabits ? (allHabits || []) : []} todayStr={todayStr} colorPriority={colorPriority} onDayClick={handleDayClick} onToggleTask={handleToggleTask} onToggleHabit={handleToggleHabit} />
        ) : (
          <MultiDayView calView={calView} allTasks={allTasks} todayStr={todayStr} yesterdayStr={yesterdayStr} tomorrowStr={tomorrowStr} onDayClick={handleDayClick} colorPriority={colorPriority} showHabits={showHabits} allHabits={allHabits} />
        )}
      </section>

      {dayModal && (
        <DayModal date={dayModal.date} tasks={dayModal.tasks} onClose={() => setDayModal(null)}
          onToggleTask={handleToggleTask} onQuickTask={() => setQuickTask({ dueDate: dayModal.date })}
          pendingHabits={pendingHabits} onToggleHabit={handleToggleHabit} showHabits={showHabits} />
      )}

      {data.activeGoals?.length > 0 && (
        <section className="mb-6">
          <h2 className="section-title mb-3">Objetivos activos</h2>
          <div className="space-y-1">
            {data.activeGoals.map(goal => (
              <Link key={goal.id} to="/goals" className={`card card-hover flex items-center gap-3 px-4 py-3 transition-colors ${goal.progress >= 100 ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20' : ''}`}>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${goal.progress >= 100 ? 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400' : 'text-primary-600 dark:text-primary-400'}`}>
                  {goal.progress >= 100 ? <CheckCircle size={16} /> : <Target size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{goal.title}</span>
                    {goal.progress >= 100 && <span className="badge text-[0.625rem] bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">Completado</span>}
                  </div>
                  {goal.description && <p className="text-xs text-gray-400 dark:text-neutral-500 truncate mt-0.5">{goal.description}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs tabular-nums whitespace-nowrap ${goal.progress >= 100 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-neutral-500'}`}>{goal.completedTasks || 0}/{goal.totalTasks || 0}</span>
                  <div className="w-16 bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${goal.progress >= 100 ? 'bg-green-500 dark:bg-green-400' : 'bg-primary-500 dark:bg-primary-400'}`} style={{ width: `${Math.min(goal.progress, 100)}%` }} />
                  </div>
                  <span className={`text-xs tabular-nums w-8 text-right ${goal.progress >= 100 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-neutral-500'}`}>{goal.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!hasContent && (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/15 flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">¡Todo al día!</p>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mb-4">No tienes tareas ni hábitos pendientes.</p>
          <Link to="/tasks" className="btn-primary btn-md">Crear una tarea</Link>
        </div>
      )}

      {quickTask !== null && (
        <TaskModal task={quickTask} categories={[]} goals={[]}
          onSave={async (t) => {
            try { await taskService.createTask(t); addToast('Tarea creada', 'success'); setQuickTask(null); reloadDashboard(); }
            catch (err) { addToast(err.response?.data?.error || 'Error al crear la tarea', 'error'); }
          }} onClose={() => setQuickTask(null)} />
      )}
    </div>
  );
}

function SummaryCard({ title, count, doneLabel, link, icon: Icon, color }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300',
    amber: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
  };
  const isDone = count === 0;
  return (
    <Link to={link} className="card p-4 flex items-center gap-3 hover:border-gray-200 dark:hover:border-neutral-700 transition-colors">
      <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400' : colors[color]}`}>
        {isDone ? <CheckCircle size={16} strokeWidth={2.5} /> : <Icon size={16} strokeWidth={2} />}
      </div>
      <div>
        {isDone ? <p className="text-xs font-medium text-green-700 dark:text-green-400">{doneLabel}</p> : <p className="text-xl font-semibold text-gray-900 dark:text-neutral-100 leading-none">{count}</p>}
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{title}</p>
      </div>
      <ChevronRight size={14} className="text-gray-300 dark:text-neutral-600 ml-auto flex-shrink-0" />
    </Link>
  );
}

function ToggleSwitch({ checked, onChange, icon: Icon, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors select-none"
      title={label}
    >
      <div className={`w-7 h-4 rounded-full transition-colors relative ${checked ? 'bg-primary-500 dark:bg-primary-600' : 'bg-gray-300 dark:bg-neutral-600'}`}>
        <div className={`w-3 h-3 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${checked ? 'left-3.5' : 'left-0.5'}`} />
      </div>
      <Icon size={12} className={checked ? 'text-primary-600 dark:text-primary-400' : ''} />
    </button>
  );
}

function taskChipColor(t, colorPriority) {
  if (t.status === 'COMPLETED') return 'bg-gray-50 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 line-through';
  if (colorPriority) {
    if (t.priority === 'HIGH') return 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300';
    if (t.priority === 'MEDIUM') return 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300';
    return 'bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400';
  }
  return 'bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-300';
}

function DayAgendaView({ tasks, habits, todayStr, colorPriority, onDayClick, onToggleTask, onToggleHabit }) {
  const d = new Date(todayStr + 'T00:00:00');
  const dayLabel = dayNames[d.getDay()];
  const fullDate = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const hasContent = tasks.length > 0 || habits.length > 0;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100 leading-tight">Hoy</h2>
          <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1 capitalize">{fullDate}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-5xl font-bold text-primary-600 dark:text-primary-400 leading-none tabular-nums">{d.getDate()}</span>
          <span className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{months[d.getMonth()].slice(0,3)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-5">
        {!hasContent && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={22} className="text-gray-300 dark:text-neutral-600" />
            </div>
            <p className="text-sm text-gray-400 dark:text-neutral-500">Día libre</p>
            <p className="text-xs text-gray-300 dark:text-neutral-600 mt-1">Sin tareas ni hábitos para hoy</p>
          </div>
        )}

        {/* Tasks */}
        {tasks.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-3">Tareas ({tasks.length})</h3>
            <div className="space-y-1.5">
              {tasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => onToggleTask(t)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-left transition-colors group"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${t.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600 group-hover:border-primary-400'}`}>
                    {t.status === 'COMPLETED' && <Check size={11} className="text-white m-auto" strokeWidth={3} />}
                  </div>
                  <span className={`text-sm flex-1 truncate transition-colors ${t.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-900 dark:text-neutral-100'}`}>
                    {t.title}
                  </span>
                  <span className={`badge text-[0.6875rem] ${
                    t.priority === 'HIGH' ? 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400' :
                    t.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400' :
                    'bg-gray-50 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {t.priority === 'HIGH' ? 'Alta' : t.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                  </span>
                  {t.category && (
                    <span className="text-[0.6875rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: t.category.color + '18', color: t.category.color }}>
                      {t.category.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Habits */}
        {habits.length > 0 && (
          <div className={`${tasks.length > 0 ? 'pt-4 border-t border-gray-50 dark:border-neutral-700' : ''}`}>
            <h3 className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-3">Hábitos ({habits.length})</h3>
            <div className="space-y-1.5">
              {habits.map(h => (
                <button
                  key={h.id}
                  onClick={() => onToggleHabit(h)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors group ${
                    h.completedToday
                      ? 'bg-gray-50 dark:bg-neutral-800/50 hover:bg-gray-100 dark:hover:bg-neutral-800'
                      : 'hover:bg-amber-50 dark:hover:bg-amber-500/5'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                    h.completedToday ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600 group-hover:border-amber-400 dark:group-hover:border-amber-500'
                  }`}>
                    {h.completedToday && <Check size={11} className="text-white m-auto" strokeWidth={3} />}
                  </div>
                  <Flame size={16} className={`flex-shrink-0 ${h.completedToday ? 'text-gray-300 dark:text-neutral-600' : 'text-orange-400 dark:text-orange-500'}`} />
                  <span className={`text-sm flex-1 truncate ${h.completedToday ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-900 dark:text-neutral-100'}`}>
                    {h.name}
                  </span>
                  <span className={`text-xs ${h.completedToday ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-neutral-500'}`}>
                    {h.completedToday ? 'Hecho' : 'Pendiente'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MultiDayView({ calView, allTasks, todayStr, yesterdayStr, tomorrowStr, onDayClick, colorPriority, showHabits, allHabits }) {
  let days = [];
  if (calView === 'day') {
    const d = new Date(todayStr + 'T00:00:00');
    days = [{ date: todayStr, label: dayNames[d.getDay()], dayNum: d.getDate(), month: months[d.getMonth()].slice(0,3), isToday: true }];
  } else if (calView === '3day') {
    const yd = new Date(yesterdayStr + 'T00:00:00');
    const td = new Date(todayStr + 'T00:00:00');
    const tmd = new Date(tomorrowStr + 'T00:00:00');
    days = [
      { date: yesterdayStr, label: dayNames[yd.getDay()], dayNum: yd.getDate(), month: months[yd.getMonth()].slice(0,3), isToday: false, isAyer: true },
      { date: todayStr, label: dayNames[td.getDay()], dayNum: td.getDate(), month: months[td.getMonth()].slice(0,3), isToday: true },
      { date: tomorrowStr, label: dayNames[tmd.getDay()], dayNum: tmd.getDate(), month: months[tmd.getMonth()].slice(0,3), isToday: false, isManana: true },
    ];
  } else {
    const dow = new Date(todayStr).getDay();
    const monday = new Date(todayStr); monday.setDate(parseInt(todayStr.slice(8)) - (dow === 0 ? 6 : dow - 1));
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, label: weekDays[i], dayNum: d.getDate(), month: months[d.getMonth()].slice(0,3), isToday: ds === todayStr });
    }
  }

  if (days.length === 0) return null;

  return (
    <div className={`grid gap-2 ${days.length === 1 ? '' : days.length === 3 ? 'grid-cols-3' : 'grid-cols-7'}`}>
      {days.map(day => {
        const dayTasks = allTasks[day.date] || [];
        const habitsToday = showHabits ? (allHabits || []) : [];
        const isDayView = days.length === 1;
        const isCompact = days.length === 7;
        return (
          <button
            key={day.date}
            onClick={() => onDayClick(day.date, dayTasks)}
            className={`rounded-lg text-left transition-all overflow-hidden ${
              isDayView ? 'min-h-[400px] p-4' : isCompact ? 'min-h-[100px] p-1.5' : 'min-h-[220px] p-3'
            } ${day.isToday ? 'ring-2 ring-primary-400 dark:ring-primary-500 bg-white dark:bg-neutral-900 ring-offset-0' : 'bg-white dark:bg-neutral-900 card'}`}
          >
            <div className={`flex items-center justify-between ${isDayView ? 'mb-4' : 'mb-2'}`}>
              <div>
                <span className={`${isDayView ? 'text-sm font-semibold' : isCompact ? 'text-[0.6875rem] font-medium' : 'text-xs font-semibold'} ${day.isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-neutral-200'}`}>
                  {day.isAyer ? 'Ayer' : day.isManana ? 'Mañana' : day.isToday ? 'Hoy' : day.label}
                </span>
                {isDayView && (
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">{day.label}, {day.dayNum} de {day.month}</p>
                )}
              </div>
              <span className={`${isDayView ? 'text-2xl font-bold' : isCompact ? 'text-sm font-semibold' : 'text-xl font-bold'} ${day.isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-neutral-100'}`}>
                {day.dayNum}
                {!isDayView && <span className={`${isDayView ? 'text-sm font-normal ml-1' : isCompact ? 'text-[0.625rem] font-normal ml-0.5' : 'text-xs font-normal ml-1'} text-gray-400 dark:text-neutral-500`}>{day.month}</span>}
              </span>
            </div>
            <div className={`space-y-${isDayView ? '1.5' : '1'}`}>
              {dayTasks.slice(0, isDayView ? 12 : isCompact ? 3 : 6).map(t => (
                <div key={t.id} className={`${isCompact ? 'text-[0.6875rem] px-1 py-0.5' : 'text-xs px-2 py-1'} rounded truncate ${taskChipColor(t, colorPriority)}`}>
                  {t.title}
                </div>
              ))}
              {dayTasks.length > (isDayView ? 12 : isCompact ? 3 : 6) && (
                <p className={`${isCompact ? 'text-[0.625rem]' : 'text-xs'} text-gray-400 dark:text-neutral-500 pl-1`}>+{dayTasks.length - (isDayView ? 12 : isCompact ? 3 : 6)} más</p>
              )}
              {dayTasks.length === 0 && isDayView && (
                <p className="text-sm text-gray-300 dark:text-neutral-600 py-8 text-center">Sin tareas</p>
              )}
              {showHabits && habitsToday.length > 0 && (
                <div className={`flex flex-wrap gap-1 ${isDayView ? 'mt-3 pt-3 border-t border-gray-50 dark:border-neutral-800' : 'mt-1'}`}>
                  {habitsToday.slice(0, isDayView ? 10 : 3).map(h => (
                    <div key={h.id} className={`${isCompact ? 'text-[0.625rem] px-1 py-0.5' : 'text-xs px-1.5 py-0.5'} rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 truncate ${h.completedToday ? 'line-through opacity-60' : 'font-medium'}`}>
                      {h.name}
                    </div>
                  ))}
                  {habitsToday.length > (isDayView ? 10 : 3) && (
                    <span className={`${isCompact ? 'text-[0.625rem]' : 'text-xs'} text-gray-400 dark:text-neutral-500`}>+{habitsToday.length - (isDayView ? 10 : 3)}</span>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MonthView({ date, allTasks, todayStr, onPrev, onNext, onDayClick, colorPriority, showHabits, allHabits }) {
  const year = date.getFullYear(); const month = date.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="btn-ghost btn-sm p-1.5"><ChevronLeft size={16} /></button>
        <span className="text-sm font-semibold text-gray-700 dark:text-neutral-200">{months[month - 1]} {year}</span>
        <button onClick={onNext} className="btn-ghost btn-sm p-1.5"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {weekDays.map(d => <div key={d} className="text-xs font-medium text-gray-400 dark:text-neutral-500 py-2">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} className="py-1" />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1; const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`; const isToday = dateStr === todayStr;
          const dayTasks = allTasks[dateStr] || [];
          const count = dayTasks.length;
          return (
            <button key={day} onClick={() => onDayClick(dateStr, dayTasks)}
              className={`py-1.5 rounded-md text-center transition-all hover:bg-gray-50 dark:hover:bg-neutral-800 ${isToday ? 'bg-primary-50 dark:bg-primary-500/10' : ''}`}>
              <span className={`text-xs font-semibold ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-neutral-300'}`}>{day}</span>
              {count > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {Array.from({ length: Math.min(count, 3) }).map((_, j) => {
                    const t = dayTasks[j];
                    const cls = t.status === 'COMPLETED'
                      ? 'bg-gray-200 dark:bg-neutral-700'
                      : colorPriority
                        ? t.priority === 'HIGH' ? 'bg-red-400 dark:bg-red-500' : t.priority === 'MEDIUM' ? 'bg-orange-400 dark:bg-orange-500' : 'bg-gray-400 dark:bg-gray-500'
                        : 'bg-primary-400 dark:bg-primary-500';
                    return <div key={j} className={`w-1.5 h-1.5 rounded-full ${cls}`} />;
                  })}
                  {count > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-neutral-600" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayModal({ date, tasks, onClose, onToggleTask, onQuickTask, pendingHabits, onToggleHabit, showHabits }) {
  const modalRef = useRef(null);
  const d = new Date(date + 'T00:00:00');
  const dayName = dayNames[d.getDay()];
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
      <div ref={modalRef} tabIndex={-1} className="relative w-full max-w-md mx-4 bg-white dark:bg-neutral-900 rounded-lg shadow-modal animate-scale-in max-h-[85vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 h-12 border-b border-gray-100 dark:border-neutral-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100">{dayName}, {displayDate}</h2>
          <div className="flex items-center gap-1">
            <button onClick={onQuickTask} className="btn-ghost btn-sm gap-1"><Plus size={12} />Tarea</button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"><X size={16} /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {tasks.length === 0 && (!isToday || (pendingHabits.length === 0)) && (
            <p className="text-sm text-gray-400 dark:text-neutral-500 text-center py-4">Sin tareas para este día</p>
          )}
          {tasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Tareas ({tasks.length})</h3>
              <div className="space-y-1">
                {tasks.map(t => (
                  <button key={t.id} onClick={() => onToggleTask(t)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800 text-left transition-colors group">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all ${t.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600 group-hover:border-primary-400'}`}>
                      {t.status === 'COMPLETED' && <Check size={10} className="text-white m-auto" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm flex-1 truncate ${t.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-900 dark:text-neutral-100'}`}>{t.title}</span>
                    {t.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: t.category.color + '18', color: t.category.color }}>{t.category.name}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isToday && pendingHabits.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Hábitos pendientes ({pendingHabits.length})</h3>
              <div className="flex flex-wrap gap-2">
                {pendingHabits.map(h => (
                  <button key={h.id} onClick={() => onToggleHabit(h)} className="card px-3 py-2 flex items-center gap-2 text-sm hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/30 dark:hover:bg-primary-500/5 transition-all group">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-neutral-600 group-hover:border-primary-400 flex-shrink-0 transition-colors" />
                    <Flame size={14} className="text-orange-400 dark:text-orange-500" />
                    <span className="text-gray-700 dark:text-neutral-200">{h.name}</span>
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
