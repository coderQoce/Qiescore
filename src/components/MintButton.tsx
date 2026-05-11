import { Button } from '@/components/ui/button';
import { useMintScore } from '@/hooks/useMintScore';
import { Loader2, Award, CheckCircle2 } from 'lucide-react';

interface MintButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'xl';
}

export function MintButton({ className, size = 'default' }: MintButtonProps) {
  const { mint, isPending, isSuccess } = useMintScore();

  if (isSuccess) {
    return (
      <Button
        disabled
        variant="outline"
        size={size}
        className={`border-green-500/50 text-green-500 ${className}`}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        NFT Minted
      </Button>
    );
  }

  return (
    <Button
      onClick={mint}
      disabled={isPending}
      variant="qie"
      size={size}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Minting...
        </>
      ) : (
        <>
          <Award className="h-4 w-4 mr-2" />
          Mint Soulbound NFT
        </>
      )}
    </Button>
  );
}
