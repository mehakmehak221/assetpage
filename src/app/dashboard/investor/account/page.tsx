"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/api/authApi";
import { useGetMyCertificatesQuery } from "@/store/api/certificatesApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { useUploadFileMutation } from "@/store/api/fileApi";
import SupportTicketComposer from "@/components/dashboard/SupportTicketComposer";
import { API_URL } from "@/constants";
import { Country } from "country-state-city";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";

const TABS = ["Profile", "Wallet", "KYC", "Certificates", "Referrals", "Support"];

const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedMessage, setCopiedMessage] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
    const { data: certsResponse, isLoading: certsLoading } = useGetMyCertificatesQuery();
    const { data: kycData, isLoading: kycLoading } = useGetKycStatusQuery();

    const [updateProfile] = useUpdateProfileMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const [fullName, setFullName] = useState("");
    const [country, setCountry] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const avatarKeyRef = useRef("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (profileData) {
            const profile = profileData.partnerProfile || profileData.investorProfile || {};
            setFullName(profileData.fullName || profile.fullName || profileData.name || "");
            setCountry(profileData.country || profile.country || profile.nationality || profileData.nationality || "");
            const dbAvatar = profileData.avatarUrl || profile.avatarUrl || "";
            setAvatarUrl(dbAvatar);
            avatarKeyRef.current = dbAvatar;
        }
    }, [profileData]);

    const handleSaveChanges = async () => {
        setIsUpdating(true);
        setStatusMsg(null);
        try {
            await updateProfile({
                fullName,
                country,
                avatarUrl: avatarKeyRef.current,
                role: "INVESTOR",
            }).unwrap();
            setStatusMsg({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setStatusMsg(null), 5000);
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            setStatusMsg({
                type: "error",
                text: err?.data?.message || err?.message || "Failed to update profile. Please try again."
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const isLoading = profileLoading || (activeTab === "Certificates" && certsLoading) || (activeTab === "KYC" && kycLoading);
    const certificates = certsResponse?.data || [];

    const getShareUrl = () => {
        const code = profileData?.referralCode || "";
        return `https://glofiestates.com/sign-up?ref=${code}`;
    };

    const getShareMessage = () => {
        const code = profileData?.referralCode || "";
        return `Hey! I'm inviting you to invest in premium real estate with me on GloFi Estates.

GloFi Estates makes it easy to co-own high-growth, vetted properties and earn passive rental returns with fractional ownership.

👉 Sign up using my invite link:
https://glofiestates.com/sign-up?ref=${code}

Referral Code: ${code}
Start building your property portfolio today! ✨`;
    };

    const handleCopyLink = () => {
        if (!profileData?.referralCode) return;
        navigator.clipboard.writeText(getShareUrl());
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyMessage = () => {
        if (!profileData?.referralCode) return;
        navigator.clipboard.writeText(getShareMessage());
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
    };

    const handleCopyCode = () => {
        if (!profileData?.referralCode) return;
        navigator.clipboard.writeText(profileData.referralCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleNativeShare = async () => {
        if (!profileData?.referralCode) return;
        const shareMessage = getShareMessage();
        const shareUrl = getShareUrl();
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: "Invest in Premium Real Estate | GloFi Estates",
                    text: shareMessage,
                    url: shareUrl,
                });
                return;
            } catch (err: unknown) {
                if ((err as Error)?.name !== "AbortError") {
                    handleCopyMessage();
                }
            }
        } else {
            handleCopyMessage();
        }
    };

    const shareOnWhatsApp = () => {
        if (!profileData?.referralCode) return;
        const text = encodeURIComponent(getShareMessage());
        window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
    };

    const shareOnTelegram = () => {
        if (!profileData?.referralCode) return;
        const text = encodeURIComponent(getShareMessage());
        const url = encodeURIComponent(getShareUrl());
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
    };

    const shareOnTwitter = () => {
        if (!profileData?.referralCode) return;
        const text = encodeURIComponent(getShareMessage());
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
    };

    const shareViaEmail = () => {
        if (!profileData?.referralCode) return;
        const subject = encodeURIComponent("Invest in premium real estate with me on GloFi Estates");
        const body = encodeURIComponent(getShareMessage());
        window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    };

    const shareOnLinkedIn = () => {
        if (!profileData?.referralCode) return;
        const url = encodeURIComponent(getShareUrl());
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="p-3 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--header-text)] mb-4 sm:mb-6"
            >
                Account
            </motion.h1>


            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2 sm:gap-2.5 mb-5 sm:mb-8"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-md text-[11px] sm:text-[13px] font-medium transition-all duration-300 cursor-pointer border ${activeTab === tab
                            ? "bg-[var(--color-primary-300)] text-black border-[var(--color-primary-300)] shadow-glow-primary"
                            : "bg-[var(--background)] text-[var(--color-text-muted)] border-[var(--sidebar-border)] hover:border-[var(--sidebar-active-text)]/30 hover:text-[var(--header-text)]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>


            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {activeTab === "Profile" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-4 sm:p-6 lg:p-8 max-w-[800px] shadow-sm">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-md h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="relative w-28 h-28 mb-3">
                                            <div className="w-full h-full rounded-full bg-[var(--field-surface)] border border-[var(--sidebar-border)] flex items-center justify-center overflow-hidden">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center font-bold text-2xl text-black"
                                                        style={{ background: "var(--color-gradient-Glofi)" }}
                                                    >
                                                        {fullName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            {avatarUrl && !isUploading && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setAvatarUrl(""); avatarKeyRef.current = ""; }}
                                                    className="absolute top-0 left-0 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer border-0 hover:bg-red-500 transition-all shadow-lg"
                                                    aria-label="Remove profile picture"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary-300)]"></div>
                                                </div>
                                            )}
                                            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00DAAF] text-black flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all">
                                                <Camera className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            try {
                                                                const response = await uploadFile({ file, folder: "avatars" }).unwrap();
                                                                if (response?.signedUrl) {
                                                                    setAvatarUrl(response.signedUrl);
                                                                    avatarKeyRef.current = response.key;
                                                                } else {
                                                                    const url = response.url || (response.key ? `https://aws-glofi-uploads.s3.ap-south-1.amazonaws.com/${response.key}` : "");
                                                                    if (url) {
                                                                        setAvatarUrl(url);
                                                                        avatarKeyRef.current = response.key || url;
                                                                    }
                                                                }
                                                            } catch (err: any) {
                                                                console.error("Photo upload failed:", err);
                                                                const msg = err?.data?.message || err?.message || "Upload failed. Please ensure the file is under 2MB and in JPG/PNG format.";
                                                                setStatusMsg({ type: "error", text: msg });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] opacity-60">
                                            <AlertCircle className="w-3.5 h-3.5 text-[#00DAAF]" />
                                            <span>JPG, PNG — max 2 MB</span>
                                        </div>
                                    </div>

                                    {statusMsg && (
                                        <div className={`mb-6 p-4 rounded-md flex items-center gap-2 text-xs border ${statusMsg.type === "success"
                                            ? "bg-[var(--color-primary-300)]/10 border-[var(--color-primary-300)]/20 text-[var(--color-primary-300)]"
                                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                            }`}>
                                            {statusMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                            <span>{statusMsg.text}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 mb-6 sm:mb-8">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full rounded-md px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-[var(--header-text)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] transition-all hover:border-[var(--sidebar-active-text)]/30 focus:outline-none focus:border-[var(--sidebar-active-text)]/50"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData?.email || ""}
                                                disabled
                                                className="w-full rounded-md px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-[var(--color-text-muted)]/60 bg-[var(--field-surface)] border border-[var(--sidebar-border)]/50 cursor-not-allowed opacity-70"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[9px] sm:text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)] font-semibold">
                                                Country
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    className="w-full rounded-md px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-[var(--header-text)] bg-[var(--field-surface)] border border-[var(--sidebar-border)] transition-all hover:border-[var(--sidebar-active-text)]/30 focus:outline-none focus:border-[var(--sidebar-active-text)]/50 appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select Country</option>
                                                    {Country.getAllCountries().map((c) => (
                                                        <option key={c.isoCode} value={c.name}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-text-muted)]">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSaveChanges}
                                        disabled={isUpdating}
                                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-md bg-[#00DAAF] text-black font-bold text-[11px] sm:text-[13px] tracking-wide cursor-pointer border-0 shadow-glow-primary transition-all disabled:opacity-50"
                                    >
                                        {isUpdating ? "Saving..." : "Save Changes"}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === "KYC" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-4 sm:p-6 lg:p-8 max-w-[800px] shadow-sm">
                            {kycLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-md h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
                                </div>
                            ) : kycData?.status === "VERIFIED" || kycData?.status === "APPROVED" ? (
                                <>
                                    <div className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-8">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-md bg-[var(--color-primary-300)]/10 flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-7 sm:h-7 text-[var(--color-primary-300)]">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-base sm:text-xl font-bold text-[var(--header-text)] mb-0.5 sm:mb-1.5">Verified</h2>
                                            <p className="text-[11px] sm:text-[13px] text-[var(--color-text-muted)] font-medium">Identity verified successfully</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[var(--sidebar-active-text)]/20 transition-colors">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-300)] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            <div>
                                                <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--header-text)] mb-0.5 sm:mb-1">Document Upload</p>
                                                <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] font-medium">Passport verified</p>
                                            </div>
                                        </div>
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[var(--sidebar-active-text)]/20 transition-colors">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-300)] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            <div>
                                                <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--header-text)] mb-0.5 sm:mb-1">Selfie Check</p>
                                                <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] font-medium">Liveness passed</p>
                                            </div>
                                        </div>
                                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-md p-3.5 sm:p-5 flex items-start gap-2.5 sm:gap-3.5 hover:border-[var(--color-primary-300)]/20 transition-colors">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-300)] mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            <div>
                                                <p className="text-[11px] sm:text-[13px] font-semibold text-[var(--header-text)] mb-0.5 sm:mb-1">Address Proof</p>
                                                <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] font-medium">Utility bill verified</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : kycData?.status === "UNDER_REVIEW" ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[var(--color-status-warning-bg)] flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-status-warning)]">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--header-text)] mb-2">Verification Under Review</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] max-w-md">Your identity verification is currently being processed. You will be notified once it is approved.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[var(--color-status-error-bg)] flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-status-error)]">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--header-text)] mb-2">Unverified</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] max-w-md mb-6">You need to complete your identity verification before you can start investing.</p>
                                    <button
                                        onClick={() => window.dispatchEvent(new CustomEvent('open-kyc-modal'))}
                                        className="px-6 py-2.5 rounded-lg bg-[var(--color-status-error)] text-white text-sm font-bold uppercase transition-all hover:opacity-90 border-0 cursor-pointer shadow-sm"
                                    >
                                        Verify Now
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Wallet" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 xl:max-w-[70rem]">
                            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 relative overflow-hidden bg-gradient-to-b from-[var(--background)] to-[var(--color-primary-700)] shadow-glow-primary flex flex-col justify-between">
                                <div className="absolute right-0 top-0 w-40 h-40 bg-[var(--background)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div>
                                    <p className="text-[11px] sm:text-[13px] uppercase tracking-[1.5px] font-semibold text-[var(--color-text-muted)] mb-2">INR BALANCE</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--header-text)] mb-4 sm:mb-6 break-words tracking-tight">₹{profileData?.usdBalance || "0.00"}</p>
                                </div>
                                <div className="flex gap-2 w-full mt-auto">
                                    <button className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 bg-[var(--card-surface)] text-[var(--header-text)] text-[11px] sm:text-xs font-semibold tracking-wide rounded-full transition-all hover:bg-[var(--field-surface)] cursor-pointer border border-[var(--sidebar-border)] text-center truncate">Deposit</button>
                                    <button className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 bg-[var(--card-surface)] text-[var(--header-text)] text-[11px] sm:text-xs font-semibold tracking-wide rounded-full border border-[var(--sidebar-border)] transition-all hover:bg-[var(--field-surface)] cursor-pointer text-center truncate">Withdraw</button>
                                </div>
                            </div>

                            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 relative overflow-hidden bg-gradient-to-b from-[var(--background)] to-[var(--color-primary-700)] shadow-glow-primary flex flex-col justify-between">
                                <div className="absolute right-0 top-0 w-40 h-40 bg-[var(--background)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div>
                                    <p className="text-[11px] sm:text-[13px] uppercase tracking-[1.5px] font-semibold text-[var(--color-text-muted)] mb-2">AED BALANCE</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--header-text)] mb-4 sm:mb-6 break-words tracking-tight"><span className="text-xs sm:text-sm font-medium opacity-80 mr-1.5">AED</span>{profileData?.aedBalance || "0.00"}</p>
                                </div>
                                <div className="flex gap-2 w-full mt-auto">
                                    <button className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 bg-[var(--card-surface)] text-[var(--header-text)] text-[11px] sm:text-xs font-semibold tracking-wide rounded-full transition-all hover:bg-[var(--field-surface)] cursor-pointer border border-[var(--sidebar-border)] text-center truncate">Deposit</button>
                                    <button className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 bg-[var(--card-surface)] text-[var(--header-text)] text-[11px] sm:text-xs font-semibold tracking-wide rounded-full border border-[var(--sidebar-border)] transition-all hover:bg-[var(--field-surface)] cursor-pointer text-center truncate">Withdraw</button>
                                </div>
                            </div>

                            <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 relative overflow-hidden bg-gradient-to-b from-[var(--background)] to-[var(--color-primary-700)] shadow-glow-primary flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                                <div className="absolute right-0 top-0 w-40 h-40 bg-[var(--background)]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div>
                                    <p className="text-[11px] sm:text-[13px] uppercase tracking-[1.5px] font-semibold text-[var(--color-text-muted)] mb-2">CRYPTO</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--header-text)] mb-4 sm:mb-6 break-words tracking-tight">{profileData?.cryptoBalance || "0.00"} <span className="text-xs sm:text-sm font-medium opacity-80 ml-1">ETH</span></p>
                                </div>
                                <div className="flex gap-2 w-full mt-auto">
                                    <button className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 bg-[var(--card-surface)] text-[var(--header-text)] text-[11px] sm:text-xs font-semibold tracking-wide rounded-full transition-all hover:bg-[var(--field-surface)] cursor-pointer border border-[var(--sidebar-border)] text-center truncate">Deposit</button>
                                    <button className="flex-1 min-w-0 px-3 py-1.5 sm:py-2 bg-[var(--card-surface)] text-[var(--header-text)] text-[11px] sm:text-xs font-semibold tracking-wide rounded-full border border-[var(--sidebar-border)] transition-all hover:bg-[var(--field-surface)] cursor-pointer text-center truncate">Withdraw</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Certificates" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 xl:max-w-6xl">
                            {certsLoading ? (
                                <div className="col-span-1 md:col-span-2 flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-300)]"></div>
                                </div>
                            ) : certificates.length > 0 ? (
                                certificates.map((cert) => (
                                    <div key={cert.id} className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-[20px] p-3.5 sm:p-5 lg:p-6 hover:border-[var(--sidebar-active-text)]/20 transition-colors shadow-sm">
                                        <div className="flex justify-between items-center mb-3 sm:mb-5">
                                            <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-[var(--color-primary-300)] font-semibold tracking-wider uppercase">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3 sm:h-3 text-[var(--color-primary-300)]">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                                </svg>
                                                Blockchain Verified
                                            </div>
                                            <span className="text-[7px] sm:text-[9px] text-[var(--color-text-muted)] font-mono tracking-wider">{cert.certificateNo || cert.id}</span>
                                        </div>

                                        <div className="border border-[var(--sidebar-border)] rounded-md sm:rounded-2xl p-4 sm:p-6 mb-3 sm:mb-5 bg-[var(--field-surface)]">
                                            <div className="text-center">
                                                <p className="text-[8px] sm:text-[9px] text-[var(--color-text-muted)] uppercase tracking-[1.5px] sm:tracking-[2px] mb-1.5 sm:mb-2 font-semibold">DIGITAL OWNERSHIP CERTIFICATE</p>
                                                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-[var(--header-text)] mb-2 sm:mb-3">{cert.assetTitle || cert.asset?.title || cert.asset?.name || "Property"}</h3>
                                                <p className="font-bold text-[var(--header-text)] flex items-center justify-center gap-1.5 sm:gap-2"><span className="text-2xl sm:text-3xl">{cert.fractionsOwned || cert.fractions || cert.investment?.fractions || 1}</span> <span className="text-[11px] sm:text-[13px] font-normal text-[var(--color-text-muted)]">Fractions</span></p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                            {cert.network && (
                                                <div className="flex justify-between items-center text-[11px] sm:text-[13px]">
                                                    <span className="text-[var(--color-text-muted)]">Network</span>
                                                    <span className="text-[var(--color-primary-300)] font-bold tracking-wide">{cert.network}</span>
                                                </div>
                                            )}
                                            {cert.issuedAt && (
                                                <div className="flex justify-between items-center text-[11px] sm:text-[13px]">
                                                    <span className="text-[var(--color-text-muted)]">Issued At</span>
                                                    <span className="text-[var(--header-text)] font-mono">
                                                        {new Date(cert.issuedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>                                        <div className="flex items-center gap-2 sm:gap-3 w-full">
                                            <button
                                                onClick={() => cert.pdfUrl && window.open(cert.pdfUrl.startsWith('http') ? cert.pdfUrl : `${API_URL}/${cert.pdfUrl.replace(/^\//, '')}`, '_blank')}
                                                disabled={!cert.pdfUrl}
                                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-[var(--color-primary-300)]/10 hover:bg-[var(--color-primary-300)]/15 text-[var(--color-primary-300)] text-[9px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full flex justify-center items-center gap-1.5 sm:gap-2 border-0 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                                                    <polyline points="7 11 12 16 17 11" />
                                                    <line x1="12" y1="4" x2="12" y2="16" />
                                                </svg>
                                                Download Docs
                                            </button>
                                            <button
                                                onClick={() => cert.pdfUrl && window.open(cert.pdfUrl.startsWith('http') ? cert.pdfUrl : `${API_URL}/${cert.pdfUrl.replace(/^\//, '')}`, '_blank')}
                                                disabled={!cert.pdfUrl}
                                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent hover:bg-[var(--sidebar-active-bg)] text-[var(--color-text-muted)] hover:text-[var(--header-text)] text-[9px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full flex justify-center items-center gap-1.5 sm:gap-2 border border-[var(--sidebar-border)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                View Docs
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-1 md:col-span-2 bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-md sm:rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                                    <svg className="w-12 h-12 text-[var(--color-text-muted)]/20 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                    <h3 className="text-lg font-bold text-[var(--header-text)] mb-1">No certificates found</h3>
                                    <p className="text-sm text-[var(--color-text-muted)]">Your digital ownership certificates will appear here once issued.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Referrals" && (
                        <div className="bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 max-w-[900px] shadow-sm">
                            <h2 className="text-base sm:text-[22px] font-bold text-[var(--header-text)] mb-1">Invite & Earn</h2>
                            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-5 sm:mb-8 font-medium">Earn ₹250 for every referred investor</p>

                            <div className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-2xl p-3 sm:p-4 mb-5 sm:mb-8 w-full max-w-[840px] space-y-3 shadow-inner">
                                <div className="flex items-center bg-[var(--background)] border border-[var(--sidebar-border)] rounded-xl px-3.5 py-2.5 gap-2.5">
                                    <svg className="w-4 h-4 text-[var(--color-primary-300)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    <input
                                        readOnly
                                        value={profileData?.referralCode ? getShareUrl() : "Not available"}
                                        className="flex-1 min-w-0 bg-transparent border-0 text-[var(--color-text-muted)] text-xs sm:text-sm font-mono focus:outline-none placeholder-[var(--color-text-muted)]/20 select-all truncate"
                                    />
                                </div>

                                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5 sm:gap-3">
                                    <button
                                        onClick={handleCopyLink}
                                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border active:scale-95 ${copiedLink ? 'bg-[var(--color-primary-700)] text-white border-transparent' : 'bg-[var(--background)] text-[var(--header-text)] border-[var(--sidebar-border)] hover:border-[var(--color-primary-300)] hover:bg-[var(--card-surface)]'}`}
                                        title="Copy registration link only"
                                    >
                                        {copiedLink ? (
                                            <>
                                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                <span>Copied Link</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                <span>Copy Link</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setIsShareModalOpen(true)}
                                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-glow-primary cursor-pointer border-0 bg-[var(--color-primary-300)] text-black hover:opacity-95 active:scale-95"
                                        title="Open share options"
                                    >
                                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                                        <span>Share Invite</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">

                                <div className="relative group bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-[16px] p-3 sm:p-4 lg:p-5 hover:border-[var(--sidebar-active-text)]/30 transition-all cursor-default shadow-sm flex flex-col justify-between" title="Referrals">
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-white text-[10px] font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-30 whitespace-nowrap">
                                        Referrals
                                    </div>
                                    <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
                                        <p className="text-[9px] sm:text-[11px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider truncate">REFERRALS</p>
                                        <div className="shrink-0 text-[var(--sidebar-active-text)] w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center bg-[var(--sidebar-active-text)]/10 rounded-full group-hover:scale-110 transition-transform">
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                        </div>
                                    </div>
                                    <p className="text-xl sm:text-2xl lg:text-[28px] font-black text-[var(--header-text)] leading-none">{profileData?.referralsCount || 0}</p>
                                </div>

                                <div className="relative group bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-[16px] p-3 sm:p-4 lg:p-5 hover:border-[var(--sidebar-active-text)]/30 transition-all cursor-default shadow-sm flex flex-col justify-between" title="Converted">
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-white text-[10px] font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-30 whitespace-nowrap">
                                        Converted
                                    </div>
                                    <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
                                        <p className="text-[9px] sm:text-[11px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider truncate">CONVERTED</p>
                                        <div className="shrink-0 text-[var(--sidebar-active-text)] w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center bg-[var(--sidebar-active-text)]/10 rounded-full group-hover:scale-110 transition-transform">
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    </div>
                                    <p className="text-xl sm:text-2xl lg:text-[28px] font-black text-[var(--header-text)] leading-none">{profileData?.convertedCount || 0}</p>
                                </div>

                                <div className="relative group bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-xl sm:rounded-[16px] p-3 sm:p-4 lg:p-5 hover:border-[var(--sidebar-active-text)]/30 transition-all cursor-default shadow-sm flex flex-col justify-between" title="Earned">
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-white text-[10px] font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-30 whitespace-nowrap">
                                        Earned
                                    </div>
                                    <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-3">
                                        <p className="text-[9px] sm:text-[11px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider truncate">EARNED</p>
                                        <div className="shrink-0 text-[var(--sidebar-active-text)] w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center bg-[var(--sidebar-active-text)]/10 rounded-full group-hover:scale-110 transition-transform">
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                                        </div>
                                    </div>
                                    <p className="text-xl sm:text-2xl lg:text-[28px] font-black text-[var(--header-text)] leading-none">{profileData?.referralEarnings || 0}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Support" && (
                        <div className="max-w-[980px]">
                            <SupportTicketComposer
                                key={profileData?.email || "investor-support"}
                                title="Need Help?"
                                subtitle="Raise a support request from your investor account."
                                description="Use this form for account issues, investment help, payment questions, or technical problems."
                                defaultEmail={profileData?.email || ""}
                                compact
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {isShareModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsShareModalOpen(false)}
                            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10 w-full max-w-lg bg-[var(--card-surface)] border border-[var(--sidebar-border)] rounded-2xl shadow-2xl p-5 sm:p-7 overflow-hidden text-[var(--sidebar-text)] max-h-[90vh] flex flex-col"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-[var(--sidebar-border)]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-300)]/20 flex items-center justify-center text-[var(--color-primary-300)]">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-[var(--header-text)]">Invite Friends & Earn</h3>
                                        <p className="text-[11px] sm:text-xs text-[var(--color-text-muted)]">Earn ₹250 for every referred investor</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-border)] transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <div className="py-4 space-y-4 overflow-y-auto pr-1">
                                <div className="relative overflow-hidden bg-gradient-to-r from-[var(--field-surface)] via-[var(--card-surface)] to-[var(--field-surface)] border border-[var(--sidebar-border)] hover:border-[var(--color-primary-300)]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 shadow-sm transition-all group">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--color-primary-300)]/10 rounded-full blur-2xl pointer-events-none" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-300)] animate-pulse" />
                                            <p className="text-[10px] sm:text-[11px] uppercase font-bold text-[var(--color-text-muted)] tracking-[1.5px] whitespace-nowrap">Your Referral Code</p>
                                        </div>
                                        <p className="text-xl sm:text-2xl font-black font-mono text-[var(--color-primary-300)] tracking-[2px] sm:tracking-[3px] select-all whitespace-nowrap drop-shadow-sm">
                                            {profileData?.referralCode || "N/A"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        className={`w-full sm:w-auto whitespace-nowrap shrink-0 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer border ${copiedCode ? 'bg-[var(--color-primary-700)] text-white border-transparent scale-105 shadow-md' : 'bg-[var(--background)] text-[var(--header-text)] border-[var(--sidebar-border)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-300)] hover:text-black hover:shadow-glow-primary active:scale-95'}`}
                                    >
                                        {copiedCode ? (
                                            <>
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Message Preview</p>
                                        <button
                                            onClick={handleCopyMessage}
                                            className="text-[11px] font-bold text-[var(--color-primary-300)] hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            {copiedMessage ? (
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            ) : (
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            )}
                                            {copiedMessage ? "Message Copied!" : "Copy Full Message"}
                                        </button>
                                    </div>
                                    <div className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-xl p-3.5 text-xs text-[var(--header-text)] whitespace-pre-line font-sans leading-relaxed text-[var(--sidebar-text)]/90">
                                        {getShareMessage()}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2.5">Share Directly to</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                                        <button
                                            onClick={shareOnWhatsApp}
                                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--field-surface)] hover:bg-[#25D366]/10 border border-[var(--sidebar-border)] hover:border-[#25D366]/40 text-[var(--header-text)] text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-sm group"
                                        >
                                            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none">
                                                <circle cx="16" cy="16" r="16" fill="#25D366" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M16 5C9.925 5 5 9.925 5 16c0 1.942.505 3.832 1.464 5.495L5.071 27.07l5.728-1.503A10.94 10.94 0 0016 27c6.075 0 11-4.925 11-11S22.075 5 16 5zm5.083 11.675c-.279-.14-1.65-.814-1.906-.907-.255-.093-.441-.14-.627.14-.186.279-.721.907-.884 1.093-.163.186-.326.21-.605.07-.279-.14-1.178-.434-2.245-1.385-.83-.74-1.39-1.654-1.553-1.933-.163-.279-.017-.43.122-.569.126-.125.279-.326.419-.489.14-.163.186-.279.279-.465.093-.186.047-.349-.023-.489-.07-.14-.627-1.512-.86-2.07-.226-.544-.456-.47-.627-.479h-.535c-.186 0-.489.07-.744.349-.256.279-.977.954-.977 2.326s1 2.698 1.14 2.884c.14.186 1.968 3.006 4.768 4.215.666.288 1.186.46 1.591.589.669.212 1.278.182 1.76.11.537-.08 1.65-.674 1.883-1.325.233-.652.233-1.21.163-1.326-.07-.116-.256-.186-.535-.326z" fill="#ffffff" />
                                            </svg>
                                            <span className="truncate">WhatsApp</span>
                                        </button>

                                        <button
                                            onClick={shareOnTelegram}
                                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--field-surface)] hover:bg-[#229ED9]/10 border border-[var(--sidebar-border)] hover:border-[#229ED9]/40 text-[var(--header-text)] text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-sm group"
                                        >
                                            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none">
                                                <circle cx="16" cy="16" r="16" fill="#29B6F6" />
                                                <path d="M23 9.5L6.5 15.85c-.55.22-.55.55-.1.72l4.23 1.32 9.8-6.18c.46-.28.89-.13.54.18L13.03 19.1l-.31 4.45c.44 0 .63-.2.87-.44l2.1-2.03 4.36 3.22c.8.44 1.37.21 1.57-.74l2.86-13.48c.29-1.17-.44-1.7-1.48-.58z" fill="#ffffff" />
                                            </svg>
                                            <span className="truncate">Telegram</span>
                                        </button>

                                        <button
                                            onClick={shareOnTwitter}
                                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--field-surface)] hover:bg-neutral-800/40 border border-[var(--sidebar-border)] hover:border-neutral-500/40 text-[var(--header-text)] text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-sm group"
                                        >
                                            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none">
                                                <rect width="32" height="32" rx="8" fill="#000000" />
                                                <path d="M21.87 8h2.33l-5.1 5.83 6 7.93h-4.7l-3.68-4.81-4.21 4.81H10.16l5.46-6.24-5.74-7.52h4.82l3.33 4.41L21.87 8zm-.82 12.35h1.29L13.72 9.3h-1.38l8.71 11.05z" fill="#ffffff" />
                                            </svg>
                                            <span className="truncate">X</span>
                                        </button>

                                        <button
                                            onClick={shareViaEmail}
                                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--field-surface)] hover:bg-[#EA4335]/10 border border-[var(--sidebar-border)] hover:border-[#EA4335]/40 text-[var(--header-text)] text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-sm group"
                                        >
                                            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none">
                                                <rect width="32" height="32" rx="8" fill="#EA4335" />
                                                <rect x="6.5" y="9.5" width="19" height="13" rx="2" fill="#ffffff" />
                                                <path d="M7 10.5L16 17L25 10.5" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="truncate">Email</span>
                                        </button>

                                        <button
                                            onClick={shareOnLinkedIn}
                                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--field-surface)] hover:bg-[#0A66C2]/10 border border-[var(--sidebar-border)] hover:border-[#0A66C2]/40 text-[var(--header-text)] text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-sm group"
                                        >
                                            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none">
                                                <rect width="32" height="32" rx="8" fill="#0A66C2" />
                                                <path d="M12 14v8h-2.5V14H12zm-1.25-4c.8 0 1.45.65 1.45 1.45s-.65 1.45-1.45 1.45S9.3 12.25 9.3 11.45 9.95 10 10.75 10zM22.5 17.5v4.5H20v-4.2c0-1-.35-1.7-1.3-1.7-.75 0-1.2.5-1.4 1-.07.18-.08.43-.08.68V22h-2.5s.03-7.2 0-8h2.5v1.15c.33-.5.92-1.25 2.22-1.25 1.62 0 2.84 1.06 2.84 3.35z" fill="#ffffff" />
                                            </svg>
                                            <span className="truncate">LinkedIn</span>
                                        </button>

                                        <button
                                            onClick={handleNativeShare}
                                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--field-surface)] hover:bg-[var(--color-primary-300)]/10 border border-[var(--sidebar-border)] hover:border-[var(--color-primary-300)]/40 text-[var(--header-text)] text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer shadow-sm group"
                                        >
                                            <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 32 32" fill="none">
                                                <defs>
                                                    <linearGradient id="sysShareBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#10B981" />
                                                        <stop offset="100%" stopColor="#06B6D4" />
                                                    </linearGradient>
                                                </defs>
                                                <rect width="32" height="32" rx="8" fill="url(#sysShareBadgeGrad)" />
                                                <circle cx="21" cy="11" r="2.5" fill="#ffffff" />
                                                <circle cx="11" cy="16" r="2.5" fill="#ffffff" />
                                                <circle cx="21" cy="21" r="2.5" fill="#ffffff" />
                                                <line x1="13.2" y1="14.8" x2="18.8" y2="12.2" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                                                <line x1="13.2" y1="17.2" x2="18.8" y2="19.8" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                                            </svg>
                                            <span className="truncate">Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[var(--sidebar-border)] flex items-center justify-end">
                                <button
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--header-text)] hover:bg-[var(--sidebar-border)]/30 transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
