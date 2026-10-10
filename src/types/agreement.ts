export type AgreementStatus = 'GENERATED' | 'SIGNED' | 'EXPIRED';

export interface AgreementAsset {
  id?: string;
  title?: string;
  name?: string;
  images?: string[];
  location?: string;
  city?: string;
  country?: string;
  saleType?: string;
  totalTokens?: number;
  availableTokens?: number;
  tokenPrice?: number;
  [key: string]: any;
}

export interface AgreementInvestment {
  id?: string;
  amount?: number;
  fractions?: number;
  status?: string;
  createdAt?: string;
  asset?: AgreementAsset;
  [key: string]: any;
}

export interface Agreement {
  id: string;
  investmentId: string;
  investorId: string;
  agreementNumber: string;
  version: number;
  status: AgreementStatus;
  fileUrl: string;
  generatedAt: string;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
  investment?: AgreementInvestment;
}

export interface AgreementDownloadResponse {
  downloadUrl: string;
}
