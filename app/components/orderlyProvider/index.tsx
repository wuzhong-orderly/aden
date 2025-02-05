import { FC, ReactNode } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import config from "@/utils/config";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  return (
    <WalletConnectorProvider>
      <OrderlyAppProvider
        brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
        brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
        networkId={import.meta.env.VITE_NETWORK_ID}
        chainFilter={import.meta.env.VITE_NETWORK_ID === 'mainnet' ? {testnet: []} : {mainnet: []}}
        appIcons={config.orderlyAppProvider.appIcons}
      >
        {props.children}
      </OrderlyAppProvider>
    </WalletConnectorProvider>
  );
};

export default OrderlyProvider;
