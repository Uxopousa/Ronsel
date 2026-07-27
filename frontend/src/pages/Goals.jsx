import { useState, useEffect, useCallback } from 'react';
import * as goalService from '../services/goals';
import * as taskService from '../services/tasks';
import GoalModal from '../components/shared/GoalModal';
import { useToast } from '../components/ui/Toast';
import { SkeletonGoalsPage } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Plus, Target, ChevronDown, ChevronUp, Check, Plus as PlusIcon, CheckCircle } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [goalTasks, setGoalTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [newTaskText, setNewTaskText] = useState({});
  const [loadingTasks, setLoadingTasks] = useState({});
  const [submittingTask, setSubmittingTask] = useState({});
  function load() { setLoading(true); goalService.getGoals().then(setGoals).catch(() => {}).finally(() => setLoading(false)); }
  useEffect(() => { load(); }, []);

  const loadTasksForGoal = useCallback(async (goalId) => {
    setLoadingTasks(prev => ({ ...prev, [goalId]: true }));
    try { const tasks = await taskService.getTasks({ goalId }); setGoalTasks(prev => ({ ...prev, [goalId]: tasks })); }
    catch { addToast('Error al cargar tareas del objetivo', 'error'); }
    finally { setLoadingTasks(prev => ({ ...prev, [goalId]: false })); }
  }, []);

  function toggleExpand(goal) {
    const willExpand = !expanded[goal.id];
    setExpanded(prev => ({ ...prev, [goal.id]: willExpand }));
    if (willExpand && !goalTasks[goal.id]) loadTasksForGoal(goal.id);
  }

  const addToast = useToast();

  async function handleSave(data) {
    try {
      if (data.id) await goalService.updateGoal(data.id, data); else await goalService.createGoal(data);
      addToast(data.id ? 'Objetivo actualizado' : 'Objetivo creado', 'success'); setModal(null); load();
    } catch (err) { addToast(err.response?.data?.error || 'Error al guardar el objetivo', 'error'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este objetivo y sus tareas asociadas?')) return;
    try { await goalService.deleteGoal(id); addToast('Objetivo eliminado', 'success'); load(); }
    catch (err) { addToast(err.response?.data?.error || 'Error al eliminar el objetivo', 'error'); }
  }

  async function handleToggleTask(task) {
    try {
      const ns = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await taskService.updateTask(task.id, { status: ns });
      addToast(ns === 'COMPLETED' ? 'Tarea completada' : 'Tarea pendiente', 'success');
      loadTasksForGoal(task.goalId);
      load();
    } catch (err) { addToast(err.response?.data?.error || 'Error al actualizar la tarea', 'error'); }
  }

  async function handleAddTask(goalId) {
    const title = newTaskText[goalId]?.trim(); if (!title) return;
    setSubmittingTask(prev => ({ ...prev, [goalId]: true }));
    try {
      await taskService.createTask({ title, goalId });
      setNewTaskText(prev => ({ ...prev, [goalId]: '' }));
      loadTasksForGoal(goalId);
      load();
    } catch (err) { addToast(err.response?.data?.error || 'Error al crear la tarea', 'error'); }
    finally { setSubmittingTask(prev => ({ ...prev, [goalId]: false })); }
  }

  function computeProgress(goal) {
    const tasks = goalTasks[goal.id];
    if (tasks) {
      const completed = tasks.filter(t => t.status === 'COMPLETED').length;
      return { progress: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0, total: tasks.length, completed };
    }
    return {
      progress: goal.progress || 0,
      total: goal.totalTasks || 0,
      completed: goal.completedTasks || 0,
    };
  }

  return (
    <div className="max-w-[96rem] mx-auto w-full px-5 md:px-8 py-5 md:py-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary font-display">Objetivos</h1>
        <Button variant="primary" size="sm" onClick={() => setModal({})}><Plus size={13} />Nuevo objetivo</Button>
      </div>

      {loading && <SkeletonGoalsPage />}

      {!loading && goals.length === 0 && (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center mx-auto mb-3"><Target size={20} className="text-text-tertiary" /></div>
          <p className="text-sm text-text-tertiary">No hay objetivos. Crea tu primer objetivo.</p>
        </div>
      )}

      {!loading && goals.length > 0 && <div className="space-y-1.5">
        {goals.map(goal => {
          const prog = computeProgress(goal);
          const isExpanded = !!expanded[goal.id];
          const tasks = goalTasks[goal.id];
          return (
            <div key={goal.id} className="card overflow-hidden">
              <button onClick={() => toggleExpand(goal)} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-alt transition-colors ${prog.progress >= 100 ? 'border-success/30' : ''}`}>
                {prog.progress >= 100 ? (
                  <CheckCircle size={16} className="text-success-text flex-shrink-0" />
                ) : (
                  <Target size={16} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary truncate">{goal.title}</span>
                    {prog.progress >= 100 && <span className="badge text-[0.625rem] bg-success-bg text-success-text">Completado</span>}
                    {goal.status !== 'ACTIVE' && goal.status !== 'COMPLETED' && <span className="badge text-[0.625rem] bg-surface-alt text-text-secondary">Cancelado</span>}
                  </div>
                  {goal.description && <p className="text-xs text-text-tertiary truncate mt-0.5">{goal.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs tabular-nums whitespace-nowrap ${prog.progress >= 100 ? 'text-success-text font-medium' : 'text-text-tertiary'}`}>
                    {prog.total > 0 ? `${prog.completed}/${prog.total}` : `${prog.progress}%`}
                  </span>
                  <div className="w-16 bg-surface-alt rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${prog.progress >= 100 ? 'bg-success' : 'bg-brand-500 dark:bg-brand-400'}`} style={{ width: `${Math.min(prog.progress, 100)}%` }} />
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-text-tertiary" /> : <ChevronDown size={14} className="text-text-tertiary" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-border animate-fade-in">
                  <div className="flex items-center gap-4 text-xs text-text-tertiary mb-3">
                    <span>Progreso: <strong className="text-text-secondary">{prog.completed}/{prog.total} tareas</strong></span>
                    {goal.targetDate && (<><span>·</span><span>Hasta {new Date(goal.targetDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span></>)}
                  </div>

                  {loadingTasks[goal.id] && (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-5 h-5 border-2 border-brand-600 dark:border-brand-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {!loadingTasks[goal.id] && tasks && tasks.length > 0 && (
                    <div className="space-y-0.5 mb-3">
                      {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-surface-alt group">
                          <button onClick={() => handleToggleTask(task)} className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${task.status === 'COMPLETED' ? 'bg-success border-success' : 'border-neutral-300 dark:border-neutral-600 hover:border-brand-400 dark:hover:border-brand-500'}`}>{task.status === 'COMPLETED' && <Check size={9} className="text-white" strokeWidth={3} />}</button>
                          <span className={`text-sm flex-1 truncate ${task.status === 'COMPLETED' ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>{task.title}</span>
                          {task.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: task.category.color + '18', color: task.category.color }}>{task.category.name}</span>}
                          {task.dueDate && <span className="text-[0.625rem] text-text-tertiary">{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingTasks[goal.id] && tasks && tasks.length === 0 && <p className="text-xs text-text-tertiary py-2">Sin tareas asociadas</p>}

                  <div className="flex gap-2">
                    <input type="text" placeholder="Añadir tarea..." value={newTaskText[goal.id] || ''} onChange={e => setNewTaskText(prev => ({ ...prev, [goal.id]: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') handleAddTask(goal.id); }} className="input text-sm flex-1 h-8" disabled={submittingTask[goal.id]} />
                    <Button variant="primary" size="sm" className="px-2.5" onClick={() => handleAddTask(goal.id)} disabled={submittingTask[goal.id]}>
                      {submittingTask[goal.id] ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <PlusIcon size={13} />}
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setModal(goal)}>Editar objetivo</Button>
                    <Button variant="ghost" size="sm" className="text-xs hover:text-error" onClick={() => handleDelete(goal.id)}>Eliminar</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>}

      {modal && <GoalModal goal={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
