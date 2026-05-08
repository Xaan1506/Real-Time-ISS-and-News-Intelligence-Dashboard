import { createContext, useEffect } from 'react';
import { useDashboardStore } from './useDashboardStore';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const theme = useDashboardStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}
