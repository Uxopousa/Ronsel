import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Inicio', icon: '◉' },
  { to: '/tasks', label: 'Tareas', icon: '☐' },
  { to: '/habits', label: 'Hábitos', icon: '◈' },
  { to: '/goals', label: 'Objetivos', icon: '◎' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden'
        } md:block w-60 bg-white border-r border-gray-200 flex flex-col fixed md:static inset-y-0 left-0 z-40`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">Ronsel</h1>
          <button
            className="md:hidden text-gray-400"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2 truncate">{user?.name}</p>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 text-xl"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-indigo-600">Ronsel</h1>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
