
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { SCORE_NFT_ABI, QIE_PASS_ABI } from '@/lib/abis';
import { getContracts } from '@/lib/wagmi';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { formatScore } from '@/lib/utils';

export interface ScoreFactors {
  walletAge: number;
  transactionActivity: number;
  uniqueInteractions: number;
  balanceHealth: number;
}

export interface ScoreRecord {
  score: number;
  timestamp: number;
}

export interface ScoreData {
  totalScore: number;
  grade: string;
  factors: ScoreFactors;
  history: ScoreRecord[];
  canRefresh: boolean;
  hasMinted: boolean;
}

export interface QiePassData {
  isVerified: boolean;
  verificationLevel: number;
  verifiedAt: number;
}

export function useQieScore(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const targetAddress = address || connectedAddress;
  const contracts = getContracts(chainId || 1983);

  
  const {
    data: hasMintedData,
    isLoading: isMintedLoading,
    refetch: refetchMinted,
  } = useReadContract({
    address: contracts.scoreNFT as Address,
    abi: SCORE_NFT_ABI,
    functionName: 'hasMinted',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 30000,
    },
  });

  
  const {
    data: scoreData,
    isLoading: isScoreLoading,
    refetch: refetchScore,
  } = useReadContract({
    address: contracts.scoreNFT as Address,
    abi: SCORE_NFT_ABI,
    functionName: 'getScore',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress && !!hasMintedData,
      staleTime: 60000,
    },
  });

  
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useReadContract({
    address: contracts.scoreNFT as Address,
    abi: SCORE_NFT_ABI,
    functionName: 'getScoreHistory',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress && !!hasMintedData,
      staleTime: 300000,
    },
  });

  
  const {
    data: canRefreshData,
    isLoading: isRefreshLoading,
    refetch: refetchCanRefresh,
  } = useReadContract({
    address: contracts.scoreNFT as Address,
    abi: SCORE_NFT_ABI,
    functionName: 'canRefresh',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress && !!hasMintedData,
      staleTime: 30000,
    },
  });

  const data: ScoreData | null = useMemo(() => {
    if (!hasMintedData) return null;

    const score = Number(scoreData || 0);

    
    
    const rawHistory = (historyData as bigint[] | undefined) || [];
    const history: ScoreRecord[] = rawHistory.map((s, index) => ({
      score: Number(s),
      timestamp: Date.now() - (rawHistory.length - 1 - index) * 24 * 60 * 60 * 1000,
    }));

    return {
      totalScore: score,
      grade: formatScore(score).grade,
      factors: {
        walletAge: 0,
        transactionActivity: 0,
        uniqueInteractions: 0,
        balanceHealth: 0,
      },
      history,
      canRefresh: (canRefreshData as boolean) ?? false,
      hasMinted: hasMintedData as boolean,
    };
  }, [hasMintedData, scoreData, historyData, canRefreshData]);

  const refetch = () => {
    refetchMinted();
    refetchScore();
    refetchHistory();
    refetchCanRefresh();
  };

  return {
    data,
    isLoading: isMintedLoading || isScoreLoading || isHistoryLoading || isRefreshLoading,
    refetch,
  };
}


export function useQiePass(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const targetAddress = address || connectedAddress;
  const contracts = getContracts(chainId || 1983);

  const { data: verifiedData, isLoading: isVerifiedLoading } = useReadContract({
    address: contracts.qiePass as Address,
    abi: QIE_PASS_ABI,
    functionName: 'isVerified',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress &&
        contracts.qiePass !== '0x0000000000000000000000000000000000000000',
      staleTime: 300000,
    },
  });

  const { data: levelData, isLoading: isLevelLoading } = useReadContract({
    address: contracts.qiePass as Address,
    abi: QIE_PASS_ABI,
    functionName: 'verificationLevel',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress &&
        contracts.qiePass !== '0x0000000000000000000000000000000000000000',
      staleTime: 300000,
    },
  });

  const { data: timestampData, isLoading: isTimestampLoading } = useReadContract({
    address: contracts.qiePass as Address,
    abi: QIE_PASS_ABI,
    functionName: 'verifiedAt',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress &&
        contracts.qiePass !== '0x0000000000000000000000000000000000000000',
      staleTime: 300000,
    },
  });

  const data: QiePassData | null = useMemo(() => {
    if (verifiedData === undefined) return null;
    return {
      isVerified: verifiedData as boolean,
      verificationLevel: Number(levelData || 0),
      verifiedAt: Number(timestampData || 0) * 1000,
    };
  }, [verifiedData, levelData, timestampData]);

  return {
    data,
    isLoading: isVerifiedLoading || isLevelLoading || isTimestampLoading,
  };
}
