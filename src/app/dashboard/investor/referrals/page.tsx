"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetInvestorReferralQuery,
  useGetInvestorReferralsQuery,
  useGetInvestorReferralSummaryQuery,
} from "@/store/api/investorReferralApi";
import {
  CopyIcon,
  ShareIcon,
  UserGroupIcon,
  DollarIcon,
  SparkleIcon,
  LoadingSpinner,
  ArrowRightIcon,
} from "@/components/VectorImages";

function formatMoney(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InvestorReferralsPage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const {
    data: referralInfo,
    isLoading: isInfoLoading,
    error: infoError,
  } = useGetInvestorReferralQuery();

  const {
    data: referralsData,
    isLoading: isReferralsLoading,
    error: referralsError,
  } = useGetInvestorReferralsQuery();

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
  } = useGetInvestorReferralSummaryQuery();

  const referralCode = referralInfo?.referralCode;
  const referralLink =
    referralInfo?.referralLink ||
    (referralCode ? `https://www.glofiestate.com/sign-up?referralCode=${referralCode}` : "");

  const programActive = referralInfo?.programActive ?? true;
  const reward = referralInfo?.reward;
  const rewardPercentage = reward?.percentage ?? 2.5;

  const totalReferred = summaryData?.totalReferred ?? referralsData?.total ?? 0;
  const totalInvested = summaryData?.totalInvested ?? 0;
  const totalEarned = summaryData?.totalEarned ?? 0;

  const referralsList = referralsData?.data ?? [];

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const shareText = `Hey! Invest in vetted, high-yield institutional real estate with me on Glofi Estate. Sign up with my referral code ${referralCode || ""} or use this link: ${referralLink}`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: "Invest in Real Estate with Glofi Estate",
          text: shareText,
          url: referralLink,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };


  const isAuthError =
    (infoError as any)?.status === 401 || (infoError as any)?.status === 403;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[var(--background)] min-h-screen text-[var(--sidebar-text)]">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-emerald-400 bg-emerald-500/10">
                Investor Program
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--header-text)]">
              Refer &amp; Earn
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
              Invite friends and investors to Glofi Estate. Share your exclusive code and earn rewards when they invest.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Auth Error Banner if user is not investor / not logged in */}
      {isAuthError && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          <p className="font-semibold">Investor Access Required</p>
          <p className="text-xs text-amber-300/80 mt-1">
            Please make sure you are signed in with an active Investor account to access your personalized referral links and earn rewards.
          </p>
        </div>
      )}

      {programActive && !isAuthError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-[var(--color-primary-300)]/30 bg-gradient-to-r from-[var(--color-primary-500)]/10 via-[var(--card-surface)] to-[var(--background)] p-5 sm:p-6 shadow-sm relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[var(--color-primary-300)]/20 text-[var(--color-primary-300)] flex items-center justify-center shrink-0">
                <SparkleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                    Earn {reward?.flatAmount ? formatMoney(reward.flatAmount) : `${rewardPercentage}%`} Reward
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Live Campaign
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 max-w-xl leading-relaxed">
                  Earn {reward?.flatAmount ? formatMoney(reward.flatAmount) : `${rewardPercentage}%`} of the investment amount directly credited to your wallet for every referred investor who completes their investment.
                  {reward?.minimumInvestment ? ` Min. investment: ${formatMoney(reward.minimumInvestment)}.` : ""}
                </p>
              </div>
            </div>

            <button
              onClick={handleNativeShare}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary-300)] text-black font-bold text-xs uppercase tracking-wider border-0 shadow-glow-primary hover:opacity-95 transition-all shrink-0 cursor-pointer"
            >
              <ShareIcon className="h-4 w-4" />
              <span>Share Invite</span>
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Total Referred
            </p>
            <span className="rounded-lg bg-[var(--sidebar-active-bg)] p-2 text-[var(--sidebar-active-text)]">
              <UserGroupIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[var(--foreground)] font-montserrat">
            {isSummaryLoading || isReferralsLoading ? "—" : totalReferred}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Users registered with your code</p>
        </div>

        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Total Invested
            </p>
            <span className="rounded-lg bg-[var(--sidebar-active-bg)] p-2 text-emerald-400">
              <DollarIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[var(--foreground)] font-montserrat">
            {isSummaryLoading || isReferralsLoading ? "—" : totalInvested}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Completed active investments</p>
        </div>

        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Total Earned
            </p>
            <span className="rounded-lg bg-[var(--sidebar-active-bg)] p-2 text-[var(--color-primary-300)]">
              <SparkleIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[var(--foreground)] font-montserrat">
            {isSummaryLoading ? "—" : formatMoney(totalEarned)}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Credited to your wallet balance</p>
        </div>
      </div>

      {/* Referral Link & Code Section */}
      <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] p-5 sm:p-6 mb-8 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-[var(--foreground)]">Your Exclusive Referral Link</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Share this link or your referral code. The signup page will automatically capture and attribute your referral.
          </p>
        </div>

        {isInfoLoading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
            <LoadingSpinner />
            <span>Loading referral details...</span>
          </div>
        ) : !referralCode ? (
          <div className="rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-5 text-center text-sm text-[var(--color-text-muted)]">
            <p className="font-semibold text-[var(--foreground)]">Referral code not available</p>
            <p className="text-xs mt-1">
              Your account does not have a referral code assigned yet. Please contact support to generate an active code.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Code Box */}
              <div className="md:col-span-1 rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-3.5 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Referral Code
                </span>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-lg font-black tracking-widest text-[var(--foreground)] font-mono">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--sidebar-active-bg)] hover:bg-[var(--sidebar-border)] text-xs font-semibold text-[var(--foreground)] transition-colors border border-[var(--sidebar-border)] cursor-pointer"
                  >
                    <CopyIcon className="h-3.5 w-3.5" />
                    <span>{copiedCode ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-[var(--sidebar-border)] bg-[var(--background)] p-3.5 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Shareable Link
                </span>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-xs font-medium text-[var(--foreground)] truncate font-mono select-all">
                    {referralLink}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--color-primary-300)] text-black text-xs font-bold uppercase tracking-wider border-0 shadow-sm hover:opacity-90 transition-all shrink-0 cursor-pointer"
                  >
                    <CopyIcon className="h-3.5 w-3.5" />
                    <span>{copiedLink ? "Copied Link!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[var(--color-text-muted)] font-medium mr-1">Share via:</span>
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 transition-colors cursor-pointer text-xs font-semibold"
              >
                WhatsApp
              </button>
              <button
                onClick={handleShareTwitter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] hover:bg-[var(--sidebar-border)] transition-colors cursor-pointer text-xs font-semibold"
              >
                X / Twitter
              </button>
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sidebar-border)] bg-[var(--background)] hover:bg-[var(--sidebar-border)] transition-colors cursor-pointer text-xs font-semibold"
              >
                <ShareIcon className="h-3.5 w-3.5" />
                More options
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Referred People List */}
      <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card-surface)] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--sidebar-border)] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">Referred People</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Live status of users who joined with your referral link.
            </p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--background)] px-2.5 py-1 rounded-full border border-[var(--sidebar-border)]">
            Total: {referralsList.length}
          </span>
        </div>

        {isReferralsLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <LoadingSpinner />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">Loading your referral list...</p>
          </div>
        ) : referralsError ? (
          <div className="p-8 text-center text-xs text-red-400">
            Failed to load referred people. Please refresh or try again later.
          </div>
        ) : referralsList.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-[var(--sidebar-active-bg)] flex items-center justify-center text-[var(--color-text-muted)] mb-3">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)]">No referrals yet</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm">
              Share your referral code or link with your friends. As soon as they register, they will appear here.
            </p>
            {referralLink && (
              <button
                onClick={handleCopyLink}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-primary-300)] text-black text-xs font-bold uppercase tracking-wider border-0 shadow-sm hover:opacity-90 transition-all cursor-pointer"
              >
                <CopyIcon className="h-3.5 w-3.5" />
                <span>{copiedLink ? "Copied Link!" : "Copy Invite Link"}</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[var(--sidebar-border)] bg-[var(--background)]/50 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-5 py-3.5">Referred User</th>
                    <th className="px-5 py-3.5">Joined Date</th>
                    <th className="px-5 py-3.5">Investment Status</th>
                    <th className="px-5 py-3.5 text-right">Reward Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--sidebar-border)] font-medium">
                  {referralsList.map((ref) => {
                    const hasInvested = Boolean(ref.hasInvested);
                    const rewardPaid = Boolean(ref.rewardPaid);
                    const rewardAmount = ref.rewardAmount;

                    return (
                      <tr
                        key={ref.id}
                        className="hover:bg-[var(--sidebar-active-bg)]/50 transition-colors"
                      >
                        <td className="px-5 py-4 text-[var(--foreground)] font-semibold">
                          {ref.name || "Anonymous Investor"}
                        </td>
                        <td className="px-5 py-4 text-xs text-[var(--color-text-muted)] font-mono">
                          {formatDate(ref.joinedAt)}
                        </td>
                        <td className="px-5 py-4">
                          {hasInvested ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>Invested</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-text-muted)] bg-[var(--background)] border border-[var(--sidebar-border)] px-2.5 py-1 rounded-full">
                              <span>Joined</span>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {hasInvested && rewardPaid ? (
                            <div className="inline-flex flex-col items-end">
                              <span className="text-xs font-bold text-emerald-400">
                                +{formatMoney(rewardAmount)}
                              </span>
                              <span className="text-[10px] text-emerald-400/80 uppercase font-semibold">
                                Credited {formatDate(ref.rewardPaidAt || ref.investedAt)}
                              </span>
                            </div>
                          ) : hasInvested && !rewardPaid ? (
                            <span className="text-xs text-[var(--color-text-muted)]">
                              Invested (No Campaign)
                            </span>
                          ) : (
                            <span className="text-xs text-[var(--color-text-muted)]">
                              Pending Investment
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[var(--sidebar-border)]">
              {referralsList.map((ref) => {
                const hasInvested = Boolean(ref.hasInvested);
                const rewardPaid = Boolean(ref.rewardPaid);
                const rewardAmount = ref.rewardAmount;

                return (
                  <div key={ref.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[var(--foreground)]">
                          {ref.name || "Anonymous Investor"}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          Joined {formatDate(ref.joinedAt)}
                        </p>
                      </div>

                      {hasInvested ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Invested
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] bg-[var(--background)] border border-[var(--sidebar-border)] px-2 py-0.5 rounded-full">
                          Joined
                        </span>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs border-t border-[var(--sidebar-border)]/50 mt-2">
                      <span className="text-[var(--color-text-muted)]">Reward:</span>
                      {hasInvested && rewardPaid ? (
                        <span className="font-bold text-emerald-400">
                          +{formatMoney(rewardAmount)} (Credited)
                        </span>
                      ) : hasInvested ? (
                        <span className="text-[var(--color-text-muted)]">Invested</span>
                      ) : (
                        <span className="text-[var(--color-text-muted)]">Awaiting Investment</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
