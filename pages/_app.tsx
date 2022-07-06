import "../styles/global.scss";
import "nprogress/nprogress.css";

import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { NextIntlProvider } from "next-intl";
import nprogress from "nprogress";
import React, { useEffect } from "react";

import Layout from "../components/Layout";
import lang from "../locale";

Router.events.on("routeChangeStart", () => nprogress.start());
Router.events.on("routeChangeComplete", () => nprogress.done());
Router.events.on("routeChangeError", () => nprogress.done());

export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
});

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  }

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html")?.classList.add("dark");
    } else {
      document.querySelector("html")?.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const themeLocalStorage = localStorage.getItem("theme");
    if (["light", "dark"].includes(themeLocalStorage!)) {
      setTheme(themeLocalStorage as "light" | "dark");
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <link rel="shortcut icon" href="/assets/favicon.png" />
        <title>Porn Vault</title>
      </Head>
      <NextIntlProvider messages={lang[router.locale || "en"]}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeContext.Provider>
      </NextIntlProvider>
    </>
  );
}
