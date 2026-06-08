
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
        Score Minted
      </Button>
    );
  }

  return (
    <Button
      onClick={mint}
      disabled={isPending}
      className={`bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90 ${className}`}
      size={size}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Getting Score...
        </>
      ) : (
        <>
          <Award className="h-4 w-4 mr-2" />
          Get My QieScore
        </>
      )}
    </Button>
  );
}