import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../ui/BrandLogo';
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
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tareas', icon: CheckSquare },
  { to: '/habits', label: 'Hábitos', icon: Flame },
  { to: '/goals', label: 'Objetivos', icon: Target },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden'
        } md:flex md:flex-col w-56 bg-white border-r border-gray-100 fixed md:static inset-y-0 left-0 z-40 animate-fade-in`}
      >
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-100">
          <BrandLogo size={22} />
          <span className="text-sm font-semibold text-gray-900 tracking-tight">Ronsel</span>
          <button
            className="md:hidden ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3 pt-3 pb-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-gray-400 bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors"
          >
            <Search size={13} />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="text-2xs text-gray-400 flex items-center gap-0.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
              K
            </kbd>
          </button>
        </div>

        <nav className="flex-1 px-2 pb-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={16}
                    className={isActive ? 'text-primary-600' : 'text-gray-400'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn-ghost btn-sm w-full mt-2 justify-start text-gray-400 hover:text-red-600 hover:bg-red-50 gap-2"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/15 z-30 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 bg-white border-b border-gray-100 px-4 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu size={20} />
          </button>
          <BrandLogo size={18} />
          <span className="text-sm font-semibold text-gray-900">Ronsel</span>
          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Search size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
