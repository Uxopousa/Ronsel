import { useState, useEffect } from 'react';
import * as goalService from '../services/goals';
import GoalModal from '../components/shared/GoalModal';
import GoalDetail from '../components/shared/GoalDetail';

const statusLabels = { ACTIVE: 'Activo', COMPLETED: 'Completado', CANCELLED: 'Cancelado' };
const statusStyles = {
  ACTIVE: 'text-indigo-600 bg-indigo-50',
  COMPLETED: 'text-emerald-600 bg-emerald-50',
  CANCELLED: 'text-gray-400 bg-gray-100',
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);

  function load() { goalService.getGoals().then(setGoals); }
  useEffect(() => { load(); }, []);

  async function handleSave(data) {
    if (data.id) await goalService.updateGoal(data.id, data);
    else await goalService.createGoal(data);
    setModal(null);
    load();
  }

  async function handleDelete(id) {
    await goalService.deleteGoal(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Objetivos</h1>
        <button
          onClick={() => setModal({})}
          className="text-sm px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Nuevo objetivo
        </button>
      </div>

      {goals.length === 0 && (
        <p className="text-gray-400 text-center py-12">No hay objetivos. Crea tu primer objetivo.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
            onClick={() => setDetail(goal)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{goal.title}</h3>
                {goal.description && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">{goal.description}</p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${statusStyles[goal.status]}`}>
                {statusLabels[goal.status]}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{goal.progress}%</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{goal.milestones.length} hitos · {goal._count?.tasks || 0} tareas</span>
              <span>{new Date(goal.startDate).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        ))}
      </div>

      {modal && <GoalModal goal={modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {detail && (
        <GoalDetail
          goal={detail}
          onClose={() => { setDetail(null); load(); }}
        />
      )}
    </div>
  );
}
