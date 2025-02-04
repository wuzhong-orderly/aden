import { FC, ReactNode, useCallback } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import config from "@/utils/config";
import { NetworkId } from "@orderly.network/types";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
	const networkId = typeof window !== 'undefined' ? (localStorage.getItem('orderly-networkId') ?? 'mainnet') as NetworkId : 'mainnet';
	const onChainChanged = useCallback(
		(_chainId: number, {isTestnet}: {isTestnet: boolean}) => {
			localStorage.setItem('orderly-networkId', isTestnet ? 'testnet' : 'mainnet');
      if (isTestnet && networkId === 'mainnet' || !isTestnet && networkId === 'testnet') {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
		},
		[],
	);
  
  return (
    <WalletConnectorProvider>
      <OrderlyAppProvider
        brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
        brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
        networkId={networkId}
        onChainChanged={onChainChanged}
        appIcons={config.orderlyAppProvider.appIcons}
      >
        {props.children}
      </OrderlyAppProvider>
    </WalletConnectorProvider>
  );
};

export default OrderlyProvider;
