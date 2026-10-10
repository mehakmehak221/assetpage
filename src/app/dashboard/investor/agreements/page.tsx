"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMyAgreementsQuery, useLazyGetAgreementDownloadUrlQuery } from "@/store/api/agreementApi";
import { Agreement } from "@/types/agreement";
import { useI18n } from "@/providers/LocaleProvider";
import AgreementModal from "@/components/dashboard/investor/AgreementModal";
import {
  DocumentIcon,
  DownloadIcon,
  SearchIcon,
  MarketplaceIcon,
} from "@/components/VectorImages";

import { API_URL } from "@/constants";

const getSafeImageUrl = (src?: string | null): string => {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return "/assets/images/marketplace/Burj.png";
  }
  const clean = src.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  if (clean.startsWith("/")) {
    return clean;
  }
  return `${API_URL}/${clean.replace(/^\//, "")}`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

export default function AgreementsPage() {
  const { t } = useI18n();
  const { data: agreementsData, isLoading, isError, refetch } = useGetMyAgreementsQuery();
  const [triggerDownload] = useLazyGetAgreementDownloadUrlQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDownloadingId, setActiveDownloadingId] = useState<{ id: string; action: "view" | "download" } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const agreements: Agreement[] = useMemo(() => {
    if (!agreementsData) return [];
    return Array.isArray(agreementsData) ? agreementsData : (agreementsData as any)?.data || [];
  }, [agreementsData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePdfAction = async (agreement: Agreement, action: "view" | "download", e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDownloadingId({ id: agreement.id, action });

    try {
      const res = await triggerDownload(agreement.id).unwrap();
      const url = res?.downloadUrl;
      if (!url) {
        throw new Error(t("Could not generate download link."));
      }

      if (action === "view") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        const fileName = `${agreement.agreementNumber || "agreement"}-v${agreement.version || 1}.pdf`;
        try {
          const fileRes = await fetch(url);
          if (!fileRes.ok) throw new Error("Failed to fetch file content");
          const blob = await fileRes.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        } catch (fetchErr) {
          // Fallback
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (err: any) {
      console.error("PDF download error:", err);
      showToast(err?.data?.message || err?.message || t("Failed to get agreement PDF. Please try again."));
    } finally {
      setActiveDownloadingId(null);
    }
  };

  const filteredAgreements = useMemo(() => {
    return agreements.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const propertyTitle =
        item.investment?.asset?.title || item.investment?.asset?.name || "";
      const matchesSearch =
        item.agreementNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.investmentId?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [agreements, statusFilter, searchQuery]);

  // Quick stats
  const stats = useMemo(() => {
    const total = agreements.length;
    const active = agreements.filter((a) => a.status === "GENERATED").length;
    const signed = agreements.filter((a) => a.status === "SIGNED").length;
    const expired = agreements.filter((a) => a.status === "EXPIRED").length;
    return { total, active, signed, expired };
  }, [agreements]);

  const openDetails = (agreementId: string) => {
    setSelectedAgreementId(agreementId);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t("Signed")}
          </span>
        );
      case "GENERATED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-[var(--color-primary-300)]/15 text-[var(--color-primary-300)] border border-[var(--color-primary-300)]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)] animate-pulse" />
            {t("Active / Generated")}
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-neutral-500/15 text-neutral-400 border border-neutral-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            {t("Expired")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-neutral-500/15 text-neutral-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-medium shadow-2xl flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--header-text)] flex items-center gap-2.5">
            <DocumentIcon className="w-6 h-6 text-[var(--color-primary-300)]" />
            {t("Investment Agreements")}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-normal mt-1">
            {t("View, verify, and download legal investment agreements generated for your fractional property purchases.")}
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-normal border border-[var(--sidebar-border)] bg-[var(--field-surface)] text-[var(--header-text)] hover:bg-[var(--sidebar-active-bg)] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t("Refresh")}
        </button>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5">
            {t("Total Documents")}
          </span>
          <span className="text-xl sm:text-2xl font-medium text-[var(--header-text)]">
            {stats.total}
          </span>
        </div>

        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[var(--color-primary-300)] block mb-1.5">
            {t("Active / Latest")}
          </span>
          <span className="text-xl sm:text-2xl font-medium text-[var(--color-primary-300)]">
            {stats.active}
          </span>
        </div>

        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-emerald-500 block mb-1.5">
            {t("Signed")}
          </span>
          <span className="text-xl sm:text-2xl font-medium text-emerald-500">
            {stats.signed}
          </span>
        </div>

        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1.5">
            {t("Expired / Superseded")}
          </span>
          <span className="text-xl sm:text-2xl font-medium text-neutral-400">
            {stats.expired}
          </span>
        </div>
      </div>


      <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">

        <div className="relative flex-1 max-w-md">
          <SearchIcon className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("Search by agreement number or property...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)] text-xs text-[var(--foreground)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--sidebar-active-text)]/40 transition-colors"
          />
        </div>


        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: "ALL", label: t("All") },
            { key: "GENERATED", label: t("Active") },
            { key: "SIGNED", label: t("Signed") },
            { key: "EXPIRED", label: t("Expired") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border-0 cursor-pointer ${statusFilter === tab.key
                  ? "bg-[var(--color-primary-300)] text-black shadow-sm font-semibold"
                  : "bg-[var(--field-surface)] text-[var(--color-text-muted)] hover:text-[var(--header-text)]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>


      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-2 border-[var(--color-primary-300)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[var(--color-text-muted)] font-normal">{t("Loading agreements...")}</span>
        </div>
      ) : isError ? (
        <div className="bg-[var(--card-surface)] border border-red-500/20 rounded-2xl p-12 text-center">
          <p className="text-sm text-red-400 mb-3 font-normal">{t("Failed to load your agreements.")}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-xs font-medium border-0 cursor-pointer"
          >
            {t("Try Again")}
          </button>
        </div>
      ) : filteredAgreements.length === 0 ? (
        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-300)]/10 text-[var(--color-primary-300)] flex items-center justify-center mx-auto mb-4">
            <DocumentIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[var(--header-text)] mb-1.5">
            {searchQuery || statusFilter !== "ALL"
              ? t("No matching agreements found")
              : t("No investment agreements yet")}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] font-normal max-w-md mx-auto mb-6 leading-relaxed">
            {searchQuery || statusFilter !== "ALL"
              ? t("Try adjusting your search query or status filter.")
              : t("When you complete a fractional property purchase on GloFi, your legal agreement PDF is generated and securely preserved here.")}
          </p>
          {!(searchQuery || statusFilter !== "ALL") && (
            <Link
              href="/dashboard/investor/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--btn-cta-bg)] text-[var(--btn-cta-text)] text-xs font-medium hover:opacity-90 transition-opacity no-underline shadow-md"
            >
              <MarketplaceIcon className="w-4 h-4" />
              {t("Explore Marketplace")}
            </Link>
          )}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {filteredAgreements.map((agreement) => {
            const asset = agreement.investment?.asset;
            const propertyTitle =
              asset?.title || asset?.name || t("Investment Property");
            const rawImage =
              asset?.images?.[0] ||
              asset?.image ||
              (typeof asset?.images === "string" ? asset.images : null);
            const propertyImage = getSafeImageUrl(rawImage);

            const isViewingThis =
              activeDownloadingId?.id === agreement.id &&
              activeDownloadingId.action === "view";
            const isDownloadingThis =
              activeDownloadingId?.id === agreement.id &&
              activeDownloadingId.action === "download";

            return (
              <motion.div
                key={agreement.id}
                variants={itemVariants}
                onClick={() => openDetails(agreement.id)}
                className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/30 rounded-2xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div>

                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-[var(--header-text)] bg-[var(--field-surface)] px-2.5 py-1 rounded-lg border border-[var(--sidebar-border)]">
                        {agreement.agreementNumber}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--sidebar-active-bg)] text-[var(--header-text)] border border-[var(--sidebar-border)]">
                        v{agreement.version}
                      </span>
                    </div>
                    {getStatusBadge(agreement.status)}
                  </div>


                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)] mb-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden relative shrink-0 bg-neutral-800">
                      <Image
                        src={propertyImage}
                        alt={propertyTitle}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-[var(--header-text)] truncate">
                        {propertyTitle}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)] font-normal mt-0.5">
                        {agreement.generatedAt
                          ? new Date(agreement.generatedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                          : t("Generated")}
                      </p>
                    </div>
                  </div>


                  <div className="space-y-2 text-xs mb-5 font-normal">
                    <div className="flex justify-between items-center text-[var(--color-text-muted)]">
                      <span>{t("Signed Status")}</span>
                      <span className="font-medium text-[var(--header-text)]">
                        {agreement.signedAt
                          ? new Date(agreement.signedAt).toLocaleDateString()
                          : t("Pending Signature")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--color-text-muted)]">
                      <span>{t("Document Version")}</span>
                      <span className="font-mono text-[var(--header-text)] font-medium">
                        v{agreement.version} {agreement.status === "GENERATED" ? `(${t("Latest")})` : ""}
                      </span>
                    </div>
                  </div>
                </div>


                <div className="flex items-center gap-2 pt-3 border-t border-[var(--sidebar-border)]">
                  <button
                    onClick={(e) => handlePdfAction(agreement, "view", e)}
                    disabled={isViewingThis || isDownloadingThis}
                    className="flex-1 py-2 px-3 rounded-xl bg-[var(--field-surface)] hover:bg-[var(--sidebar-active-bg)] border border-[var(--sidebar-border)] text-[var(--header-text)] text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isViewingThis ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <DocumentIcon className="w-3.5 h-3.5 text-[var(--color-primary-300)]" />
                    )}
                    {t("View PDF")}
                  </button>

                  <button
                    onClick={(e) => handlePdfAction(agreement, "download", e)}
                    disabled={isDownloadingThis || isViewingThis}
                    className="flex-1 py-2 px-3 rounded-xl bg-[var(--btn-cta-bg)] hover:opacity-90 text-[var(--btn-cta-text)] text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isDownloadingThis ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <DownloadIcon className="w-3.5 h-3.5" />
                    )}
                    {t("Download")}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}


      <AgreementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAgreementId(null);
        }}
        agreementId={selectedAgreementId}
      />
    </div>
  );
}
