import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

export default function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme();

  function toggle() {
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  }

  const title = resolved === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={title}
      aria-label={title}
    >
      {resolved === 'dark' ? (
        <Moon size={15} className="text-brand-400" />
      ) : (
        <Sun size={15} className="text-amber-500" />
      )}
    </Button>
  );
}
