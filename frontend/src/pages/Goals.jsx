import { useState, useEffect, useCallback } from 'react';
import * as goalService from '../services/goals';
import * as taskService from '../services/tasks';
import GoalModal from '../components/shared/GoalModal';
import { useToast } from '../components/ui/Toast';
import { Plus, Target, ChevronDown, ChevronUp, Check, Plus as PlusIcon } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [goalTasks, setGoalTasks] = useState({});
  const [modal, setModal] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [newTaskText, setNewTaskText] = useState({});
  function load() { goalService.getGoals().then(setGoals).catch(() => {}); }
  useEffect(() => { load(); }, []);

  const loadTasksForGoal = useCallback(async (goalId) => {
    try { const tasks = await taskService.getTasks({ goalId }); setGoalTasks(prev => ({ ...prev, [goalId]: tasks })); }
    catch { addToast('Error al cargar tareas del objetivo', 'error'); }
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
    try {
      await taskService.createTask({ title, goalId });
      setNewTaskText(prev => ({ ...prev, [goalId]: '' }));
      loadTasksForGoal(goalId);
      load();
    } catch (err) { addToast(err.response?.data?.error || 'Error al crear la tarea', 'error'); }
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
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Objetivos</h1>
        <button onClick={() => setModal({})} className="btn-primary btn-sm gap-1.5"><Plus size={14} /> Nuevo objetivo</button>
      </div>

      {goals.length === 0 && (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3"><Target size={20} className="text-gray-400 dark:text-neutral-500" /></div>
          <p className="text-sm text-gray-400 dark:text-neutral-500">No hay objetivos. Crea tu primer objetivo.</p>
        </div>
      )}

      <div className="space-y-1.5">
        {goals.map(goal => {
          const prog = computeProgress(goal);
          const isExpanded = !!expanded[goal.id];
          const tasks = goalTasks[goal.id];
          return (
            <div key={goal.id} className="card overflow-hidden">
              <button onClick={() => toggleExpand(goal)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                <Target size={16} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{goal.title}</span>
                    {goal.status !== 'ACTIVE' && <span className={`badge text-[0.625rem] ${goal.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' : 'bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400'}`}>{goal.status === 'COMPLETED' ? 'Completado' : 'Cancelado'}</span>}
                  </div>
                  {goal.description && <p className="text-xs text-gray-400 dark:text-neutral-500 truncate mt-0.5">{goal.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 dark:text-neutral-500 tabular-nums">{prog.progress}%</span>
                  <div className="w-16 bg-gray-100 dark:bg-neutral-800 rounded-full h-1.5"><div className="bg-primary-500 dark:bg-primary-400 h-1.5 rounded-full transition-all" style={{ width: `${prog.progress}%` }} /></div>
                  {isExpanded ? <ChevronUp size={14} className="text-gray-400 dark:text-neutral-500" /> : <ChevronDown size={14} className="text-gray-400 dark:text-neutral-500" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-50 dark:border-neutral-700 animate-fade-in">
                  <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-neutral-500 mb-3">
                    <span>Progreso: <strong className="text-gray-600 dark:text-neutral-300">{prog.completed}/{prog.total} tareas</strong></span>
                    {goal.targetDate && (<><span>·</span><span>Hasta {new Date(goal.targetDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span></>)}
                  </div>

                  {tasks && tasks.length > 0 && (
                    <div className="space-y-0.5 mb-3">
                      {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800/50 group">
                          <button onClick={() => handleToggleTask(task)} className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${task.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500'}`}>{task.status === 'COMPLETED' && <Check size={9} className="text-white" strokeWidth={3} />}</button>
                          <span className={`text-sm flex-1 truncate ${task.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-700 dark:text-neutral-200'}`}>{task.title}</span>
                          {task.category && <span className="text-[0.625rem] px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: task.category.color + '18', color: task.category.color }}>{task.category.name}</span>}
                          {task.dueDate && <span className="text-[0.625rem] text-gray-400 dark:text-neutral-500">{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {tasks && tasks.length === 0 && <p className="text-xs text-gray-400 dark:text-neutral-500 py-2">Sin tareas asociadas</p>}

                  <div className="flex gap-2">
                    <input type="text" placeholder="Añadir tarea..." value={newTaskText[goal.id] || ''} onChange={e => setNewTaskText(prev => ({ ...prev, [goal.id]: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') handleAddTask(goal.id); }} className="input text-sm flex-1 h-8" />
                    <button onClick={() => handleAddTask(goal.id)} className="btn-primary btn-sm px-2.5"><PlusIcon size={14} /></button>
                  </div>

                  <div className="flex gap-2 mt-3 pt-2 border-t border-gray-50 dark:border-neutral-700">
                    <button onClick={() => setModal(goal)} className="btn-ghost btn-sm text-xs">Editar objetivo</button>
                    <button onClick={() => handleDelete(goal.id)} className="btn-ghost btn-sm text-xs hover:text-red-500 dark:hover:text-red-400">Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modal && <GoalModal goal={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
