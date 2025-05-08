import { ReactNode } from 'react';
import { WalletConnectorProvider } from '@orderly.network/wallet-connector';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { NetworkId } from "@orderly.network/types";
import injected from '@web3-onboard/injected-wallets';
import walletConnect from '@web3-onboard/walletconnect';
import binanceWallet from '@binance/w3w-blocknative-connector';

interface WalletConnectorProps {
  children: ReactNode;
  networkId: NetworkId;
}

const WalletConnector = ({ children, networkId }: WalletConnectorProps) => {
  const isBrowser = typeof window !== 'undefined';
  
  const evmInitial = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID && isBrowser 
    ? {
        options: {
          wallets: [
            injected(),
            binanceWallet({ options: { lng: "en" } }),
            walletConnect({
              projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
              qrModalOptions: {
                themeMode: "dark",
              },
              dappUrl: window.location.origin,
            }),
          ],
        }
      } 
    : undefined;

  return (
    <WalletConnectorProvider
      solanaInitial={{
        network: networkId === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet
      }}
      evmInitial={evmInitial}
    >
      {children}
    </WalletConnectorProvider>
  );
};

export default WalletConnector; 