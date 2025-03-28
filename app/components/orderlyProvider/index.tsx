import { FC, ReactNode, useCallback } from "react";
import { WalletConnectorProvider } from "@orderly.network/wallet-connector";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import config from "@/utils/config";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import injected from "@web3-onboard/injected-wallets";
import walletConnect from '@web3-onboard/walletconnect'
import binance from "@binance/w3w-blocknative-connector";
import type { NetworkId } from "@orderly.network/types";

const NETWORK_ID_KEY = "orderly_network_id";

const getNetworkId = (): NetworkId => {
	if (typeof window === "undefined") return "mainnet";
	return (localStorage.getItem(NETWORK_ID_KEY) as NetworkId) || "mainnet";
};

const setNetworkId = (networkId: NetworkId) => {
	if (typeof window !== "undefined") {
		localStorage.setItem(NETWORK_ID_KEY, networkId);
	}
};

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
	const networkId = getNetworkId();

	const onChainChanged = useCallback(
		(_chainId: number, {isTestnet}: {isTestnet: boolean}) => {
			const currentNetworkId = getNetworkId();
			// If network type has changed (testnet vs mainnet)
			if ((isTestnet && currentNetworkId === 'mainnet') || (!isTestnet && currentNetworkId === 'testnet')) {
				const newNetworkId: NetworkId = isTestnet ? 'testnet' : 'mainnet';
				setNetworkId(newNetworkId);
				
				setTimeout(() => {
					window.location.reload();
				}, 100);
			}
		},
		[]
	);
	
	return (
		<WalletConnectorProvider
			solanaInitial={{network: networkId === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet}}
			evmInitial={import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID && typeof window !== 'undefined' ? {
				options: {
					wallets: [
						injected(),
						binance({ options: { lng: "en" } }),
						walletConnect({
							projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
							qrModalOptions: {
								themeMode: "dark",
							},
							dappUrl: window.location.origin,
						}),
					],
				}
			} : undefined}
		>
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
