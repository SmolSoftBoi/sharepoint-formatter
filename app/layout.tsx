import type { ReactNode } from "react";
import "./styles/globals.css";
import "./styles/accessibility.css";
import { AppShell } from "./components/AppShell";

export const metadata = {
  title: "SharePoint Formatter",
  description: "Create, validate, preview, and export SharePoint list formatting JSON.",
};

/**
 * Root layout component that renders the application's HTML shell with a header and main content area.
 *
 * @param children - Content to render inside the layout's main area.
 * @returns The top-level JSX element containing `html`/`body`, a header with the app title, and a `main` element that wraps `children`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
