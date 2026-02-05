"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  FluentProvider,
  makeStyles,
  Subtitle1,
  Title1,
  tokens,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  shell: {
    minHeight: "100vh",
    maxHeight: "100vh",
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
    lineHeight: tokens.lineHeightBase300,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    padding: [tokens.spacingVerticalM, tokens.spacingHorizontalL]
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  main: {
    flex: 1,
    minHeight: "100%",
    maxHeight: "100%"
  },
});

type ColorScheme = "light" | "dark";

interface AppShellProps {
  children: ReactNode;
}

const getPreferredScheme = (): ColorScheme => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const AppShell = ({ children }: AppShellProps) => {
  const styles = useStyles();
  const [scheme, setScheme] = useState<ColorScheme>(getPreferredScheme);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setScheme(media.matches ? "dark" : "light");
    };

    handleChange();

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme = scheme;
  }, [scheme]);

  return (
    <FluentProvider
      theme={scheme === "dark" ? webDarkTheme : webLightTheme}
      className={styles.shell}
      suppressHydrationWarning
    >
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Title1>SharePoint Formatter</Title1>
          <Subtitle1>
            Create, validate, preview, and export SharePoint list formatting JSON.
          </Subtitle1>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </FluentProvider>
  );
};
