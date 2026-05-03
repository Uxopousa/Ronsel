import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Flame, Target, Hash, Command } from 'lucide-react';
import * as taskService from '../../services/tasks';
import * as habitService from '../../services/habits';
import * as goalService from '../../services/goals';
import * as categoryService from '../../services/categories';

function getModKey() {
  return navigator.userAgent.includes('Mac') && !navigator.userAgent.includes('Mobile') ? '⌘' : 'Ctrl+';
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function SearchPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ tasks: [], habits: [], goals: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [modKey, setModKey] = useState('');
  const [touch, setTouch] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setModKey(getModKey());
    setTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setResults({ tasks: [], habits: [], goals: [], categories: [] });
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ tasks: [], habits: [], goals: [], categories: [] });
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(() => {
      const q = query.toLowerCase();
      setLoading(true);
      Promise.all([
        taskService.getTasks({}).then(t => t.filter(t => t.title.toLowerCase().includes(q)).slice(0, 5)),
        habitService.getHabits().then(h => h.filter(h => h.name.toLowerCase().includes(q)).slice(0, 5)),
        goalService.getGoals().then(g => g.filter(g => g.title.toLowerCase().includes(q)).slice(0, 5)),
        categoryService.getCategories().then(c => c.filter(c => c.name.toLowerCase().includes(q)).slice(0, 5)),
      ])
        .then(([tasks, habits, goals, categories]) => {
          if (!cancelled) setResults({ tasks, habits, goals, categories });
        })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 300);

    return () => {
      clearTimeout(timeout);
      cancelled = true;
    };
  }, [query]);

  function handleSelect(type) {
    onClose();
    if (type === 'task') navigate('/tasks');
    else if (type === 'habit') navigate('/habits');
    else if (type === 'goal') navigate('/goals');
    else if (type === 'category') navigate('/tasks');
  }

  const hasResults = results.tasks.length || results.habits.length || results.goals.length || results.categories.length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] animate-fade-in" onClick={onClose}>
      <div className="fixed inset-0 bg-black/15 dark:bg-black/60" />
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-neutral-900 rounded-lg shadow-modal animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 h-12 border-b border-gray-100 dark:border-neutral-700">
          <Search size={16} className="text-gray-400 dark:text-neutral-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar tareas, hábitos, objetivos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-neutral-500 dark:text-neutral-100"
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onClose(); }
            }}
          />
          {!touch && (
            <kbd className="text-2xs text-gray-400 dark:text-neutral-500 bg-gray-50 dark:bg-neutral-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Command size={10} />{modKey === '⌘' ? 'K' : ''}{modKey !== '⌘' && 'K'}
            </kbd>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && query && !hasResults && (
            <p className="text-sm text-gray-400 dark:text-neutral-500 text-center py-8">Sin resultados para "{query}"</p>
          )}

          {!loading && !query && (
            <p className="text-xs text-gray-400 dark:text-neutral-500 text-center py-8">Escribe para buscar...</p>
          )}

          {!loading && results.tasks.length > 0 && (
            <Section title="Tareas" icon={FileText}>
              {results.tasks.map(t => (
                <ResultRow key={t.id} label={t.title} sub={t.category?.name} onClick={() => handleSelect('task')} />
              ))}
            </Section>
          )}

          {!loading && results.habits.length > 0 && (
            <Section title="Hábitos" icon={Flame}>
              {results.habits.map(h => (
                <ResultRow key={h.id} label={h.name} sub={h.category?.name} onClick={() => handleSelect('habit')} />
              ))}
            </Section>
          )}

          {!loading && results.goals.length > 0 && (
            <Section title="Objetivos" icon={Target}>
              {results.goals.map(g => (
                <ResultRow key={g.id} label={g.title} sub={`${g.progress}%`} onClick={() => handleSelect('goal')} />
              ))}
            </Section>
          )}

          {!loading && results.categories.length > 0 && (
            <Section title="Categorías" icon={Hash}>
              {results.categories.map(c => (
                <ResultRow key={c.id} label={c.name} sub={c.color} onClick={() => handleSelect('category')} />
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <Icon size={12} className="text-gray-400 dark:text-neutral-500" />
        <span className="text-2xs font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  );
}

function ResultRow({ label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
    >
      <span className="flex-1 truncate">{label}</span>
      {sub && <span className="text-2xs text-gray-400 dark:text-neutral-500 flex-shrink-0">{sub}</span>}
    </button>
  );
}
