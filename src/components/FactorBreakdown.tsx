import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type ScoreFactors } from '@/hooks/useQieScore';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { TrendingUp, Clock, Lock, AlertTriangle, Wallet, Shield } from 'lucide-react';

interface FactorBreakdownProps {
  factors?: ScoreFactors;
  isLoading?: boolean;
  chartType?: 'radar' | 'bar';
}

const factorConfig = [
  { key: 'stakingHistory', label: 'Staking History', icon: Lock, color: '#7B2CBF', max: 100 },
  { key: 'repaymentHistory', label: 'Repayment History', icon: TrendingUp, color: '#00D084', max: 100 },
  { key: 'walletAge', label: 'Wallet Age & Activity', icon: Clock, color: '#00A8E8', max: 100 },
  { key: 'liquidationRecord', label: 'Liquidation Record', icon: AlertTriangle, color: '#F59E0B', max: 100 },
  { key: 'assetDiversity', label: 'Asset Diversity', icon: Wallet, color: '#EC4899', max: 100 },
  { key: 'kycStatus', label: 'QIE Pass KYC status', icon: Shield, color: '#10B981', max: 100 },
];

export function FactorBreakdown({
  factors,
  isLoading,
  chartType = 'radar',
}: FactorBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="border-qie-border bg-qie-card">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
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

  // Prepare chart data
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
          AI analysis of your on-chain behavior across 6 key dimensions
        </p>
      </CardHeader>
      <CardContent>
        {/* Chart */}
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
                  domain={[0, 200]}
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
                <XAxis type="number" domain={[0, 200]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
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

        {/* Factor Details */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {factorConfig.map((config) => {
            const Icon = config.icon;
            const value = factors[config.key as keyof ScoreFactors];
            const percentage = (value / config.max) * 100;

            return (
              <div
                key={config.key}
                className="flex items-center gap-3 rounded-lg border border-qie-border bg-qie-dark/50 p-3"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 truncate">{config.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{value}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-gray-700">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: config.color }}
                      />
                    </div>
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
