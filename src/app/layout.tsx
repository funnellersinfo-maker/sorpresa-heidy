import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feliz Cumpleaños Heidy 🎂",
  description: "Un regalo digital hecho con amor para ti en tu cumpleaños 28. Tejiendo un amanecer juntos.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💛</text></svg>",
  },
  openGraph: {
    title: "Feliz Cumpleaños Heidy 🎂",
    description: "Un regalo digital hecho con amor para ti en tu cumpleaños 28",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning style={{ backgroundColor: '#0a0a0f' }}>
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="color-scheme" content="dark" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background: #0a0a0f !important;
                color: #f0e6d3 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            `,
          }}
        />
      </head>
      <body style={{ backgroundColor: '#0a0a0f', color: '#f0e6d3', margin: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
