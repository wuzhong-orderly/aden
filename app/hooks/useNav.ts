import { useCallback } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { RouteOption } from "@orderly.network/ui-scaffold";
import { getSymbol } from "@/utils/storage";

export function useNav() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      const searchParamsString = searchParams.toString();
      const queryString = searchParamsString ? `?${searchParamsString}` : "";

      if (option.target === "_blank") {
        let href = option.href;
        if (href === "/v2") {
          href = "/v2/";
        }
        window.open(href);
        return;
      }

      if (option.href === "/") {
        const symbol = getSymbol();
        navigate(`/perp/${symbol}${queryString}`);
        return;
      }

      const routeMap = {
        "/portfolio/feeTier": "/portfolio/fee",
        "/portfolio/apiKey": "/portfolio/api-key",
        "/affiliate": "/referral",
        "/tradingRewards": "/referral",
        "/rewards": "/referral",
        "/rewards/affiliate?tab=affiliate": "/referral/affiliate",
        "/rewards/affiliate?tab=trader": "/referral/trader",
        "/referral": "/referral",
      } as Record<string, string>;

      const path = routeMap[option.href] || option.href;

      // Remix navigate() automatically handles the basename from vite config
      // so we don't need to add /v2 prefix here
      navigate(`${path}${queryString}`);
    },
    [navigate, searchParams]
  );

  return { onRouteChange };
}
