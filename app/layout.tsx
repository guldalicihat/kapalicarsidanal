import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomBar, PreviewStrip, TopBar } from "@/components/Chrome";
import { CatalogProvider } from "@/components/CatalogProvider";
import { getCatalog } from "@/lib/db";

export const metadata: Metadata = {
  title: "Kapalıçarşıdan Al — Tasarım önizlemesi",
  description: "Kapalıçarşı'dan altın ve pırlanta takı. Ürünü anlatırım, pazarlığı sana bırakırım.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0a3a2c", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { products } = await getCatalog();
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
        />
      </head>
      <body>
        <PreviewStrip />
        <TopBar />
        <CatalogProvider products={products}><main>{children}</main></CatalogProvider>
        <BottomBar />
      </body>
    </html>
  );
}
