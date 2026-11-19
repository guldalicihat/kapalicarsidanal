import { Suspense } from "react";
import Cart from "@/components/Cart";

export default function Sepet() {
  return <div className="shell"><h1 className="page-title">Sepetim</h1><Suspense><Cart /></Suspense></div>;
}
