import { useState, useEffect } from 'react';
import * as habitService from '../services/habits';
import * as categoryService from '../services/categories';
import HabitModal from '../components/shared/HabitModal';
import HabitCalendar from '../components/shared/HabitCalendar';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [calendarHabit, setCalendarHabit] = useState(null);

  function load() {
    habitService.getHabits().then(setHabits);
    categoryService.getCategories().then(setCategories);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data) {
    if (data.id) {
      await habitService.updateHabit(data.id, data);
    } else {
      await habitService.createHabit(data);
    }
    setModal(null);
    load();
  }

  async function handleDelete(id) {
    await habitService.deleteHabit(id);
    load();
  }

  async function handleToggle(id) {
    await habitService.toggleHabit(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hábitos</h1>
        <button
          onClick={() => setModal({})}
          className="text-sm px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Nuevo hábito
        </button>
      </div>

      {habits.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          No hay hábitos. Crea tu primer hábito.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{habit.name}</h3>
                  {habit.category && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: habit.category.color + '20',
                        color: habit.category.color,
                      }}
                    >
                      {habit.category.name}
                    </span>
                  )}
                </div>
                {habit.description && (
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    {habit.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleToggle(habit.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition flex-shrink-0 ${
                  habit.completedToday
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-500'
                }`}
              >
                {habit.completedToday ? '✓' : '○'}
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>
                Rachas: <strong>{habit.currentStreak}</strong> actual ·{' '}
                <strong>{habit.longestStreak}</strong> máxima
              </span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs capitalize">
                {habit.frequency === 'DAILY' ? 'Diario' : 'Semanal'}
              </span>
            </div>

            <div className="flex gap-2 mt-3 pt-2 border-t border-gray-50">
              <button
                onClick={() => setCalendarHabit(habit)}
                className="text-xs text-gray-400 hover:text-indigo-600"
              >
                Calendario
              </button>
              <button
                onClick={() => setModal(habit)}
                className="text-xs text-gray-400 hover:text-indigo-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(habit.id)}
                className="text-xs text-gray-400 hover:text-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <HabitModal
          habit={modal}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {calendarHabit && (
        <HabitCalendar
          habit={calendarHabit}
          onClose={() => setCalendarHabit(null)}
        />
      )}
    </div>
  );
}
