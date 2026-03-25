import { Montserrat, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
  weight: ["600", "700"],
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s — MG Group",
    default: "MG Group — Недвижимость в Испании",
  },
  description:
    "MG Group (Marescol S.L): продажа, аренда и строительство недвижимости в Испании. Каталог объектов с фильтрами и удобной навигацией.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/ico.ico",
    shortcut: "/ico.ico",
    apple: "/ico.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${montserrat.variable} ${displaySerif.variable} ${geistMono.variable} antialiased bg-mg-mint text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
