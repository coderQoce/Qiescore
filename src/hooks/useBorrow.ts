import { useAccount, useReadContract, useChainId } from 'wagmi';
import { QIELEND_ABI } from '@/lib/abis';
import { getContracts } from '@/lib/wagmi';
import { useMemo } from 'react';
import type { Address } from 'viem';

export interface BorrowTerms {
  maxAmount: bigint;
  interestRate: bigint;
  ltvRatio: bigint;
  duration: bigint;
}

// Hook to fetch borrow terms from QieLend
export function useBorrowTerms(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const targetAddress = address || connectedAddress;
  const contracts = getContracts(chainId || 8428);

  const {
    data,
    isLoading,
    error,
  } = useReadContract({
    address: contracts.qieLend as Address,
    abi: QIELEND_ABI,
    functionName: 'getBorrowTerms',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 60000,
    },
  });

  const terms: BorrowTerms | null = useMemo(() => {
    if (!data) return null;
    const [maxAmount, interestRate, ltvRatio, duration] = data as [bigint, bigint, bigint, bigint];
    return { maxAmount, interestRate, ltvRatio, duration };
  }, [data]);

  return {
    terms,
    isLoading,
    error,
  };
}

// Generate deep link to QieLend with pre-connected wallet
export function getQieLendLink(address?: Address): string {
  const baseUrl = 'https://qielend.qiblockchain.online';
  if (!address) return baseUrl;
  return `${baseUrl}?ref=${address}&autoconnect=true`;
}
