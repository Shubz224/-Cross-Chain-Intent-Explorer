import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, } from 'wagmi'
import { sepolia, arbitrumSepolia, baseSepolia, optimismSepolia, polygonAmoy } from 'wagmi/chains'

const WALLETCONNECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const config = getDefaultConfig({
  appName: 'IntentScan',
  projectId: WALLETCONNECT_ID,
  chains: [sepolia, arbitrumSepolia, baseSepolia, optimismSepolia, polygonAmoy],
  transports: {
    [sepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
  ssr: true,
});


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme()} locale="en">
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
