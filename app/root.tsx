import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";
import { useState } from "react";
import "./styles/index.css";
import { withBasePath } from "./utils/base-path";
import { i18n } from "@orderly.network/i18n";

export function Layout({ children }: { children: React.ReactNode }) {

  const [lang, setLang] = useState(i18n.language === "ko" ? "ko" : "en");
  const toggleLang = () => {
    const nextLang = lang === "en" ? "ko" : "en";
    i18n.changeLanguage(nextLang);
    setLang(nextLang);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/webp" href={withBasePath("/favicon.webp")} />
        <Meta />
        <Links />
      </head>
      <body>
        <OrderlyProvider>
          {/* Floating Language Switch Bubble */}
          <div
            id="changeLocaleButtonDiv"
            style={{
              position: "fixed",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              background: "rgba(255, 255, 200, 0.85)",
              borderRadius: "999px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "15px",
              transition: "background 0.2s",
              border: "1px solid #f5e9a5",
              minWidth: "80px",
              textAlign: "center",
              userSelect: "none"
            }}
            onClick={toggleLang}
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
