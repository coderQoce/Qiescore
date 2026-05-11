import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { Toaster } from 'sonner';
import { config } from '@/lib/wagmi';
import { Layout } from '@/components/Layout';
import { Landing, Dashboard, Score, Protocol, ApiDocs } from '@/pages';
import '@rainbow-me/rainbowkit/styles.css';
import '@/styles/globals.css';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00D084',
            accentColorForeground: '#0A0A0F',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/score" element={<Score />} />
                <Route path="/protocol" element={<Protocol />} />
                <Route path="/api-docs" element={<ApiDocs />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111118',
                border: '1px solid #1E1E2E',
                color: '#fff',
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
