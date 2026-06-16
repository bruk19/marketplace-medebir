"use client";

import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, MapPin, Menu, Phone, Store, X } from "lucide-react";
import {
  productsForShop,
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
    const set = new Set<string>();
    items.forEach((i) => { if (i.type) set.add(i.type); });
    return ["All", ...Array.from(set).sort()] as string[];
  }, [items]);

  const singleCategory = cats.length === 2;

  const [active, setActive] = useState<string>("All");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [showCatMenu, setShowCatMenu] = useState(false);

  const catScrollRef = useRef<HTMLDivElement>(null);
  const catPillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const drawerListRef = useRef<HTMLDivElement>(null);
  const drawerItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const scrollPillIntoView = useCallback((cat: string) => {
    const container = catScrollRef.current;
    const pill = catPillRefs.current[cat];
    if (!container || !pill) return;
    const offset =
      pill.offsetLeft - container.clientWidth / 2 + pill.offsetWidth / 2;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!showCatMenu) return;
    const id = setTimeout(() => {
      drawerItemRefs.current[active]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 80);
    return () => clearTimeout(id);
  }, [showCatMenu, active]);

  useEffect(() => {
    scrollPillIntoView(active);
  }, [active, scrollPillIntoView]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      return active === "All" || p.type === active;
    });
  }, [items, active]);

  const perPage = isMobile ? 10 : 20;
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [active, perPage]);

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
                <span key={c} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
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

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-gray-100 bg-white/90 backdrop-blur-md sm:-mx-6 lg:-mx-8">
        <div className="relative flex items-center gap-2 py-3 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">

          {/* Scrollable pill strip */}
          {!singleCategory && (
            <div
              ref={catScrollRef}
              className="flex flex-1 gap-2 overflow-x-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {cats.map((c) => {
                const isActive = active === c;
                return (
                  <button
                    key={c}
                    ref={(el) => { catPillRefs.current[c] = el; }}
                    onClick={() => setActive(c)}
                    className={`relative shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? ""
                        : "border border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:text-violet-700"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="shop-cat-indicator"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className={`relative ${isActive ? "text-white" : ""}`}>{c}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Spacer when pills hidden */}
          {singleCategory && <div className="flex-1" />}

          {/* Hamburger — mobile only, always rendered */}
          <button
            onClick={() => setShowCatMenu((s) => !s)}
            className="sm:hidden flex-shrink-0 grid h-9 w-9 place-items-center rounded-full border-2 border-gray-400 bg-white shadow-lg"
            aria-label="Browse categories"
          >
            {showCatMenu
              ? <X className="h-5 w-5 text-black" />
              : <Menu className="h-5 w-5 text-black" />
            }
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {showCatMenu && (
              <>
                <motion.div
                  className="fixed inset-0 z-30 sm:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCatMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="absolute right-3 top-full z-40 mt-1 w-[90vw] max-w-xs rounded-xl border border-gray-100 bg-white shadow-xl sm:hidden"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <h4 className="text-sm font-semibold text-gray-900">Filter by type</h4>
                    <button
                      onClick={() => setShowCatMenu(false)}
                      className="grid h-7 w-7 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                      aria-label="Close"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div
                    ref={drawerListRef}
                    className="max-h-[60vh] overflow-y-auto overscroll-contain py-2"
                  >
                    {cats.map((c) => {
                      const isActive = active === c;
                      return (
                        <button
                          key={`menu-${c}`}
                          ref={(el) => { drawerItemRefs.current[c] = el; }}
                          onClick={() => {
                            setActive(c);
                            setShowCatMenu(false);
                            scrollPillIntoView(c);
                          }}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 ${
                            isActive ? "text-violet-700" : "text-gray-700"
                          }`}
                        >
                          <span className={`h-2 w-2 flex-shrink-0 rounded-full transition ${
                            isActive ? "bg-violet-600" : "bg-gray-300"
                          }`} />
                          <span className="flex-1 text-left">{c}</span>
                          {isActive && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600">
                              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M2 6l3 3 5-5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${active}-${page}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {paged.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={() => setOpenProduct(p)} />
          ))}
          {filtered.length === 0 && <EmptyState label="No items in this category." />}
        </motion.div>
      </AnimatePresence>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
    </div>
  );
}
