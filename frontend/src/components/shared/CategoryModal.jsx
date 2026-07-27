import { useState } from 'react';
import * as categoryService from '../../services/categories';
import { Edit3, Trash2, Plus } from 'lucide-react';
import BaseModal from '../ui/BaseModal';
import { Button } from '../ui/Button';

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
      if (editing) await categoryService.updateCategory(editing.id, form);
      else await categoryService.createCategory(form);
      setForm({ name: '', color: '#6366f1' });
      setEditing(null);
      onChange();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  }

  function handleEdit(cat) { setEditing(cat); setForm({ name: cat.name, color: cat.color }); }
  function handleCancelEdit() { setEditing(null); setForm({ name: '', color: '#6366f1' }); setError(''); }
  async function handleDelete(id) { if (!window.confirm('¿Eliminar esta categoría?')) return; try { await categoryService.deleteCategory(id); onChange(); } catch { setError('Error al eliminar la categoría'); } }

  return (
    <BaseModal title="Categorías" onClose={onClose}>
      <div className="p-5">
          <form onSubmit={handleSubmit} className="mb-5 space-y-3">
              {error && (
                <div className="px-3 py-2 bg-error-bg border border-error/20 rounded-md text-xs text-error-text">{error}</div>
              )}
            <div className="flex gap-2">
              <input type="text" placeholder="Nombre de la categoría" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input text-sm flex-1" required />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {presetColors.map((c) => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className={`w-6 h-6 rounded-md border-2 transition-all ${form.color === c ? 'border-gray-800 dark:border-neutral-200 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="sm"><Plus size={13} />{editing ? 'Actualizar' : 'Añadir'}</Button>
              {editing && <Button type="button" variant="secondary" size="sm" onClick={handleCancelEdit}>Cancelar</Button>}
            </div>
          </form>
          <div className="space-y-1 max-h-60 overflow-auto">
            {categories.length === 0 && (
              <p className="text-text-tertiary text-xs text-center py-4">No hay categorías aún</p>
            )}
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-surface-alt group">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-text-primary">{cat.name}</span>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEdit(cat)} className="btn-icon text-text-tertiary hover:text-brand-600 dark:hover:text-brand-400 hover:bg-surface-alt"><Edit3 size={12} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="btn-icon text-text-tertiary hover:text-error hover:bg-error-bg"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </BaseModal>
  );
}
