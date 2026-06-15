"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, MapPin, Phone, Store } from "lucide-react";
import {
  productsForShop,
  type Category,
  type Product,
  type Shop,
} from "@/src/lib/shop-data";
import { useIsMobile } from "@/src/hooks/use-mobile";
import {
  EmptyState,
  Pagination,
  ProductCard,
  ProductModal,
} from "@/src/components/marketplace-shared";

export default function ShopDetail({ shop }: { shop: Shop }) {
  const items = useMemo(() => productsForShop(shop.id), [shop.id]);
  const isMobile = useIsMobile();

  const cats = useMemo(() => {
    const set = new Set<Category>();
    items.forEach((i) => set.add(i.category));
    return ["All", ...Array.from(set)] as string[];
  }, [items]);

  const singleCategory = cats.length === 2; // ["All", "X"] means only one real category

  const [active, setActive] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);

  useEffect(() => {
    setTypeFilter("All");
  }, [active]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => {
      if ((active === "All" || p.category === active) && p.type)
        set.add(p.type);
    });
    return Array.from(set).sort();
  }, [active, items]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchC = active === "All" || p.category === active;
      const matchT = typeFilter === "All" || p.type === typeFilter;
      return matchC && matchT;
    });
  }, [items, active, typeFilter]);

  /* ---- pagination: 20/page desktop, 10/page mobile ---- */
  const perPage = isMobile ? 10 : 20;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [active, typeFilter, perPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-violet-200 hover:text-violet-700"
      >
        <ChevronLeft className="h-4 w-4" /> All Shops
      </Link>

      {/* Shop header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-violet-100">
            {shop.logo ? (
              <img src={shop.logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-violet-100">
                <Store className="h-7 w-7 text-violet-500" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{shop.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {shop.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {shop.phone}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {shop.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="self-start rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:self-auto">
          {items.length} items
        </span>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-gray-100 bg-white/90 backdrop-blur-md sm:-mx-6 lg:-mx-8">
        {!singleCategory && (
          <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cats.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? ""
                      : "border border-gray-100 bg-white text-gray-600 hover:text-violet-700"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="shop-cat-indicator"
                      className="absolute inset-0 rounded-full bg-violet-600"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative ${isActive ? "text-white" : ""}`}>
                    {c}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {availableTypes.length > 0 && (
          <div className={`bg-white/70 ${!singleCategory ? "border-t border-gray-100" : ""}`}>
            <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(["All", ...availableTypes] as string[]).map((t) => {
                const isActive = typeFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                      isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${active}-${typeFilter}-${page}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {paged.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onOpen={() => setOpenProduct(p)}
            />
          ))}
          {filtered.length === 0 && (
            <EmptyState label="No items in this category." />
          )}
        </motion.div>
      </AnimatePresence>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ProductModal
        product={openProduct}
        onClose={() => setOpenProduct(null)}
      />
    </div>
  );
}
