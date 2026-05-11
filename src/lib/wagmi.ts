import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { type Chain } from 'viem';

// QIE Chain Configuration
export const qieChain: Chain = {
  id: 8428,
  name: 'QIE',
  nativeCurrency: {
    decimals: 18,
    name: 'QIE',
    symbol: 'QIE',
  },
  rpcUrls: {
    public: { http: ['https://rpc.qiblockchain.online'] },
    default: { http: ['https://rpc.qiblockchain.online'] },
  },
  blockExplorers: {
    default: { name: 'QIE Explorer', url: 'https://mainnet.qiblockchain.online' },
  },
  testnet: false,
};

// QIE Testnet (for development)
export const qieTestnet: Chain = {
  id: 8427,
  name: 'QIE Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'QIE',
    symbol: 'QIE',
  },
  rpcUrls: {
    public: { http: ['https://testnet.qiblockchain.online'] },
    default: { http: ['https://testnet.qiblockchain.online'] },
  },
  blockExplorers: {
    default: { name: 'QIE Testnet Explorer', url: 'https://testnet.qiblockchain.online' },
  },
  testnet: true,
};

// Wagmi Configuration
export const config = getDefaultConfig({
  appName: 'QieScore',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [qieChain, qieTestnet],
  transports: {
    [qieChain.id]: http(),
    [qieTestnet.id]: http(),
  },
});

// Contract Addresses
export const CONTRACTS = {
  qieChain: {
    scoreNFT: '0x1234567890123456789012345678901234567890',
    qiePass: '0x0987654321098765432109876543210987654321',
    qieLend: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
    scoreOracle: '0xFEDCBA0987654321FEDCBA0987654321FEDCBA09',
  },
  qieTestnet: {
    scoreNFT: '0x1111111111111111111111111111111111111111',
    qiePass: '0x2222222222222222222222222222222222222222',
    qieLend: '0x3333333333333333333333333333333333333333',
    scoreOracle: '0x4444444444444444444444444444444444444444',
  },
} as const;

export function getContracts(chainId: number) {
  if (chainId === qieTestnet.id) {
    return CONTRACTS.qieTestnet;
  }
  return CONTRACTS.qieChain;
}
