import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Shield, Code, Home, BarChart3, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '/', label: 'Home', icon: Home, requiresAuth: false },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3, requiresAuth: true },
  { path: '/protocol', label: 'Protocol', icon: Shield, requiresAuth: false },
  { path: '/api-docs', label: 'API Docs', icon: Code, requiresAuth: false },
];

export function Navbar() {
  const location = useLocation();
  const { isConnected } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Filter nav items based on authentication status
  const visibleNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isConnected)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-qie-border bg-qie-dark/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-qie-primary to-qie-secondary">
              <Activity className="h-6 w-6 text-qie-dark" />
            </div>
            <span className="hidden text-xl font-bold text-white sm:block">
              Qie<span className="text-qie-primary">Score</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-qie-primary/10 text-qie-primary"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Connect Button & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
              accountStatus="address"
            />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-qie-border bg-qie-dark/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-qie-primary/10 text-qie-primary"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}