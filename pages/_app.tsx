import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// RainbowKit / Wagmi / Filecoin Network

const hyperspaceChain: Chain = {
  id: 3141,
  name: 'Filecoin - Hyperspace testnet',
  network: 'Hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'Hyperspace',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: {
      http: ['https://api.hyperspace.node.glif.io/rpc/v0'],
    },
  },  
  blockExplorers: {
    default: { name: 'Glif', url: 'https://hyperspace.filfox.info/en' },
  },
  testnet: true,
};

const { chains, provider, webSocketProvider } = configureChains(
  [
    hyperspaceChain
  ],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

// Chakra UI

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const theme = extendTheme({ colors })


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider  theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
