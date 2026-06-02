
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Globe, Code, Terminal } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const endpoints = [
  {
    method: 'GET',
    path: '/score/:wallet',
    description: 'Get the current QieScore for a wallet address. Free, no authentication required.',
    params: [
      { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
    ],
    response: `{
  "success": true,
  "wallet": "0x...",
  "score": 720,
  "grade": "Good",
  "history": [580, 650, 720],
  "canRefresh": false,
  "hasMinted": true
}`,
  },
  {
    method: 'POST',
    path: '/score/request',
    description: 'Request a new score or refresh existing score. Triggers AI analysis and mints/updates soulbound NFT on-chain.',
    params: [
      { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
    ],
    response: `{
  "success": true,
  "wallet": "0x...",
  "score": 720,
  "grade": "Good",
  "summary": "This wallet demonstrates consistent on-chain activity...",
  "factors": {
    "walletAge": 140,
    "transactionActivity": 213,
    "uniqueInteractions": 160,
    "balanceHealth": 207
  },
  "recommendation": "Increase protocol interactions to improve your score.",
  "txHash": "0x...",
  "hasMinted": true,
  "isNewMint": false
}`,
  },
];

const solidityExample = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IQieScore {
    function getScore(address wallet) external view returns (uint256);
    function hasMinted(address wallet) external view returns (bool);
    function canRefresh(address wallet) external view returns (bool);
    function lastRefreshTime(address wallet) external view returns (uint256);
    function getScoreHistory(address wallet) external view returns (uint256[] memory);
}

contract YourProtocol {
    // Always use Registry address — permanent, never changes
    IQieScore public qieScore = IQieScore(
        0x5360B744548a267f36B903A65f78cab44882C8Ec // QIE Testnet
    );

    function getBorrowTerms(address borrower) public view {
        require(qieScore.hasMinted(borrower), "No QieScore found");

        uint256 score = qieScore.getScore(borrower); // 300-850

        // Check score is not stale (updated within 30 days)
        uint256 lastUpdate = qieScore.lastRefreshTime(borrower);
        require(
            block.timestamp - lastUpdate <= 30 days,
            "Score is stale, please refresh"
        );

        if (score >= 800) {
            // Exceptional — best terms
        } else if (score >= 740) {
            // Very Good — preferential rates
        } else if (score >= 670) {
            // Good — standard rates
        } else if (score >= 580) {
            // Fair — limited access
        } else {
            // Poor — collateral required
        }
    }
}`;

const ethersExample = `import { Contract, JsonRpcProvider } from 'ethers';

// Connect to QIE Testnet
const provider = new JsonRpcProvider('https://rpc1testnet.qie.digital/');

// Always use Registry address — never the implementation
const REGISTRY_ADDRESS = '0x5360B744548a267f36B903A65f78cab44882C8Ec';

const ABI = [
  "function getScore(address wallet) external view returns (uint256)",
  "function hasMinted(address wallet) external view returns (bool)",
  "function canRefresh(address wallet) external view returns (bool)",
  "function lastRefreshTime(address wallet) external view returns (uint256)",
  "function getScoreHistory(address wallet) external view returns (uint256[])",
];

async function getQieScore(walletAddress: string) {
  const contract = new Contract(REGISTRY_ADDRESS, ABI, provider);

  const hasMinted = await contract.hasMinted(walletAddress);
  if (!hasMinted) return null;

  const score = await contract.getScore(walletAddress);
  const lastUpdate = await contract.lastRefreshTime(walletAddress);

  return {
    score: Number(score),        // 300-850 FICO range
    lastUpdated: new Date(Number(lastUpdate) * 1000),
  };
}`;

const restExample = `// Request a new score
const response = await fetch('${BACKEND_URL}/score/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ wallet: '0x...' })
});

const result = await response.json();
console.log(result.score);  // 300-850
console.log(result.grade);  // "Exceptional" | "Very Good" | "Good" | "Fair" | "Poor"
console.log(result.txHash); // on-chain transaction hash

// Read existing score (free, no backend needed)
const scoreResponse = await fetch('${BACKEND_URL}/score/0x...');
const scoreData = await scoreResponse.json();
console.log(scoreData.score); // 300-850`;

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
      {}
      <div>
        <h1 className="text-2xl font-bold text-white">API Documentation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Integrate QieScore into your protocol via REST API, Solidity interface, or Ethers.js
        </p>
      </div>

      <Tabs defaultValue="rest" className="w-full">
        <TabsList className="bg-qie-card border border-qie-border">
          <TabsTrigger value="rest" className="data-[state=active]:bg-qie-primary/20">
            <Globe className="h-4 w-4 mr-2" />
            REST API
          </TabsTrigger>
          <TabsTrigger value="solidity" className="data-[state=active]:bg-qie-primary/20">
            <Code className="h-4 w-4 mr-2" />
            Solidity
          </TabsTrigger>
          <TabsTrigger value="ethers" className="data-[state=active]:bg-qie-primary/20">
            <Terminal className="h-4 w-4 mr-2" />
            Ethers.js
          </TabsTrigger>
        </TabsList>

        {}
        <TabsContent value="rest" className="space-y-4">

          {}
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Base URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <code className="block rounded-lg bg-qie-dark p-4 font-mono text-sm text-qie-primary">
                  {BACKEND_URL}
                </code>
                <CopyButton text={BACKEND_URL} />
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">FICO Score Range</CardTitle>
              <CardDescription className="text-gray-500">
                QieScore uses the standard FICO range for instant familiarity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { range: '800-850', grade: 'Exceptional', color: '#00D084' },
                  { range: '740-799', grade: 'Very Good', color: '#00A8E8' },
                  { range: '670-739', grade: 'Good', color: '#7B2CBF' },
                  { range: '580-669', grade: 'Fair', color: '#F59E0B' },
                  { range: '300-579', grade: 'Poor', color: '#EF4444' },
                ].map((item) => (
                  <div
                    key={item.grade}
                    className="rounded-lg border p-3 text-center"
                    style={{
                      borderColor: `${item.color}30`,
                      backgroundColor: `${item.color}10`,
                    }}
                  >
                    <p className="text-xs font-mono" style={{ color: item.color }}>
                      {item.range}
                    </p>
                    <p className="text-xs font-semibold text-white mt-1">
                      {item.grade}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="rounded-lg bg-qie-dark p-4 overflow-x-auto text-xs text-gray-300 font-mono">
                  {restExample}
                </pre>
                <CopyButton text={restExample} />
              </div>
            </CardContent>
          </Card>

          {}
          {endpoints.map((endpoint) => (
            <Card key={endpoint.path} className="border-qie-border bg-qie-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={endpoint.method === 'GET' ? 'outline' : 'default'}
                    className="font-mono"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm text-qie-secondary font-mono">
                    {endpoint.path}
                  </code>
                </div>
                <CardDescription className="text-gray-500">
                  {endpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

        {}
        <TabsContent value="solidity" className="space-y-4">
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Smart Contract Integration</CardTitle>
              <CardDescription className="text-gray-500">
                Import IQieScore and read scores directly on-chain — no API key needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Registry Addresses</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark border border-qie-border">
                    <span className="text-xs text-gray-400">QIE Testnet (Chain ID: 1983)</span>
                    <code className="text-xs text-qie-primary font-mono">
                      0x5360B744548a267f36B903A65f78cab44882C8Ec
                    </code>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-qie-dark border border-qie-border">
                    <span className="text-xs text-gray-400">QIE Mainnet (Chain ID: 1990)</span>
                    <code className="text-xs text-gray-500 font-mono">
                      Coming soon after audit
                    </code>
                  </div>
                </div>
              </div>
              <div className="relative">
                <pre className="rounded-lg bg-qie-dark p-4 overflow-x-auto text-xs text-gray-300 font-mono">
                  {solidityExample}
                </pre>
                <CopyButton text={solidityExample} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {}
        <TabsContent value="ethers" className="space-y-4">
          <Card className="border-qie-border bg-qie-card">
            <CardHeader>
              <CardTitle className="text-white">Ethers.js Integration</CardTitle>
              <CardDescription className="text-gray-500">
                Read scores directly from the blockchain — free, no backend needed
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