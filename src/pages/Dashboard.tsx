
import { useState } from "react";
import { useAccount } from "wagmi";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreCard, FactorBreakdown, ScoreHistory } from "@/components";
import { useQieScore } from "@/hooks/useQieScore";
import { formatScore, formatAddress, getRiskLevel } from "@/lib/utils";
import { Wallet, TrendingUp, Zap, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://qiescore-backend.onrender.com";

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: scoreData, isLoading, refetch } = useQieScore();
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  const score = scoreData?.totalScore || 0;
  const { grade, color } = formatScore(score);
  const risk = getRiskLevel(score);

  const handleRequestScore = async () => {
    if (!address) return;

    setIsRequesting(true);
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
      if (!response.ok) {
        throw new Error(result?.error || `Server error: ${response.status}`);
      }

      await refetch();
      toast.success(`Score: ${result.score} — ${result.grade}!`, {
        id: "request",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to get score";
      toast.error(message, { id: "request" });
    } finally {
      setIsRequesting(false);
    }
  };

  const getEligibilityMessage = () => {
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

  return (
    <div className="space-y-8">
      { }
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Your Credit Score</h1>
        <p className="text-gray-400 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {formatAddress(address || "")}
        </p>
      </div>

      { }
      {!scoreData?.hasMinted ? (
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
                  Ready to Get Your Score?
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  We'll analyze your on-chain behavior to calculate your
                  QieScore using the FICO scoring model (300-850).
                </p>
              </div>
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
                        isLoading={isLoading}
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
                            {score}
                          </span>
                          <span className="text-xl text-gray-500">/ 850</span>
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
                              color: scoreData?.canRefresh
                                ? "#00D084"
                                : "#F59E0B",
                            }}
                          >
                            {scoreData?.canRefresh
                              ? "Available now"
                              : "Available tomorrow"}
                          </span>
                        </div>
                      </div>

                      {/* Refresh Button */}
                      {scoreData?.canRefresh && (
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
                <Button
                  className="w-full bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90"
                  onClick={() =>
                    window.open(
                      `https://www.borrow.qie.digital?wallet=${address}`,
                      "_blank",
                    )
                  }
                >
                  Go to QieLend
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Score History */}
          <ScoreHistory
            history={scoreData?.history}
            isLoading={isLoading}
            currentScore={score}
          />

          {/* Factor Breakdown */}
          <FactorBreakdown
            factors={scoreData?.factors}
            isLoading={isLoading}
            chartType="bar"
          />
        </>
      )}
    </div>
  );
}
