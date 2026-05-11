import { useAccount, useReadContract, useChainId } from 'wagmi';
import { SCORE_ORACLE_ABI, QIE_PASS_ABI } from '@/lib/abis';
import { getContracts } from '@/lib/wagmi';
import { useMemo } from 'react';
import type { Address } from 'viem';

export interface ScoreFactors {
  repaymentHistory: number;
  walletAge: number;
  stakingCommitment: number;
  liquidationRecord: number;
  assetDiversity: number;
  kycBoost: number;
}

export interface ScoreRecord {
  score: number;
  timestamp: number;
}

export interface ScoreData {
  totalScore: number;
  riskLevel: number;
  factors: ScoreFactors;
  history: ScoreRecord[];
}

export interface QiePassData {
  isVerified: boolean;
  verificationLevel: number;
  verifiedAt: number;
}

// Hook to fetch AI credit score for any wallet address
export function useQieScore(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const targetAddress = address || connectedAddress;
  const contracts = getContracts(chainId || 8428);

  // Fetch total score and risk level
  const {
    data: scoreData,
    isLoading: isScoreLoading,
    error: scoreError,
    refetch: refetchScore,
  } = useReadContract({
    address: contracts.scoreOracle as Address,
    abi: SCORE_ORACLE_ABI,
    functionName: 'calculateScore',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 60000,
    },
  });

  // Fetch detailed score factors
  const {
    data: factorsData,
    isLoading: isFactorsLoading,
    error: factorsError,
  } = useReadContract({
    address: contracts.scoreOracle as Address,
    abi: SCORE_ORACLE_ABI,
    functionName: 'getScoreFactors',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 60000,
    },
  });

  // Fetch score history
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useReadContract({
    address: contracts.scoreOracle as Address,
    abi: SCORE_ORACLE_ABI,
    functionName: 'getScoreHistory',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 300000,
    },
  });

  const data: ScoreData | null = useMemo(() => {
    if (!scoreData || !factorsData) return null;

    const [totalScore, riskLevel] = scoreData as [bigint, bigint];
    const factors = factorsData as {
      repaymentHistory: bigint;
      walletAge: bigint;
      stakingCommitment: bigint;
      liquidationRecord: bigint;
      assetDiversity: bigint;
      kycBoost: bigint;
    };

    const history = (historyData as { score: bigint; timestamp: bigint }[] | undefined)?.map(
      (record) => ({
        score: Number(record.score),
        timestamp: Number(record.timestamp) * 1000,
      })
    ) || [];

    return {
      totalScore: Number(totalScore),
      riskLevel: Number(riskLevel),
      factors: {
        repaymentHistory: Number(factors.repaymentHistory),
        walletAge: Number(factors.walletAge),
        stakingCommitment: Number(factors.stakingCommitment),
        liquidationRecord: Number(factors.liquidationRecord),
        assetDiversity: Number(factors.assetDiversity),
        kycBoost: Number(factors.kycBoost),
      },
      history,
    };
  }, [scoreData, factorsData, historyData]);

  return {
    data,
    isLoading: isScoreLoading || isFactorsLoading || isHistoryLoading,
    error: scoreError || factorsError || historyError,
    refetch: refetchScore,
  };
}

// Hook to check QIE Pass verification status
export function useQiePass(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const targetAddress = address || connectedAddress;
  const contracts = getContracts(chainId || 8428);

  const {
    data: verifiedData,
    isLoading: isVerifiedLoading,
  } = useReadContract({
    address: contracts.qiePass as Address,
    abi: QIE_PASS_ABI,
    functionName: 'isVerified',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 300000,
    },
  });

  const {
    data: levelData,
    isLoading: isLevelLoading,
  } = useReadContract({
    address: contracts.qiePass as Address,
    abi: QIE_PASS_ABI,
    functionName: 'verificationLevel',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 300000,
    },
  });

  const {
    data: timestampData,
    isLoading: isTimestampLoading,
  } = useReadContract({
    address: contracts.qiePass as Address,
    abi: QIE_PASS_ABI,
    functionName: 'verifiedAt',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
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
