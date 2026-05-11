import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Shield,
  TrendingUp,
  Lock,
  Zap,
  Globe,
  ChevronRight,
  Sparkles,
  Wallet,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'AI-Powered Scoring',
    description: 'Machine learning algorithms analyze on-chain behavior to generate accurate credit scores.',
    color: '#00D084',
  },
  {
    icon: Shield,
    title: 'Non-Custodial',
    description: 'Your assets never leave your wallet. We only read on-chain data, never hold your funds.',
    color: '#00A8E8',
  },
  {
    icon: Lock,
    title: 'Soulbound NFT',
    description: 'Your QieScore is minted as a non-transferable NFT, establishing on-chain reputation.',
    color: '#7B2CBF',
  },
  {
    icon: TrendingUp,
    title: 'Better DeFi Rates',
    description: 'Unlock preferential borrowing rates on QieLend based on your reputation.',
    color: '#F59E0B',
  },
  {
    icon: Zap,
    title: 'Instant Approval',
    description: 'No paperwork, no waiting. Get your score and start borrowing in minutes.',
    color: '#EC4899',
  },
  {
    icon: Globe,
    title: 'Protocol Integration',
    description: 'Easy API for lenders and developers to verify borrower creditworthiness.',
    color: '#10B981',
  },
];
export function Landing() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-qie-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-qie-secondary/20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-qie-primary/30 bg-qie-primary/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-qie-primary" />
              <span className="text-sm font-medium text-qie-primary">
                Now Live on QIE Mainnet
              </span>
            </div> */}

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Your On-Chain
              <br />
              <span className="text-gradient">Credit Score</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400 md:text-xl">
              QieScore brings AI-powered credit scoring to the QIE blockchain. 
              Establish your reputation, unlock better DeFi rates, and mint your 
              soulbound score NFT.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/dashboard">
                <Button
                  size="xl"
                  className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90 glow-primary"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Button>
              </Link>
              <Link to="/protocol">
                <Button
                  size="xl"
                  variant="qie-outline"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Protocol Lookup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">How It Works</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Get your QieScore in three simple steps and start enjoying better DeFi rates.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Connect Wallet',
              description: 'Link your QIE wallet securely using RainbowKit. No private keys required.',
              icon: Wallet,
            },
            {
              step: '02',
              title: 'Get Analyzed',
              description: 'Our AI analyzes your on-chain history across multiple dimensions instantly.',
              icon: Activity,
            },
            {
              step: '03',
              title: 'Borrow Better',
              description: 'Mint your score NFT and access preferential rates on QieLend.',
              icon: TrendingUp,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-qie-border bg-qie-card p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-qie-primary to-qie-secondary">
                <item.icon className="h-6 w-6 text-qie-dark" />
              </div>
              <span className="absolute right-4 top-4 text-5xl font-bold text-qie-border">
                {item.step}
              </span>
              <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-qie-primary/30 bg-gradient-to-r from-qie-primary/20 to-qie-secondary/20 p-8 md:p-12">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Check Your Score?
            </h2>
            <p className="mb-8 max-w-2xl text-gray-300">
              Connect your wallet now and discover your QieScore. It takes less than 
              a minute and could save you thousands in interest.
            </p>
            <Link to="/dashboard">
              <Button
                size="xl"
                className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90"
              >
                Get My QieScore
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-qie-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-qie-secondary/30 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
