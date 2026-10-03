"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useWishlist } from "@/providers/WishlistProvider";

interface WishlistHeartButtonProps {
  assetId: string | number;
  assetTitle?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
  className?: string;
}

export const HeartIcon = ({
  filled = false,
  className = "w-4 h-4",
}: {
  filled?: boolean;
  className?: string;
}) => {
  if (filled) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="#FF4D6D"
        stroke="#FF4D6D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
};

export const SavedPropertiesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function WishlistHeartButton({
  assetId,
  assetTitle,
  size = "md",
  variant = "icon",
  className = "",
}: WishlistHeartButtonProps) {
  const pathname = usePathname() || "";
  const { isInWishlist, toggleWishlist, isLoggedInInvestor } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isInvestorDashboard = pathname.startsWith("/dashboard/investor");
  const isVisible = isInvestorDashboard || isLoggedInInvestor;

  // Requirement: Show the heart icon only to logged-in investors. Hide it for guests, partners, agents and admins.
  if (mounted && !isVisible) {
    return null;
  }

  const wishlisted = isInWishlist(assetId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;
    setIsToggling(true);
    try {
      await toggleWishlist(assetId, assetTitle);
    } finally {
      setIsToggling(false);
    }
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "button") {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        onClick={handleClick}
        disabled={isToggling}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm border ${
          wishlisted
            ? "bg-[#FF4D6D]/15 border-[#FF4D6D]/40 text-[#FF4D6D] hover:bg-[#FF4D6D]/25"
            : "bg-[var(--sidebar-bg)] border-[var(--sidebar-border)] text-[var(--header-text)] hover:bg-[var(--card-surface)]"
        } ${className}`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        title={wishlisted ? "Remove from saved properties" : "Save property to wishlist"}
      >
        <motion.div
          animate={wishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <HeartIcon
            filled={wishlisted}
            className={`${iconSizes[size]} ${
              wishlisted ? "text-[#FF4D6D]" : "text-[var(--sidebar-active-text)]"
            }`}
          />
        </motion.div>
        <span className="text-sm font-semibold">
          {wishlisted ? "Saved" : "Save"}
        </span>
      </motion.button>
    );
  }

  const buttonDimensions = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={handleClick}
      disabled={isToggling}
      className={`rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer pointer-events-auto backdrop-blur-md shadow-md border ${
        wishlisted
          ? "bg-black/75 text-[#FF4D6D] border-[#FF4D6D]/50 hover:bg-black/90 shadow-[0_0_12px_rgba(255,77,109,0.35)]"
          : "bg-black/60 text-white border-white/20 hover:bg-black/80 hover:text-[#FF4D6D] hover:border-[#FF4D6D]/40"
      } ${buttonDimensions[size]} ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={wishlisted ? "Remove from saved properties" : "Save property to wishlist"}
    >
      <motion.div
        animate={wishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <HeartIcon
          filled={wishlisted}
          className={`${iconSizes[size]} transition-colors`}
        />
      </motion.div>
    </motion.button>
  );
}
