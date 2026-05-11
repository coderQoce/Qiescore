import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQieScore, useQiePass } from '@/hooks/useQieScore';
import { ScoreCard } from './ScoreCard';
import { FactorBreakdown } from './FactorBreakdown';
import { formatScore, getRiskLevel, formatAddress } from '@/lib/utils';
import { Search, ExternalLink, Shield, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { Address } from 'viem';
import { isAddress } from 'viem';

export function ProtocolLookup() {
  const [searchAddress, setSearchAddress] = useState('');
  const [validatedAddress, setValidatedAddress] = useState<Address | undefined>();
  const [error, setError] = useState('');

  const { data: scoreData, isLoading: isScoreLoading } = useQieScore(validatedAddress);
  const { data: passData, isLoading: isPassLoading } = useQiePass(validatedAddress);

  const handleSearch = () => {
    setError('');
    if (!searchAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!isAddress(searchAddress as Address)) {
      setError('Invalid wallet address format');
      return;
    }

    setValidatedAddress(searchAddress as Address);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isLoading = isScoreLoading || isPassLoading;
  const hasSearched = validatedAddress !== undefined;

  return (
    <div className="space-y-6">
      {/* Search Card */}
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

          {/* Example addresses */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Try examples:</span>
            {[
              '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
              '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            ].map((addr) => (
              <button
                key={addr}
                onClick={() => setSearchAddress(addr)}
                className="text-xs text-qie-secondary hover:underline"
              >
                {formatAddress(addr, 4, 4)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Score Overview */}
          <div className="lg:col-span-1 space-y-6">
            <ScoreCard
              score={scoreData?.totalScore || 0}
              isLoading={isScoreLoading}
              size="lg"
            />

            {/* Verification Status */}
            <Card className="border-qie-border bg-qie-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${passData?.isVerified ? 'bg-green-500/20' : 'bg-gray-700/50'
                      }`}>
                      <Shield className={`h-5 w-5 ${passData?.isVerified ? 'text-green-500' : 'text-gray-500'
                        }`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">QIE Pass</p>
                      <p className="text-xs text-gray-500">
                        {passData?.isVerified ? 'Verified Identity' : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={passData?.isVerified ? 'verified' : 'outline'}>
                    {passData?.isVerified ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      'Unverified'
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-qie-border bg-qie-card">
              <CardContent className="p-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-qie-border hover:bg-qie-primary/10 hover:border-qie-primary"
                  onClick={() => window.open(`https://mainnet.qiblockchain.online/address/${validatedAddress}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <div className="lg:col-span-2">
            <FactorBreakdown
              factors={scoreData?.factors}
              isLoading={isScoreLoading}
              chartType="bar"
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasSearched && (
        <Card className="border-qie-border bg-qie-card/50 border-dashed">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Enter a wallet address to begin
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              The protocol lookup allows lenders and developers to instantly check any
              wallet&apos;s QieScore and risk assessment without connecting a wallet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
