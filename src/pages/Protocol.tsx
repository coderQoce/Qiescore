import { ProtocolLookup } from '@/components';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Code, Lock, Globe, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Instant risk evaluation for any wallet address.',
  },
  {
    icon: Code,
    title: 'Easy Integration',
    description: 'Simple REST API and smart contract interfaces.',
  },
  {
    icon: Lock,
    title: 'Permissionless',
    description: 'No API keys required for read-only score checks.',
  },
  {
    icon: Globe,
    title: 'Multi-Chain Ready',
    description: 'Built for QIE, expandable to any EVM chain.',
  },
  {
    icon: Zap,
    title: 'Real-Time Data',
    description: 'Scores update in real-time as on-chain activity occurs.',
  },
  {
    icon: BarChart3,
    title: 'Rich Analytics',
    description: 'Detailed factor breakdowns for deep analysis.',
  },
];

export function Protocol() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">Protocol Interface</h1>
        <p className="text-sm text-gray-500 mt-1">
          Public lookup for lenders and developers to verify wallet scores
        </p>
      </div>
      <ProtocolLookup />

    </div>
  );
}
