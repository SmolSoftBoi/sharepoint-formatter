import "./styles/globals.css";

export const metadata = {
  title: "SharePoint Formatter",
  description: "Create, validate, preview, and export SharePoint list formatting JSON.",
};

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
