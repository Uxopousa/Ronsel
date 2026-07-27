import { useState, useEffect, useMemo } from 'react';
import * as taskService from '../services/tasks';
import * as categoryService from '../services/categories';
import * as goalService from '../services/goals';
import TaskModal from '../components/shared/TaskModal';
import CategoryModal from '../components/shared/CategoryModal';
import { useToast } from '../components/ui/Toast';
import { SkeletonTasksPage } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Plus, Settings2, Edit3, Trash2, Check, Search, SlidersHorizontal, ChevronLeft, ChevronRight, CalendarDays, List, X, ListTodo } from 'lucide-react';
import { STATUS_LABELS, MONTHS, WEEK_DAYS } from '../constants';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(null);
  const [catModal, setCatModal] = useState(false);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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
      if (debouncedSearch.trim()) { const s = debouncedSearch.toLowerCase(); t = t.filter(t => t.title.toLowerCase().includes(s)); }
      setTasks(t);
    }).catch(() => { addToast('Error al cargar tareas', 'error'); }).finally(() => setLoading(false));
  }

  function loadCategories() { categoryService.getCategories().then(setCategories).catch(() => {}); }
  function loadGoals() { goalService.getGoals().then(setGoals).catch(() => {}); }

  useEffect(() => { loadTasks(); }, [filters, quickFilter, debouncedSearch, view, calDate]);
  useEffect(() => { loadCategories(); loadGoals(); }, []);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  async function handleSave(task) {
    try {
      if (task.id) await taskService.updateTask(task.id, task); else await taskService.createTask(task);
      addToast(task.id ? 'Tarea actualizada' : 'Tarea creada', 'success'); setTaskModal(null); loadTasks();
    } catch (err) { addToast(err.response?.data?.error || 'Error al guardar la tarea', 'error'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
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

  const monthTasks = tasks.reduce((acc, t) => {
    if (!t.dueDate) return acc;
    const d = t.dueDate.slice(0, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(t);
    return acc;
  }, {});

  return (
    <div className="max-w-[96rem] mx-auto w-full p-5 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary font-display">Tareas</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setCatModal(true)}><Settings2 size={13} />Categorías</Button>
          <Button variant="primary" size="sm" onClick={() => setTaskModal({})}><Plus size={13} />Nueva tarea</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" placeholder="Buscar tareas..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 pr-8 text-sm h-9 w-full" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"><X size={14} /></button>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="secondary" size="sm" onClick={() => setFilterOpen(!filterOpen)} className={filterOpen ? 'bg-surface-alt' : ''}>
              <SlidersHorizontal size={13} />Filtros
              {(filters.status || filters.priority || filters.categoryId || filters.goalId) && <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />}
            </Button>
            {filterOpen && <FilterPanel filters={filters} categories={categories} goals={goals} onChange={f => setFilters(f)} onClose={() => setFilterOpen(false)} />}
          </div>
          <select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value, sortOrder: e.target.value === 'dueDate' ? 'asc' : 'desc' })} className="select text-xs py-1.5 w-auto min-w-0 sm:min-w-[7rem]">
            <option value="createdAt">Creación</option><option value="dueDate">Fecha límite</option><option value="priority">Prioridad</option>
          </select>
          <div className="flex bg-surface-alt rounded-lg p-0.5 gap-0.5">
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-surface text-text-primary ring-1 ring-border' : 'text-text-tertiary hover:text-text-primary'}`} title="Lista"><List size={14} /></button>
            <button onClick={() => setView('calendar')} className={`p-1.5 rounded ${view === 'calendar' ? 'bg-surface text-text-primary ring-1 ring-border' : 'text-text-tertiary hover:text-text-primary'}`} title="Calendario"><CalendarDays size={14} /></button>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {[{ key: 'today', label: 'Hoy' },{ key: 'week', label: 'Esta semana' },{ key: 'overdue', label: 'Vencidas' }].map(qf => (
          <button key={qf.key} onClick={() => setQuickFilter(quickFilter === qf.key ? '' : qf.key)}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${quickFilter === qf.key ? 'bg-brand-600 text-white' : 'bg-surface-card text-text-secondary border border-border hover:text-text-primary'}`}>{qf.label}</button>
        ))}
        {quickFilter && <button onClick={() => setQuickFilter('')} className="px-2.5 py-1 text-xs rounded-md text-text-tertiary hover:text-text-primary"><X size={12} /></button>}
      </div>

      {loading && <SkeletonTasksPage />}

      {!loading && view === 'list' && (
        <>
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center mx-auto mb-3"><ListTodo size={20} className="text-text-tertiary" /></div>
              <p className="text-sm text-text-secondary font-medium">
                {quickFilter === 'today' ? 'No tienes tareas para hoy' : quickFilter === 'week' ? 'No tienes tareas esta semana' : quickFilter === 'overdue' ? 'No tienes tareas vencidas' : search ? 'No se encontraron tareas' : 'No tienes tareas'}
              </p>
              <p className="text-xs text-text-tertiary mt-1">{search ? 'Prueba con otros términos' : 'Crea una nueva tarea para empezar'}</p>
              {!search && <Button variant="primary" size="sm" className="mt-4" onClick={() => setTaskModal({})}><Plus size={13} />Nueva tarea</Button>}
            </div>
          ) : (
            <div className="divide-y divide-border bg-surface-card border border-border rounded-lg overflow-hidden">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-alt transition-colors group">
                  <button onClick={() => handleToggleComplete(task)}
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${task.status === 'COMPLETED' ? 'bg-success border-success' : 'border-neutral-300 dark:border-neutral-600 hover:border-brand-400 dark:hover:border-brand-500'}`}>
                    {task.status === 'COMPLETED' && <Check size={12} className="text-white" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className={`text-sm truncate ${task.status === 'COMPLETED' ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.625rem] text-text-tertiary">
                    {task.goal && <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-surface-alt rounded font-medium text-text-secondary">{task.goal.title}</span>}
                    {task.category && (
                      <span className="px-1.5 py-0.5 rounded-sm font-medium" style={{ backgroundColor: task.category.color + '18', color: task.category.color }}>{task.category.name}</span>
                    )}
                    {task.dueDate && <span className="hidden sm:inline">{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>}
                    <span className={`badge ${task.priority === 'HIGH' ? 'bg-error-bg text-error-text' : task.priority === 'MEDIUM' ? 'bg-warning-bg text-warning-text' : 'bg-surface-alt text-text-tertiary'}`}>
                      {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <div className="flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setTaskModal(task)} className="btn-icon text-text-tertiary hover:text-text-primary hover:bg-surface-alt"><Edit3 size={12} /></button>
                    <button onClick={() => handleDelete(task.id)} className="btn-icon text-text-tertiary hover:text-error hover:bg-error-bg"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && view === 'calendar' && (
        <TaskCalendarView date={calDate} monthTasks={monthTasks}
          onPrev={() => { const d = new Date(calDate); d.setMonth(d.getMonth() - 1); setCalDate(d); }}
          onNext={() => { const d = new Date(calDate); d.setMonth(d.getMonth() + 1); setCalDate(d); }}
        />
      )}

      {taskModal && <TaskModal task={taskModal} categories={categories} goals={goals} onSave={handleSave} onClose={() => setTaskModal(null)} />}
      {catModal && <CategoryModal categories={categories} onChange={() => { loadCategories(); loadTasks(); }} onClose={() => setCatModal(false)} />}
    </div>
  );
}

function FilterPanel({ filters, categories, goals, onChange, onClose }) {
  useEffect(() => {
    function handleClick(e) {
      const panel = e.target.closest('[data-filter-panel]');
      if (!panel) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div data-filter-panel className="absolute top-full right-0 mt-1 w-56 bg-surface-card rounded-lg border border-border p-3 z-10 animate-fade-in" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Filtros</span>
        <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X size={12} /></button>
      </div>
      <div className="space-y-2">
        <div><label className="text-[0.625rem] text-text-tertiary font-medium">Estado</label>
          <select value={filters.status} onChange={e => onChange({ ...filters, status: e.target.value })} className="select text-xs py-1.5 mt-0.5">
            <option value="">Todos</option>{Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div><label className="text-[0.625rem] text-text-tertiary font-medium">Prioridad</label>
          <select value={filters.priority} onChange={e => onChange({ ...filters, priority: e.target.value })} className="select text-xs py-1.5 mt-0.5">
            <option value="">Todas</option><option value="HIGH">Alta</option><option value="MEDIUM">Media</option><option value="LOW">Baja</option>
          </select>
        </div>
        <div><label className="text-[0.625rem] text-text-tertiary font-medium">Categoría</label>
          <select value={filters.categoryId} onChange={e => onChange({ ...filters, categoryId: e.target.value })} className="select text-xs py-1.5 mt-0.5">
            <option value="">Todas</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="text-[0.625rem] text-text-tertiary font-medium">Objetivo</label>
          <select value={filters.goalId} onChange={e => onChange({ ...filters, goalId: e.target.value })} className="select text-xs py-1.5 mt-0.5">
            <option value="">Todos</option>{goals.filter(g => g.status === 'ACTIVE').map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => onChange({ status: '', priority: '', categoryId: '', goalId: '', sortBy: filters.sortBy, sortOrder: filters.sortOrder })}
        className="mt-2 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">Limpiar filtros</button>
    </div>
  );
}

function TaskCalendarView({ date, monthTasks, onPrev, onNext }) {
  const year = date.getFullYear(); const month = date.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-surface-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-alt transition-all"><ChevronLeft size={16} /></button>
        <span className="text-sm font-medium text-text-primary">{MONTHS[month - 1]} {year}</span>
        <button onClick={onNext} className="flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-alt transition-all"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {WEEK_DAYS.map(d => <div key={d} className="text-[0.625rem] text-text-tertiary font-medium text-center py-1.5">{d}</div>)}
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const dayTasks = monthTasks[dateStr] || [];
          return (
            <div key={day} className={`p-1.5 rounded-md text-left min-h-[64px] transition-all ${isToday ? 'ring-1 ring-brand-300 dark:ring-brand-500 bg-brand-50/30 dark:bg-brand-950' : 'hover:bg-surface-alt'}`}>
              <span className={`text-xs font-medium ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-text-secondary'}`}>{day}</span>
              <div className="mt-0.5 space-y-0.5">
                {dayTasks.slice(0, 2).map(t => (
                  <div key={t.id} className={`text-[0.5rem] px-0.5 py-0.5 rounded truncate leading-tight ${
                    t.status === 'COMPLETED' ? 'bg-success-bg text-success-text' : 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                  }`}>{t.title}</div>
                ))}
                {dayTasks.length > 2 && <p className="text-[0.5rem] text-text-tertiary">+{dayTasks.length - 2}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
