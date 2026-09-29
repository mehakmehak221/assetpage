import { baseApi } from "./baseApi";
import {
  InvestorReferralInfo,
  InvestorReferralsResponse,
  InvestorReferralSummary,
  WalletBalanceResponse,
  WalletTransactionItem,
} from "@/types/investorReferral";

export const investorReferralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /investor/referral
    getInvestorReferral: builder.query<InvestorReferralInfo, void>({
      query: () => ({
        url: "investor/referral",
        method: "GET",
      }),
      providesTags: ["InvestorReferral"],
    }),

    // GET /investor/referral/referrals
    getInvestorReferrals: builder.query<InvestorReferralsResponse, void>({
      query: () => ({
        url: "investor/referral/referrals",
        method: "GET",
      }),
      providesTags: ["InvestorReferral"],
    }),

    // GET /investor/referral/summary
    getInvestorReferralSummary: builder.query<InvestorReferralSummary, void>({
      query: () => ({
        url: "investor/referral/summary",
        method: "GET",
      }),
      providesTags: ["InvestorReferral"],
    }),

    // GET /wallet
    getWallet: builder.query<WalletBalanceResponse, void>({
      query: () => ({
        url: "wallet",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),

    // GET /wallet/transactions
    getWalletTransactions: builder.query<WalletTransactionItem[], void>({
      query: () => ({
        url: "wallet/transactions",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),

    // POST /wallet/withdraw
    withdrawWallet: builder.mutation<
      { success: boolean; message?: string; transactionId?: string },
      { amount: number; bankAccountId?: string }
    >({
      query: (body) => ({
        url: "wallet/withdraw",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "InvestorReferral"],
    }),
  }),
});

export const {
  useGetInvestorReferralQuery,
  useGetInvestorReferralsQuery,
  useGetInvestorReferralSummaryQuery,
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useWithdrawWalletMutation,
} = investorReferralApi;
