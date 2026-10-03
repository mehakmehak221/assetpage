"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Navbar from "@/components/sections/Navbar/Navbar";
import { useGetAssetsQuery } from "@/store/api/assetApi";
import { CATEGORIES } from "@/data/propertyData";
import { Country, State, City } from "country-state-city";
import { API_URL } from "@/constants";
import { MapPinIcon, TrendingUpIcon, VerifiedIcon, SecondaryMarketplaceIcon, ShareIcon, StarIcon } from "@/components/VectorImages";
import Link from "next/link";
import WishlistHeartButton from "@/components/dashboard/investor/WishlistHeartButton";

import { useCurrency } from "@/providers/CurrencyProvider";

const DROPDOWN_STYLES = `
  .dropdown-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .dropdown-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .dropdown-scroll::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 10px;
  }
  .dropdown-scroll::-webkit-scrollbar-thumb:hover {
    background: #D1D5DB;
  }
`;

function PillDropdown({ label, options, value, onChange, placeholder, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`flex flex-col gap-1.5 relative w-full sm:w-auto ${isOpen ? 'z-30' : 'z-10'}`} ref={dropdownRef}>
            <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold px-1 font-Montserrat">{label}</label>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex justify-between items-center bg-neutral-50 border border-neutral-200/80 rounded-md px-4 py-1.5 text-xs font-Montserrat cursor-pointer transition-all min-w-0 sm:min-w-[150px] w-full sm:w-auto ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-300'} ${isOpen ? 'border-[#00DAAF] shadow-sm' : ''}`}
            >
                <span className={`truncate ${value ? "text-neutral-900 font-medium" : "text-neutral-400"}`}>
                    {value || placeholder}
                </span>
                <svg className={`w-3 h-3 text-neutral-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-[100] top-[calc(100%+6px)] left-0 min-w-[200px] w-full sm:w-auto bg-white border border-neutral-200 rounded-md shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-2 border-b border-neutral-100">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-3 py-1.5 text-[10px] text-neutral-800 focus:outline-none focus:border-[#00DAAF]/50 font-Montserrat"
                            />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto dropdown-scroll">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.isoCode || opt.name}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={`px-4 py-2 text-[11px] font-Montserrat cursor-pointer hover:bg-neutral-50 hover:text-neutral-900 transition-colors ${value === opt.name ? 'bg-[#00DAAF]/10 text-[#00B28F] font-semibold' : 'text-neutral-600'}`}
                                    >
                                        {opt.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-[10px] text-neutral-400 font-Montserrat text-center italic">
                                    No results found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const CATEGORY_MAP = {
    "Dubai Skyscrapers": "DUBAI_SKYSCRAPER",
    "Land Parcels": "LAND_PARCEL",
    "Commercial Real Estate": "COMMERCIAL_REAL_ESTATE",
    "Residential": "RESIDENTIAL"
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function ExplorePage() {
    const { formatPrice, currency } = useCurrency();
    const [activeCategory, setActiveCategory] = useState("All");
    const [countryFilter, setCountryFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [countryIsoCode, setCountryIsoCode] = useState("");
    const [stateIsoCode, setStateIsoCode] = useState("");
    const [saleTypeFilter, setSaleTypeFilter] = useState<"FRACTIONAL" | "WHOLE" | "PREMIUM">("FRACTIONAL");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const apiCategory = activeCategory === "All" ? undefined : CATEGORY_MAP[activeCategory];
    const { data: assetsData, isLoading, isError } = useGetAssetsQuery({
        category: apiCategory,
        country: countryFilter || undefined,
        state: stateFilter || undefined,
        city: cityFilter || undefined,
        saleType: saleTypeFilter
    });

    const assets = assetsData?.data || [];

    return (
        <div className="min-h-screen bg-[#F8FBFA] text-neutral-900 font-Montserrat overflow-x-hidden">
            <Navbar />
            <style>{DROPDOWN_STYLES}</style>

            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-12 pb-12 sm:pt-16 sm:pb-16">


                <div className="flex flex-col gap-6 mb-8 bg-white p-6 sm:p-8 rounded-md border border-neutral-200/60 shadow-sm relative z-20">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-r from-[#00B28F] to-[#00DAAF] bg-clip-text text-transparent">
                            Discover Assets
                        </h1>
                        <p className="text-sm sm:text-base text-neutral-500 max-w-xl font-medium leading-relaxed mb-0.5">
                            Institutional-grade real estate. Digitally simplified.
                        </p>
                        <p className="text-sm text-neutral-500 font-medium">
                            {saleTypeFilter === "FRACTIONAL"
                                ? `Invest fractionally starting from ${currency.symbol}10,000.`
                                : saleTypeFilter === "PREMIUM"
                                    ? `Curated ultra-prime assets with min. valuation of ₹2 Cr and ₹1 Lakh min. share investment.`
                                    : "Acquire complete institutional assets as a single whole transaction."}
                        </p>
                    </div>

                    {/* Sale-type pill toggle */}
                    <div className="flex mb-1 overflow-x-auto no-scrollbar">
                        <div className="inline-flex min-w-full sm:min-w-0 bg-neutral-100 border border-neutral-200/80 rounded-md p-1 gap-1 shadow-sm relative">
                            {(["FRACTIONAL", "WHOLE", "PREMIUM"] as const).map((type) => {
                                const isSelected = saleTypeFilter === type;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setSaleTypeFilter(type)}
                                        className={`relative flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 rounded-md text-xs font-bold transition-colors duration-300 cursor-pointer border-0 bg-transparent z-10 flex items-center justify-center gap-1.5 whitespace-nowrap ${isSelected
                                                ? "text-[#00B28F]"
                                                : "text-neutral-500 hover:text-neutral-900"
                                            }`}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="activeSaleType"
                                                className="absolute inset-0 bg-white border border-[#00DAAF]/30 rounded-md z-[-1] shadow-sm"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        {type === "FRACTIONAL"
                                            ? "Fractional Real Estate"
                                            : type === "PREMIUM"
                                                ? (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <StarIcon className="w-3.5 h-3.5 fill-current" />
                                                        GloFi Premium
                                                    </span>
                                                )
                                                : "Whole Properties"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 sm:gap-8">
                        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-2 sm:gap-3 pb-1 sm:pb-0">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-md text-xs font-bold transition-all duration-300 border whitespace-nowrap shrink-0 ${activeCategory === cat
                                        ? "bg-[#00DAAF]/10 text-[#00B28F] border-[#00DAAF]/30 shadow-[0_0_20px_rgba(0,218,175,0.05)]"
                                        : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-stretch sm:items-center border-t border-neutral-100 pt-5">
                            <PillDropdown
                                label="Country"
                                options={Country.getAllCountries()}
                                value={countryFilter}
                                onChange={(opt) => {
                                    setCountryIsoCode(opt.isoCode);
                                    setCountryFilter(opt.name);
                                    setStateFilter("");
                                    setCityFilter("");
                                    setStateIsoCode("");
                                }}
                                placeholder="Select Country"
                            />
                            <PillDropdown
                                label="State"
                                options={countryIsoCode ? State.getStatesOfCountry(countryIsoCode) : []}
                                value={stateFilter}
                                onChange={(opt) => {
                                    setStateIsoCode(opt.isoCode);
                                    setStateFilter(opt.name);
                                    setCityFilter("");
                                }}
                                placeholder="Select State"
                                disabled={!countryIsoCode}
                            />
                            <PillDropdown
                                label="City"
                                options={(countryIsoCode && stateIsoCode) ? City.getCitiesOfState(countryIsoCode, stateIsoCode) : []}
                                value={cityFilter}
                                onChange={(opt) => {
                                    setCityFilter(opt.name);
                                }}
                                placeholder="Select City"
                                disabled={!stateIsoCode}
                            />
                            {(countryFilter || stateFilter || cityFilter) && (
                                <button
                                    onClick={() => {
                                        setCountryFilter("");
                                        setStateFilter("");
                                        setCityFilter("");
                                        setStateIsoCode("");
                                        setCountryIsoCode("");
                                    }}
                                    className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors py-2 px-3 hover:bg-neutral-50 rounded-md"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 w-full">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white border border-neutral-200/60 rounded-md overflow-hidden animate-pulse shadow-sm">
                                    <div className="h-64 sm:h-72 bg-neutral-200" />
                                    <div className="p-5 sm:p-6 space-y-4">
                                        <div className="h-5 bg-neutral-200 rounded w-3/4" />
                                        <div className="h-4 bg-neutral-100 rounded w-1/2" />
                                        <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3">
                                            <div className="h-10 bg-neutral-100 rounded" />
                                            <div className="h-10 bg-neutral-100 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center p-24 bg-white rounded-md border border-neutral-200 shadow-sm">
                            <p className="text-neutral-500 mb-4">Error loading assets. Please try again later.</p>
                            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-md text-xs font-bold transition-all text-neutral-800">Retry</button>
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center p-24 bg-white rounded-md border border-dashed border-neutral-200 shadow-sm">
                            <p className="text-neutral-500 font-medium">No assets found in this category.</p>
                        </div>
                    ) : (
                        <motion.div
                            key={activeCategory}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={
                                assets.length === 1
                                    ? "grid grid-cols-1 gap-6 sm:gap-8 max-w-lg w-full justify-items-stretch"
                                    : assets.length === 2
                                        ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full justify-items-stretch"
                                        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 w-full"
                            }
                        >
                            {assets.map((property) => {
                                const propertyImage = property.images?.[0];
                                const imageUrl = propertyImage
                                    ? (propertyImage.startsWith('http') ? propertyImage : `${API_URL}/${propertyImage.replace(/^\//, '')}`)
                                    : "/assets/images/content/img_ext_0.jpeg";
                                const expectedYield = parseFloat(property.expectedYield || 0);
                                const expectedAnnualRent = parseFloat(property.expectedAnnualRent || 0);
                                const rentalGrowthRate = parseFloat(property.rentalGrowthRate || 0);
                                const expectedAppreciationRate = parseFloat(property.expectedAppreciationRate || 0);
                                const operatingCostRate = parseFloat(property.operatingCostRate || 0);

                                const rawYield = expectedYield + expectedAnnualRent + rentalGrowthRate + expectedAppreciationRate - operatingCostRate;
                                const formattedYield = rawYield.toFixed(2).replace(/\.?0+$/, '');

                                const total = property.totalFractions || 1;
                                const available = property.availableFractions || 0;
                                const fundedPercentage = Math.max(0, Math.min(100, Math.round(((total - available) / total) * 100)));
                                const isSoldOut = available <= 0 || fundedPercentage >= 100;
                                const riskLevel = (property.riskRating || "MEDIUM").toString().toUpperCase();

                                const detailHref = `/assets/${property.id}`;

                                return (
                                    <motion.div
                                        key={property.id}
                                        variants={cardVariants}
                                        whileHover={{ y: -6 }}
                                        className="bg-white border border-neutral-200/60 rounded-md overflow-hidden hover:border-[#00DAAF]/30 transition-all duration-500 group shadow-sm hover:shadow-md relative"
                                    >
                                        <Link
                                            href={detailHref}
                                            className="absolute inset-0 z-[1] rounded-md cursor-pointer outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00DAAF]"
                                            aria-label={`View details for ${property.title}`}
                                            prefetch={false}
                                        />
                                        <div className="relative z-[2] pointer-events-none flex flex-col">

                                            <div className="relative h-64 sm:h-72 overflow-hidden shrink-0">
                                                <Image
                                                    src={imageUrl}
                                                    alt={property.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />


                                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
                                                    <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold capitalize bg-white text-[#111111] shadow-md tracking-wide">
                                                        {property.category.replace(/_/g, ' ').toLowerCase()}
                                                    </span>
                                                    {property.saleType === 'PREMIUM' && (
                                                        <span className="px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md tracking-wider flex items-center gap-1">
                                                            <StarIcon className="w-3 h-3 fill-black shrink-0" />
                                                            PREMIUM
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white border border-white/10 backdrop-blur-md shadow-sm z-10">
                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${riskLevel === "LOW"
                                                        ? 'bg-[#00DAAF] text-[#00DAAF]'
                                                        : riskLevel === "HIGH"
                                                            ? 'bg-[#FF5C5C] text-[#FF5C5C]'
                                                            : 'bg-[#E8940C] text-[#E8940C]'
                                                        }`} />
                                                    {riskLevel} RISK
                                                </span>

                                                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30 pointer-events-auto">
                                                    <WishlistHeartButton
                                                        assetId={property.id}
                                                        assetTitle={property.title}
                                                        size="md"
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            const url = `${window.location.origin}/assets/${property.id}`;
                                                            navigator.clipboard.writeText(url);
                                                            setCopiedId(property.id);
                                                            setTimeout(() => setCopiedId(null), 2000);
                                                        }}
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

                                                <h3 className="text-[22px] font-extrabold text-neutral-900 mb-1 leading-snug tracking-tight">{property.title}</h3>
                                                <div className="flex items-center gap-1.5 text-neutral-500 text-[13px] mb-5 font-medium">
                                                    <MapPinIcon className="w-4 h-4 text-neutral-400" />
                                                    {property.city && property.state ? `${property.city}, ${property.state}` : property.location}
                                                </div>


                                                <div className="bg-[#F9FAFB] border border-neutral-200/80 rounded-md p-3 sm:p-4 mb-6 shadow-sm">
                                                    <div className="grid grid-cols-3 divide-x divide-neutral-200/65 text-center items-center">
                                                        <div className="min-w-0 px-1 flex flex-col justify-center">
                                                            <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 mb-1 truncate">Valuation</p>
                                                            <p className="text-[11px] min-[400px]:text-xs sm:text-[15px] font-extrabold text-neutral-900 whitespace-nowrap leading-tight">{formatPrice(property.valuation, true)}</p>
                                                        </div>
                                                        <div className="min-w-0 px-1 flex flex-col justify-center">
                                                            <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 mb-1 truncate">
                                                                {property.saleType === 'WHOLE' ? 'Whole Price' : 'Per Fraction'}
                                                            </p>
                                                            <p className="text-[11px] min-[400px]:text-xs sm:text-[15px] font-extrabold text-neutral-900 whitespace-nowrap leading-tight">
                                                                {formatPrice(
                                                                    Number(property.fractionPrice) && Number(property.fractionPrice) !== Number(property.valuation)
                                                                        ? property.fractionPrice
                                                                        : (Number(property.valuation) / (Number(property.totalFractions) || 1)),
                                                                    true
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="relative group/tip min-w-0 px-1 flex flex-col justify-center">
                                                            <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 mb-1 truncate cursor-default" title="Potential Annual Return">Potential Annual Return</p>
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover/tip:flex items-center px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-semibold rounded shadow-xl border border-neutral-700 whitespace-nowrap z-30 pointer-events-none">
                                                                Potential Annual Return
                                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-900 rotate-45 border-r border-b border-neutral-700" />
                                                            </div>
                                                            <p className="text-[11px] min-[400px]:text-xs sm:text-[15px] font-extrabold text-[#00B28F] whitespace-nowrap leading-tight">{formattedYield}%</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Funding Progress */}
                                                <div className="mb-6">
                                                    <div className="flex justify-between items-center mb-2 text-[12px] font-bold text-neutral-400">
                                                        <span>{fundedPercentage}% funded</span>
                                                        <span>{isSoldOut ? "Sold Out" : `${property.availableFractions?.toLocaleString()} left`}</span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-[#00DAAF]/20 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full bg-[#00DAAF]"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${fundedPercentage}%` }}
                                                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                                        />
                                                    </div>
                                                </div>


                                                <Link
                                                    href={detailHref}
                                                    prefetch={false}
                                                    className="relative z-[3] block pointer-events-auto w-full py-3.5 rounded-md border-[1.5px] border-[#006D5B] bg-transparent text-neutral-900 hover:bg-[#006D5B] hover:text-white text-sm font-extrabold uppercase tracking-wide text-center transition-all duration-300 active:scale-[0.99]"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}