import { notFound } from "next/navigation";
import { SHOPS } from "@/src/lib/shop-data";
import ShopDetail from "@/src/components/shop-detail";

export function generateStaticParams() {
  return SHOPS.map((s) => ({ shopId: s.id }));
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  const shop = SHOPS.find((s) => s.id === shopId);

  if (!shop) notFound();

  return <ShopDetail shop={shop} />;
}
