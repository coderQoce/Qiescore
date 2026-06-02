
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type ScoreFactors } from '@/hooks/useQieScore';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import { Clock, Activity, Globe, Wallet } from 'lucide-react';

interface FactorBreakdownProps {
  factors?: ScoreFactors;
  isLoading?: boolean;
  chartType?: 'radar' | 'bar';
}

const factorConfig = [
  { key: 'walletAge', label: 'Wallet Age', icon: Clock, color: '#00A8E8', max: 212 },
  { key: 'transactionActivity', label: 'Transaction Activity', icon: Activity, color: '#00D084', max: 213 },
  { key: 'uniqueInteractions', label: 'Protocol Interactions', icon: Globe, color: '#7B2CBF', max: 212 },
  { key: 'balanceHealth', label: 'Balance Health', icon: Wallet, color: '#F59E0B', max: 213 },
];

export function FactorBreakdown({ factors, isLoading, chartType = 'radar' }: FactorBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="border-qie-border bg-qie-card">
        <CardContent className="p-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!factors) {
    return (
      <Card className="border-qie-border bg-qie-card">
        <CardContent className="p-8 text-center text-gray-500">
          <p>Connect your wallet to see your score breakdown</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = factorConfig.map((config) => ({
    name: config.label,
    value: factors[config.key as keyof ScoreFactors],
    max: config.max,
    fullMark: config.max,
    color: config.color,
  }));

  return (
    <Card className="border-qie-border bg-qie-card card-hover">
      <CardHeader>
        <CardTitle className="text-white">Score Factor Breakdown</CardTitle>
        <p className="text-sm text-gray-500">
          AI analysis across 4 key dimensions — max 850 points total
        </p>
      </CardHeader>
      <CardContent>
        {}
        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'radar' ? (
              <RadarChart data={chartData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 213]}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                  tickCount={5}
                />
                <Radar
                  name="Your Score"
                  dataKey="value"
                  stroke="#00D084"
                  fill="#00D084"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            ) : (
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[0, 213]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111118',
                    border: '1px solid #1E1E2E',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {factorConfig.map((config) => {
            const Icon = config.icon;
            const value = factors[config.key as keyof ScoreFactors];
            const percentage = (value / config.max) * 100;

            return (
              <div
                key={config.key}
                className="flex flex-col gap-2 rounded-lg border border-qie-border bg-qie-dark/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: config.color }} />
                  </div>
                  <p className="text-xs text-gray-500">{config.label}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white text-sm">{value}</span>
                    <span className="text-xs text-gray-500">/ {config.max}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: config.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}