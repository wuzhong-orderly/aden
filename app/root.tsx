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

export function Layout({ children }: { children: React.ReactNode }) {

  const [lang, setLang] = useState(i18n.language === "ko" ? "ko" : "en");
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setBubblePos({
      x: window.innerWidth - 60,
      y: window.innerHeight - 60,
    });
    setLang("en");
    i18n.changeLanguage("en");
  }, []);

  const toggleLang = () => {
    const nextLang = lang === "en" ? "ko" : "en";
    i18n.changeLanguage(nextLang);
    setLang(nextLang);
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

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/webp" href={withBasePath("/favicon.webp")} />
        <Meta />
        <Links />
      </head>
      <body>
        <OrderlyProvider>
          {/* Hide default language switcher icon */}
          <style>
            {`#language-switcher-icon { display: none !important; }`}
          </style>
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
              userSelect: "none"
            }}
            onClick={toggleLang}
            onMouseDown={onMouseDown}
            title="Switch Language"
          >
            {lang === "en" ? "English" : "한국어"}
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