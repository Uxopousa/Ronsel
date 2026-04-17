import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inicio</h1>

      {!data && <p className="text-gray-400">Cargando...</p>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            title="Tareas hoy"
            count={data.tasksToday?.length || 0}
            link="/tasks"
            color="indigo"
          />
          <SummaryCard
            title="Hábitos pendientes"
            count={data.pendingHabits?.length || 0}
            link="/habits"
            color="emerald"
          />
          <SummaryCard
            title="Objetivos activos"
            count={data.activeGoals?.length || 0}
            link="/goals"
            color="amber"
          />
        </div>
      )}

      {data?.tasksToday?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Tareas de hoy</h2>
          <div className="space-y-2">
            {data.tasksToday.map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <span>{task.title}</span>
                <PriorityBadge priority={task.priority} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data?.pendingHabits?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Hábitos de hoy</h2>
          <div className="space-y-2">
            {data.pendingHabits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                {habit.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {data?.activeGoals?.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Objetivos activos</h2>
          <div className="space-y-3">
            {data.activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-gray-500">
                    {goal.progress || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({ title, count, link, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <Link
      to={link}
      className={`p-4 rounded-xl ${colors[color]} hover:brightness-95 transition`}
    >
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm mt-1">{title}</p>
    </Link>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-gray-100 text-gray-500',
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${styles[priority] || styles.LOW}`}
    >
      {priority === 'HIGH' ? 'Alta' : priority === 'MEDIUM' ? 'Media' : 'Baja'}
    </span>
  );
}
