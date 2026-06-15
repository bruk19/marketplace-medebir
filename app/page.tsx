import MarketplacePage from "@/src/components/marketplace-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medebir Marketplace — Shop local. Discover everything.",
  description:
    "Browse trusted local shops and find products from electronics to fashion — all in one place.",
};

export default function Page() {
  return <MarketplacePage />;
}
