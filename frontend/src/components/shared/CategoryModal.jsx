import { useState } from 'react';
import * as categoryService from '../../services/categories';

const presetColors = [
  '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6b7280',
];

export default function CategoryModal({ categories, onChange, onClose }) {
  const [form, setForm] = useState({ name: '', color: '#6366f1' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await categoryService.updateCategory(editing.id, form);
      } else {
        await categoryService.createCategory(form);
      }
      setForm({ name: '', color: '#6366f1' });
      setEditing(null);
      onChange();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  }

  function handleEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, color: cat.color });
  }

  function handleCancelEdit() {
    setEditing(null);
    setForm({ name: '', color: '#6366f1' });
    setError('');
  }

  async function handleDelete(id) {
    await categoryService.deleteCategory(id);
    onChange();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Categorías</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, color: c })}
                className={`w-7 h-7 rounded-full border-2 ${
                  form.color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {editing ? 'Actualizar' : 'Añadir'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="space-y-2 max-h-60 overflow-auto">
          {categories.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              No hay categorías aún
            </p>
          )}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm">{cat.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-xs text-gray-400 hover:text-indigo-600 px-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-xs text-gray-400 hover:text-red-600 px-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
