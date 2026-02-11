import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#e8f4e8] text-slate-900`}
      >
        <Header />
        <main className="min-h-[calc(100svh-64px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
