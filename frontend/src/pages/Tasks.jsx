import { useState, useEffect, useMemo } from 'react';
import * as taskService from '../services/tasks';
import * as categoryService from '../services/categories';
import * as goalService from '../services/goals';
import TaskModal from '../components/shared/TaskModal';
import CategoryModal from '../components/shared/CategoryModal';
import { useToast } from '../components/ui/Toast';
import {
  Plus, Settings2, Edit3, Trash2, Check, Search,
  SlidersHorizontal, ChevronLeft, ChevronRight, CalendarDays, List, X, ListTodo,
} from 'lucide-react';

const statusLabels = { PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', COMPLETED: 'Completada', CANCELLED: 'Cancelada' };
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(null);
  const [catModal, setCatModal] = useState(false);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', categoryId: '', goalId: '', sortBy: 'createdAt', sortOrder: 'desc' });
  const [calDate, setCalDate] = useState(new Date());
  const addToast = useToast();

  function buildQuery() {
    const q = { ...filters };
    const today = new Date(); today.setHours(0, 0, 0, 0); const todayStr = today.toISOString();
    if (view === 'calendar') {
      const year = calDate.getFullYear(); const month = calDate.getMonth() + 1;
      q.dueDateFrom = `${year}-${String(month).padStart(2, '0')}-01`;
      q.dueDateTo = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
    }
    if (quickFilter === 'today') { q.dueDateFrom = todayStr; q.dueDateTo = new Date(today.getTime() + 86400000).toISOString(); }
    else if (quickFilter === 'week') {
      const monday = new Date(today); monday.setDate(monday.getDate() - (monday.getDay() === 0 ? 6 : monday.getDay() - 1)); monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 7);
      q.dueDateFrom = monday.toISOString(); q.dueDateTo = sunday.toISOString();
    } else if (quickFilter === 'overdue') { q.dueDateTo = todayStr; q.status = 'PENDING'; }
    return q;
  }

  function loadTasks() {
    setLoading(true);
    const q = buildQuery();
    taskService.getTasks(q).then(t => {
      if (search.trim()) { const s = search.toLowerCase(); t = t.filter(t => t.title.toLowerCase().includes(s)); }
      setTasks(t);
    }).catch(() => { addToast('Error al cargar tareas', 'error'); }).finally(() => setLoading(false));
  }

  function loadCategories() { categoryService.getCategories().then(setCategories).catch(() => {}); }
  function loadGoals() { goalService.getGoals().then(setGoals).catch(() => {}); }

  useEffect(() => { loadTasks(); }, [filters, quickFilter, search, view, calDate]);
  useEffect(() => { loadCategories(); loadGoals(); }, []);

  async function handleSave(task) {
    try {
      if (task.id) await taskService.updateTask(task.id, task); else await taskService.createTask(task);
      addToast(task.id ? 'Tarea actualizada' : 'Tarea creada', 'success'); setTaskModal(null); loadTasks();
    } catch (err) { addToast(err.response?.data?.error || 'Error al guardar la tarea', 'error'); }
  }

  async function handleDelete(id) {
    try { await taskService.deleteTask(id); addToast('Tarea eliminada', 'success'); loadTasks(); }
    catch (err) { addToast(err.response?.data?.error || 'Error al eliminar la tarea', 'error'); }
  }

  async function handleToggleComplete(task) {
    try {
      const ns = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await taskService.updateTask(task.id, { status: ns });
      addToast(ns === 'COMPLETED' ? 'Tarea completada' : 'Tarea pendiente', 'success'); loadTasks();
    } catch (err) { addToast(err.response?.data?.error || 'Error al actualizar la tarea', 'error'); }
  }

  const monthTasks = useMemo(() => {
    if (view !== 'calendar') return {};
    const grouped = {};
    for (const t of tasks) { if (!t.dueDate) continue; const d = t.dueDate.slice(0, 10); if (!grouped[d]) grouped[d] = []; grouped[d].push(t); }
    return grouped;
  }, [tasks, view]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Tareas</h1>
        <div className="flex gap-2">
          <button onClick={() => setCatModal(true)} className="btn-secondary btn-sm gap-1.5"><Settings2 size={13} /> Categorías</button>
          <button onClick={() => setTaskModal({})} className="btn-primary btn-sm gap-1.5"><Plus size={14} /> Nueva tarea</button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
          <input type="text" placeholder="Buscar tareas..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 pr-8 text-sm h-9" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"><X size={14} /></button>}
        </div>
        <div className="relative">
          <button onClick={() => setFilterOpen(!filterOpen)} className={`btn-secondary btn-sm gap-1.5 ${filterOpen ? 'bg-gray-100 dark:bg-neutral-800' : ''}`}><SlidersHorizontal size={13} />Filtros{(filters.status || filters.priority || filters.categoryId || filters.goalId) && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />}</button>
          {filterOpen && <FilterPanel filters={filters} categories={categories} goals={goals} onChange={f => setFilters(f)} onClose={() => setFilterOpen(false)} />}
        </div>
        <select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value, sortOrder: e.target.value === 'dueDate' ? 'asc' : 'desc' })} className="select text-xs py-1.5 w-28">
          <option value="createdAt">Fecha creación</option><option value="dueDate">Fecha límite</option><option value="priority">Prioridad</option>
        </select>
        <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-md p-0.5 gap-0.5">
          <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'}`}><List size={14} /></button>
          <button onClick={() => setView('calendar')} className={`p-1.5 rounded ${view === 'calendar' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300'}`}><CalendarDays size={14} /></button>
        </div>
      </div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {[{ key: 'today', label: 'Hoy' },{ key: 'week', label: 'Esta semana' },{ key: 'overdue', label: 'Vencidas' }].map(qf => (
          <button key={qf.key} onClick={() => setQuickFilter(quickFilter === qf.key ? '' : qf.key)}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${quickFilter === qf.key ? 'bg-primary-600 dark:bg-primary-500 text-white' : 'bg-white dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>{qf.label}</button>
        ))}
        {quickFilter && <button onClick={() => setQuickFilter('')} className="px-2.5 py-1 text-xs rounded-md text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"><X size={12} /></button>}
      </div>

      {loading && <p className="text-gray-400 dark:text-neutral-500 text-sm py-8 text-center">Cargando...</p>}

      {!loading && view === 'list' && (<>
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3"><ListTodo size={20} className="text-gray-400 dark:text-neutral-500" /></div>
            <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
              {quickFilter === 'today' ? 'No tienes tareas para hoy' : quickFilter === 'week' ? 'No tienes tareas esta semana' : quickFilter === 'overdue' ? 'No tienes tareas vencidas' : search ? 'No se encontraron tareas' : 'No tienes tareas'}
            </p>
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{search ? 'Prueba con otros términos' : 'Crea una nueva tarea para empezar'}</p>
            {!search && <button onClick={() => setTaskModal({})} className="btn-primary btn-sm mt-4 gap-1.5"><Plus size={14} /> Nueva tarea</button>}
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-neutral-800 card overflow-hidden">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                <button onClick={() => handleToggleComplete(task)} className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${task.status === 'COMPLETED' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500'}`}>{task.status === 'COMPLETED' && <Check size={12} className="text-white" strokeWidth={3} />}</button>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className={`text-sm truncate ${task.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-neutral-600' : 'text-gray-900 dark:text-neutral-100'}`}>{task.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[0.625rem] text-gray-400 dark:text-neutral-500">
                  {task.goal && <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-neutral-800 rounded font-medium text-gray-500 dark:text-neutral-400">{task.goal.title}</span>}
                  {task.category && <span className="px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: task.category.color + '18', color: task.category.color }}>{task.category.name}</span>}
                  {task.dueDate && <span className="hidden sm:inline">{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>}
                  <span className={`badge ${task.priority === 'HIGH' ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400' : task.priority === 'MEDIUM' ? 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400' : 'bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400'}`}>{task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}</span>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setTaskModal(task)} className="btn-ghost btn-sm p-1.5"><Edit3 size={12} /></button>
                  <button onClick={() => handleDelete(task.id)} className="btn-ghost btn-sm p-1.5 hover:text-red-500 dark:hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>)}

      {!loading && view === 'calendar' && (
        <CalendarView date={calDate} monthTasks={monthTasks} onPrev={() => { const d = new Date(calDate); d.setMonth(d.getMonth() - 1); setCalDate(d); }} onNext={() => { const d = new Date(calDate); d.setMonth(d.getMonth() + 1); setCalDate(d); }} onDayClick={() => {}} />
      )}

      {taskModal && <TaskModal task={taskModal} categories={categories} goals={goals} onSave={handleSave} onClose={() => setTaskModal(null)} />}
      {catModal && <CategoryModal categories={categories} onChange={() => { loadCategories(); loadTasks(); }} onClose={() => setCatModal(false)} />}
    </div>
  );
}

function FilterPanel({ filters, categories, goals, onChange, onClose }) {
  return (
    <div className="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-dropdown border border-gray-100 dark:border-neutral-800 p-3 z-10 animate-fade-in" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Filtros</span>
        <button onClick={onClose} className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"><X size={12} /></button>
      </div>
      <div className="space-y-2">
        <div><label className="text-[0.625rem] text-gray-400 dark:text-neutral-500 font-medium">Estado</label><select value={filters.status} onChange={e => onChange({ ...filters, status: e.target.value })} className="select text-xs py-1.5 mt-0.5"><option value="">Todos</option>{Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="text-[0.625rem] text-gray-400 dark:text-neutral-500 font-medium">Prioridad</label><select value={filters.priority} onChange={e => onChange({ ...filters, priority: e.target.value })} className="select text-xs py-1.5 mt-0.5"><option value="">Todas</option><option value="HIGH">Alta</option><option value="MEDIUM">Media</option><option value="LOW">Baja</option></select></div>
        <div><label className="text-[0.625rem] text-gray-400 dark:text-neutral-500 font-medium">Categoría</label><select value={filters.categoryId} onChange={e => onChange({ ...filters, categoryId: e.target.value })} className="select text-xs py-1.5 mt-0.5"><option value="">Todas</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className="text-[0.625rem] text-gray-400 dark:text-neutral-500 font-medium">Objetivo</label><select value={filters.goalId} onChange={e => onChange({ ...filters, goalId: e.target.value })} className="select text-xs py-1.5 mt-0.5"><option value="">Todos</option>{goals.filter(g => g.status === 'ACTIVE').map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select></div>
      </div>
      <button onClick={() => onChange({ status: '', priority: '', categoryId: '', goalId: '', sortBy: filters.sortBy, sortOrder: filters.sortOrder })} className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">Limpiar filtros</button>
    </div>
  );
}

function CalendarView({ date, monthTasks, onPrev, onNext }) {
  const year = date.getFullYear(); const month = date.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const todayStr = new Date().toISOString().slice(0, 10);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="btn-ghost btn-sm p-1.5"><ChevronLeft size={16} /></button>
        <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{months[month - 1]} {year}</span>
        <button onClick={onNext} className="btn-ghost btn-sm p-1.5"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map(d => <div key={d} className="text-[0.625rem] text-gray-400 dark:text-neutral-500 font-medium text-center py-1.5">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1; const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr; const dayTasks = monthTasks[dateStr] || [];
          return (
            <div key={day} className={`p-1.5 rounded-md text-left min-h-[64px] transition-all ${isToday ? 'ring-1 ring-primary-300 dark:ring-primary-600 bg-primary-50/30 dark:bg-primary-950/30' : 'hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>
              <span className={`text-xs font-medium ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-neutral-400'}`}>{day}</span>
              <div className="mt-0.5 space-y-0.5">
                {dayTasks.slice(0, 2).map(t => <div key={t.id} className={`text-[0.5rem] px-0.5 py-0.5 rounded truncate leading-tight ${t.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' : 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'}`}>{t.title}</div>)}
                {dayTasks.length > 2 && <p className="text-[0.5rem] text-gray-400 dark:text-neutral-500">+{dayTasks.length - 2}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
