export interface ListingRequestOption {
  value: string;
  label: string;
  description?: string;
}

export interface ListingRequestOptionsResponse {
  ownerTypes: ListingRequestOption[];
  categories: ListingRequestOption[];
  constructionStatuses: ListingRequestOption[];
  listingPreferences: ListingRequestOption[];
}

export interface CreateListingRequestDto {
  fullName: string;
  phone: string;
  email: string;
  ownerType: string;
  referredBy?: string;
  category: string;
  constructionStatus: string;
  streetAddress: string;
  city: string;
  state: string;
  expectedPrice?: number | string;
  listingPreference?: string;
}

export interface CreateListingRequestResponse {
  message: string;
  referenceNo: string;
  status: string;
  createdAt: string;
}

export type ListingRequestStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'UNDER_EVALUATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'CONVERTED';

export interface ListingRequestItem {
  id: string;
  referenceNo: string;
  ownerName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  ownerType?: string;
  referredBy?: string | null;
  category: string;
  constructionStatus?: string;
  streetAddress?: string;
  city: string;
  state: string;
  expectedPrice?: string | number | null;
  listingPreference?: string | null;
  status: ListingRequestStatus | string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface MyListingRequestsParams {
  page?: number;
  limit?: number;
}

export interface MyListingRequestsResponse {
  data: ListingRequestItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const LISTING_STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string }
> = {
  NEW: {
    label: 'Submitted',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  CONTACTED: {
    label: 'Under review',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  UNDER_EVALUATION: {
    label: 'Under review',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  APPROVED: {
    label: 'Approved',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  CONVERTED: {
    label: 'Listed',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
  },
};
