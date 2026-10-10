"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useGetAgreementByIdQuery, useLazyGetAgreementDownloadUrlQuery } from "@/store/api/agreementApi";
import { Agreement } from "@/types/agreement";
import { useI18n } from "@/providers/LocaleProvider";
import { DocumentIcon, DownloadIcon, CloseIcon } from "@/components/VectorImages";

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

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreementId?: string | null;
  initialAgreement?: Agreement | null;
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

export default function AgreementModal({
  isOpen,
  onClose,
  agreementId,
  initialAgreement,
}: AgreementModalProps) {
  const { t } = useI18n();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch full details if agreementId is provided
  const { data: fetchedAgreement, isLoading: isFetching } = useGetAgreementByIdQuery(
    agreementId || "",
    { skip: !isOpen || !agreementId }
  );

  const [triggerDownload] = useLazyGetAgreementDownloadUrlQuery();

  if (!isOpen) return null;

  const agreement: Agreement | null = fetchedAgreement || initialAgreement || null;

  const handleAction = async (action: "view" | "download") => {
    if (!agreement?.id) return;
    setErrorMsg(null);
    if (action === "view") setViewLoading(true);
    else setDownloadLoading(true);

    try {
      const res = await triggerDownload(agreement.id).unwrap();
      const url = res?.downloadUrl;
      if (!url) throw new Error(t("Could not generate download link. Please try again."));

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
      console.error("Failed to fetch agreement download URL:", err);
      setErrorMsg(err?.data?.message || err?.message || t("Failed to get agreement PDF. Please try again."));
    } finally {
      setViewLoading(false);
      setDownloadLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "SIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("Signed")}
          </span>
        );
      case "GENERATED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-[var(--color-primary-300)]/15 text-[var(--color-primary-300)] border border-[var(--color-primary-300)]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)]" />
            {t("Active / Generated")}
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-neutral-500/15 text-neutral-400 border border-neutral-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            {t("Expired (Superseded)")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-neutral-500/15 text-neutral-400">
            {status || t("Unknown")}
          </span>
        );
    }
  };

  const asset = agreement?.investment?.asset;
  const propertyTitle = asset?.title || asset?.name || t("Investment Property");
  const rawImage =
    asset?.images?.[0] ||
    asset?.image ||
    (typeof asset?.images === "string" ? asset.images : null);
  const propertyImage = getSafeImageUrl(rawImage);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        />

        <motion.div
          className="relative bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10 my-auto text-[var(--foreground)]"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--sidebar-border)] flex items-center justify-between bg-[var(--field-surface)]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-300)]/15 border border-[var(--color-primary-300)]/30 flex items-center justify-center text-[var(--color-primary-300)]">
                <DocumentIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--header-text)]">
                  {t("Investment Agreement")}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] font-mono font-normal">
                  {agreement?.agreementNumber || (isFetching ? t("Loading...") : t("Agreement Details"))}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-border)]/50 transition-colors border-0 bg-transparent cursor-pointer"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {isFetching && !agreement ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-[var(--color-primary-300)] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[var(--color-text-muted)] font-normal">{t("Fetching agreement details...")}</span>
              </div>
            ) : agreement ? (
              <>
                {/* Property Card */}
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)]">
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0 bg-neutral-800">
                    <Image
                      src={propertyImage}
                      alt={propertyTitle}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-primary-300)]">
                      {t("Linked Asset")}
                    </span>
                    <h4 className="text-sm font-medium text-[var(--header-text)] truncate">
                      {propertyTitle}
                    </h4>
                    {asset?.location && (
                      <p className="text-xs text-[var(--color-text-muted)] font-normal truncate">
                        {asset.location}
                      </p>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(agreement.status)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)]">
                    <span className="text-[10px] uppercase tracking-wider font-normal text-[var(--color-text-muted)] block mb-1">
                      {t("Agreement No.")}
                    </span>
                    <span className="text-xs sm:text-sm font-medium font-mono text-[var(--header-text)] block truncate">
                      {agreement.agreementNumber}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)]">
                    <span className="text-[10px] uppercase tracking-wider font-normal text-[var(--color-text-muted)] block mb-1">
                      {t("Version")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium text-[var(--header-text)]">
                        v{agreement.version}
                      </span>
                      {agreement.status === "GENERATED" && (
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-[var(--color-primary-300)]/20 text-[var(--color-primary-300)]">
                          {t("Latest")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)]">
                    <span className="text-[10px] uppercase tracking-wider font-normal text-[var(--color-text-muted)] block mb-1">
                      {t("Generated On")}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[var(--header-text)]">
                      {agreement.generatedAt
                        ? new Date(agreement.generatedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : t("N/A")}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)]">
                    <span className="text-[10px] uppercase tracking-wider font-normal text-[var(--color-text-muted)] block mb-1">
                      {t("Signed Date")}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[var(--header-text)]">
                      {agreement.signedAt
                        ? new Date(agreement.signedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : t("Not signed yet")}
                    </span>
                  </div>

                  {agreement.investment?.fractions && (
                    <div className="p-3.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)]">
                      <span className="text-[10px] uppercase tracking-wider font-normal text-[var(--color-text-muted)] block mb-1">
                        {t("Tokens / Fractions")}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[var(--header-text)]">
                        {agreement.investment.fractions} {t("Fractions")}
                      </span>
                    </div>
                  )}

                  {agreement.investment?.amount && (
                    <div className="p-3.5 rounded-xl bg-[var(--field-surface)] border border-[var(--sidebar-border)]">
                      <span className="text-[10px] uppercase tracking-wider font-normal text-[var(--color-text-muted)] block mb-1">
                        {t("Investment Amount")}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[var(--header-text)]">
                        ₹{Number(agreement.investment.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Notice */}
                {agreement.status === "EXPIRED" && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-2.5">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                      {t("This version of the agreement has expired because a newer regenerated version exists.")}
                    </span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {errorMsg}
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center text-[var(--color-text-muted)] text-sm">
                {t("Agreement details not found.")}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-[var(--sidebar-border)] bg-[var(--field-surface)]/60 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => handleAction("view")}
              disabled={viewLoading || downloadLoading || !agreement}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/40 bg-[var(--card-surface)] text-[var(--header-text)] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--sidebar-active-bg)]"
            >
              {viewLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <DocumentIcon className="w-3.5 h-3.5" />
              )}
              {t("View PDF")}
            </button>

            <button
              onClick={() => handleAction("download")}
              disabled={downloadLoading || viewLoading || !agreement}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[var(--btn-cta-bg)] hover:opacity-90 text-[var(--btn-cta-text)] text-xs font-bold transition-all flex items-center justify-center gap-2 border-0 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <DownloadIcon className="w-3.5 h-3.5" />
              )}
              {t("Download PDF")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
