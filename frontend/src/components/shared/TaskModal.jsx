import { useState } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({ task, categories, goals, onSave, onClose }) {
  const isEdit = !!task.id;
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'MEDIUM',
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    categoryId: task.categoryId || '',
    goalId: task.goalId || '',
  });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    const data = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      categoryId: form.categoryId || undefined,
      goalId: form.goalId || undefined,
    };
    if (form.dueDate) data.dueDate = new Date(form.dueDate).toISOString();
    if (isEdit) data.id = task.id;
    onSave(data);
  }

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-modal w-full max-w-md mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 h-12 border-b border-gray-100 dark:border-neutral-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
            {isEdit ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-md text-xs text-red-600 dark:text-red-300">
              {error}
            </div>
          )}
          <div>
            <label className="input-label">Título</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="¿Qué tienes que hacer?"
            />
          </div>
          <div>
            <label className="input-label">Descripción</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
              placeholder="Opcional"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Prioridad</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="select text-sm">
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            <div>
              <label className="input-label">Fecha límite</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="input-label">Categoría</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="select text-sm">
              <option value="">Sin categoría</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
          <div>
            <label className="input-label">Objetivo</label>
            <select value={form.goalId} onChange={(e) => setForm({ ...form, goalId: e.target.value })} className="select text-sm">
              <option value="">Sin objetivo</option>
              {(goals || []).map((g) => (<option key={g.id} value={g.id}>{g.title}</option>))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary btn-md">Cancelar</button>
            <button type="submit" className="btn-primary btn-md">{isEdit ? 'Guardar cambios' : 'Crear tarea'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
