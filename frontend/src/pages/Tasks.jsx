import { useState, useEffect } from 'react';
import * as taskService from '../services/tasks';
import * as categoryService from '../services/categories';
import * as goalService from '../services/goals';
import TaskModal from '../components/shared/TaskModal';
import CategoryModal from '../components/shared/CategoryModal';

const statusLabels = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const priorityStyles = {
  HIGH: 'text-red-600 bg-red-50',
  MEDIUM: 'text-yellow-600 bg-yellow-50',
  LOW: 'text-gray-500 bg-gray-100',
};

const statusStyles = {
  PENDING: 'border-gray-300',
  IN_PROGRESS: 'border-blue-400',
  COMPLETED: 'border-emerald-400 bg-emerald-50',
  CANCELLED: 'border-gray-200 text-gray-400',
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    categoryId: '',
    goalId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [taskModal, setTaskModal] = useState(null);
  const [catModal, setCatModal] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadTasks() {
    setLoading(true);
    taskService.getTasks(filters).then(setTasks).finally(() => setLoading(false));
  }

  function loadCategories() {
    categoryService.getCategories().then(setCategories);
  }

  function loadGoals() {
    goalService.getGoals().then(setGoals);
  }

  useEffect(() => { loadTasks(); }, [filters]);
  useEffect(() => { loadCategories(); loadGoals(); }, []);

  async function handleSave(task) {
    if (task.id) {
      await taskService.updateTask(task.id, task);
    } else {
      await taskService.createTask(task);
    }
    setTaskModal(null);
    loadTasks();
  }

  async function handleDelete(id) {
    await taskService.deleteTask(id);
    loadTasks();
  }

  async function handleToggleComplete(task) {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await taskService.updateTask(task.id, { status: newStatus });
    loadTasks();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tareas</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCatModal(true)}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Categorías
          </button>
          <button
            onClick={() => setTaskModal({})}
            className="text-sm px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Nueva tarea
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="">Todos los estados</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="">Todas las prioridades</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>

        <select
          value={filters.categoryId}
          onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={filters.goalId}
          onChange={(e) => setFilters({ ...filters, goalId: e.target.value })}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="">Todos los objetivos</option>
          {goals.filter((g) => g.status === 'ACTIVE').map((g) => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400">Cargando...</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          No hay tareas. Crea tu primera tarea.
        </p>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white border-l-4 ${statusStyles[task.status]} rounded-lg p-4 shadow-sm flex items-center gap-3`}
          >
            <button
              onClick={() => handleToggleComplete(task)}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              {task.status === 'COMPLETED' && (
                <svg viewBox="0 0 20 20" className="text-white">
                  <path fill="currentColor" d="M6 10l2 2 6-6" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium truncate ${
                    task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {task.title}
                </span>
                {task.category && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: task.category.color + '20', color: task.category.color }}
                  >
                    {task.category.name}
                  </span>
                )}
              </div>
              {task.dueDate && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(task.dueDate).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>

            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
              {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
            </span>

            <div className="flex gap-1">
              <button
                onClick={() => setTaskModal(task)}
                className="text-xs text-gray-400 hover:text-indigo-600 px-2 py-1"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-xs text-gray-400 hover:text-red-600 px-2 py-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {taskModal && (
        <TaskModal
          task={taskModal}
          categories={categories}
          goals={goals}
          onSave={handleSave}
          onClose={() => setTaskModal(null)}
        />
      )}

      {catModal && (
        <CategoryModal
          categories={categories}
          onChange={() => { loadCategories(); loadTasks(); }}
          onClose={() => setCatModal(false)}
        />
      )}
    </div>
  );
}
