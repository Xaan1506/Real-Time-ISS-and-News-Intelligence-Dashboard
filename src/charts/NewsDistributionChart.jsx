import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#22d3ee', '#a78bfa', '#fb7185', '#f59e0b', '#4ade80'];

export function NewsDistributionChart({ articles, onCategoryClick }) {
  const grouped = articles.reduce((acc, item) => {
    const key = item.category || 'other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <div className="glass h-[300px] p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">News Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={95}
            onClick={(payload) => onCategoryClick(payload.name)}
            animationDuration={500}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
