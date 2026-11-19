import { BottomBar, PreviewStrip, TopBar } from "@/components/Chrome";
import { CatalogProvider } from "@/components/CatalogProvider";
import { getCatalog } from "@/lib/db";
import Feedback from "@/components/Feedback";

export default async function MagazaLayout({ children }: { children: React.ReactNode }) {
  const { products } = await getCatalog();
  return (
    <CatalogProvider products={products}>
      <PreviewStrip />
      <TopBar />
      <main>{children}</main>
      <Feedback />
      <BottomBar />
    </CatalogProvider>
  );
}
