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
  description: "Type with sovereignty",
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
