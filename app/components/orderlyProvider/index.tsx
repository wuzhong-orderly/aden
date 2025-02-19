import { FC, ReactNode } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import config from "@/utils/config";
import { ArbitrumSepolia, SolanaDevnet } from "@orderly.network/types";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  return (
    <WalletConnectorProvider>
      <OrderlyAppProvider
        brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
        brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
        networkId={import.meta.env.VITE_NETWORK_ID}
        chainFilter={import.meta.env.VITE_NETWORK_ID === 'mainnet' ? {testnet: []} : {mainnet: [], testnet: [ArbitrumSepolia, SolanaDevnet, {
          id: 10143,
          chainInfo: {
            name: "Monad Testnet",
            public_rpc_url: "https://testnet-rpc.monad.xyz",
            chainId: 10143,
            currency_symbol: "MON",
            explorer_base_url: "",
            vault_address: "",
          },
        }]}}
        appIcons={config.orderlyAppProvider.appIcons}
      >
        {props.children}
      </OrderlyAppProvider>
    </WalletConnectorProvider>
  );
};

export default OrderlyProvider;
