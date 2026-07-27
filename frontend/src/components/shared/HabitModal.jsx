import { useState } from 'react';
import BaseModal from '../ui/BaseModal';
import { Button } from '../ui/Button';

const DAYS = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'M' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' },
];

function initDays(habit) {
  const d = habit.daysOfWeek;
  if (habit.frequency === 'WEEKLY' && Array.isArray(d)) return d;
  if (habit.frequency === 'BIWEEKLY' && d && d.week1) {
    return { week1: d.week1 || [], week2: d.week2 || [] };
  }
  return [];
}

function toggleDay(arr, day) {
  return arr.includes(day) ? arr.filter((d) => d !== day) : [...arr, day].sort();
}

export default function HabitModal({ habit, categories, onSave, onClose }) {
  const isEdit = !!habit.id;
  const init = initDays(habit);
  const [form, setForm] = useState({
    name: habit.name || '',
    description: habit.description || '',
    frequency: habit.frequency || 'DAILY',
    categoryId: habit.categoryId || habit.category?.id || '',
    daysOfWeek: init,
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggle(field, day) {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: Array.isArray(prev.daysOfWeek)
        ? toggleDay(prev.daysOfWeek, day)
        : prev.daysOfWeek,
    }));
  }

  function toggleBiweek(weekKey, day) {
    setForm((prev) => {
      const cur = prev.daysOfWeek && !Array.isArray(prev.daysOfWeek)
        ? prev.daysOfWeek
        : { week1: [], week2: [] };
      return {
        ...prev,
        daysOfWeek: { ...cur, [weekKey]: toggleDay(cur[weekKey] || [], day) },
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const data = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      frequency: form.frequency,
      categoryId: form.categoryId || undefined,
    };

    if (form.frequency === 'WEEKLY') {
      data.daysOfWeek = Array.isArray(form.daysOfWeek) && form.daysOfWeek.length > 0
        ? form.daysOfWeek
        : undefined;
    } else if (form.frequency === 'BIWEEKLY') {
      const dw = form.daysOfWeek;
      const week1 = dw?.week1 || [];
      const week2 = dw?.week2 || [];
      data.daysOfWeek = week1.length > 0 || week2.length > 0
        ? { week1, week2 }
        : undefined;
    }

    if (isEdit) data.id = habit.id;
    onSave(data);
  }

  function DayCheckbox({ day, checked, onChange }) {
    return (
      <button
        type="button"
        onClick={() => onChange(day.value)}
        className={`w-8 h-8 rounded-md text-xs font-medium transition-all ${
          checked
            ? 'bg-primary-600 text-white dark:bg-primary-500'
            : 'bg-gray-50 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
        }`}
      >
        {day.label}
      </button>
    );
  }

  function DayPicker({ weekKey }) {
    const arr = weekKey
      ? (form.daysOfWeek?.[weekKey] || [])
      : (Array.isArray(form.daysOfWeek) ? form.daysOfWeek : []);
    const onChange = weekKey
      ? (day) => toggleBiweek(weekKey, day)
      : (day) => toggle('daysOfWeek', day);

    return (
      <div className="flex gap-1">
        {DAYS.map((day) => (
          <DayCheckbox key={day.value} day={day} checked={arr.includes(day.value)} onChange={onChange} />
        ))}
      </div>
    );
  }

  return (
    <BaseModal title={isEdit ? 'Editar hábito' : 'Nuevo hábito'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="input-label">Nombre</label>
          <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className="input" placeholder="Nombre del hábito" />
        </div>
        <div>
          <label className="input-label">Descripción</label>
          <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className="input resize-none" placeholder="Opcional" />
        </div>
        <div>
          <label className="input-label">Frecuencia</label>
          <select value={form.frequency} onChange={(e) => set('frequency', e.target.value)} className="select text-sm">
            <option value="DAILY">Diaria</option>
            <option value="WEEKLY">Semanal</option>
            <option value="BIWEEKLY">Quincenal</option>
          </select>
        </div>

        {form.frequency === 'WEEKLY' && (
          <div>
            <label className="input-label">Días de la semana</label>
            <DayPicker />
            {Array.isArray(form.daysOfWeek) && form.daysOfWeek.length > 0 && (
              <p className="text-[0.625rem] text-gray-400 dark:text-neutral-500 mt-1">
                {form.daysOfWeek.length} día{form.daysOfWeek.length !== 1 ? 's' : ''} a la semana
              </p>
            )}
          </div>
        )}

        {form.frequency === 'BIWEEKLY' && (
          <div className="space-y-3">
            <div>
              <label className="input-label text-[0.625rem] text-gray-400 dark:text-neutral-500">Semana 1</label>
              <DayPicker weekKey="week1" />
            </div>
            <div>
              <label className="input-label text-[0.625rem] text-gray-400 dark:text-neutral-500">Semana 2</label>
              <DayPicker weekKey="week2" />
            </div>
            <p className="text-[0.625rem] text-gray-400 dark:text-neutral-500">
              Se alterna cada semana: Semana 1 → Semana 2 → Semana 1...
            </p>
          </div>
        )}

        <div>
          <label className="input-label">Categoría</label>
          <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="select text-sm">
            <option value="">Sin categoría</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="primary" size="md">{isEdit ? 'Guardar cambios' : 'Crear hábito'}</Button>
        </div>
      </form>
    </BaseModal>
  );
}
