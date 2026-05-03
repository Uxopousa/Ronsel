import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../ui/BrandLogo';
import ThemeToggle from '../ui/ThemeToggle';
import SearchPalette from '../ui/SearchPalette';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tareas', icon: CheckSquare },
  { to: '/habits', label: 'Hábitos', icon: Flame },
  { to: '/goals', label: 'Objetivos', icon: Target },
];

function getModKey() {
  const ua = navigator.userAgent || '';
  return ua.includes('Mac') && !ua.includes('Mobile') ? '⌘' : 'Ctrl +';
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [modKey, setModKey] = useState('');
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setModKey(getModKey());
    setTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden'
        } md:flex md:flex-col w-56 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-700 fixed md:static inset-y-0 left-0 z-40 animate-fade-in`}
      >
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-100 dark:border-neutral-700">
          <BrandLogo size={22} />
          <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100 tracking-tight">Ronsel</span>
          <button
            className="md:hidden ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search trigger */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-gray-400 dark:text-neutral-500 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-100 dark:border-neutral-700 transition-colors"
          >
            <Search size={13} />
            <span className="flex-1 text-left">Buscar...</span>
            {!touch && (
              <kbd className="text-2xs text-gray-400 dark:text-neutral-500 inline-flex items-center gap-0.5">
                {modKey === '⌘' ? (
                  <span className="text-xs">⌘K</span>
                ) : (
                  <span>Ctrl+K</span>
                )}
              </kbd>
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 pb-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-500/10 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={16}
                    className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-neutral-500'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Theme + Logout */}
        <div className="px-3 py-3 border-t border-gray-100 dark:border-neutral-700 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 dark:text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={logout}
              className="btn-ghost btn-sm flex-1 justify-start text-gray-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 gap-2"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/15 dark:bg-black/50 z-30 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-700 px-4 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
          >
            <Menu size={20} />
          </button>
          <BrandLogo size={18} />
          <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">Ronsel</span>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
