"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPinIcon, StarIcon, ShareIcon } from "@/components/VectorImages";
import { useGetWishlistQuery } from "@/store/api/assetApi";
import { useWishlist } from "@/providers/WishlistProvider";
import WishlistHeartButton from "@/components/dashboard/investor/WishlistHeartButton";
import { useCurrency } from "@/providers/CurrencyProvider";
import { API_URL } from "@/constants";
import { type SaleType } from "@/utils/assetUtils";

const CATEGORIES = ["All", "Commercial", "Residential", "Industrial", "Warehousing", "Land"];

const CATEGORY_MAP: Record<string, string | undefined> = {
  All: undefined,
  Commercial: "COMMERCIAL",
  Residential: "RESIDENTIAL",
  Industrial: "INDUSTRIAL",
  Warehousing: "WAREHOUSING",
  Land: "LAND",
};

const SALE_TYPES: { label: string; value?: SaleType }[] = [
  { label: "All Properties", value: undefined },
  { label: "Fractional", value: "FRACTIONAL" },
  { label: "Whole", value: "WHOLE" },
  { label: "GloFi Premium", value: "PREMIUM" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function WishlistPage() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { isLoggedInInvestor, wishlistCount } = useWishlist();

  const [activeCategory, setActiveCategory] = useState("All");
  const [saleTypeFilter, setSaleTypeFilter] = useState<SaleType | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const limit = 24;

  const { data: wishlistData, isLoading, isError, refetch } = useGetWishlistQuery(
    {
      page: 1,
      limit: 100,
    },
    {
      skip: !isLoggedInInvestor,
      refetchOnMountOrArgChange: true,
    }
  );

  const rawList: any[] = Array.isArray(wishlistData)
    ? wishlistData
    : Array.isArray(wishlistData?.data)
      ? wishlistData.data
      : [];

  const filteredList = useMemo(() => {
    return rawList.filter((property: any) => {
      if (saleTypeFilter) {
        const propSaleType = String(property.saleType || "").toUpperCase();
        if (propSaleType !== saleTypeFilter) return false;
      }
      if (activeCategory && activeCategory !== "All") {
        const propCat = String(property.category || "").toUpperCase().replace(/[\s_-]+/g, "");
        const targetCat = (CATEGORY_MAP[activeCategory] || activeCategory).toUpperCase().replace(/[\s_-]+/g, "");
        if (propCat !== targetCat) return false;
      }
      return true;
    });
  }, [rawList, saleTypeFilter, activeCategory]);

  const total = filteredList.length;
  const totalPages = Math.ceil(total / limit) || 1;

  const paginatedList = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredList.slice(start, start + limit);
  }, [filteredList, page, limit]);

  const handleCardShare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/dashboard/investor/marketplace/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--header-text)] tracking-tight">
                Saved Properties
              </h1>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30">
                  {wishlistCount} saved
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-muted)] font-medium">
              Your private bookmark list. Properties remain saved so you can review them and invest fraction by fraction whenever you are ready.
            </p>
          </div>

          <Link
            href="/dashboard/investor/marketplace"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold text-[var(--header-text)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/40 transition-all shrink-0 no-underline"
          >
            <svg className="w-3.5 h-3.5 text-[var(--sidebar-active-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Browse Marketplace</span>
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-6 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-5 shadow-sm backdrop-blur-md">
          {/* Sale Type Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-[var(--sidebar-border)]/60 mb-3">
            {SALE_TYPES.map((st) => {
              const isSelected = saleTypeFilter === st.value;
              return (
                <button
                  key={st.label}
                  onClick={() => {
                    setSaleTypeFilter(st.value);
                    setPage(1);
                  }}
                  className={`relative px-3.5 sm:px-4 py-1.5 rounded-md text-xs font-bold transition-colors duration-200 cursor-pointer border-0 bg-transparent shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? "text-[var(--sidebar-active-text)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeWishlistSaleType"
                      className="absolute inset-0 bg-[var(--sidebar-active-bg)] border border-[var(--sidebar-active-text)]/15 rounded-md z-[-1] shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {st.value === "PREMIUM" && (
                    <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  )}
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar relative z-10">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setPage(1);
                  }}
                  className={`relative px-3.5 sm:px-4 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer border-0 bg-transparent ${
                    isSelected
                      ? "text-[var(--sidebar-active-text)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeWishlistCategoryBg"
                      className="absolute inset-0 bg-[var(--sidebar-active-bg)] border border-[var(--sidebar-active-text)]/10 rounded-md z-[-1] shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

      {/* Main Asset Grid / Empty State */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-20"
          >
            <div className="w-10 h-10 border-2 border-[var(--color-primary-300)]/20 border-t-[var(--color-primary-300)] rounded-full animate-spin mb-4" />
            <p className="text-xs text-[var(--color-text-muted)] font-medium">Loading saved properties...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-12 text-[var(--color-text-muted)] border border-dashed border-[var(--sidebar-border)] rounded-2xl"
          >
            <p className="font-semibold text-sm">Failed to load saved properties.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 rounded-lg bg-[var(--sidebar-active-text)] text-black text-xs font-bold cursor-pointer hover:opacity-90"
            >
              Retry
            </button>
          </motion.div>
        ) : rawList.length === 0 ? (
          <motion.div
            key="empty-all"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center p-14 sm:p-20 border border-dashed border-[var(--sidebar-border)] rounded-2xl bg-[var(--sidebar-bg)]/40"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--header-text)] mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm mx-auto mb-6">
              You haven&apos;t saved any properties yet.
            </p>
            <Link
              href="/dashboard/investor/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--sidebar-active-text)] text-black font-extrabold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              Explore Properties
            </Link>
          </motion.div>
        ) : paginatedList.length === 0 ? (
          <motion.div
            key="empty-filtered"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center p-14 sm:p-20 border border-dashed border-[var(--sidebar-border)] rounded-2xl bg-[var(--sidebar-bg)]/40"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--sidebar-active-text)]/10 text-[var(--sidebar-active-text)] border border-[var(--sidebar-active-text)]/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--header-text)] mb-1">
              No matching properties
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm mx-auto mb-6">
              You have {rawList.length} saved {rawList.length === 1 ? "property" : "properties"}, but none match this filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSaleTypeFilter(undefined);
                setPage(1);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--sidebar-active-text)] text-black font-extrabold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`wishlist-grid-${page}-${activeCategory}-${saleTypeFilter}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 sm:gap-6"
          >
            {paginatedList.map((property) => {
              const propertyImage = property.images?.[0];
              const imageUrl = propertyImage
                ? (propertyImage.startsWith("http")
                  ? propertyImage
                  : `${API_URL}/${propertyImage.replace(/^\/+/, "")}`)
                : "/assets/images/content/img_ext_0.jpeg";

              const rawYield =
                parseFloat(String(property.expectedYield || 0)) +
                parseFloat(String(property.expectedAnnualRent || 0)) +
                parseFloat(String(property.rentalGrowthRate || 0)) +
                parseFloat(String(property.expectedAppreciationRate || 0)) -
                parseFloat(String(property.operatingCostRate || 0));
              const formattedYield = rawYield.toFixed(1);

              const totalFractions = property.totalFractions || 1;
              const available = property.availableFractions ?? totalFractions;
              const fundedPct = Math.max(0, Math.min(100, Math.round(((totalFractions - available) / totalFractions) * 100)));
              const isSoldOut = available <= 0 || fundedPct >= 100;

              const riskColor =
                property.riskRating === "LOW"
                  ? "bg-[#00DAAF] text-[#00DAAF]"
                  : property.riskRating === "HIGH"
                    ? "bg-[#FF5C5C] text-[#FF5C5C]"
                    : "bg-[#E8940C] text-[#E8940C]";

              return (
                <motion.div
                  key={property.id}
                  variants={cardVariants}
                  layout
                  onClick={() => router.push(`/dashboard/investor/marketplace/${property.id}`)}
                  className="bg-[var(--marketplace-card-bg)] border border-[var(--marketplace-card-border)] rounded-md overflow-hidden hover:border-[var(--sidebar-active-text)]/25 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={property.title || "Property"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "var(--marketplace-card-overlay)" }} />

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold capitalize bg-white text-[#111] shadow-md tracking-wide">
                        {property.category?.replace(/_/g, " ").toLowerCase()}
                      </span>
                      {property.saleType === "PREMIUM" && (
                        <span className="px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md tracking-wider flex items-center gap-1">
                          <StarIcon className="w-3 h-3 fill-black shrink-0" />
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm z-10">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${riskColor}`} />
                      {property.riskRating || "MODERATE"} RISK
                    </span>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30 pointer-events-auto">
                      <WishlistHeartButton
                        assetId={property.id}
                        assetTitle={property.title}
                        size="md"
                      />
                      <button
                        onClick={(e) => handleCardShare(e, property.id)}
                        className="edit-icon-btn p-2 rounded-full bg-black/50 text-white hover:bg-neutral-800 transition-all border border-white/10 backdrop-blur-md shadow-sm flex items-center justify-center cursor-pointer group"
                        aria-label="Share property"
                      >
                        {copiedId === property.id ? (
                          <span className="text-[10px] font-bold px-1.5 text-[#00DAAF]">Copied!</span>
                        ) : (
                          <ShareIcon className="w-4 h-4 text-white group-hover:text-[#00DAAF] transition-colors" />
                        )}
                      </button>
                    </div>

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-xl border border-red-400/40">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-[22px] font-extrabold text-[var(--header-text)] mb-1 leading-snug tracking-tight">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs sm:text-[13px] mb-4 sm:mb-5 font-medium">
                      <MapPinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-text-muted)] shrink-0" />
                      <span className="truncate">
                        {property.city && property.state
                          ? `${property.city}, ${property.state}`
                          : property.location}
                      </span>
                    </div>

                    <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md p-3.5 sm:p-4 mb-4 sm:mb-5 shadow-sm">
                      <div className="grid grid-cols-3 divide-x divide-[var(--sidebar-border)]/65 text-center items-center">
                        <div className="min-w-0 px-2 flex flex-col justify-center">
                          <p className="text-[10px] sm:text-[11px] font-bold text-[var(--color-text-muted)] mb-1 truncate" title="Valuation">
                            Valuation
                          </p>
                          <p className="text-xs sm:text-sm font-extrabold text-[var(--header-text)] whitespace-nowrap leading-tight">
                            {formatPrice(property.valuation, true)}
                          </p>
                        </div>
                        <div className="min-w-0 px-2 flex flex-col justify-center">
                          <p
                            className="text-[10px] sm:text-[11px] font-bold text-[var(--color-text-muted)] mb-1 truncate"
                            title={property.saleType === "WHOLE" ? "Whole Price" : "Per Fraction"}
                          >
                            {property.saleType === "WHOLE" ? "Whole Price" : "Per Fraction"}
                          </p>
                          <p className="text-xs sm:text-sm font-extrabold text-[var(--header-text)] whitespace-nowrap leading-tight">
                            {formatPrice(
                              Number(property.fractionPrice) && Number(property.fractionPrice) !== Number(property.valuation)
                                ? property.fractionPrice
                                : Number(property.valuation) / (Number(property.totalFractions) || 1),
                              true
                            )}
                          </p>
                        </div>
                        <div className="min-w-0 px-2 relative group/tip flex flex-col justify-center">
                          <p
                            className="text-[10px] sm:text-[11px] font-bold text-[var(--color-text-muted)] mb-1 truncate cursor-default"
                            title="Potential Annual Return"
                          >
                            Potential Annual Return
                          </p>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/tip:flex items-center px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-semibold rounded shadow-xl border border-neutral-700 whitespace-nowrap z-30 pointer-events-none">
                            Potential Annual Return
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-900 rotate-45 border-r border-b border-neutral-700" />
                          </div>
                          <p className="text-xs sm:text-sm font-extrabold text-[var(--sidebar-active-text)] whitespace-nowrap leading-tight">
                            {formattedYield}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-2 text-[12px] font-bold text-[var(--color-text-muted)]">
                        <span>{fundedPct}% funded</span>
                        <span>{isSoldOut ? "Sold Out" : `${available?.toLocaleString()} left`}</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--sidebar-active-text)]/15 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[var(--sidebar-active-text)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${fundedPct}%` }}
                          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/investor/marketplace/${property.id}`);
                      }}
                      className="w-full py-3.5 rounded-md border-[1.5px] border-[var(--sidebar-active-text)] bg-transparent text-sm font-extrabold uppercase tracking-wide cursor-pointer transition-colors duration-300 text-[var(--header-text)] hover:bg-[var(--sidebar-active-text)]/10"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-[var(--sidebar-border)] text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-[var(--card-surface)] transition-all"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-[var(--sidebar-border)] text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-[var(--card-surface)] transition-all"
          >
            Next
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
