import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { Navbar } from './layout/Navbar';
import { useDashboardStore } from './context/useDashboardStore';

function App() {
  const theme = useDashboardStore((s) => s.theme);
  const classes = useMemo(
    () =>
      theme === 'dark'
        ? 'min-h-screen bg-slate-950 text-slate-100'
        : 'min-h-screen bg-slate-100 text-slate-900',
    [theme],
  );

  return (
    <div className={classes}>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={theme}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8"
        >
          <DashboardPage />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default App;
