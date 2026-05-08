import { Moon, Sun, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../context/useDashboardStore';
import { DASHBOARD_TITLE } from '../utils/constants';
import { toast } from 'react-toastify';

export function Navbar() {
  const theme = useDashboardStore((s) => s.theme);
  const setTheme = useDashboardStore((s) => s.setTheme);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    toast.info(`Theme switched to ${next}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl light:border-slate-200 light:bg-slate-100/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Satellite className="h-5 w-5 text-cyan-400" />
          <h1 className="text-sm font-semibold tracking-wide sm:text-base">{DASHBOARD_TITLE}</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          className="glass flex items-center gap-2 px-3 py-2 text-xs font-semibold sm:text-sm"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </motion.button>
      </div>
    </header>
  );
}
