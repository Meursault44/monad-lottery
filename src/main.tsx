import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactTogether } from 'react-together';
import App from './App.tsx';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';
import { AppLoader } from './components';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: `'Open Sans', sans-serif`,
            },
            components: {
              Button: {
                fontSize: 16,
                fontWeight: 700,
                paddingInline: 12,
                controlHeight: 40,
              },
              Tour: {},
            },
          }}
        >
          <RainbowKitProvider>
            <ReactTogether
              sessionParams={{
                appId: import.meta.env['VITE_APP_ID'],
                apiKey: import.meta.env['VITE_API_KEY'],
                name: 'HappyWheel777',
                password: 'HappyWheel777Password',
              }}
            >
              <AppLoader>
                <App />
              </AppLoader>
            </ReactTogether>
          </RainbowKitProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
