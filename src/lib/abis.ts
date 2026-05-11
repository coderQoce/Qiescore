import { type Abi } from 'viem';

// QieScore NFT Contract ABI
export const SCORE_NFT_ABI: Abi = [
  {
    inputs: [],
    name: "mintScore",
    outputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getScore",
    outputs: [
      { internalType: "uint256", name: "score", type: "uint256" },
      { internalType: "uint256", name: "mintedAt", type: "uint256" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "hasMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "tokenOfOwner",
    outputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "score", type: "uint256" },
    ],
    name: "ScoreMinted",
    type: "event",
  },
];

// QIE Pass Contract ABI (KYC/Soulbound)
export const QIE_PASS_ABI: Abi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isVerified",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "verificationLevel",
    outputs: [{ internalType: "uint8", name: "level", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "verifiedAt",
    outputs: [{ internalType: "uint256", name: "timestamp", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: false, internalType: "uint8", name: "level", type: "uint8" },
    ],
    name: "Verified",
    type: "event",
  },
];

// Score Oracle ABI (AI Credit Score)
export const SCORE_ORACLE_ABI: Abi = [
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "calculateScore",
    outputs: [
      { internalType: "uint256", name: "totalScore", type: "uint256" },
      { internalType: "uint256", name: "riskLevel", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "getScoreFactors",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "repaymentHistory", type: "uint256" },
          { internalType: "uint256", name: "walletAge", type: "uint256" },
          { internalType: "uint256", name: "stakingCommitment", type: "uint256" },
          { internalType: "uint256", name: "liquidationRecord", type: "uint256" },
          { internalType: "uint256", name: "assetDiversity", type: "uint256" },
          { internalType: "uint256", name: "kycBoost", type: "uint256" },
        ],
        internalType: "struct IScoreOracle.ScoreFactors",
        name: "factors",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "getScoreHistory",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "score", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct IScoreOracle.ScoreRecord[]",
        name: "history",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "wallet", type: "address" },
      { indexed: false, internalType: "uint256", name: "oldScore", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newScore", type: "uint256" },
    ],
    name: "ScoreUpdated",
    type: "event",
  },
];

// QieLend Interface ABI
export const QIELEND_ABI: Abi = [
  {
    inputs: [{ internalType: "address", name: "borrower", type: "address" }],
    name: "getMaxBorrowAmount",
    outputs: [
      { internalType: "uint256", name: "maxAmount", type: "uint256" },
      { internalType: "uint256", name: "interestRate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "borrower", type: "address" }],
    name: "getBorrowTerms",
    outputs: [
      { internalType: "uint256", name: "maxAmount", type: "uint256" },
      { internalType: "uint256", name: "interestRate", type: "uint256" },
      { internalType: "uint256", name: "ltvRatio", type: "uint256" },
      { internalType: "uint256", name: "duration", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// ERC20 ABI for common token interactions
export const ERC20_ABI: Abi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];
