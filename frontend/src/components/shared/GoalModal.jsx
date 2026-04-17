import { useState } from 'react';

export default function GoalModal({ goal, onSave, onClose }) {
  const isEdit = !!goal.id;
  const [form, setForm] = useState({
    title: goal.title || '',
    description: goal.description || '',
    startDate: goal.startDate ? goal.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const data = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      startDate: new Date(form.startDate).toISOString(),
    };
    if (form.targetDate) data.targetDate = new Date(form.targetDate).toISOString();
    if (isEdit) data.id = goal.id;
    onSave(data);
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? 'Editar objetivo' : 'Nuevo objetivo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              {isEdit ? 'Guardar cambios' : 'Crear objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
