"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, MapPin, Package, Phone, X } from "lucide-react";
import { SHOPS, type Product } from "@/src/lib/shop-data";

/* ============================================================
   EMPTY STATE
   ============================================================ */

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
      {label}
    </div>
  );
}

/* ============================================================
   PRODUCT CARD
   ============================================================ */

export function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product;
  index: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: reduce ? 0 : 0.25,
        delay: reduce ? 0 : Math.min(index, 12) * 0.03,
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-left transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Package className="h-8 w-8 text-gray-300" />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-700 backdrop-blur">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h4 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.name}
        </h4>
        {(product.brand || product.model) && (
          <p className="truncate text-xs text-gray-500">
            {[product.brand, product.model].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-violet-600">
            ETB {product.price.toLocaleString()}
          </span>
        </div>
        {(product.size || product.color) && (
          <div className="mt-1 flex flex-wrap gap-1">
            {product.size && (
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500">
                Size {product.size}
              </span>
            )}
            {product.color && (
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500">
                {product.color}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
}

/* ============================================================
   ROW
   ============================================================ */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 items-center">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

/* ============================================================
   PRODUCT MODAL
   ============================================================ */

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ y: reduce ? 0 : 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-gray-100 bg-white sm:rounded-3xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-600 ring-1 ring-gray-100 backdrop-blur transition hover:bg-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-video w-full bg-gray-50">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <Package className="h-12 w-12 text-gray-300" />
                </div>
              )}
            </div>

            <div className="space-y-4 p-6">
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                  {product.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h2>
                {(product.brand || product.model) && (
                  <p className="text-sm text-gray-500">
                    {[product.brand, product.model].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-violet-600">
                  ETB {product.price.toLocaleString()}
                </span>
              </div>

              {(() => {
                type Field = { key: string; label: string; value?: string | number };

                const rows: Field[] = [
                  { key: "type", label: "Type", value: product.type },
                  { key: "barcode", label: "Barcode", value: product.barcode },
                  { key: "size", label: "Size", value: product.size },
                  { key: "color", label: "Color", value: product.color },
                  { key: "notifyEndDate", label: "Notify end date", value: product.notifyEndDate },
                  { key: "unit", label: "Unit", value: product.unit },
                  { key: "expireDate", label: "Expiry date", value: product.expireDate },
                  { key: "manufacturer", label: "Manufacturer", value: product.manufacturer },
                  { key: "model", label: "Model / Variant", value: product.model },
                  { key: "specifications", label: "Specifications", value: product.specifications },
                  { key: "warranty", label: "Warranty", value: product.warranty },
                  { key: "material", label: "Material", value: product.material },
                  { key: "dimensions", label: "Dimensions", value: product.dimensions },
                  { key: "brand", label: "Brand", value: product.brand },
                  { key: "weight", label: "Weight", value: product.weight },
                  { key: "roomType", label: "Room type", value: product.roomType },
                  { key: "unitType", label: "Unit type", value: product.unitType },
                  { key: "materialType", label: "Material type", value: product.materialType },
                  { key: "vehicleCompatibility", label: "Vehicle compatibility", value: product.vehicleCompatibility },
                  { key: "condition", label: "Condition", value: product.condition },
                ];

                const visible = rows.filter((r) => r.value !== undefined && r.value !== null && r.value !== "");
                if (visible.length === 0) return null;
                return (
                  <div className="space-y-2 rounded-2xl border border-gray-100 p-4 text-sm">
                    {visible.map((f) => (
                      <Row key={f.key} label={f.label} value={String(f.value)} />
                    ))}
                  </div>
                );
              })()}

              {(() => {
                const shop = SHOPS.find((s) => s.id === product.shopId);
                if (!shop) return null;
                return (
                  <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-indigo-50/60 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">
                      Contact shop
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {shop.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{shop.location}</span>
                    </div>
                    <a
                      href={`tel:${shop.phone.replace(/\s+/g, "")}`}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-violet-700 hover:to-indigo-700"
                    >
                      <Phone className="h-4 w-4" /> {shop.phone}
                    </a>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   PAGINATION
   ============================================================ */

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const items: (number | "...")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      items.push(p);
    } else if (items[items.length - 1] !== "...") {
      items.push("...");
    }
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {items.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-1.5 text-sm text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
              p === page
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30"
                : "border border-gray-200 bg-white text-gray-600 hover:border-violet-300 hover:text-violet-700"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}