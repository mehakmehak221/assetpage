export interface InvestorReferralRewardConfig {
  percentage?: number | null;
  flatAmount?: number | null;
  minimumInvestment?: number | null;
  maximumReward?: number | null;
  endsAt?: string | null;
}

export interface InvestorReferralInfo {
  referralCode?: string | null;
  referralLink?: string | null;
  programActive: boolean;
  reward?: InvestorReferralRewardConfig | null;
}

export interface InvestorReferredUser {
  id: string;
  name: string;
  joinedAt: string;
  hasInvested: boolean;
  investedAt?: string | null;
  rewardPaid: boolean;
  rewardAmount?: number | null;
  rewardPaidAt?: string | null;
}

export interface InvestorReferralsResponse {
  data: InvestorReferredUser[];
  total: number;
}

export interface InvestorReferralSummary {
  totalReferred: number;
  totalInvested: number;
  totalEarned: number;
}

export interface WalletBalanceResponse {
  balance?: number;
  currency?: string;
  lockedBalance?: number;
  availableBalance?: number;
  totalEarned?: number;
  [key: string]: any;
}

export interface WalletTransactionItem {
  id: string;
  type: string; // e.g. "REFERRAL_REWARD", "INVESTMENT", "WITHDRAWAL", "DEPOSIT"
  amount: number;
  currency?: string;
  status: string; // "COMPLETED", "PENDING", "FAILED"
  description?: string;
  createdAt: string;
  referenceId?: string;
  [key: string]: any;
}
