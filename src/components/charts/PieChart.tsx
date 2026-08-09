import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number | string;
}

const DEFAULT_COLORS = ['#6366f1', '#eab308', '#f97316', '#22c55e'];

export function PieChart({ data, colors = DEFAULT_COLORS, height = 300 }: PieChartProps) {
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"

            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-6">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
