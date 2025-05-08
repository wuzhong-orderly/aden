import { ReactNode } from 'react';
import { WalletConnectorPrivyProvider, Network } from '@orderly.network/wallet-connector-privy';
import { injected, walletConnect } from 'wagmi/connectors';
import type { NetworkId } from "@orderly.network/types";
import { CreateConnectorFn } from 'wagmi';

const PrivyConnector = ({ children, networkId }: {
  children: ReactNode;
  networkId: NetworkId;
}) => {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;
  const termsOfUseUrl = import.meta.env.VITE_PRIVY_TERMS_OF_USE;
  const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
  const isBrowser = typeof window !== 'undefined';

  const connectors: CreateConnectorFn[] = [injected()];
  if (walletConnectProjectId && isBrowser) {
    connectors.push(
      walletConnect({
        projectId: walletConnectProjectId,
        showQrModal: true,
        metadata: {
          name: import.meta.env.VITE_APP_NAME || 'Orderly App',
          description: import.meta.env.VITE_APP_DESCRIPTION || 'Orderly Application',
          url: window.location.origin,
          icons: [`${window.location.origin}/favicon.webp`]
        }
      })
    );
  }

  return (
    <WalletConnectorPrivyProvider
      network={networkId === 'mainnet' ? Network.mainnet : Network.testnet}
      termsOfUse={termsOfUseUrl}
      wagmiConfig={{
        connectors
      }}
      privyConfig={{
        config: {
          appearance: {
            showWalletLoginFirst: false,
          },
        },
        appid: appId,
      }}
    >
      {children}
    </WalletConnectorPrivyProvider>
  );
};

export default PrivyConnector; 