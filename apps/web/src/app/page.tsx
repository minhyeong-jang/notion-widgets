import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function RootPage() {
  return (
    <html lang="ko">
      <head>
        <meta httpEquiv="refresh" content="0;url=/ko/" />
        <link rel="canonical" href="/ko/" />
      </head>
      <body>
        <p>Redirecting...</p>
      </body>
    </html>
  );
}
