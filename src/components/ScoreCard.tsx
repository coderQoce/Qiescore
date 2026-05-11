import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatScore, getRiskLevel, formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Shield, Award } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  isLoading?: boolean;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreCard({ score, isLoading, showBadge = true, size = 'md' }: ScoreCardProps) {
  if (isLoading) {
    return (
      <Card className="border-qie-border bg-qie-card">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { grade, color, label } = formatScore(score);
  const risk = getRiskLevel(score);

  const sizeClasses = {
    sm: { container: 'w-24 h-24', score: 'text-3xl', label: 'text-xs' },
    md: { container: 'w-36 h-36', score: 'text-5xl', label: 'text-sm' },
    lg: { container: 'w-48 h-48', score: 'text-7xl', label: 'text-base' },
  };

  const classes = sizeClasses[size];

  // Calculate stroke dasharray for circular progress
  const radius = size === 'sm' ? 40 : size === 'md' ? 60 : 80;
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 1000) * circumference;

  return (
    <Card className="border-qie-border bg-qie-card card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Circular Score Display */}
          <div className="relative">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="-rotate-90 transform"
            >
              {/* Background circle */}
              <circle
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Progress circle */}
              <circle
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`${classes.score} font-bold`}
                style={{ color }}
              >
                {formatNumber(score, 0)}
              </span>
              <span className={`${classes.label} text-gray-500`}>/ 1000</span>
            </div>
          </div>

          {/* Grade Badge */}
          {showBadge && (
            <div className="flex flex-col items-center gap-2">
              <Badge
                variant="outline"
                className="text-base font-semibold px-4 py-1"
                style={{ borderColor: color, color }}
              >
                {grade}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" style={{ color }} />
                <span>{label}</span>
              </div>
            </div>
          )}

          {/* Risk Level & APR */}
          {size !== 'sm' && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Risk Level</p>
              <p className="text-sm font-medium" style={{ color: risk.color }}>
                {risk.level} ({risk.apr} APR)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact score display for lists
export function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const { grade, color } = formatScore(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]}`}
      style={{ backgroundColor: `${color}20`, color }}
    >
      <Award className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {score}
    </span>
  );
}
