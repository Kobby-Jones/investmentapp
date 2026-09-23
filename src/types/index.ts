export type UserRole = 'investor' | 'admin' | 'public';

export type KycStatus = 'Verified' | 'Pending' | 'Under Review' | 'Rejected';

export type TransactionStatus = 'Completed' | 'Pending' | 'Processing' | 'Failed';

export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'dividend' | 'fee';

export type RiskLevel = 'Low' | 'Low–Medium' | 'Medium' | 'Medium–High' | 'High';

export type ProductCategory = 'money_market' | 'fixed_income' | 'balanced' | 'equity';

export interface AssetAllocationItem {
  label: string;
  percentage: number;
  color: string;
}

export interface InvestmentProduct {
  id: string;
  name: string;
  category: ProductCategory;
  riskRating: RiskLevel;
  horizon: string;
  minInvestment: number;
  managementFee: string;
  description: string;
  strategy: string;
  demoHistoricalReturn: string;
  historicalAnnualReturnNumber: number; // e.g., 4.8
  assetAllocation: AssetAllocationItem[];
  riskInformation: string;
  terms: string[];
  status: 'active' | 'inactive';
  totalInvestors: number;
  simulatedAum: number;
  inceptionDate: string;
}

export interface PortfolioHolding {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  units: number;
  averageCost: number;
  currentValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
  allocationPercent: number;
  purchaseDate: string;
  lastValuationDate: string;
}

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  method?: string;
  recipientOrSource?: string;
  productId?: string;
  fee?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  actionUrl?: string;
}

export interface ReferralItem {
  id: string;
  friendName: string;
  email: string;
  date: string;
  status: 'Registered' | 'Invested' | 'Pending';
  rewardCredit: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address: string;
  city: string;
  country: string;
  nationality: string;
  kycStatus: KycStatus;
  kycSubmittedDate: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  mobileMoneyProvider: string;
  mobileMoneyNumber: string;
  availableCashBalance: number;
  twoFactorEnabled: boolean;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  joinedDate: string;
  totalInvested: number;
  referralCode?: string;
}

export interface AdminUserListItem {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  kycStatus: KycStatus;
  status: 'Active' | 'Suspended' | 'Pending';
  registrationDate: string;
  registeredDate?: string;
  totalInvested: number;
  portfolioValue: number;
  activeInvestmentsCount: number;
  lastLogin: string;
}

export interface AdminKycApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  idType: string;
  idNumber: string;
  documentName: string;
  submittedAt: string;
  submittedDate?: string;
  status: KycStatus;
  riskRating: 'Low' | 'Medium' | 'High';
  reviewNotes: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type KycQueueItem = AdminKycApplication;

export interface WithdrawalRequest {
  id: string;
  reference?: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: 'Bank Transfer' | 'Mobile Money';
  destination: string;
  fee: number;
  netAmount: number;
  requestedAt: string;
  requestDate?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';
  reviewNotes?: string;
}

export interface AdminAuditLogItem {
  id: string;
  timestamp: string;
  administrator: string;
  actor?: string;
  action: string;
  entity: string;
  category?: string;
  reference: string;
  ipDevice: string;
  ipAddress?: string;
  details?: string;
  result: 'Success' | 'Flagged' | 'Rejected';
}

export type LedgerEntryType =
  | 'DEPOSIT'
  | 'INVESTMENT'
  | 'WITHDRAWAL'
  | 'WITHDRAWAL_REVERSAL'
  | 'DIVIDEND'
  | 'MANAGEMENT_FEE'
  | 'VALUATION_ADJUSTMENT'
  | 'REFERRAL_REWARD';

export interface LedgerEntry {
  id: string;
  userId: string;
  entryType: LedgerEntryType;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: 'GHS';
  reference: string;
  relatedEntityId?: string;
  timestamp: string;
  description: string;
  status: 'POSTED' | 'PENDING' | 'REVERSED';
  balanceAfter: number;
}

export interface DepositRequest {
  id: string;
  reference: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: 'Mobile Money' | 'Bank Transfer';
  provider: string;
  accountDetails: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  requestedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface ValuationRecord {
  id: string;
  productId: string;
  productName: string;
  previousNav: number;
  newNav: number;
  changePercent: number;
  effectiveDate: string;
  appliedBy: string;
  reason: string;
  timestamp: string;
}

export interface SystemSettings {
  environment: 'sandbox' | 'production';
  minDepositAmount: number;
  minWithdrawalAmount: number;
  withdrawalFeeRate: number;
  platformName: string;
  sandboxBannerEnabled: boolean;
}
