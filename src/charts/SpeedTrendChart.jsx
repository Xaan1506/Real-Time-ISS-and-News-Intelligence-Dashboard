import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function SpeedTrendChart({ points }) {
  const data = points.map((point) => ({
    ...point,
    label: new Date(point.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }));
  const speeds = data.map((d) => d.speed).filter((v) => Number.isFinite(v));
  const current = speeds.at(-1) ?? 0;
  const min = speeds.length ? Math.min(...speeds) : 0;
  const max = speeds.length ? Math.max(...speeds) : 0;
  const avg = speeds.length ? speeds.reduce((acc, val) => acc + val, 0) / speeds.length : 0;
  const rangePadding = Math.max(50, (max - min) * 0.2);
  const yMin = Math.max(0, Math.floor(min - rangePadding));
  const yMax = Math.ceil(max + rangePadding);

  return (
    <div className="glass h-[300px] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">ISS Speed Trend</h3>
        <p className="text-xs text-slate-400">Last {Math.min(points.length, 30)} measurements</p>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div className="rounded-lg bg-white/5 p-2"><span className="text-slate-400">Current</span><p className="font-semibold">{current.toLocaleString()} km/h</p></div>
        <div className="rounded-lg bg-white/5 p-2"><span className="text-slate-400">Min</span><p className="font-semibold">{min.toLocaleString()} km/h</p></div>
        <div className="rounded-lg bg-white/5 p-2"><span className="text-slate-400">Max</span><p className="font-semibold">{max.toLocaleString()} km/h</p></div>
        <div className="rounded-lg bg-white/5 p-2"><span className="text-slate-400">Avg</span><p className="font-semibold">{avg.toFixed(2)} km/h</p></div>
      </div>
      <ResponsiveContainer width="100%" height="65%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} interval="preserveStartEnd" minTickGap={24} />
          <YAxis domain={[yMin, yMax || 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString()} km/h`, 'Speed']}
            labelFormatter={(label) => `Timestamp: ${label}`}
            contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: '12px' }}
          />
          <Line type="monotone" dataKey="speed" stroke="#22d3ee" strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
