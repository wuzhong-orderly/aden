import { TradingPageProps } from "@orderly.network/trading";
import { FooterProps, MainNavWidgetProps } from "@orderly.network/ui-scaffold";
import { AppLogos } from "@orderly.network/react-app";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";
import { withBasePath } from "./base-path";

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

const config: OrderlyConfig = {
  scaffold: {
    mainNavProps: {
      initialMenu: "/",
      mainMenus: [
        { name: "Trading", href: "/" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Markets", href: "/markets" },
        { name: "Leaderboard", href: "/leaderboard" },
      ],
      campaigns: {
        name: "Reward",
        href: "/rewards",
        children: [
          {
            name: "Trading rewards",
            href: "https://app.orderly.network/tradingRewards",
            description: "Trade with Orderly to earn ORDER",
            icon: <OrderlyIcon size={14} />,
            activeIcon: <OrderlyActiveIcon size={14} />,
            target: "_blank",
          },

          {
            name: "Staking",
            href: "https://app.orderly.network/staking",
            description: "Stake ORDER/esORDER to acquire VALOR",
            icon: <OrderlyIcon size={14} />,
            activeIcon: <OrderlyActiveIcon size={14} />,
            target: "_blank",
          },
        ],
      },
    },
    footerProps: {
      telegramUrl: import.meta.env.VITE_TELEGRAM_URL || undefined,
      discordUrl: import.meta.env.VITE_DISCORD_URL || undefined,
      twitterUrl: import.meta.env.VITE_TWITTER_URL || undefined,
      trailing: <span className="oui-text-2xs oui-text-base-contrast-54">Charts powered by <a href="https://tradingview.com" target="_blank" rel="noopener noreferrer">TradingView</a></span>
    },
  },
  orderlyAppProvider: {
    appIcons: {
      main:
        import.meta.env.VITE_HAS_PRIMARY_LOGO === "true"
          ? { component: <img src={withBasePath("/logo.webp")} alt="logo" style={{ height: "42px" }} /> }
          : { img: withBasePath("/orderly-logo.svg") },
      secondary: {
        img: import.meta.env.VITE_HAS_SECONDARY_LOGO === "true"
          ? withBasePath("/logo.webp")
          : withBasePath("/orderly-logo-secondary.svg"),
      },
    },
  },
  tradingPage: {
    tradingViewConfig: {
      scriptSRC: withBasePath("/tradingview/charting_library/charting_library.js"),
      library_path: withBasePath("/tradingview/charting_library/"),
      customCssUrl: withBasePath("/tradingview/chart.css"),
    },
    sharePnLConfig: {
      backgroundImages: [
        withBasePath("/pnl/poster_bg_1.png"),
        withBasePath("/pnl/poster_bg_2.png"),
        withBasePath("/pnl/poster_bg_3.png"),
        withBasePath("/pnl/poster_bg_4.png"),
      ],

      color: "rgba(255, 255, 255, 0.98)",
      profitColor: "rgba(41, 223, 169, 1)",
      lossColor: "rgba(245, 97, 139, 1)",
      brandColor: "rgba(255, 255, 255, 0.98)",

      // ref
      refLink: "https://orderly.network",
      refSlogan: "Orderly referral",
    },
  },
};

export default config;
