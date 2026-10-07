import { type SaleType } from '@/utils/assetUtils';

export interface PartnerProfile {
  fullName?: string;
  avatarUrl?: string;
  companyName?: string;
}

export interface AssetPartner {
  id: string;
  partnerProfile: PartnerProfile | null;
}

export interface WishlistAsset {
  id: string;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  valuation?: number | string;
  fractionPrice?: number | string;
  totalFractions?: number;
  availableFractions?: number;
  expectedYield?: number | string;
  expectedAnnualRent?: number | string;
  rentalGrowthRate?: number | string;
  expectedAppreciationRate?: number | string;
  operatingCostRate?: number | string;
  riskRating?: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  saleType?: SaleType;
  status?: string;
  images?: string[];
  partner?: AssetPartner | null;
  wishlistedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface WishlistResponse {
  data: WishlistAsset[];
  total: number;
  page: number;
  limit: number;
}

export interface WishlistQueryParams {
  page?: number;
  limit?: number;
  saleType?: SaleType;
  category?: string;
}

export interface WishlistMutationResponse {
  message: string;
}
