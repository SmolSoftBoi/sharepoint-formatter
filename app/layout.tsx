import "./styles/globals.css";
import "./styles/accessibility.css";

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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <h1>SharePoint Formatter</h1>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}