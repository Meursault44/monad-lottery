import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 10143, // Chain ID Monad testnet
  name: 'Monad Testnet',
  network: 'monad-testnet',
  iconUrl: 'https://files.svgcdn.io/token-branded/monad.png',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [`https://monad-testnet.g.alchemy.com/v2/${import.meta.env['VITE_ALCHEMY_API_KEY']}`],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.monad.xyz' },
  },
  testnet: true,
});

export const MON_LOTTERY_ADDRESS = '0xd26C113932d444e886Fafa90feB938CaceDB7ec9';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [monadTestnet],
});
