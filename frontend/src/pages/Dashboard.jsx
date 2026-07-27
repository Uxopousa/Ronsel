import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Plus, Eye, Palette, ChevronRight, Flame, Target } from 'lucide-react';
import api from '../services/api';
import * as taskService from '../services/tasks';
import * as habitService from '../services/habits';
import TaskModal from '../components/shared/TaskModal';
import SummaryCard from '../components/dashboard/SummaryCard';
import ToggleSwitch from '../components/dashboard/ToggleSwitch';
import { MultiDayView, MonthView, AgendaView } from '../components/dashboard/CalendarView';
import DayModal from '../components/dashboard/DayModal';
import { useToast } from '../components/ui/Toast';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { buttonVariants } from '../components/ui/Button';
import { cn } from '../lib/utils';

const LS_VIEW = 'dash_calView';
const LS_SHOW_HABITS = 'dash_showHabits';
const LS_COLOR_PRIORITY = 'dash_colorPriority';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calView, setCalView] = useState(() => localStorage.getItem(LS_VIEW) || '3day');
  const [calDate, setCalDate] = useState(new Date());
  const [agendaStart, setAgendaStart] = useState(() => new Date().toISOString().slice(0, 10));
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
    if (calView === '3day') { from = yesterdayStr; to = afterTomorrow; }
    else if (calView === 'agenda') {
      from = agendaStart;
      const end = new Date(agendaStart + 'T00:00:00');
      end.setDate(end.getDate() + 14);
      to = end.toISOString().slice(0, 10);
    } else {
      const y = calDate.getFullYear(); const m = calDate.getMonth() + 1;
      from = `${y}-${String(m).padStart(2,'0')}-01`;
      to = `${y}-${String(m).padStart(2,'0')}-${new Date(y,m,0).getDate()}`;
    }
    loadTasks(from, to);
  }, [calView, calDate, agendaStart, loadTasks]);

  useEffect(() => {
    if (showHabits) { habitService.getHabits().then(setAllHabits).catch(() => {}); }
  }, [showHabits]);

  function persist(key, val) { localStorage.setItem(key, val); }
  function setView(v) { setCalView(v); persist(LS_VIEW, v); }
  function toggleShowHabits(v) { setShowHabits(v); persist(LS_SHOW_HABITS, v); }
  function toggleColorPriority(v) { setColorPriority(v); persist(LS_COLOR_PRIORITY, v); }
  function navMonth(dir) { const d = new Date(calDate); d.setMonth(d.getMonth() + dir); setCalDate(d); }
  function goAgendaPrev() { const d = new Date(agendaStart + 'T00:00:00'); d.setDate(d.getDate() - 7); setAgendaStart(d.toISOString().slice(0, 10)); }
  function goAgendaNext() { const d = new Date(agendaStart + 'T00:00:00'); d.setDate(d.getDate() + 7); setAgendaStart(d.toISOString().slice(0, 10)); }
  function handleQuickTask(dateStr) { setQuickTask({ dueDate: dateStr }); }
  function handleDayClick(dateStr, tasks) { setDayModal({ date: dateStr, tasks: tasks || [] }); }

  async function handleToggleTask(task) {
    try {
      const ns = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await taskService.updateTask(task.id, { status: ns });
      reloadDashboard();
      let refFrom, refTo;
      if (calView === 'month') {
        refFrom = `${calDate.getFullYear()}-${String(calDate.getMonth()+1).padStart(2,'0')}-01`;
        refTo = `${calDate.getFullYear()}-${String(calDate.getMonth()+1).padStart(2,'0')}-${new Date(calDate.getFullYear(), calDate.getMonth()+1, 0).getDate()}`;
      } else if (calView === 'agenda') {
        refFrom = agendaStart;
        const end = new Date(agendaStart + 'T00:00:00');
        end.setDate(end.getDate() + 14);
        refTo = end.toISOString().slice(0, 10);
      } else {
        refFrom = yesterdayStr;
        const d = new Date(tomorrowStr + 'T00:00:00'); d.setDate(d.getDate() + 1);
        refTo = d.toISOString().slice(0, 10);
      }
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

  if (loading) return <SkeletonDashboard />;
  if (!data) return <p className="text-text-tertiary text-sm py-8 text-center">Error al cargar el dashboard.</p>;

  const overdue = (data.tasksToday || []).filter(t => t.dueDate && t.dueDate.slice(0, 10) < todayStr);
  const todayTasks = (data.tasksToday || []).filter(t => !t.dueDate || t.dueDate.slice(0, 10) === todayStr);
  const hasContent = data.tasksToday?.length || pendingHabits.length || data.activeGoals?.length;
  const goalsWithPendingTasks = (data.activeGoals || []).filter(g => g.totalTasks > g.completedTasks).length;

  return (
    <div className="max-w-[96rem] mx-auto w-full p-5 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary font-display">
          {today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryCard title="Pendientes" count={todayTasks.length} doneLabel="Completadas" link="/tasks" />
        <SummaryCard title="Hábitos" count={pendingHabits.length} doneLabel="Completados" link="/habits" />
        <SummaryCard title="Objetivos" count={data.activeGoals?.length || 0} doneLabel="Sin objetivos" link="/goals" />
      </div>

      {/* Alerts */}
      {overdue.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-error-bg border border-error/20 text-sm text-error-text">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">{overdue.length} tarea{overdue.length !== 1 ? 's' : ''} vencida{overdue.length !== 1 ? 's' : ''}</span>
          <Link to="/tasks" className="text-xs font-medium hover:underline">Ver</Link>
        </div>
      )}

      {todayTasks.length === 0 && pendingHabits.length === 0 && data.activeGoals?.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-success-bg border border-success/20 text-sm text-success-text">
          <CheckCircle size={16} className="flex-shrink-0" />
          <span className="flex-1">
            {goalsWithPendingTasks > 0
              ? `Tareas y hábitos al día · ${goalsWithPendingTasks} ${goalsWithPendingTasks === 1 ? 'objetivo con tareas pendientes' : 'objetivos con tareas pendientes'}`
              : '¡Todo al día! Sin tareas ni hábitos pendientes.'}
          </span>
        </div>
      )}

      {/* Content grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left column */}
        <div className="space-y-6 min-w-0">
          {todayTasks.length > 0 && (
            <section>
              <h2 className="section-title mb-3">Tareas de hoy ({todayTasks.length})</h2>
              <div className="bg-surface-card border border-border rounded-lg divide-y divide-border">
                {todayTasks.map(t => (
                  <button key={t.id} onClick={() => handleToggleTask(t)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-alt transition-colors group"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
                      t.status === 'COMPLETED' ? 'bg-success border-success' : 'border-neutral-300 dark:border-neutral-600 group-hover:border-brand-400'
                    }`}>
                      {t.status === 'COMPLETED' && <CheckCircle size={10} className="text-white m-auto" />}
                    </div>
                    <span className={`text-sm flex-1 truncate transition-colors ${t.status === 'COMPLETED' ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                      {t.title}
                    </span>
                    {t.category && (
                      <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: t.category.color + '18', color: t.category.color }}>
                        {t.category.name}
                      </span>
                    )}
                    {t.dueDate && t.dueDate.slice(0, 10) < todayStr && (
                      <span className="text-[0.625rem] text-error font-medium">Vencida</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {pendingHabits.length > 0 && (
            <section>
              <h2 className="section-title mb-3">Hábitos pendientes ({pendingHabits.length})</h2>
              <div className="flex flex-wrap gap-2">
                {pendingHabits.map(h => (
                  <div key={h.id} className="bg-surface-card border border-border rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                    <button onClick={e => { e.stopPropagation(); handleToggleHabit(h); }}
                      className="w-4 h-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600 hover:border-brand-400 flex-shrink-0 transition-colors"
                    />
                    <Flame size={14} className="text-accent-500 flex-shrink-0" />
                    <button onClick={() => handleToggleHabit(h)}
                      className="text-text-primary hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {h.name}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.activeGoals?.length > 0 && (
            <section>
              <h2 className="section-title mb-3">Objetivos activos</h2>
              <div className="space-y-1">
                {data.activeGoals.map(goal => (
                  <Link key={goal.id} to="/goals"
                    className={`group bg-surface-card border rounded-lg flex items-center gap-3 px-4 py-3 hover:border-border-hover transition-all ${
                      goal.progress >= 100 ? 'border-success/30 bg-success-bg/50' : 'border-border hover:border-border-hover'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      goal.progress >= 100 ? 'bg-success-bg text-success' : 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300'
                    }`}>
                      {goal.progress >= 100 ? <CheckCircle size={16} /> : <Target size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">{goal.title}</span>
                        {goal.progress >= 100 && <span className="badge text-[0.625rem] bg-success-bg text-success-text">Completado</span>}
                      </div>
                      {goal.description && <p className="text-xs text-text-tertiary truncate mt-0.5">{goal.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs tabular-nums whitespace-nowrap ${goal.progress >= 100 ? 'text-success font-medium' : 'text-text-tertiary'}`}>
                        {goal.completedTasks || 0}/{goal.totalTasks || 0}
                      </span>
                      <div className="w-16 bg-surface-alt rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all ${goal.progress >= 100 ? 'bg-success' : 'bg-brand-500 dark:bg-brand-400'}`}
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs tabular-nums w-8 text-right ${goal.progress >= 100 ? 'text-success font-medium' : 'text-text-tertiary'}`}>
                        {goal.progress}%
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-text-tertiary group-hover:text-text-secondary transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!hasContent && (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-success" />
              </div>
              <p className="text-sm text-text-secondary font-medium mb-1">¡Todo al día!</p>
              <p className="text-xs text-text-tertiary mb-4">No tienes tareas ni hábitos pendientes.</p>
              <Link to="/tasks" className={cn(buttonVariants({ variant: 'primary', size: 'md' }))}>Crear una tarea</Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6 min-w-0 lg:sticky lg:top-20">
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="section-title">Calendario</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex bg-surface-alt rounded-lg p-0.5">
                  {[{k:'3day',l:'3 días'},{k:'agenda',l:'Agenda'},{k:'month',l:'Mes'}].map(({k,l}) => (
                    <button key={k} onClick={() => setView(k)}
                      className={`px-2.5 sm:px-3 py-1.5 text-xs rounded font-medium transition-all ${
                        calView === k ? 'bg-surface text-text-primary ring-1 ring-border' : 'text-text-tertiary hover:text-text-primary'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <ToggleSwitch checked={showHabits} onChange={toggleShowHabits} icon={Eye} label="Hábitos" />
                <ToggleSwitch checked={colorPriority} onChange={toggleColorPriority} icon={Palette} label="Prioridad" />
              </div>
            </div>

            {calView === 'month' ? (
              <MonthView date={calDate} allTasks={allTasks} todayStr={todayStr}
                onPrev={() => navMonth(-1)} onNext={() => navMonth(1)}
                onDayClick={handleDayClick} colorPriority={colorPriority}
                showHabits={showHabits} allHabits={allHabits}
              />
            ) : calView === 'agenda' ? (
              <AgendaView startDate={agendaStart} allTasks={allTasks} allHabits={allHabits} todayStr={todayStr}
                showHabits={showHabits} colorPriority={colorPriority}
                onDayClick={handleDayClick} onQuickTask={handleQuickTask}
                onPrev={goAgendaPrev} onNext={goAgendaNext}
              />
            ) : (
              <MultiDayView allTasks={allTasks} todayStr={todayStr}
                yesterdayStr={yesterdayStr} tomorrowStr={tomorrowStr}
                onDayClick={handleDayClick} colorPriority={colorPriority}
                showHabits={showHabits} allHabits={allHabits}
              />
            )}
          </section>
        </div>
      </div>

      {dayModal && (
        <DayModal date={dayModal.date} tasks={dayModal.tasks} onClose={() => setDayModal(null)}
          onToggleTask={handleToggleTask} onQuickTask={() => setQuickTask({ dueDate: dayModal.date })}
          pendingHabits={pendingHabits} onToggleHabit={handleToggleHabit} showHabits={showHabits}
        />
      )}

      {quickTask !== null && (
        <TaskModal task={quickTask} categories={[]} goals={[]}
          onSave={async (t) => {
            try { await taskService.createTask(t); addToast('Tarea creada', 'success'); setQuickTask(null); reloadDashboard(); }
            catch (err) { addToast(err.response?.data?.error || 'Error al crear la tarea', 'error'); }
          }} onClose={() => setQuickTask(null)}
        />
      )}
    </div>
  );
}
