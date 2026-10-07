"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/store/api/assetApi";
import { getCookie } from "@/utils/cookieUtils";

interface WishlistContextType {
  wishlistIds: Set<string>;
  isInWishlist: (assetId: string | number) => boolean;
  toggleWishlist: (assetId: string | number, assetTitle?: string) => Promise<boolean>;
  addToWishlist: (assetId: string | number, assetTitle?: string) => Promise<boolean>;
  removeFromWishlist: (assetId: string | number, assetTitle?: string) => Promise<boolean>;
  isLoggedInInvestor: boolean;
  wishlistCount: number;
  isSyncing: boolean;
  refetchWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set<string>(),
  isInWishlist: () => false,
  toggleWishlist: async () => false,
  addToWishlist: async () => false,
  removeFromWishlist: async () => false,
  isLoggedInInvestor: false,
  wishlistCount: 0,
  isSyncing: false,
  refetchWishlist: () => { },
});

export const useWishlist = () => useContext(WishlistContext);

function notifyToast(message: string, type: "success" | "error" | "warning" = "success") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: { message, type },
      })
    );
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const [isClient, setIsClient] = useState(false);
  const [isLoggedInInvestor, setIsLoggedInInvestor] = useState(() => pathname.startsWith("/dashboard/investor"));
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const checkInvestorStatus = useCallback(() => {
    if (typeof window === "undefined") return false;

    // Reject non-investor dashboard routes explicitly
    if (
      pathname.startsWith("/dashboard/partner") ||
      pathname.startsWith("/dashboard/agent") ||
      pathname.startsWith("/dashboard/admin")
    ) {
      return false;
    }

    const storedRole = (localStorage.getItem("userType") || "").toUpperCase();
    if (
      storedRole === "PARTNER" ||
      storedRole === "DEVELOPER" ||
      storedRole === "AGENT" ||
      storedRole === "ADMIN"
    ) {
      return false;
    }

    // If currently on any investor dashboard route, definitely logged in as investor
    if (pathname.startsWith("/dashboard/investor")) {
      return true;
    }

    // For public routes (like /explore, /, etc.), check login signals
    const token = getCookie("access_token") || localStorage.getItem("access_token") || localStorage.getItem("token");
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      getCookie("isLoggedIn") === "true" ||
      Boolean(token) ||
      storedRole === "INVESTOR";

    if (!isLoggedIn) return false;

    return storedRole === "INVESTOR" || !storedRole;
  }, [pathname]);

  useEffect(() => {
    setIsClient(true);
    setIsLoggedInInvestor(checkInvestorStatus());
  }, [checkInvestorStatus]);

  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = () => {
      setIsLoggedInInvestor(checkInvestorStatus());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isClient, checkInvestorStatus]);


  const {
    data: wishlistData,
    isLoading: isWishlistLoading,
    isFetching: isWishlistFetching,
    refetch: refetchWishlistApi,
  } = useGetWishlistQuery(
    { limit: 100, page: 1 },
    {
      skip: !isLoggedInInvestor,
      refetchOnMountOrArgChange: true,
    }
  );

  const [addMutation] = useAddToWishlistMutation();
  const [removeMutation] = useRemoveFromWishlistMutation();


  useEffect(() => {
    if (!isLoggedInInvestor) {
      setWishlistIds(new Set());
      return;
    }

    if (wishlistData) {
      const rawList: any[] = Array.isArray(wishlistData)
        ? wishlistData
        : Array.isArray(wishlistData.data)
          ? wishlistData.data
          : [];

      const ids = new Set<string>();
      rawList.forEach((item: any) => {
        const id = item?.id ?? item?.assetId;
        if (id != null) {
          ids.add(String(id));
        }
      });
      setWishlistIds(ids);
    }
  }, [wishlistData, isLoggedInInvestor]);


  useEffect(() => {
    if (!isLoggedInInvestor) return;

    const handleResume = () => {
      if (document.visibilityState === "visible") {
        refetchWishlistApi();
      }
    };

    const handleFocus = () => {
      refetchWishlistApi();
    };

    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isLoggedInInvestor, refetchWishlistApi]);

  const isInWishlist = useCallback(
    (assetId: string | number) => {
      if (!isLoggedInInvestor || assetId == null) return false;
      return wishlistIds.has(String(assetId));
    },
    [isLoggedInInvestor, wishlistIds]
  );


  const addToWishlist = useCallback(
    async (assetId: string | number, assetTitle?: string): Promise<boolean> => {
      if (!isLoggedInInvestor) {
        notifyToast("Please log in as an investor to bookmark properties", "warning");
        return false;
      }

      const idStr = String(assetId);
      if (wishlistIds.has(idStr)) return true;

      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.add(idStr);
        return next;
      });

      try {
        await addMutation(assetId).unwrap();
        notifyToast(assetTitle ? `Saved "${assetTitle}" to wishlist` : "Asset added to wishlist", "success");
        return true;
      } catch (err: any) {

        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(idStr);
          return next;
        });
        const errMsg = err?.data?.message || err?.message || "Failed to add asset to wishlist.";
        notifyToast(errMsg, "error");
        return false;
      }
    },
    [isLoggedInInvestor, wishlistIds, addMutation]
  );


  const removeFromWishlist = useCallback(
    async (assetId: string | number, assetTitle?: string): Promise<boolean> => {
      if (!isLoggedInInvestor) return false;

      const idStr = String(assetId);
      if (!wishlistIds.has(idStr)) return true;


      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(idStr);
        return next;
      });

      try {
        await removeMutation(assetId).unwrap();
        notifyToast(assetTitle ? `Removed "${assetTitle}" from wishlist` : "Asset removed from wishlist", "success");
        return true;
      } catch (err: any) {

        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.add(idStr);
          return next;
        });
        const errMsg = err?.data?.message || err?.message || "Failed to remove asset from wishlist.";
        notifyToast(errMsg, "error");
        return false;
      }
    },
    [isLoggedInInvestor, wishlistIds, removeMutation]
  );


  const toggleWishlist = useCallback(
    async (assetId: string | number, assetTitle?: string): Promise<boolean> => {
      if (!isLoggedInInvestor) {
        notifyToast("Please log in as an investor to save properties", "warning");
        return false;
      }

      const idStr = String(assetId);
      const isCurrentlyWishlisted = wishlistIds.has(idStr);

      if (isCurrentlyWishlisted) {
        return await removeFromWishlist(assetId, assetTitle);
      } else {
        return await addToWishlist(assetId, assetTitle);
      }
    },
    [isLoggedInInvestor, wishlistIds, addToWishlist, removeFromWishlist]
  );

  const contextValue = useMemo(
    () => ({
      wishlistIds,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      isLoggedInInvestor,
      wishlistCount: wishlistIds.size,
      isSyncing: isWishlistLoading || isWishlistFetching,
      refetchWishlist: refetchWishlistApi,
    }),
    [
      wishlistIds,
      isInWishlist,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      isLoggedInInvestor,
      isWishlistLoading,
      isWishlistFetching,
      refetchWishlistApi,
    ]
  );

  return <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>;
}
