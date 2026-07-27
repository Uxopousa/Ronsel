import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../ui/BrandLogo';
import ThemeToggle from '../ui/ThemeToggle';
import SearchPalette from '../ui/SearchPalette';
import { useModKey } from '../../hooks/useModKey';
import { useTouchDevice } from '../../hooks/useTouchDevice';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  LogOut,
  Search,
  FlaskConical,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tareas', icon: CheckSquare },
  { to: '/habits', label: 'Hábitos', icon: Flame },
  { to: '/goals', label: 'Objetivos', icon: Target },
];

const pageTitles = {
  '/': 'Inicio',
  '/tasks': 'Tareas',
  '/habits': 'Hábitos',
  '/goals': 'Objetivos',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [devStatus, setDevStatus] = useState(null);
  const modKey = useModKey();
  const touch = useTouchDevice();

  const pageTitle = pageTitles[location.pathname] || 'Ronsel';

  async function handleSeed() {
    setDevStatus('seed');
    try { await api.post('/dev/seed'); window.location.reload(); }
    catch { setDevStatus('error'); setTimeout(() => setDevStatus(null), 2000); }
  }
  async function handleWipe() {
    if (!window.confirm('¿Eliminar todos tus datos? No se puede deshacer.')) return;
    setDevStatus('wipe');
    try { await api.post('/dev/wipe'); window.location.reload(); }
    catch { setDevStatus('error'); setTimeout(() => setDevStatus(null), 2000); }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-surface text-text-primary antialiased">
      {/* ── Top Bar ── */}
      <header className="h-14 bg-surface-card border-b border-border px-4 md:px-6 flex items-center flex-shrink-0 relative">
        {/* Brand */}
        <NavLink to="/" end className="flex items-center gap-2 flex-shrink-0">
          <BrandLogo size={36} />
          <span className="hidden sm:inline text-sm font-bold text-text-primary font-display">Ronsel</span>
        </NavLink>

        {/* Desktop nav links — centered */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile page title */}
        <h1 className="lg:hidden text-sm font-semibold text-text-primary font-display flex-1 truncate ml-3">
          {pageTitle}
        </h1>

        {/* Right actions group */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
          {/* Search */}
          {!touch && (
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-text-tertiary bg-surface-alt border border-border hover:text-text-primary hover:border-border-hover transition-all"
            >
              <Search size={13} />
              <span className="hidden lg:inline">Buscar</span>
              <kbd className="text-2xs text-text-tertiary hidden lg:inline ml-1">
                {modKey === '⌘' ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>
          )}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-alt transition-all"
          >
            <Search size={18} />
          </button>

          <ThemeToggle />

          {/* Dev + logout group (desktop) */}
          <div className="hidden sm:flex items-center gap-1 ml-1 pl-2 border-l border-border">
            <button
              onClick={handleSeed}
              disabled={devStatus === 'seed'}
              className="flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-success hover:bg-success-bg transition-all"
              title="Rellenar con datos de ejemplo"
            >
              {devStatus === 'seed' ? <CheckCircle2 size={14} className="animate-pulse" /> : <FlaskConical size={14} />}
            </button>
            <button
              onClick={handleWipe}
              disabled={devStatus === 'wipe'}
              className="flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-error hover:bg-error-bg transition-all"
              title="Eliminar todos los datos"
            >
              {devStatus === 'wipe' ? <CheckCircle2 size={14} className="animate-pulse" /> : <Trash2 size={14} />}
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center w-8 h-8 rounded-md text-text-tertiary hover:text-error hover:bg-error-bg transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* Mobile logout */}
          <button
            onClick={logout}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-text-tertiary hover:text-error hover:bg-error-bg transition-all"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-auto custom-scrollbar bg-surface">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden flex items-center justify-around h-16 bg-surface-card border-t border-border px-2 flex-shrink-0 safe-bottom">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 w-14 h-full rounded-lg transition-all duration-150 ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-text-tertiary hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[0.625rem] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
