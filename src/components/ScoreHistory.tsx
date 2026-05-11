import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type ScoreRecord } from '@/hooks/useQieScore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

interface ScoreHistoryProps {
  history?: ScoreRecord[];
  isLoading?: boolean;
  currentScore: number;
}

export function ScoreHistory({ history, isLoading, currentScore }: ScoreHistoryProps) {
  if (isLoading) {
    return (
      <Card className="border-qie-border bg-qie-card">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Generate mock history if none exists
  const chartData = history?.length
    ? history.map((record) => ({
      date: new Date(record.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      fullDate: new Date(record.timestamp).toLocaleDateString(),
      score: record.score,
    }))
    : generateMockHistory(currentScore);

  const scoreChange = chartData.length > 1
    ? chartData[chartData.length - 1].score - chartData[0].score
    : 0;

  const averageScore = chartData.length > 0
    ? Math.round(chartData.reduce((acc, d) => acc + d.score, 0) / chartData.length)
    : currentScore;

  return (
    <Card className="border-qie-border bg-qie-card card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="h-5 w-5 text-qie-primary" />
              Score History
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Your QieScore evolution over time
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {scoreChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={scoreChange >= 0 ? 'text-green-500' : 'text-red-500'}>
              {scoreChange >= 0 ? '+' : ''}{scoreChange} points
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis
                domain={[0, 1000]}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111118',
                  border: '1px solid #1E1E2E',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <ReferenceLine
                y={averageScore}
                stroke="#00D084"
                strokeDasharray="3 3"
                label={{
                  value: `Avg: ${averageScore}`,
                  fill: '#00D084',
                  fontSize: 12,
                  position: 'right',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#00D084"
                strokeWidth={3}
                dot={{ fill: '#00D084', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: '#00D084', strokeWidth: 2, fill: '#111118' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-qie-border pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Current</p>
            <p className="text-lg font-semibold text-qie-primary">{currentScore}</p>
          </div>
          <div className="text-center border-x border-qie-border">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Average</p>
            <p className="text-lg font-semibold text-qie-secondary">{averageScore}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Records</p>
            <p className="text-lg font-semibold text-white">{chartData.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Generate realistic mock history for demo
function generateMockHistory(currentScore: number): Array<{ date: string; fullDate: string; score: number }> {
  const data = [];
  const days = 30;
  let score = Math.max(300, currentScore - 100);

  for (let i = 0; i < days; i += 5) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));

    // Simulate gradual improvement
    score += Math.random() * 20 - 5;
    score = Math.min(1000, Math.max(300, score));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toLocaleDateString(),
      score: Math.round(score),
    });
  }

  // Ensure last point matches current
  data.push({
    date: 'Today',
    fullDate: new Date().toLocaleDateString(),
    score: currentScore,
  });

  return data;
}
