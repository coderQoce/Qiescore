import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreCard, ScoreHistory } from "@/components";
import { useQieScore } from "@/hooks/useQieScore";
import { formatScore, formatAddress, getRiskLevel } from "@/lib/utils";
import { Wallet, TrendingUp, Zap, ArrowRight, RefreshCw, AlertCircle, Clock, History } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://qiescore-backend.onrender.com";

// Match the exact types expected by the components
interface ScoreRecord {
  timestamp: number;
  score: number;
  grade?: string;
}

interface ScoreData {
  hasMinted: boolean;
  totalScore: number;
  canRefresh: boolean;
  history: ScoreRecord[];
  grade?: string;
}

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: hookScoreData, isLoading, refetch } = useQieScore();
  const [isRequesting, setIsRequesting] = useState(false);
  const [localScoreData, setLocalScoreData] = useState<ScoreData | null>(null);
  const [requirementError, setRequirementError] = useState<string | null>(null);

  // Helper function to normalize history to array of ScoreRecord
  const normalizeHistory = (history: any): ScoreRecord[] => {
    if (!history) return [];
    if (Array.isArray(history)) {
      return history.map(entry => ({
        timestamp: entry.timestamp || entry.date || Date.now(),
        score: entry.score || 0,
        grade: entry.grade
      }));
    }
    return [];
  };

  // Merge hook data with local data and normalize
  const getNormalizedDisplayData = (): ScoreData | null => {
    const sourceData = localScoreData || hookScoreData;
    if (!sourceData) return null;
    
    return {
      hasMinted: sourceData.hasMinted ?? false,
      totalScore: sourceData.totalScore || 0,
      canRefresh: sourceData.canRefresh ?? false,
      history: normalizeHistory(sourceData.history),
      grade: sourceData.grade,
    };
  };

  const displayData = getNormalizedDisplayData();

  // Debug logging
  useEffect(() => {
    if (hookScoreData) {
      console.log("Hook score data from backend:", hookScoreData);
      console.log("Has minted:", hookScoreData.hasMinted);
      console.log("Total score:", hookScoreData.totalScore);
      console.log("History type:", typeof hookScoreData.history, hookScoreData.history);
    }
  }, [hookScoreData]);

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  const score = displayData?.totalScore || 0;
  const { grade, color } = formatScore(score);
  const risk = getRiskLevel(score);

  const handleRequestScore = async () => {
    if (!address) return;

    setIsRequesting(true);
    setRequirementError(null);
    toast.loading("Analyzing your on-chain history...", { id: "request" });

    try {
      const response = await fetch(`${BACKEND_URL}/score/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error(`Server error: ${response.status}`);
      }
      
      if (!response.ok || result.error) {
        const errorMessage = result.error || result.message || `Server error: ${response.status}`;
        
        if (errorMessage.includes("30 days") || errorMessage.includes("5 transaction")) {
          setRequirementError(errorMessage);
          toast.error(errorMessage, { id: "request", duration: 5000 });
        } else {
          throw new Error(errorMessage);
        }
        return;
      }

      console.log("Score request response:", result);

      // Transform and normalize the data
      const transformedData: ScoreData = {
        hasMinted: result.hasMinted ?? true,
        totalScore: result.totalScore || result.score || 0,
        canRefresh: result.canRefresh ?? false,
        history: normalizeHistory(result.history),
        grade: result.grade,
      };

      setLocalScoreData(transformedData);
      await refetch();
      
      if (transformedData.totalScore > 0) {
        toast.success(`Score: ${transformedData.totalScore} — ${result.grade || grade}!`, {
          id: "request",
        });
      } else {
        toast.success("Score request submitted! Check back soon.", {
          id: "request",
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to get score";
      toast.error(message, { id: "request" });
    } finally {
      setIsRequesting(false);
    }
  };

  const getEligibilityMessage = () => {
    if (!displayData?.hasMinted || score === 0) {
      return {
        message: "Request your score to unlock QieLend access",
        color: "#9CA3AF",
      };
    }
    if (score >= 800)
      return {
        message: "Eligible for lowest rates on QieLend",
        color: "#00D084",
      };
    if (score >= 740)
      return {
        message: "Eligible for preferential rates on QieLend",
        color: "#00A8E8",
      };
    if (score >= 670)
      return {
        message: "Eligible for standard rates on QieLend",
        color: "#7B2CBF",
      };
    if (score >= 580)
      return {
        message: "Limited borrowing access on QieLend",
        color: "#F59E0B",
      };
    return {
      message: "Build your score to unlock borrowing on QieLend",
      color: "#EF4444",
    };
  };

  const eligibility = getEligibilityMessage();

  // Show loading state
  if (isLoading && !displayData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qie-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your credit score...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Your Credit Score</h1>
        <p className="text-gray-400 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {formatAddress(address || "")}
        </p>
      </div>

      {/* Check if score exists */}
      {!displayData?.hasMinted ? (
        <>
          {/* Requirement Error Display */}
          {requirementError && (
            <Card className="border-red-500/50 bg-red-500/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-red-500/20">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-500 mb-2">
                      Cannot Calculate Score Yet
                    </h3>
                    <p className="text-gray-300 mb-3">
                      {requirementError}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Wallet age: &lt; 30 days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <History className="h-4 w-4" />
                        <span>Transactions: &lt; 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Request Score Card */}
          <Card className="border-qie-border bg-gradient-to-br from-qie-primary/10 to-qie-secondary/5">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-qie-primary/20">
                    <Zap className="h-8 w-8 text-qie-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {requirementError ? "Requirements Not Met" : "Ready to Get Your Score?"}
                  </h2>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {requirementError 
                      ? "Your wallet doesn't meet the minimum requirements for a QieScore yet."
                      : "We'll analyze your on-chain behavior to calculate your QieScore using the FICO scoring model (300-850)."
                    }
                  </p>
                </div>
                
                {!requirementError && (
                  <div className="flex justify-center gap-6 text-sm text-gray-400 py-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>30+ days old</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <History className="h-4 w-4" />
                      <span>5+ transactions</span>
                    </div>
                  </div>
                )}
                
                <Button
                  size="lg"
                  onClick={handleRequestScore}
                  disabled={isRequesting || isLoading}
                  className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90"
                >
                  {isRequesting ? "Analyzing..." : "Request Your Credit Score"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Score Display */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Score Card */}
            <div className="lg:col-span-2">
              <Card className="border-qie-border bg-qie-card">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-shrink-0">
                      <ScoreCard
                        score={score}
                        isLoading={isLoading && !localScoreData}
                        size="lg"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                          Your QieScore
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">
                            {score > 0 ? score : "Pending"}
                          </span>
                          {score > 0 && <span className="text-xl text-gray-500">/ 850</span>}
                        </div>
                        {score === 0 && (
                          <p className="text-sm text-gray-400 mt-2">
                            Score calculation in progress...
                          </p>
                        )}
                      </div>
                      {score > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark/50 border border-qie-border">
                            <span className="text-gray-400">Grade</span>
                            <span className="text-lg font-bold" style={{ color }}>
                              {grade}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark/50 border border-qie-border">
                            <span className="text-gray-400">Risk Level</span>
                            <span
                              className="text-lg font-bold"
                              style={{ color: risk.color }}
                            >
                              {risk.level}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark/50 border border-qie-border">
                            <span className="text-gray-400">Est. APR</span>
                            <span className="text-lg font-bold text-qie-primary">
                              {risk.apr}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark/50 border border-qie-border">
                            <span className="text-gray-400">Refresh</span>
                            <span
                              className="text-sm font-medium"
                              style={{
                                color: displayData?.canRefresh
                                  ? "#00D084"
                                  : "#F59E0B",
                              }}
                            >
                              {displayData?.canRefresh
                                ? "Available now"
                                : "Available tomorrow"}
                            </span>
                          </div>
                        </div>
                      )}

                      {displayData?.canRefresh && (
                        <Button
                          variant="outline"
                          onClick={handleRequestScore}
                          disabled={isRequesting}
                          className="w-full border-qie-border hover:bg-qie-primary/10"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {isRequesting ? "Refreshing..." : "Refresh Score"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QieLend Eligibility Card */}
            <Card className="border-qie-border bg-qie-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-qie-primary" />
                  QieLend Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: `${eligibility.color}10`,
                    borderColor: `${eligibility.color}30`,
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: eligibility.color }}
                  >
                    {eligibility.message}
                  </p>
                </div>
                {score > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Est. APR Range</span>
                      <span className="font-medium text-white">{risk.apr}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Risk Profile</span>
                      <span className="font-medium" style={{ color: risk.color }}>
                        {risk.level}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90"
                  onClick={() =>
                    window.open(
                      `https://www.borrow.qie.digital?wallet=${address}`,
                      "_blank",
                    )
                  }
                  disabled={score === 0}
                >
                  Go to QieLend
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Score History Section */}
          {score > 0 && displayData?.history && displayData.history.length > 0 && (
            <ScoreHistory
              history={displayData.history}
              isLoading={isLoading && !localScoreData}
              currentScore={score}
            />
          )}
        </>
      )}
    </div>
  );
}