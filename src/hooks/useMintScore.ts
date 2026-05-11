import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { SCORE_NFT_ABI } from '@/lib/abis';
import { getContracts } from '@/lib/wagmi';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { Address } from 'viem';

// Hook to mint Soulbound Score NFT
export function useMintScore() {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId || 8428);

  const {
    data: hash,
    error: writeError,
    isPending,
    writeContract,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async () => {
    if (!connectedAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      toast.loading('Minting your QieScore NFT...', { id: 'mint-score' });

      writeContract({
        address: contracts.scoreNFT as Address,
        abi: SCORE_NFT_ABI,
        functionName: 'mintScore',
      });
    } catch (error) {
      console.error('Mint error:', error);
      toast.error('Failed to mint NFT', { id: 'mint-score' });
      reset();
    }
  };

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('QieScore NFT Minted successfully!', {
        id: 'mint-score',
        duration: 5000,
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://mainnet.qiblockchain.online/tx/${hash}`, '_blank'),
        },
      });
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (writeError) {
      const message = writeError.message.includes('already minted')
        ? 'You already have a QieScore NFT'
        : writeError.message.includes('rejected')
          ? 'Transaction rejected'
          : 'Failed to mint NFT';

      toast.error(message, { id: 'mint-score' });
    }
  }, [writeError]);

  return {
    mint,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
    reset,
  };
}

// Hook to check if user has already minted
export function useHasMinted(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const targetAddress = address || connectedAddress;
  const contracts = getContracts(chainId || 8428);

  const { data: hasMinted, isLoading } = useWriteContract();

  // Note: This should actually be a read contract call, here's the proper implementation
  return {
    hasMinted: false, // Placeholder - actual implementation needs useReadContract
    tokenId: null,
    isLoading,
  };
}
