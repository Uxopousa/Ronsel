import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data)).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Cargando...</p>;
  if (!data) return <p className="text-gray-400">Error al cargar el dashboard.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inicio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Tareas hoy" count={data.tasksToday?.length || 0} link="/tasks" color="indigo" />
        <SummaryCard title="Hábitos pendientes" count={data.pendingHabits?.length || 0} link="/habits" color="emerald" />
        <SummaryCard title="Objetivos activos" count={data.activeGoals?.length || 0} link="/goals" color="amber" />
      </div>

      {data.nextMilestones?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Próximos hitos</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
            {data.nextMilestones.map((m) => (
              <div key={m.id} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-gray-600">{m.title}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {m.goal.title} · {new Date(m.dueDate).toLocaleDateString('es-ES')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.week && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Vista semanal</h2>
          <div className="grid grid-cols-7 gap-2">
            {data.week.map((day) => {
              const date = new Date(day.date + 'T00:00:00');
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={day.date}
                  className={`bg-white rounded-lg p-2 shadow-sm border min-h-[100px] ${
                    isToday ? 'border-indigo-400 ring-1 ring-indigo-200' : 'border-gray-100'
                  }`}
                >
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    {date.getDate()}
                  </p>
                  <div className="space-y-1">
                    {day.tasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-600 line-through'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {day.tasks.length > 3 && (
                      <p className="text-[10px] text-gray-400">+{day.tasks.length - 3} más</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {data.activeGoals?.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Objetivos activos</h2>
          <div className="space-y-3">
            {data.activeGoals.map((goal) => (
              <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!data.tasksToday?.length && !data.pendingHabits?.length && !data.activeGoals?.length && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Bienvenido a Ronsel. No tienes nada pendiente hoy.</p>
          <Link to="/tasks" className="text-sm text-indigo-600 hover:underline">Crear tu primera tarea</Link>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, count, link, color }) {
  const colors = { indigo: 'bg-indigo-50 text-indigo-700', emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700' };
  return (
    <Link to={link} className={`p-4 rounded-xl ${colors[color]} hover:brightness-95 transition block`}>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm mt-1">{title}</p>
    </Link>
  );
}
