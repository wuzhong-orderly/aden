import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { API } from "@orderly.network/types";
import { Flex, Spinner } from "@orderly.network/ui";
// import { TradingPage } from "@orderly.network/trading";
import config from "@/utils/config";
import { updateSymbol } from "@/utils/storage";
import { formatSymbol, generatePageTitle } from "@/utils/utils";

const TradingPage = lazy(() =>
  import("@orderly.network/trading").then((module) => ({
    default: module.TradingPage,
  }))
);

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

export default function PerpPage() {
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);
      navigate(`/perp/${symbol}`);
    },
    [navigate]
  );

  return (
    <Suspense
      fallback={
        <Flex style={{ height: "100vh" }} justify="center" itemAlign="center">
          <Spinner />
        </Flex>
      }
    >
      <TradingPage
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </Suspense>
  );

  return (
    <TradingPage
      symbol={symbol}
      onSymbolChange={onSymbolChange}
      tradingViewConfig={config.tradingPage.tradingViewConfig}
      sharePnLConfig={config.tradingPage.sharePnLConfig}
    />
  );
}
