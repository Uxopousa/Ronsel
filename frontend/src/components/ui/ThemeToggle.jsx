import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme();

  function toggle() {
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  }

  const title = resolved === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  return (
    <button
      onClick={toggle}
      title={title}
      className="btn-ghost btn-sm p-1.5"
      aria-label={title}
    >
      {resolved === 'dark' ? (
        <Moon size={15} className="text-primary-400" />
      ) : (
        <Sun size={15} className="text-amber-500" />
      )}
    </button>
  );
}
