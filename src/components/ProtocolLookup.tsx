
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQieScore, useQiePass } from "@/hooks/useQieScore";
import { ScoreCard } from "./ScoreCard";
import { FactorBreakdown } from "./FactorBreakdown";
import {
  Search,
  ExternalLink,
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react";
import type { Address } from "viem";
import { isAddress } from "viem";
import { getExplorerUrl } from "@/lib/wagmi";
import { useChainId } from "wagmi";

export function ProtocolLookup() {
  const chainId = useChainId();

  const [searchAddress, setSearchAddress] = useState("");
  const [validatedAddress, setValidatedAddress] = useState<
    Address | undefined
  >();
  const [error, setError] = useState("");

  const { data: scoreData, isLoading: isScoreLoading } =
    useQieScore(validatedAddress);
  const { data: passData, isLoading: isPassLoading } =
    useQiePass(validatedAddress);

  const handleSearch = () => {
    setError("");
    if (!searchAddress.trim()) {
      setError("Please enter a wallet address");
      return;
    }
    if (!isAddress(searchAddress)) {
      setError("Invalid wallet address format");
      return;
    }
    setValidatedAddress(searchAddress as Address);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const isLoading = isScoreLoading || isPassLoading;
  const hasSearched = validatedAddress !== undefined;

  return (
    <div className="space-y-6">
      {}
      <Card className="border-qie-border bg-qie-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-qie-primary" />
            Wallet Score Lookup
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter any QIE wallet address to check its QieScore and risk profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="0x..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-qie-dark border-qie-border text-white placeholder:text-gray-600"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-qie-primary text-qie-dark hover:bg-qie-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Lookup</span>
            </Button>
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {}
      {hasSearched && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            {}
            <ScoreCard
              score={scoreData?.totalScore || 0}
              isLoading={isScoreLoading}
              size="lg"
            />

            {}
            <Card className="border-qie-border bg-qie-card">
              <CardContent className="p-4 space-y-3">
                {}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">QieScore NFT</span>
                  <Badge variant={scoreData?.hasMinted ? "default" : "outline"}>
                    {scoreData?.hasMinted ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Minted
                      </span>
                    ) : (
                      "Not Minted"
                    )}
                  </Badge>
                </div>

                {}
                {scoreData?.hasMinted && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Refresh Status
                    </span>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: scoreData?.canRefresh
                          ? "#00D084"
                          : "#F59E0B",
                        color: scoreData?.canRefresh ? "#00D084" : "#F59E0B",
                      }}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {scoreData?.canRefresh ? "Available" : "Not yet"}
                    </Badge>
                  </div>
                )}

                {}
                {passData !== null && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield
                        className={`h-4 w-4 ${
                          passData?.isVerified
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="text-sm text-gray-400">QIE Pass</span>
                    </div>
                    <Badge
                      variant={passData?.isVerified ? "default" : "outline"}
                    >
                      {passData?.isVerified ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        "Unverified"
                      )}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {}
            <Card className="border-qie-border bg-qie-card">
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full border-qie-border hover:bg-qie-primary/10 hover:border-qie-primary"
                  onClick={() =>
                    window.open(
                      `${getExplorerUrl(chainId)}/address/${validatedAddress}`,
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="lg:col-span-2">
            <FactorBreakdown
              factors={scoreData?.factors}
              isLoading={isScoreLoading}
              chartType="bar"
            />
          </div>
        </div>
      )}

      {}
      {!hasSearched && (
        <Card className="border-qie-border bg-qie-card/50 border-dashed">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Enter a wallet address to begin
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              The protocol lookup allows lenders and developers to instantly
              check any wallet's QieScore and risk assessment without connecting
              a wallet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
