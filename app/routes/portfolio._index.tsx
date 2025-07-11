import { MetaFunction } from "@remix-run/node";
import { OverviewModule, PortfolioLayoutWidget } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/utils/config";
import { useTranslation } from "@orderly.network/i18n";
import { useLocation } from "@remix-run/react";
import { useMemo, useEffect, useState } from "react";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Portfolio") }];
// };

export default function PortfolioPage() {
  const [needsLayout, setNeedsLayout] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();
  const { onRouteChange } = useNav();
  const config = useOrderlyConfig();

  const currentPath = useMemo(() => {
    if (pathname.endsWith("/portfolio")) return "/portfolio";
    if (pathname.endsWith("/portfolio/fee")) return "/portfolio/feeTier";
    if (pathname.endsWith("/portfolio/api-key")) return "/portfolio/apiKey";
    return pathname;
  }, [pathname]);

  const customSideBarItems = [
    {
      name: t("common.overview"),
      href: "/portfolio"
    },
    {
      name: t("common.positions"),
      href: "/portfolio/positions"
    },
    {
      name: t("common.orders"),
      href: "/portfolio/orders"
    },
    {
      name: t("portfolio.apiKeys"),
      href: "/portfolio/api-key"
    },
    {
      name: t("portfolio.setting"),
      href: "/portfolio/setting"
    },
  ];

  // Check if logo exists (portfolio.tsx layout didn't run)
  useEffect(() => {
    const checkLayout = () => {
      // Look for logo elements
      const logo = document.querySelector('#primary-logo-link') ||
        document.querySelector('#secondary-logo-link')

      // If no logo found, we need to add the layout
      if (!logo) {
        setNeedsLayout(true);
      } else {
        setNeedsLayout(false);
      }
    };

    // Check immediately
    checkLayout();

    // Check after delays to catch different render phases
    const timer1 = setTimeout(checkLayout, 100);
    const timer2 = setTimeout(checkLayout, 500);
    const timer3 = setTimeout(checkLayout, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // If layout is needed (portfolio.tsx didn't run), wrap with PortfolioLayoutWidget
  if (needsLayout) {
    return (
      <PortfolioLayoutWidget
        items={customSideBarItems}
        footerProps={config.scaffold.footerProps}
        mainNavProps={{
          ...config.scaffold.mainNavProps,
          initialMenu: "/portfolio",
        }}
        routerAdapter={{
          onRouteChange,
        }}
        leftSideProps={{
          current: currentPath,
        }}
        bottomNavProps={config.scaffold.bottomNavProps}
      >
        <OverviewModule.OverviewPage />
      </PortfolioLayoutWidget>
    );
  }

  // If layout exists (portfolio.tsx ran properly), just return the content
  return (
    <OverviewModule.OverviewPage />
  );
}
