import { Badge } from '@/components/ui/badge';
import { useQiePass } from '@/hooks/useQieScore';
import { Shield, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import type { Address } from 'viem';

interface QiePassBadgeProps {
  address?: Address;
  showDetails?: boolean;
}

export function QiePassBadge({ address, showDetails = false }: QiePassBadgeProps) {
  const { data, isLoading } = useQiePass(address);

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking...
      </Badge>
    );
  }

  if (!data?.isVerified) {
    return (
      <Badge variant="outline" className="gap-1 text-gray-500 border-gray-600">
        <ShieldAlert className="h-3 w-3" />
        Not Verified
      </Badge>
    );
  }

  const levelNames = ['Basic', 'Standard', 'Premium', 'Enterprise'];
  const levelName = levelNames[data.verificationLevel] || 'Verified';

  if (showDetails) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
          <ShieldCheck className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <p className="font-semibold text-green-400">QIE Pass Verified</p>
          <p className="text-xs text-gray-400">
            {levelName} • Verified {new Date(data.verifiedAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="verified" className="ml-auto">
          +{data.verificationLevel * 50} pts
        </Badge>
      </div>
    );
  }

  return (
    <Badge variant="verified" className="gap-1">
      <ShieldCheck className="h-3 w-3" />
      QIE Pass
    </Badge>
  );
}
