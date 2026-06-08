
import { useAccount, useReadContract, useChainId } from "wagmi";
import { SCORE_NFT_ABI } from "@/lib/abis";
import { getContracts } from "@/lib/wagmi";
import { useState } from "react";
import { toast } from "sonner";
import type { Address } from "viem";
import { getExplorerUrl } from "@/lib/wagmi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";


export function useMintScore() {
  const chainId = useChainId();
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mint = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsPending(true);
    setIsSuccess(false);

    try {
      toast.loading("Requesting your QieScore...", { id: "mint-score" });

      const response = await fetch(`${BACKEND_URL}/score/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error(`Server error: ${response.status}`);
      }
      if (!response.ok) {
        throw new Error(result?.error || `Server error: ${response.status}`);
      }

      setTxHash(result.txHash);
      setIsSuccess(true);

      toast.success(`QieScore: ${result.score} — ${result.grade}!`, {
        id: "mint-score",
        duration: 5000,
        action: {
          label: "View on Explorer",
          onClick: () =>
            window.open(`${getExplorerUrl(chainId)}/tx/${txHash}`, "_blank"),
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to get score";

      const friendlyMessage = message.includes("once per day")
        ? "You can only refresh your score once per day"
        : message.includes("30 days")
          ? "Wallet must be at least 30 days old to get a QieScore"
          : message.includes("maintenance")
            ? "QieScore is temporarily paused for maintenance"
            : message.includes("5 transactions")
              ? "Wallet needs at least 5 transactions to get a QieScore"
              : message;

      toast.error(friendlyMessage, { id: "mint-score" });
    } finally {
      setIsPending(false);
    }
  };

  return {
    mint,
    isPending,
    isSuccess,
    txHash,
  };
}


export function useHasMinted(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const targetAddress = address || connectedAddress;
  const contracts = getContracts(chainId || 1983);

  const { data: hasMinted, isLoading } = useReadContract({
    address: contracts.scoreNFT as Address,
    abi: SCORE_NFT_ABI,
    functionName: "hasMinted",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 30000,
    },
  });

  return {
    hasMinted: (hasMinted as boolean) ?? false,
    isLoading,
  };
}
