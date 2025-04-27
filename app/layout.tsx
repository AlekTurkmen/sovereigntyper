import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const boldonse = localFont({
  src: '../public/fonts/Boldonse/Boldonse-Regular.ttf',
  variable: '--font-boldonse',
});

const lexend = localFont({
  src: '../public/fonts/Lexend/Lexend-VariableFont_wght.ttf',
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: "SovereignTyper",
  description: "Improve your typing skills with sovereignty. A minimal typing practice application focused on speed and accuracy.",
  keywords: ["typing", "typing practice", "typing game", "typing speed", "typing accuracy", "speed typing"],
  authors: [{ name: "Alek Turkmen" }],
  metadataBase: new URL('https://sovereigntyper.vercel.app'),
  openGraph: {
    title: "SovereignTyper",
    description: "Improve your typing skills with sovereignty",
    type: "website",
    siteName: "SovereignTyper",
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${boldonse.variable} ${lexend.variable} font-lexend antialiased`}>
        {children}
      </body>
    </html>
  );
}
