import { Dashboard } from "@orderly.network/affiliate";
import { Outlet } from "@remix-run/react";
import {
    TradingRewardsLayoutWidget,
} from "@orderly.network/trading-rewards";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";

export default function TradingRewardsLayout() {
    const { onRouteChange } = useNav();
    const config = useOrderlyConfig();

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any}
        >
            <Dashboard.AffiliatePage />
            <Outlet />
        </TradingRewardsLayoutWidget>
    )
}
