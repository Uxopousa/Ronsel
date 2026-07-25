import { useState } from 'react';
import BaseModal from '../ui/BaseModal';

export default function HabitModal({ habit, categories, onSave, onClose }) {
  const isEdit = !!habit.id;
  const [form, setForm] = useState({
    name: habit.name || '',
    description: habit.description || '',
    frequency: habit.frequency || 'DAILY',
    targetPerWeek: habit.targetPerWeek || '',
    categoryId: habit.categoryId || habit.category?.id || '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const data = { name: form.name.trim(), description: form.description.trim() || undefined, frequency: form.frequency, categoryId: form.categoryId || undefined };
    if (form.frequency === 'WEEKLY' && form.targetPerWeek) data.targetPerWeek = parseInt(form.targetPerWeek);
    if (isEdit) data.id = habit.id;
    onSave(data);
  }

  return (
    <BaseModal title={isEdit ? 'Editar hábito' : 'Nuevo hábito'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="input-label">Nombre</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Nombre del hábito" />
        </div>
        <div>
          <label className="input-label">Descripción</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" placeholder="Opcional" />
        </div>
        <div>
          <label className="input-label">Frecuencia</label>
          <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="select text-sm">
            <option value="DAILY">Diaria</option>
            <option value="WEEKLY">Semanal</option>
          </select>
        </div>
        {form.frequency === 'WEEKLY' && (
          <div>
            <label className="input-label">Veces por semana</label>
            <input type="number" min={1} max={7} value={form.targetPerWeek} onChange={(e) => setForm({ ...form, targetPerWeek: e.target.value })} className="input" />
          </div>
        )}
        <div>
          <label className="input-label">Categoría</label>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="select text-sm">
            <option value="">Sin categoría</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary btn-md">Cancelar</button>
          <button type="submit" className="btn-primary btn-md">{isEdit ? 'Guardar cambios' : 'Crear hábito'}</button>
        </div>
      </form>
    </BaseModal>
  );
}
