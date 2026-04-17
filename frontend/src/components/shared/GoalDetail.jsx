import { useState, useEffect } from 'react';
import * as goalService from '../../services/goals';

export default function GoalDetail({ goal: initial, onClose }) {
  const [goal, setGoal] = useState(null);
  const [newMilestone, setNewMilestone] = useState('');

  function load() {
    goalService.getGoal(initial.id).then(setGoal);
  }

  useEffect(() => { load(); }, [initial.id]);

  if (!goal) return null;

  async function handleToggleMilestone(milestone) {
    await goalService.updateMilestone(goal.id, milestone.id, {
      completed: !milestone.completed,
    });
    load();
  }

  async function handleAddMilestone() {
    if (!newMilestone.trim()) return;
    await goalService.addMilestone(goal.id, { title: newMilestone.trim() });
    setNewMilestone('');
    load();
  }

  async function handleDeleteMilestone(id) {
    await goalService.deleteMilestone(goal.id, id);
    load();
  }

  const tasksByStatus = {
    PENDING: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    CANCELLED: [],
  };
  for (const t of goal.tasks || []) {
    (tasksByStatus[t.status] || tasksByStatus.PENDING).push(t);
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{goal.title}</h2>
            {goal.description && (
              <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(goal.startDate).toLocaleDateString('es-ES')}
              {goal.targetDate && ` → ${new Date(goal.targetDate).toLocaleDateString('es-ES')}`}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <span className="text-lg font-bold text-indigo-600">{goal.progress}%</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Hitos ({goal.milestones.length})</h3>
          <div className="space-y-1 mb-3">
            {goal.milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleMilestone(m)}
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    m.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                  }`}
                >
                  {m.completed && <svg viewBox="0 0 20 20" className="text-white"><path fill="currentColor" d="M6 10l2 2 6-6" /></svg>}
                </button>
                <span className={`text-sm flex-1 ${m.completed ? 'line-through text-gray-400' : ''}`}>
                  {m.title}
                </span>
                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="text-xs text-gray-300 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nuevo hito"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleAddMilestone}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Añadir
            </button>
          </div>
        </div>

        {goal.tasks?.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Tareas asociadas ({goal.tasks.length})</h3>
            <div className="space-y-1">
              {goal.tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                  <span className={`w-2 h-2 rounded-full ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-gray-300'
                  }`} />
                  <span className={t.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}>
                    {t.title}
                  </span>
                  {t.category && (
                    <span className="text-xs" style={{ color: t.category.color }}>{t.category.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
