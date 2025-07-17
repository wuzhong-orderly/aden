import { ReactNode, useCallback, lazy, Suspense, useState, useEffect } from "react";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { useOrderlyConfig } from "@/utils/config";
import type { NetworkId } from "@orderly.network/types";
import { LocaleProvider, LocaleCode, LocaleEnum, defaultLanguages } from "@orderly.network/i18n";
import { withBasePath } from "@/utils/base-path";
import ServiceRestrictionsDialog from "./ServiceRestrictionsDialog";
import { useApiInterceptor } from "@/hooks/useApiInterceptor";
import { useLocation } from "@remix-run/react";

const NETWORK_ID_KEY = "orderly_network_id";

const getNetworkId = (): NetworkId => {
	if (typeof window === "undefined") return "mainnet";

	const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === 'true';
	const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === 'true';

	if (disableMainnet && !disableTestnet) {
		return "testnet";
	}

	if (disableTestnet && !disableMainnet) {
		return "mainnet";
	}

	return (localStorage.getItem(NETWORK_ID_KEY) as NetworkId) || "mainnet";
};

const setNetworkId = (networkId: NetworkId) => {
	if (typeof window !== "undefined") {
		localStorage.setItem(NETWORK_ID_KEY, networkId);
	}
};

const getAvailableLanguages = (): string[] => {
	const languages = import.meta.env.VITE_AVAILABLE_LANGUAGES?.split(',')
		.map((code: string) => code.trim())
		.filter((code: string) => code.length > 0) || [];
	
	return languages.length > 0 ? languages : ['en'];
};

const LoadingSpinner = () => (
	<div className="loading-container">
		<div className="loading-spinner"></div>
		<style>
			{`
				.loading-container {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100vh;
					background-color: rgba(0, 0, 0, 0.03);
				}
				.loading-spinner {
					width: 50px;
					height: 50px;
					border: 4px solid rgba(0, 0, 0, 0.1);
					border-radius: 50%;
					border-left-color: #09f;
					animation: spin 1s linear infinite;
				}
				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			`}
		</style>
	</div>
);

const PrivyConnector = lazy(() => import("@/components/orderlyProvider/privyConnector"));
const WalletConnector = lazy(() => import("@/components/orderlyProvider/walletConnector"));

const OrderlyProvider = (props: { children: ReactNode }) => {
	const config = useOrderlyConfig();
	const networkId = getNetworkId();
	const [isClient, setIsClient] = useState(false);
	const location = useLocation();

	// Enhanced ActiveNavigation logic with better DOM checking
	useEffect(() => {
		const updateActiveNav = () => {
			const path = location.pathname;
			const navItems = document.querySelectorAll('footer>div>div');

			// If nav items aren't ready yet, try again later
			if (navItems.length === 0) {
				setTimeout(updateActiveNav, 200);
				return;
			}

			// Remove active class from all items
			navItems.forEach(item => item.classList.remove('nav-active'));

			// Add active class based on current path
			if (path.includes('/perp') || path.includes('/trading')) {
				navItems[0]?.classList.add('nav-active'); // Trading
			} else if (path.includes('/portfolio')) {
				navItems[1]?.classList.add('nav-active'); // Portfolio
			} else if (path.includes('/markets')) {
				navItems[2]?.classList.add('nav-active'); // Markets
			} else if (path.includes('/demo_trading')) {
				navItems[3]?.classList.add('nav-active'); // Demo
			}
		};

		// Run immediately if client is ready
		if (isClient) {
			updateActiveNav();
		}

		// Also run with delay to catch late-rendered elements
		const timer = setTimeout(updateActiveNav, 500);

		// Set up a MutationObserver to detect when the footer is added to DOM
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) { // Element node
						const element = node as Element;
						if (element.tagName === 'FOOTER' || element.querySelector('footer')) {
							updateActiveNav();
						}
					}
				});
			});
		});

		// Start observing
		if (typeof document !== 'undefined') {
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		}

		return () => {
			clearTimeout(timer);
			observer.disconnect();
		};
	}, [location.pathname, isClient]);

	const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
	const usePrivy = !!privyAppId;

	const parseChainIds = (envVar: string | undefined): Array<{ id: number }> | undefined => {
		if (!envVar) return undefined;
		return envVar.split(',')
			.map(id => id.trim())
			.filter(id => id)
			.map(id => ({ id: parseInt(id, 10) }))
			.filter(chain => !isNaN(chain.id));
	};

	const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === 'true';
	const mainnetChains = disableMainnet ? [] : parseChainIds(import.meta.env.VITE_ORDERLY_MAINNET_CHAINS);
	const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === 'true';
	const testnetChains = disableTestnet ? [] : parseChainIds(import.meta.env.VITE_ORDERLY_TESTNET_CHAINS);

	const chainFilter = (mainnetChains || testnetChains) ? {
		...(mainnetChains && { mainnet: mainnetChains }),
		...(testnetChains && { testnet: testnetChains })
	} : undefined;

	useEffect(() => {
		setIsClient(true);
	}, []);

	const onChainChanged = useCallback(
		(_chainId: number, { isTestnet }: { isTestnet: boolean }) => {
			const currentNetworkId = getNetworkId();
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

	useApiInterceptor();

	const onLanguageChanged = async (lang: LocaleCode) => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			if (lang === LocaleEnum.en) {
				url.searchParams.delete('lang');
			} else {
				url.searchParams.set('lang', lang);
			}
			window.history.replaceState({}, '', url.toString());
		}
	};

	const loadPath = (lang: LocaleCode) => {
		const availableLanguages = getAvailableLanguages();
		
		if (!availableLanguages.includes(lang)) {
			return [];
		}
		
		if (lang === LocaleEnum.en) {
			return withBasePath(`/locales/extend/${lang}.json`);
		}
		return [
			withBasePath(`/locales/${lang}.json`),
			withBasePath(`/locales/extend/${lang}.json`)
		];
	};

	const availableLanguages = getAvailableLanguages();
	const filteredLanguages = defaultLanguages.filter(lang => 
		availableLanguages.includes(lang.localCode)
	);

	const appProvider = (
		<OrderlyAppProvider
			brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
			brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
			networkId={networkId}
			onChainChanged={onChainChanged}
			appIcons={config.orderlyAppProvider.appIcons}
			orderbookDefaultTickSizes={{
				PERP_BTC_USDC: "10",
				PERP_ETH_USDC: "0.1",
				PERP_SOL_USDC: "0.01",
			}}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(chainFilter && { chainFilter } as any)}
			defaultChain={{
				mainnet: { id: 56 }
			}}
		>
			<ServiceRestrictionsDialog />
			{props.children}
		</OrderlyAppProvider>
	);

	if (!isClient) {
		return <LoadingSpinner />;
	}

	const walletConnector = usePrivy
		? <PrivyConnector networkId={networkId}>{appProvider}</PrivyConnector>
		: <WalletConnector networkId={networkId}>{appProvider}</WalletConnector>;

	return (
		<LocaleProvider
			onLanguageChanged={onLanguageChanged}
			backend={{ loadPath }}
			languages={filteredLanguages}
		>
			<Suspense fallback={<LoadingSpinner />}>
				{walletConnector}
			</Suspense>
		</LocaleProvider>
	);
};

export default OrderlyProvider;
