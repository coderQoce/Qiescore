import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreCard, FactorBreakdown, ScoreHistory } from '@/components';
import { useQieScore } from '@/hooks/useQieScore';
import { formatScore, formatAddress, cn } from '@/lib/utils';
import { Wallet, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for demonstration
const MOCK_SCORE_DATA = {
  totalScore: 742,
  factors: {
    stakingHistory: 88,
    repaymentHistory: 85,
    walletAge: 72,
    liquidationRecord: 90,
    assetDiversity: 65,
    kycStatus: 75,
  },
  history: [
    { date: '2025-01-01', score: 650 },
    { date: '2025-01-08', score: 680 },
    { date: '2025-01-15', score: 710 },
    { date: '2025-01-22', score: 730 },
    { date: '2025-01-29', score: 742 },
  ],
  qiePassVerified: true,
};

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: scoreData, isLoading, refetch } = useQieScore();
  const [scoreRequested, setScoreRequested] = useState(false);

  // Use mock data when not connected, real data when connected
  const displayData = isConnected ? scoreData : MOCK_SCORE_DATA;
  const displayAddress = address || '0x1234...5678';
  const score = displayData?.totalScore || 0;
  const { grade, color } = formatScore(score);

  const handleRequestScore = async () => {
    toast.loading('Analyzing your on-chain history...', { id: 'request' });
    setScoreRequested(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Score calculated successfully!', { id: 'request' });
    }, 2000);
  };

  const calculateBorrowingPower = () => {
    if (score < 500) return { ltv: '50%', previous: '40%' };
    if (score < 650) return { ltv: '66%', previous: '50%' };
    if (score < 750) return { ltv: '75%', previous: '66%' };
    return { ltv: '80%', previous: '75%' };
  };

  const borrowPower = calculateBorrowingPower();

  const handleBorrowClick = () => {
    const qieLendUrl = `https://qielend.qiblockchain.online?wallet=${displayAddress}`;
    window.open(qieLendUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Your Credit Score</h1>
        <p className="text-gray-400 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {formatAddress(displayAddress)}
          {!isConnected && <span className="text-xs text-qie-primary">(Demo)</span>}
        </p>
      </div>

      {/* Request Score Section */}
      {!scoreRequested ? (
        <Card className="border-qie-border bg-gradient-to-br from-qie-primary/10 to-qie-secondary/5">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-qie-primary/20">
                  <Zap className="h-8 w-8 text-qie-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Get Your Score?</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  We'll analyze your on-chain behavior to calculate your QieScore and unlock borrowing power on QieLend.
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleRequestScore}
                disabled={isLoading}
                className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90 glow-primary"
              >
                {isLoading ? 'Analyzing...' : 'Request Your Credit Score'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Score Display - FICO Style */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Score Card */}
            <div className="lg:col-span-2">
              <Card className="border-qie-border bg-qie-card">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Score Circle */}
                    <div className="flex-shrink-0">
                      <ScoreCard
                        score={score}
                        isLoading={isLoading}
                        size="lg"
                      />
                    </div>

                    {/* Score Details */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Your Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">{score}</span>
                          <span className="text-xl text-gray-500">/ 1000</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark/50 border border-qie-border">
                          <span className="text-gray-400">Grade</span>
                          <span className="text-lg font-bold" style={{ color }}>
                            {grade}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark/50 border border-qie-border">
                          <span className="text-gray-400">Risk Level</span>
                          <span className="text-lg font-bold" style={{ color }}>
                            {formatScore(score).label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Borrowing Power Card */}
            <Card className="border-qie-border bg-qie-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-qie-primary" />
                  Borrowing Power
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Your LTV (Loan-to-Value)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-qie-primary">{borrowPower.ltv}</span>
                    <span className="text-sm text-gray-500">
                      (was {borrowPower.previous})
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-qie-primary/10 border border-qie-primary/20">
                  <p className="text-sm text-gray-300">
                    You can now borrow with <span className="font-bold text-qie-primary">{borrowPower.ltv} LTV</span> instead of <span className="font-bold">{borrowPower.previous}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score History */}
          <ScoreHistory
            history={displayData?.history}
            isLoading={isLoading}
            currentScore={score}
          />

          {/* Factor Breakdown */}
          <FactorBreakdown
            factors={displayData?.factors}
            isLoading={isLoading}
            chartType="bar"
          />

          {/* Prominent Borrow Button */}
          <Card className="border-qie-primary/50 bg-gradient-to-r from-qie-primary/20 to-qie-secondary/10 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Ready to Borrow?</h3>
                  <p className="text-gray-400">
                    Use your QieScore to unlock better rates and higher borrowing limits on QieLend
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleBorrowClick}
                  className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90 glow-primary whitespace-nowrap"
                >
                  Borrow on QieLend with your score
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
