import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBorrowTerms, getQieLendLink } from '@/hooks/useBorrow';
import { ArrowRight, Wallet, Percent, Clock, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import type { Address } from 'viem';
import { formatEther } from 'viem';

interface BorrowCTAProps {
  address?: Address;
  score: number;
}

export function BorrowCTA({ address, score }: BorrowCTAProps) {
  const { terms, isLoading } = useBorrowTerms(address);

  const qieLendUrl = getQieLendLink(address);

  // Calculate estimated borrow amount based on score
  const maxBorrow = terms?.maxAmount
    ? formatEther(terms.maxAmount)
    : (score * 0.5).toFixed(2); // Fallback estimate

  const apr = terms?.interestRate
    ? formatNumber(Number(terms.interestRate) / 100, 1)
    : Math.max(3.5, 25 - (score / 1000) * 21.5).toFixed(1);

  return (
    <Card className="border-qie-primary/30 bg-gradient-to-br from-qie-primary/10 to-qie-secondary/5">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-qie-primary" />
              Ready to Borrow?
            </h3>
            <p className="text-sm text-gray-400">
              Your QieScore unlocks preferential rates on QieLend
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Wallet className="h-4 w-4 text-qie-secondary" />
                <span className="text-gray-400">Max:</span>
                <span className="font-semibold text-white">
                  {isLoading ? '...' : `${formatNumber(Number(maxBorrow))} QIE`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4 text-qie-secondary" />
                <span className="text-gray-400">APR:</span>
                <span className="font-semibold text-qie-primary">{apr}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-qie-secondary" />
                <span className="text-gray-400">Instant:</span>
                <span className="font-semibold text-green-400">Approved</span>
              </div>
            </div>
          </div>

          <Button
            size="xl"
            className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90 glow-primary whitespace-nowrap"
            onClick={() => window.open(qieLendUrl, '_blank')}
          >
            Borrow on QieLend
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
