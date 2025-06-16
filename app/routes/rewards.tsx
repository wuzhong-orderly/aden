import { Dashboard, ReferralProvider } from "@orderly.network/affiliate";
import { FC, ReactNode } from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { useMemo } from "react";
import {
    TradingRewardsLayoutWidget,
    TradingRewardsLeftSidebarPath,
} from "@orderly.network/trading-rewards";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";

type TradingRewardsLayoutProps = {
    children: ReactNode;
    currentPath?: TradingRewardsLeftSidebarPath;
};
export default function TradingRewardsLayout() {
    const { onRouteChange } = useNav();
    const config = useOrderlyConfig();
    const pathname = location.pathname;

    return (
        <TradingRewardsLayoutWidget
            {...{
                footerProps: config.scaffold.footerProps,
                mainNavProps: {
                    ...config.scaffold.mainNavProps,
                    initialMenu: ["/rewards"],
                },
                routerAdapter: { onRouteChange },
                hideSideBar: true,
            } as any}
        >
            <Dashboard.AffiliatePage />
            <Outlet />
        </TradingRewardsLayoutWidget >
    )

}
