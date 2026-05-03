import { useState, useEffect } from 'react';
import * as habitService from '../../services/habits';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

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
  const weekDays = ['L','M','X','J','V','S','D'];

  function prevMonth() { if (month === 1) { setYear(year - 1); setMonth(12); } else setMonth(month - 1); }
  function nextMonth() { if (month === 12) { setYear(year + 1); setMonth(1); } else setMonth(month + 1); }

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-modal w-full max-w-sm mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 h-12 border-b border-gray-100 dark:border-neutral-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100">{habit.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="btn-ghost btn-sm p-1.5"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{months[month - 1]} {year}</span>
            <button onClick={nextMonth} className="btn-ghost btn-sm p-1.5"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((d) => <div key={d} className="text-2xs text-gray-400 dark:text-neutral-500 font-medium py-1">{d}</div>)}
            {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isCompleted = days.days?.[day];
              return (
                <div key={day} className={`py-1.5 text-xs rounded-md transition-colors ${
                  isCompleted === true ? 'bg-green-500 text-white font-medium' :
                  isCompleted === false ? 'bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400' :
                  'text-gray-600 dark:text-neutral-400'
                }`}>{day}</div>
              );
            })}
          </div>
          <div className="flex gap-4 justify-center mt-4 text-2xs text-gray-400 dark:text-neutral-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" /> Completado</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 inline-block" /> Sin registro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
