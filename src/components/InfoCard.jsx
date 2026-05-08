import { motion } from 'framer-motion';

export function InfoCard({ title, value, subtitle }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </motion.div>
  );
}
