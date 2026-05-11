# QieScore DApp

A production-ready Web3 dApp for AI-powered credit scoring on the QIE blockchain.

## Features

- **User Dashboard**: Connect wallet, request AI credit score, view detailed breakdown
- **Score Visualization**: Circular score display with color-coded grades (0-1000 scale)
- **Factor Analysis**: Radar/bar charts showing 6 key scoring dimensions
- **Score History**: Track score changes over time with line charts
- **Soulbound NFT**: Mint your QieScore as a non-transferable NFT
- **Protocol Interface**: Public lookup for lenders and developers
- **API Documentation**: REST API and smart contract integration guides
- **QieLend Integration**: Deep linking to borrow with your score

## Tech Stack

- React + TypeScript
- Vite (build tool)
- TailwindCSS + Bootstrap + shadcn/ui
- wagmi v2 + viem (Web3 interactions)
- RainbowKit (wallet connection)
- TanStack Query (data fetching)
- Recharts (charts)
- Sonner (toasts)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # App layout with navigation
│   ├── ScoreCard.tsx   # Score display component
│   ├── FactorBreakdown.tsx
│   ├── ScoreHistory.tsx
│   ├── ProtocolLookup.tsx
│   ├── QiePassBadge.tsx
│   ├── MintButton.tsx
│   └── BorrowCTA.tsx
├── hooks/              # Custom React hooks
│   ├── useQieScore.ts
│   ├── useMintScore.ts
│   └── useBorrow.ts
├── pages/              # Route pages
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── Score.tsx
│   ├── Protocol.tsx
│   └── ApiDocs.tsx
├── lib/                # Utilities & configs
│   ├── utils.ts
│   ├── wagmi.ts        # wagmi config + QIE chain
│   └── abis.ts         # Contract ABIs
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

## Routes

- `/` - Landing page
- `/dashboard` - User dashboard (requires wallet)
- `/score` - Score request & results
- `/protocol` - Public protocol lookup
- `/api-docs` - API documentation

## Blockchain Configuration

The app is configured for QIE chain (Chain ID: 8428):

- RPC: `https://rpc.qiblockchain.online`
- Explorer: `https://mainnet.qiblockchain.online`

Contract addresses are defined in `src/lib/wagmi.ts`.

## Environment Variables

Create a `.env` file:

```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com).

## License

MIT
