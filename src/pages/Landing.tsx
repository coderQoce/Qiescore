import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Activity,
  TrendingUp,
  ChevronRight,
  Wallet,
  BarChart3,
} from "lucide-react";

export function Landing() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  return (
    <div className="space-y-20">
      {}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-qie-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-qie-secondary/20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {}
            {}

            {}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Your On-Chain
              <br />
              <span className="text-gradient">Credit Score</span>
            </h1>

            {}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400 md:text-xl">
              QieScore brings AI-powered credit scoring to the QIE blockchain.
              Establish your reputation, unlock better DeFi rates, and mint your
              soulbound score NFT.
            </p>

            {}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              size="xl"
                              onClick={openConnectModal}
                              className="bg-qie-primary text-qie-dark font-bold hover:bg-qie-primary/90 glow-primary"
                            >
                              <Wallet className="h-5 w-5 mr-2" />
                              Connect Wallet
                            </Button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <Button
                              size="xl"
                              onClick={openChainModal}
                              className="bg-red-600 text-white font-bold hover:bg-red-700"
                            >
                              Wrong Network
                            </Button>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
              <Link to="/protocol">
                <Button size="xl" variant="qie-outline">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Protocol Lookup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">How It Works</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Get your QieScore in three simple steps and start enjoying better
            DeFi rates.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Connect Wallet",
              description:
                "Link your QIE wallet securely using RainbowKit. No private keys required.",
              icon: Wallet,
            },
            {
              step: "02",
              title: "Get Analyzed",
              description:
                "Our AI analyzes your on-chain history across multiple dimensions instantly.",
              icon: Activity,
            },
            {
              step: "03",
              title: "Borrow Better",
              description:
                "Mint your score NFT and access preferential rates on QieLend.",
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
              <h3 className="mb-2 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      {}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-qie-primary/30 bg-gradient-to-r from-qie-primary/20 to-qie-secondary/20 p-8 md:p-12">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Check Your Score?
            </h2>
            <p className="mb-8 max-w-2xl text-gray-300">
              Connect your wallet now and discover your QieScore. It takes less
              than a minute and could save you thousands in interest.
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

          {}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-qie-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-qie-secondary/30 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
