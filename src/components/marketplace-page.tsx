"use client";

import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  Search,
  Store,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import {
  ALL_CATEGORIES,
  PRODUCTS,
  SHOPS,
  shopItemCount,
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

type Tab = "shops" | "items";
type CategoryFilter = "All" | Category;

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Verified shops" },
  { icon: TrendingUp, label: "Live inventory" },
  { icon: Sparkles, label: "Curated products" },
];

export default function MarketplacePage() {
  const [tab, setTab] = useState<Tab>("shops");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const isMobile = useIsMobile();

  const q = query.trim().toLowerCase();

  const [showTypesMenu, setShowTypesMenu] = useState(false);

  // ── refs for scroll-to-active behaviour ──
  const catScrollRef = useRef<HTMLDivElement>(null);
  const catPillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const drawerListRef = useRef<HTMLDivElement>(null);
  const drawerItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // centres the chosen pill in the horizontal scroll row
  const scrollPillIntoView = useCallback((cat: string) => {
    const container = catScrollRef.current;
    const pill = catPillRefs.current[cat];
    if (!container || !pill) return;
    const offset =
      pill.offsetLeft - container.clientWidth / 2 + pill.offsetWidth / 2;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  // when the drawer opens, scroll the active row into view after the animation starts
  useEffect(() => {
    if (!showTypesMenu) return;
    const id = setTimeout(() => {
      const el = drawerItemRefs.current[category];
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 80);
    return () => clearTimeout(id);
  }, [showTypesMenu, category]);

  // keep the pill row centred whenever category changes from anywhere
  useEffect(() => {
    scrollPillIntoView(category);
  }, [category, scrollPillIntoView]);

  const startsWithMatch = (text: string) => {
    if (!q) return true;
    const t = text.toLowerCase();
    if (t.startsWith(q)) return true;
    return t.split(/[\s,/.\-]+/).some((w) => w.startsWith(q));
  };

  const shops = useMemo(() => {
    return SHOPS.filter((s) => {
      const matchQ =
        !q ||
        startsWithMatch(s.name) ||
        startsWithMatch(s.location) ||
        s.categories.some((c) => startsWithMatch(c));
      const matchC = category === "All" || s.categories[0] === category;
      return matchQ && matchC;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category]);

  const [typeFilter, setTypeFilter] = useState<string>("All");

  useEffect(() => {
    setTypeFilter("All");
  }, [category, tab]);

  const availableTypes = useMemo(() => {
    if (category === "All") return [];
    const set = new Set<string>();
    PRODUCTS.forEach((p) => {
      if (p.category === category && p.type) set.add(p.type);
    });
    return Array.from(set).sort();
  }, [category]);

  const items = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchQ =
        !q ||
        startsWithMatch(p.name) ||
        startsWithMatch(p.category) ||
        startsWithMatch(p.brand ?? "") ||
        startsWithMatch(p.type ?? "");
      const matchC = category === "All" || p.category === category;
      const matchT = typeFilter === "All" || p.type === typeFilter;
      return matchQ && matchC && matchT;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, typeFilter]);

  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const categories: CategoryFilter[] = ["All", ...ALL_CATEGORIES];

  const shopsPerPage = isMobile ? 10 : 15;
  const itemsPerPage = isMobile ? 10 : 20;

  const [shopPage, setShopPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);

  useEffect(() => { setShopPage(1); }, [q, category, shopsPerPage]);
  useEffect(() => { setItemPage(1); }, [q, category, typeFilter, itemsPerPage]);

  const totalShopPages = Math.max(1, Math.ceil(shops.length / shopsPerPage));
  const pagedShops = shops.slice((shopPage - 1) * shopsPerPage, shopPage * shopsPerPage);

  const totalItemPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const pagedItems = items.slice((itemPage - 1) * itemsPerPage, itemPage * itemsPerPage);

  return (
    <div className="pb-20 bg-gray-50/40">

      {/* ── COMPACT HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-700">
        {/* Subtle grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h32v1H0zm0 16h32v1H0zM0 0v32h1V0zm16 0v32h1V0z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          {/* Top row: brand + CTAs */}
          <div className="flex items-center justify-between gap-4">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-white/30 backdrop-blur">
                <img src="/logo.png" alt="Medebir" className="h-7 w-7 object-contain" />
              </div>
              <div className="hidden sm:block">
                <p className="text-lg font-bold text-white leading-none">Medebir</p>
                <p className="text-[13px] text-violet-200 font-medium mt-0.5">Marketplace</p>
              </div>
            </motion.div>

            {/* Headline (center, hidden on very small) */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="hidden md:flex flex-col items-center gap-1"
            >
              <h1 className="text-lg font-black tracking-tight text-white leading-none">
                Shop local.{" "}
                <span className="text-violet-200">Discover everything.</span>
              </h1>
              <div className="flex items-center gap-3">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1 text-[11px] text-violet-200 font-medium">
                    <Icon className="h-3 w-3 text-violet-300" />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="flex items-center gap-2 shrink-0"
            >
              <a
                href="https://medebir.business"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Store className="h-3.5 w-3.5 hidden sm:block" />
                {isMobile ? "Manage my Shop" : "Manage my Shop"}
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </a>

              <a
                href="https://agent.medebir.business"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-lg shadow-black/20 transition hover:bg-violet-50"
              >
                {isMobile ? "Be an Agent" : "Become an Agent"}
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>

          {/* Mobile headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-3 text-sm font-bold text-white md:hidden"
          >
            Shop local. <span className="text-violet-200">Discover everything.</span>
          </motion.p>

          {/* Search + stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 flex items-center gap-3"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shops, products, categories…"
                className="w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-9 text-sm shadow-lg shadow-black/20 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Stat pills (desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              {[
                { value: SHOPS.length, label: "Shops" },
                { value: PRODUCTS.length, label: "Products" },
                { value: ALL_CATEGORIES.length, label: "Type Shops" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur"
                >
                  <span className="text-sm font-black text-white">{value}</span>
                  <span className="text-[11px] text-violet-200 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky category bar ── */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">

          {/* Scrollable pill row */}
          <div
            ref={catScrollRef}
            className="flex flex-1 gap-2 overflow-x-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  ref={(el) => { catPillRefs.current[c] = el; }}
                  onClick={() => setCategory(c)}
                  className={`relative shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? ""
                      : "border border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="cat-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative ${active ? "text-white" : ""}`}>{c}</span>
                </button>
              );
            })}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setShowTypesMenu((s) => !s)}
            className="sm:hidden flex-shrink-0 grid h-9 w-9 place-items-center rounded-full border-2 border-gray-400 bg-white shadow-lg"
            aria-label="Open categories"
          >
            {showTypesMenu
              ? <X className="h-5 w-5 text-black" />
              : <Menu className="h-5 w-5 text-black" />
            }
          </button>
        </div>

        {/* ── Mobile category drawer (dropdown) ── */}
        <AnimatePresence>
          {showTypesMenu && (
            <>
              {/* Backdrop — closes menu on tap outside */}
              <motion.div
                className="fixed inset-0 z-30 sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTypesMenu(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className="absolute right-3 top-full z-40 mt-1 w-[90vw] max-w-xs rounded-xl border border-gray-100 bg-white shadow-xl sm:hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <h4 className="text-sm font-semibold text-gray-900">Shop Types</h4>
                  <button
                    onClick={() => setShowTypesMenu(false)}
                    className="grid h-7 w-7 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Scrollable list */}
                <div
                  ref={drawerListRef}
                  className="max-h-[60vh] overflow-y-auto overscroll-contain py-2"
                >
                  {categories.map((c) => {
                    const active = category === c;
                    return (
                      <button
                        key={`menu-${c}`}
                        ref={(el) => { drawerItemRefs.current[c] = el; }}
                        onClick={() => {
                          setCategory(c);
                          setShowTypesMenu(false);
                          scrollPillIntoView(c);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 ${
                          active ? "text-violet-700" : "text-gray-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 flex-shrink-0 rounded-full transition ${
                            active ? "bg-violet-600" : "bg-gray-300"
                          }`}
                        />
                        <span className="flex-1 text-left">{c}</span>
                        {active && (
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

        {/* ── Type sub-filter row ── */}
        {tab === "items" && availableTypes.length > 0 && (
          <div className="border-t border-gray-100 bg-white/70">
            <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(["All", ...availableTypes] as string[]).map((t) => {
                const active = typeFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                      active
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

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Tabs + result hint */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
            {(["shops", "items"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative rounded-xl px-5 py-2 text-sm font-semibold capitalize transition"
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-500/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative ${tab === t ? "text-white" : "text-gray-600"}`}>
                  {t}{" "}
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    tab === t ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {t === "shops" ? shops.length : items.length}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {q && (
            <p className="text-sm text-gray-500">
              Results for{" "}
              <span className="font-semibold text-gray-800">"{query}"</span>
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {tab === "shops" ? (
            <motion.div
              key="shops"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pagedShops.map((shop, i) => (
                  <ShopCard key={shop.id} shop={shop} index={i} />
                ))}
                {shops.length === 0 && <EmptyState label="No shops match your search." />}
              </div>
              <Pagination page={shopPage} totalPages={totalShopPages} onChange={setShopPage} />
            </motion.div>
          ) : (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {pagedItems.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    onOpen={() => setOpenProduct(p)}
                  />
                ))}
                {items.length === 0 && <EmptyState label="No items match your search." />}
              </div>
              <Pagination page={itemPage} totalPages={totalItemPages} onChange={setItemPage} />
            </motion.div>
          )}
        </AnimatePresence>

        <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
      </div>
    </div>
  );
}

/* ============================================================
   SHOP CARD
   ============================================================ */

function ShopCard({ shop, index }: { shop: Shop; index: number }) {
  const reduce = useReducedMotion();
  const count = shopItemCount(shop.id);
  const shown = shop.categories.slice(0, 3);
  const extra = shop.categories.length - shown.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : index * 0.05 }}
      whileHover={reduce ? undefined : { y: -5 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.2)] hover:border-violet-100"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100">
        {shop.cover ? (
          <img
            src={shop.cover}
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Store className="h-10 w-10 text-violet-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-gray-700 backdrop-blur shadow-sm">
          {count} items
        </span>
        <div className="absolute -bottom-5 left-4 h-11 w-11 overflow-hidden rounded-xl ring-2 ring-white shadow-md">
          {shop.logo ? (
            <img src={shop.logo} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-violet-100 to-indigo-100">
              <Store className="h-5 w-5 text-violet-500" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-8">
        <h3 className="text-base font-bold leading-tight text-gray-900 group-hover:text-violet-700 transition-colors">
          {shop.name}
        </h3>
        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-violet-400 shrink-0" />
            <span className="truncate">{shop.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-violet-400 shrink-0" />
            <span className="truncate">{shop.phone}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {shown.map((c) => (
            <span key={c} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 border border-violet-100">
              {c}
            </span>
          ))}
          {extra > 0 && (
            <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500 border border-gray-100">
              +{extra} more
            </span>
          )}
        </div>
        <Link
          href={`/shop/${shop.id}`}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-violet-700 hover:to-indigo-700 hover:shadow-md hover:shadow-violet-500/30"
        >
          View Shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
