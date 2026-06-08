
import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScoreCard, FactorBreakdown, ScoreHistory } from '@/components';
import { useQieScore } from '@/hooks/useQieScore';
import { type ScoreFactors } from '@/hooks/useQieScore';
import { Brain, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { getExplorerUrl } from '@/lib/wagmi';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const analysisSteps = [
  'Scanning transaction history...',
  'Analyzing wallet age and activity...',
  'Evaluating on-chain interactions...',
  'Checking balance health...',
  'Verifying QIE Pass status...',
  'Calculating final score...',
];

interface ScoreResult {
  score: number;
  grade: string;
  summary: string;
  recommendation: string;
  factors: ScoreFactors;
  txHash: string;
  isNewMint: boolean;
}

export function Score() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  const { data: scoreData, isLoading, refetch } = useQieScore();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  const handleRequestScore = async () => {
    if (!address) return;

    setAnalyzing(true);
    setCurrentStep(0);
    setShowResults(false);
    setScoreResult(null);

    
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      const response = await fetch(`${BACKEND_URL}/score/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error(`Server error: ${response.status}`);
      }
      if (!response.ok) {
        throw new Error(result?.error || `Server error: ${response.status}`);
      }
      setScoreResult(result);
      await refetch();
      setShowResults(true);
      toast.success('Your QieScore is ready!');

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get score';

      const friendlyMessage = message.includes('once per day')
        ? 'You can only refresh your score once per day'
        : message.includes('30 days')
        ? 'Wallet must be at least 30 days old to get a QieScore'
        : message.includes('maintenance')
        ? 'QieScore is temporarily paused for maintenance'
        : message.includes('5 transactions')
        ? 'Wallet needs at least 5 transactions to get a QieScore'
        : message;

      toast.error(friendlyMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const score = scoreResult?.score || scoreData?.totalScore || 0;

  return (
    <div className="space-y-6">
      {}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Request AI Credit Score</h1>
        <p className="text-sm text-gray-500 mt-1">
          Our AI analyzes your on-chain history to generate your FICO-style QieScore (300-850)
        </p>
      </div>

      {}
      {analyzing && (
        <Card className="border-qie-border bg-qie-card">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-qie-primary/20 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-qie-primary to-qie-secondary">
                  <Brain className="h-12 w-12 text-qie-dark animate-pulse" />
                </div>
              </div>
              <div className="w-full max-w-md space-y-2">
                <Progress
                  value={((currentStep + 1) / analysisSteps.length) * 100}
                  className="h-2"
                />
                <p className="text-center text-sm text-qie-primary animate-pulse">
                  {analysisSteps[currentStep]}
                </p>
              </div>
              <div className="flex gap-2">
                {analysisSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i <= currentStep ? 'bg-qie-primary w-4' : 'bg-gray-700 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {}
      {!analyzing && !showResults && (
        <Card className="border-qie-border bg-qie-card">
          <CardContent className="p-8 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-qie-primary/20">
              <Sparkles className="h-8 w-8 text-qie-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Ready to Generate Your Score
            </h3>
            <p className="mb-6 text-gray-400 max-w-md mx-auto">
              This process analyzes your transaction history, wallet age,
              on-chain interactions, and balance. Takes about 30 seconds.
            </p>
            <Button
              size="lg"
              onClick={handleRequestScore}
              className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90"
            >
              Start Analysis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {}
      {showResults && !analyzing && scoreResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {}
          <Card className="border-green-500/30 bg-green-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-semibold text-green-400">
                    {scoreResult.isNewMint ? 'QieScore NFT Minted!' : 'Score Refreshed!'}
                  </p>
                  <p className="text-sm text-green-300/70">
                    Your QieScore has been calculated and recorded on QIE testnet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          {scoreResult.summary && (
            <Card className="border-qie-border bg-qie-card">
              <CardContent className="p-6 space-y-3">
                <p className="text-gray-300">{scoreResult.summary}</p>
                {scoreResult.recommendation && (
                  <div className="p-3 rounded-lg bg-qie-primary/10 border border-qie-primary/20">
                    <p className="text-sm text-qie-primary">
                      💡 {scoreResult.recommendation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              <ScoreCard score={score} isLoading={isLoading} size="lg" />

              {}
              {scoreResult.txHash && (
                <Card className="border-qie-border bg-qie-card">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                    <a
                      href={`${getExplorerUrl(chainId)}/tx/${scoreResult.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-qie-primary hover:underline break-all"
                    >
                      {scoreResult.txHash}
                    </a>
                  </CardContent>
                </Card>
              )}

              <Card className="border-qie-border bg-qie-card">
                <CardHeader>
                  <CardTitle className="text-base text-white">Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-qie-border hover:bg-qie-primary/10"
                    onClick={() => window.open('/dashboard', '_self')}
                  >
                    View Full Dashboard
                  </Button>
                  <Button
                    className="w-full bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90"
                    onClick={() =>
                      window.open(
                        `https://www.borrow.qie.digital?wallet=${address}`,
                        '_blank'
                      )
                    }
                  >
                    Go to QieLend
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <FactorBreakdown
                factors={scoreResult.factors}
                isLoading={false}
                chartType="radar"
              />
              <ScoreHistory
                history={scoreData?.history}
                isLoading={isLoading}
                currentScore={score}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}