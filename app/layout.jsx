import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "VerifHalal — Cek dulu, baru yakin belanja",
  description:
    "Verifikasi kehalalan produk dan kejelasan skema pembayaran, real-time dari data publik BPJPH.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
