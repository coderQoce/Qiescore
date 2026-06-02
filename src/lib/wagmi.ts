//lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { type Chain } from 'viem';

// QIE Mainnet Configuration
export const qieChain: Chain = {
  id: 1990,
  name: 'QIE',
  nativeCurrency: {
    decimals: 18,
    name: 'QIE',
    symbol: 'QIEV3',
  },
  rpcUrls: {
    public: { http: ['https://rpc1mainnet.qie.digital/'] },
    default: { http: ['https://rpc1mainnet.qie.digital/'] },
  },
  blockExplorers: {
    default: { name: 'QIE Explorer', url: 'https://mainnet.qie.digital' },
  },
  testnet: false,
};

// QIE Testnet Configuration
export const qieTestnet: Chain = {
  id: 1983,
  name: 'QIE Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'QIE',
    symbol: 'QIE',
  },
  rpcUrls: {
    public: { http: ['https://rpc1testnet.qie.digital/'] },
    default: { http: ['https://rpc1testnet.qie.digital/'] },
  },
  blockExplorers: {
    default: { name: 'QIE Testnet Explorer', url: 'https://testnet.qie.digital' },
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
    scoreNFT: '0x0000000000000000000000000000000000000000', // Registry — update after mainnet deploy
    qiePass: '0x0000000000000000000000000000000000000000', // get from QIE team
  },
  qieTestnet: {
    scoreNFT: '0x5360B744548a267f36B903A65f78cab44882C8Ec', // Registry — testnet
    qiePass: '0x0000000000000000000000000000000000000000', // get from QIE team
  },
} as const;

export function getContracts(chainId: number) {
  if (chainId === qieTestnet.id) {
    return CONTRACTS.qieTestnet;
  }
  return CONTRACTS.qieChain;
}

export function getExplorerUrl(chainId: number) {
  if (chainId === qieTestnet.id) return 'https://testnet.qie.digital';
  return 'https://mainnet.qie.digital';
}