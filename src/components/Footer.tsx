
import React from "react";
import { Globe } from "./icons";
export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0F] border-t border-[#1E1E2E] py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/qie-logo.svg" alt="QieScore" className="w-6 h-6" />
            <span className="text-[#A0A0B0] text-sm">
              Powered by <span className="text-[#00D084]">QIE</span> Blockchain
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href={
                import.meta.env.VITE_USE_TESTNET === "true"
                  ? "https://testnet.qie.digital"
                  : "https://mainnet.qie.digital"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6A6A7B] hover:text-[#00D084] transition-colors flex items-center gap-1"
            >
              <Globe size={14} />
              Explorer
            </a>
            <a
              href="/api-docs"
              className="text-[#6A6A7B] hover:text-[#00D084] transition-colors"
            >
              API Docs
            </a>
            <span className="text-[#3A3A4B]">|</span>
            <span className="text-[#6A6A7B]">2026 QieScore</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
