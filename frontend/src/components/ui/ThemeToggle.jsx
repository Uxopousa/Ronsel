import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  }

  const title =
    theme === 'light' ? 'Tema claro' :
    theme === 'dark' ? 'Tema oscuro' : 'Tema automático';

  return (
    <button
      onClick={cycle}
      title={title}
      className="relative btn-ghost btn-sm p-1.5"
      aria-label={title}
    >
      {theme === 'dark' ? (
        <Moon size={15} className="text-primary-400" />
      ) : theme === 'light' ? (
        <Sun size={15} className="text-amber-500" />
      ) : (
        <Sun size={15} className="text-gray-400" />
      )}
    </button>
  );
}
