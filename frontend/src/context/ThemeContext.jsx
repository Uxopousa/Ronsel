import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'theme';
const MQ = '(prefers-color-scheme: dark)';

function getSystemDark() {
  return window.matchMedia(MQ).matches;
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => localStorage.getItem(STORAGE_KEY) || 'system');
  const [systemDark, setSystemDark] = useState(getSystemDark);

  const isDark = preference === 'dark' ? true : preference === 'light' ? false : systemDark;

  useEffect(() => {
    const mq = window.matchMedia(MQ);
    function handle(e) {
      setSystemDark(e.matches);
    }
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem(STORAGE_KEY, preference);
  }, [isDark, preference]);

  function setTheme(next) {
    setPreference(next);
  }

  return (
    <ThemeContext.Provider value={{ theme: preference, setTheme, resolved: isDark ? 'dark' : 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
