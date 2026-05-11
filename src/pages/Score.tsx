import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ScoreCard,
  FactorBreakdown,
  ScoreHistory,
  MintButton,
} from '@/components';
import { useQieScore } from '@/hooks/useQieScore';
import { Brain, Loader2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Analysis steps for loading animation
const analysisSteps = [
  'Scanning transaction history...',
  'Analyzing wallet age and activity...',
  'Evaluating staking positions...',
  'Checking liquidation records...',
  'Assessing asset diversity...',
  'Verifying QIE Pass status...',
  'Calculating final score...',
];

export function Score() {
  const { isConnected } = useAccount();
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const { data: scoreData, isLoading, refetch } = useQieScore();

  // Redirect to landing if not connected
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  const handleRequestScore = async () => {
    setAnalyzing(true);
    setCurrentStep(0);
    setShowResults(false);

    // Simulate step-by-step analysis
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // Fetch actual data
    await refetch();
    
    setAnalyzing(false);
    setShowResults(true);
    toast.success('Your QieScore is ready!');
  };

  const score = scoreData?.totalScore || 0;

  // If already has score data, show results immediately
  if (scoreData && !analyzing && !showResults) {
    setShowResults(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Request AI Credit Score</h1>
        <p className="text-sm text-gray-500 mt-1">
          Our AI will analyze your on-chain history to generate your QieScore
        </p>
      </div>

      {/* Analysis Animation */}
      {analyzing && (
        <Card className="border-qie-border bg-qie-card">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* AI Brain Animation */}
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-qie-primary/20 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-qie-primary to-qie-secondary">
                  <Brain className="h-12 w-12 text-qie-dark animate-pulse" />
                </div>
              </div>

              {/* Progress */}
              <div className="w-full max-w-md space-y-2">
                <Progress
                  value={((currentStep + 1) / analysisSteps.length) * 100}
                  className="h-2"
                />
                <p className="text-center text-sm text-qie-primary animate-pulse">
                  {analysisSteps[currentStep]}
                </p>
              </div>

              {/* Step Indicators */}
              <div className="flex gap-2">
                {analysisSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i <= currentStep ? 'bg-qie-primary w-4' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Button */}
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
              This process analyzes your transaction history, wallet age, staking 
              positions, and more. It takes about 30 seconds.
            </p>
            <Button
              size="xl"
              onClick={handleRequestScore}
              className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90 glow-primary"
            >
              Start Analysis
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResults && !analyzing && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Success Banner */}
          <Card className="border-green-500/30 bg-green-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-semibold text-green-400">Analysis Complete</p>
                  <p className="text-sm text-green-300/70">
                    Your QieScore has been calculated based on on-chain data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              <ScoreCard
                score={score}
                isLoading={isLoading}
                size="lg"
              />
              
              <Card className="border-qie-border bg-qie-card">
                <CardHeader>
                  <CardTitle className="text-base text-white">Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MintButton className="w-full" />
                  <Button
                    variant="outline"
                    className="w-full border-qie-border hover:bg-qie-primary/10"
                    onClick={() => window.open('/dashboard', '_self')}
                  >
                    View Full Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <FactorBreakdown
                factors={scoreData?.factors}
                isLoading={isLoading}
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
