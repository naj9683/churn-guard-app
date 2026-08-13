'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const data = [
  { m: 'Mar', v: 640 },
  { m: 'Apr', v: 1020 },
  { m: 'May', v: 890 },
  { m: 'Jun', v: 1680 },
  { m: 'Jul', v: 2140 },
  { m: 'Aug', v: 3300 },
  { m: 'Sep', v: 4820 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={68}>
      <AreaChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#revGrad)"
          dot={false}
          isAnimationActive
          animationDuration={1400}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
