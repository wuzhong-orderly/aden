import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";
import { useState, useRef, useEffect } from "react";
import "./styles/index.css";
import { withBasePath } from "./utils/base-path";
import { i18n } from "@orderly.network/i18n";
import { useAppContext } from "@orderly.network/react-app";
import { useStorageChain } from "@orderly.network/hooks";

export function Layout({ children }: { children: React.ReactNode }) {

  const [lang, setLang] = useState(i18n.language === "ko" ? "ko" : "en");
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const { currentChainId, setCurrentChainId } =
    useAppContext();
  const { setStorageChain } = useStorageChain();
  const defaultChainId = Number(import.meta.env.VITE_DEFAULT_CHAIN_ID);

  useEffect(() => {

    let savedLang = localStorage.getItem("lang");
    console.log(`Language set from localStorage: ${savedLang}`);
    console.log(`Language set from localStorage: ${savedLang}`);

    setStorageChain(defaultChainId);
    setCurrentChainId(defaultChainId);

    setBubblePos({
      x: window.innerWidth - 90,
      y: window.innerHeight - 110,
    });

    if (savedLang) {
      setLang(savedLang);
      i18n.changeLanguage(savedLang);
      localStorage.removeItem("lang");
    } else {
      setLang("en");
      i18n.changeLanguage("en");
    }

    // Handler for window resize
    const handleResize = () => {
      setBubblePos(pos => ({
        x: window.innerWidth - 90,
        y: window.innerHeight - 110,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const toggleLang = () => {
    const nextLang = lang === "en" ? "ko" : "en";
    localStorage.setItem("lang", nextLang);
    window.location.reload();
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - bubblePos.x,
      y: e.clientY - bubblePos.y,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setBubblePos({
      x: e.clientX - offset.current.x,
      y: Math.max(0, e.clientY - offset.current.y),
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    dragging.current = true;
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - bubblePos.x,
      y: touch.clientY - bubblePos.y,
    };
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging.current) return;
    const touch = e.touches[0];
    setBubblePos({
      x: touch.clientX - offset.current.x,
      y: Math.max(0, touch.clientY - offset.current.y),
    });
  };

  const onTouchEnd = () => {
    dragging.current = false;
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/webp" href={withBasePath("/favicon.webp")} />
        <Meta />
        <Links />
        {/* SEO: Dynamic title and meta tags */}
        <title>
          {lang === "ko"
            ? "DeFi: DEX 거래소 아덴"
            : "ADEN - DeFi Crypto Futures Trading Platform"}
        </title>
        <meta
          name="description"
          content={
            lang === "ko"
              ? "아덴 거래소(ADEN): 탈중앙화 거래소(DEX)에서 암호화폐 선물거래를 경험하세요. 아덴, 거래소, 덱스 거래소, DeFi, 암호화폐, 선물거래"
              : "Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX). Aden, Exchange, DEX Exchange, DeFi, Crypto, Futures Trading"
          }
        />
        <meta
          name="keywords"
          content={
            lang === "ko"
              ? "아덴 거래소, 아덴, 탈중앙화 거래소, 거래소, 덱스 거래소, DEX, DeFi, 암호화폐, 선물거래"
              : "Aden Exchange, Aden, Decentralized Exchange, Exchange, DEX Exchange, DEX, DeFi, Crypto, Futures Trading"
          }
        />
        <meta property="og:title" content={lang === "ko" ? "DeFi: DEX 거래소 아덴" : "ADEN - DeFi Crypto Futures Trading Platform"} />
        <meta property="og:description" content={
          lang === "ko"
            ? "아덴 거래소(ADEN): 탈중앙화 거래소(DEX)에서 암호화폐 선물거래를 경험하세요."
            : "Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX)."
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aden.io/" />
        <meta property="og:image" content={withBasePath("/logo.webp")} />
      </head>
      <body>
        <OrderlyProvider>
          {/* Draggable Floating Language Switch Bubble */}
          <div
            id="changeLocaleButtonDiv"
            style={{
              position: "fixed",
              top: bubblePos.y,
              left: bubblePos.x,
              transform: "translate(-50%, 0)",
              zIndex: 1000,
              background: "rgb(253 180 29)",
              borderRadius: "999px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: "8px 20px",
              cursor: "grab",
              fontWeight: 500,
              fontSize: "15px",
              transition: "background 0.2s",
              border: "1px solid rgb(213, 191, 65)",
              minWidth: "80px",
              textAlign: "center",
              userSelect: "none",
              color: "black"
            }}
            onClick={toggleLang}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            title="Switch Language"
          >
            {lang === "en" ? "한국어" : "English"}
          </div>
          {children}
        </OrderlyProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}