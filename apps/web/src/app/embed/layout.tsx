import "../globals.css";

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh">{children}</div>
      </body>
    </html>
  );
}
