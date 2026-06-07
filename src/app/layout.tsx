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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* ===== CRITICAL CSS - prevents FOUC ===== */
              html, body {
                background: #0a0a0f !important;
                color: #f0e6d3 !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden;
                min-height: 100vh;
                min-height: 100dvh;
              }

              /* CSS-only preloader splash - shows BEFORE JavaScript loads */
              #__preloader {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: #0a0a0f;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2rem;
                transition: opacity 0.3s ease;
              }
              #__preloader .__pre-heart {
                width: 100px;
                height: 100px;
                animation: __preHeartbeat 1.4s ease-in-out infinite;
                filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.5));
              }
              #__preloader .__pre-heart svg {
                width: 100%; height: 100%;
              }
              #__preloader .__pre-text {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 1rem;
                color: rgba(212, 175, 55, 0.7);
                font-weight: 300;
                letter-spacing: 0.15em;
                animation: __preBlink 2.5s ease-in-out infinite;
              }

              @keyframes __preHeartbeat {
                0%, 100% { transform: scale(1); }
                14% { transform: scale(1.18); }
                28% { transform: scale(1); }
                42% { transform: scale(1.12); }
                56% { transform: scale(1); }
              }
              @keyframes __preBlink {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 1; }
              }

              /* Hide landing page until hydrated - prevents FOUC */
              /* Only hidden-page needs !important since it must stay hidden until React takes over */
              .hidden-page {
                opacity: 0 !important;
                visibility: hidden !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                pointer-events: none !important;
              }
              /* scroll-reveal uses NO !important so styled-jsx can override with .revealed */
              .scroll-reveal {
                opacity: 0;
              }
              .scroll-reveal.revealed {
                opacity: 1;
              }
              .scroll-reveal-inner {
                opacity: 0;
                max-height: 0;
                overflow: hidden;
              }
              .scroll-reveal-inner.revealed {
                opacity: 1;
                max-height: 600px;
                overflow: visible;
              }
            `,
          }}
        />
      </head>
      <body style={{ backgroundColor: '#0a0a0f', color: '#f0e6d3', margin: 0, overflow: 'hidden' }}>
        {/* CSS-only preloader - visible IMMEDIATELY, no JS needed */}
        <div id="__preloader">
          <div className="__pre-heart">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#d4af37"
                stroke="#d4af37"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <p className="__pre-text">Toca para abrir</p>
        </div>

        {children}
      </body>
    </html>
  );
}
