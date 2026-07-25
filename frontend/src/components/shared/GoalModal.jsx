import { useState } from 'react';
import BaseModal from '../ui/BaseModal';

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
    const data = { title: form.title.trim(), description: form.description.trim() || undefined, startDate: new Date(form.startDate).toISOString() };
    if (form.targetDate) data.targetDate = new Date(form.targetDate).toISOString();
    if (isEdit) data.id = goal.id;
    onSave(data);
  }

  return (
    <BaseModal title={isEdit ? 'Editar objetivo' : 'Nuevo objetivo'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="input-label">Título</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Nombre del objetivo" />
        </div>
        <div>
          <label className="input-label">Descripción</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" placeholder="Opcional" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">Fecha inicio</label>
            <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input" />
          </div>
          <div>
            <label className="input-label">Fecha fin</label>
            <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="input" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary btn-md">Cancelar</button>
          <button type="submit" className="btn-primary btn-md">{isEdit ? 'Guardar cambios' : 'Crear objetivo'}</button>
        </div>
      </form>
    </BaseModal>
  );
}
