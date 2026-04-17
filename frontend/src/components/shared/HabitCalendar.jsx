import { useState, useEffect } from 'react';
import * as habitService from '../../services/habits';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function HabitCalendar({ habit, onClose }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [days, setDays] = useState({});

  useEffect(() => {
    habitService.getHabitCalendar(habit.id, year, month).then(setDays);
  }, [habit.id, year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  function prevMonth() {
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else { setMonth(month - 1); }
  }

  function nextMonth() {
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else { setMonth(month + 1); }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{habit.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 px-2">◀</button>
          <span className="text-sm font-medium">
            {months[month - 1]} {year}
          </span>
          <button onClick={nextMonth} className="text-gray-400 hover:text-gray-600 px-2">▶</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((d) => (
            <div key={d} className="text-xs text-gray-400 py-1">{d}</div>
          ))}

          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const isCompleted = days.days?.[day];
            return (
              <div
                key={day}
                className={`py-2 text-sm rounded-full ${
                  isCompleted === true
                    ? 'bg-emerald-500 text-white'
                    : isCompleted === false
                    ? 'bg-red-100 text-red-500'
                    : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Completado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> Sin registro
          </span>
        </div>
      </div>
    </div>
  );
}
