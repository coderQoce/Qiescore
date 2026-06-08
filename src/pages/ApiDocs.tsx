import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Globe } from 'lucide-react';

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/score/{address}',
    description: 'Get the QieScore for a specific wallet address',
    params: [
      { name: 'address', type: 'string', required: true, description: 'Wallet address (0x...)' },
    ],
    response: `{
  "success": true,
  "data": {
    "address": "0x...",
    "score": 785,
    "grade": "Good",
    "riskLevel": "Low",
    "factors": {
      "repaymentHistory": 180,
      "walletAge": 140,
      "stakingCommitment": 170,
      "liquidationRecord": 145,
      "assetDiversity": 120,
      "kycBoost": 30
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/score/{address}/history',
    description: 'Get historical score data for trend analysis',
    params: [
      { name: 'address', type: 'string', required: true, description: 'Wallet address' },
      { name: 'days', type: 'number', required: false, description: 'Number of days (default: 30)' },
    ],
    response: `{
  "success": true,
  "data": {
    "address": "0x...",
    "history": [
      { "score": 750, "timestamp": "2024-01-01T00:00:00Z" },
      { "score": 765, "timestamp": "2024-01-08T00:00:00Z" },
      { "score": 785, "timestamp": "2024-01-15T00:00:00Z" }
    ]
  }
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/batch/scores',
    description: 'Get scores for multiple addresses in one request',
    params: [
      { name: 'addresses', type: 'string[]', required: true, description: 'Array of wallet addresses' },
    ],
    response: `{
  "success": true,
  "data": {
    "scores": [
      { "address": "0x...", "score": 785, "grade": "Good" },
      { "address": "0x...", "score": 650, "grade": "Fair" }
    ]
  }
}`,
  },
];

const wagmiExample = `import { useReadContract } from 'wagmi';
import { SCORE_ORACLE_ABI } from './abis';

const SCORE_ORACLE_ADDRESS = '0x...';

function useQieScore(address: string) {
  const { data, isLoading } = useReadContract({
    address: SCORE_ORACLE_ADDRESS,
    abi: SCORE_ORACLE_ABI,
    functionName: 'calculateScore',
    args: [address],
  });

  return { score: data, isLoading };
}`;

const viemExample = `import { createPublicClient, http } from 'viem';
import { qieChain } from './chains';
import { SCORE_ORACLE_ABI } from './abis';

const client = createPublicClient({
  chain: qieChain,
  transport: http(),
});

async function getQieScore(address: string) {
  const [score, riskLevel] = await client.readContract({
    address: '0x...',
    abi: SCORE_ORACLE_ABI,
    functionName: 'calculateScore',
    args: [address],
  });

  return { score, riskLevel };
}`;

const ethersExample = `import { Contract, JsonRpcProvider } from 'ethers';
import { SCORE_ORACLE_ABI } from './abis';

const provider = new JsonRpcProvider('https://rpc.qiblockchain.online');
const oracleAddress = '0x...';

async function getQieScore(address: string) {
  const contract = new Contract(oracleAddress, SCORE_ORACLE_ABI, provider);
  
  const [score, riskLevel] = await contract.calculateScore(address);
  
  return {
    score: Number(score),
    riskLevel: Number(riskLevel)
  };
}`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="absolute top-2 right-2 text-gray-400 hover:text-white"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function ApiDocs() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">API Documentation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Integrate QieScore into your application with our REST API or smart contracts
        </p>
      </div>



      <Tabs defaultValue="rest" className="w-full">
        <TabsList className="bg-qie-card border border-qie-border">
          <TabsTrigger value="rest" className="data-[state=active]:bg-qie-primary/20">
            <Globe className="h-4 w-4 mr-2" />
            REST API
          </TabsTrigger>
          {/* <TabsTrigger value="wagmi" className="data-[state=active]:bg-qie-primary/20">
            <Code className="h-4 w-4 mr-2" />
            wagmi/viem
          </TabsTrigger>
          <TabsTrigger value="ethers" className="data-[state=active]:bg-qie-primary/20">
            <Terminal className="h-4 w-4 mr-2" />
            Ethers.js
          </TabsTrigger> */}
        </TabsList>
        {/* REST API Tab */}
        <TabsContent value="rest" className="space-y-4">
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Base URL</CardTitle>
              <CardDescription className="text-gray-500">
                All API requests should be made to:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <code className="block rounded-lg bg-qie-dark p-4 font-mono text-sm text-qie-primary">
                  https://api.qiescore.qiblockchain.online/v1
                </code>
                <CopyButton text="https://api.qiescore.qiblockchain.online/v1" />
              </div>
            </CardContent>
          </Card>

          {endpoints.map((endpoint) => (
            <Card key={endpoint.path} className="border-qie-border bg-qie-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={endpoint.method === 'GET' ? 'outline' : 'qie'}
                    className="font-mono"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm text-qie-secondary font-mono">{endpoint.path}</code>
                </div>
                <CardDescription className="text-gray-500">
                  {endpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {endpoint.params.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Parameters</h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-qie-border">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Required</th>
                          <th className="pb-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-400">
                        {endpoint.params.map((param) => (
                          <tr key={param.name} className="border-b border-qie-border/50">
                            <td className="py-2 font-mono text-qie-primary">{param.name}</td>
                            <td className="py-2">{param.type}</td>
                            <td className="py-2">{param.required ? 'Yes' : 'No'}</td>
                            <td className="py-2">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Response</h4>
                  <div className="relative">
                    <pre className="rounded-lg bg-qie-dark p-4 overflow-x-auto text-xs text-gray-300 font-mono">
                      {endpoint.response}
                    </pre>
                    <CopyButton text={endpoint.response} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* wagmi/viem Tab */}
        <TabsContent value="wagmi" className="space-y-4">
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Using wagmi (React)</CardTitle>
              <CardDescription className="text-gray-500">
                Recommended for React applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="rounded-lg bg-qie-dark p-4 overflow-x-auto text-xs text-gray-300 font-mono">
                  {wagmiExample}
                </pre>
                <CopyButton text={wagmiExample} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Using viem (Vanilla JS/TS)</CardTitle>
              <CardDescription className="text-gray-500">
                For non-React applications or backend services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="rounded-lg bg-qie-dark p-4 overflow-x-auto text-xs text-gray-300 font-mono">
                  {viemExample}
                </pre>
                <CopyButton text={viemExample} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ethers Tab */}
        <TabsContent value="ethers" className="space-y-4">
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Using Ethers.js v6</CardTitle>
              <CardDescription className="text-gray-500">
                For projects using the Ethers.js library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="rounded-lg bg-qie-dark p-4 overflow-x-auto text-xs text-gray-300 font-mono">
                  {ethersExample}
                </pre>
                <CopyButton text={ethersExample} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
