import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  UserProfile,
  InvestmentProduct,
  PortfolioHolding,
  Transaction,
  NotificationItem,
  ReferralItem,
  AdminUserListItem,
  AdminKycApplication,
  WithdrawalRequest,
  AdminAuditLogItem,
  KycStatus,
  DepositRequest,
  LedgerEntry,
  ValuationRecord
} from '../types';
import { FinancialEngine } from '../services/financialEngine';
import { AuthService } from '../services/authService';
import {
  INITIAL_USER,
  INITIAL_PRODUCTS,
  INITIAL_HOLDINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REFERRALS,
  ADMIN_USERS_LIST,
  INITIAL_KYC_QUEUE,
  INITIAL_WITHDRAWALS,
  INITIAL_AUDIT_LOGS
} from '../mock/initialData';
import { auth, db, googleProvider } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

export type PublicPage = 'home' | 'investments' | 'how-it-works' | 'about' | 'faq' | 'contact' | 'login' | 'register' | 'verify-email' | 'forgot-password';
export type InvestorPage = 'dashboard' | 'marketplace' | 'product-details' | 'portfolio' | 'transactions' | 'deposits' | 'withdrawals' | 'referrals' | 'notifications' | 'profile' | 'settings';
export type AdminPage = 'overview' | 'users' | 'user-details' | 'kyc' | 'products' | 'investments' | 'deposits' | 'withdrawals' | 'reports' | 'audit' | 'settings';

const ADMIN_BOOTSTRAP_EMAIL = 'kobbyjones154@gmail.com';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  role: 'public' | 'investor' | 'admin';
  setRole: (role: 'public' | 'investor' | 'admin') => void;
  publicPage: PublicPage;
  setPublicPage: (page: PublicPage) => void;
  investorPage: InvestorPage;
  setInvestorPage: (page: InvestorPage) => void;
  adminPage: AdminPage;
  setAdminPage: (page: AdminPage) => void;
  
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedAdminUserId: string | null;
  setSelectedAdminUserId: (id: string | null) => void;
  
  investmentModalProduct: InvestmentProduct | null;
  setInvestmentModalProduct: (prod: InvestmentProduct | null) => void;
  activeHoldingDetail: PortfolioHolding | null;
  setActiveHoldingDetail: (holding: PortfolioHolding | null) => void;
  
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (fullName: string, email: string, phone: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;

  products: InvestmentProduct[];
  holdings: PortfolioHolding[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  referrals: ReferralItem[];
  adminUsers: AdminUserListItem[];
  kycQueue: AdminKycApplication[];
  withdrawalsQueue: WithdrawalRequest[];
  depositsQueue: DepositRequest[];
  ledgerEntries: LedgerEntry[];
  valuations: ValuationRecord[];
  auditLogs: AdminAuditLogItem[];
  toasts: Toast[];
  
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  
  // Computed portfolio metrics
  totalPortfolioValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercent: number;
  adminStats: {
    totalAum: number;
    totalInvestors: number;
    activeProductsCount: number;
    pendingKycCount: number;
    platformVolume: number;
    totalTransactionsCount: number;
  };
  
  // Real workflow actions backed by Firestore
  makeInvestment: (productId: string, amount: number) => Promise<{ success: boolean; reference: string; message: string }>;
  makeDeposit: (amount: number, method: string) => Promise<{ success: boolean; reference: string }>;
  recordDeposit: (amount: number, method: string) => Promise<{ success: boolean; reference: string }>;
  requestWithdrawal: (amount: number, methodOrDest: string, destination?: string) => Promise<{ success: boolean; reference: string; message?: string }>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  submitKycApplication: (idType: string, idNumber: string, documentName: string) => Promise<void>;
  submitKycVerification: (params: { idType: string; idNumber: string }) => Promise<void>;
  
  // Admin actions
  updateKycStatusByAdmin: (applicationId: string, status: KycStatus, notes?: string) => Promise<void>;
  approveKyc: (applicationId: string) => Promise<void>;
  rejectKyc: (applicationId: string, notes?: string) => Promise<void>;
  updateWithdrawalStatusByAdmin: (withdrawalId: string, status: WithdrawalRequest['status'], notes?: string) => Promise<void>;
  approveWithdrawal: (withdrawalId: string) => Promise<void>;
  rejectWithdrawal: (withdrawalId: string, notes?: string) => Promise<void>;
  approveDepositByAdmin: (depositId: string) => Promise<void>;
  applyProductValuation: (productId: string, newReturn: number, changePercent: number, reason: string) => Promise<void>;
  createProductByAdmin: (productData: any) => Promise<void>;
  addProduct: (productData: any) => Promise<void>;
  updateProductByAdmin: (id: string, updates: Partial<InvestmentProduct>) => Promise<void>;
  updateProductStatus: (id: string, status: any) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  
  // Demo helpers
  resetToDemoState: () => void;
  setDemoEmptyState: () => void;
  jumpToStep: (stepNumber: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'public' | 'investor' | 'admin'>('investor');
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [investorPage, setInvestorPage] = useState<InvestorPage>('dashboard');
  const [adminPage, setAdminPage] = useState<AdminPage>('overview');
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod_bgp_03');
  const [selectedAdminUserId, setSelectedAdminUserId] = useState<string | null>('usr_inv_8829');
  const [investmentModalProduct, setInvestmentModalProduct] = useState<InvestmentProduct | null>(null);
  const [activeHoldingDetail, setActiveHoldingDetail] = useState<PortfolioHolding | null>(null);

  // Authentication State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core Application Data State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [products, setProducts] = useState<InvestmentProduct[]>(INITIAL_PRODUCTS);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(INITIAL_HOLDINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [referrals, setReferrals] = useState<ReferralItem[]>(INITIAL_REFERRALS);
  const [adminUsers, setAdminUsers] = useState<AdminUserListItem[]>(ADMIN_USERS_LIST);
  const [kycQueue, setKycQueue] = useState<AdminKycApplication[]>(INITIAL_KYC_QUEUE);
  const [withdrawalsQueue, setWithdrawalsQueue] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [depositsQueue, setDepositsQueue] = useState<DepositRequest[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [valuations, setValuations] = useState<ValuationRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Google Sign-In with popup
  const signInWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      showToast(`Welcome back, ${cred.user.displayName || 'Investor'}!`, 'success');
      if (cred.user.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase()) {
        setRole('admin');
        setAdminPage('overview');
      } else {
        setRole('investor');
        setInvestorPage('dashboard');
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      showToast(err.message || 'Sign in cancelled or failed.', 'error');
    }
  };

  // Email & Password Sign-In
  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const fbUser = await AuthService.loginWithEmail(email, pass);
      showToast(`Welcome back, ${fbUser.displayName || 'Investor'}!`, 'success');
      if (fbUser.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase()) {
        setRole('admin');
        setAdminPage('overview');
      } else {
        setRole('investor');
        setInvestorPage('dashboard');
      }
    } catch (err: any) {
      console.error('Email sign in error:', err);
      const message =
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
          ? 'Invalid email or password.'
          : err.message || 'Authentication failed.';
      showToast(message, 'error');
      throw err;
    }
  };

  // Register with Email
  const registerWithEmail = async (fullName: string, email: string, phone: string, pass: string) => {
    try {
      await AuthService.registerWithEmail({
        fullName,
        email,
        phone,
        password: pass,
      });
      showToast('Account registered successfully! Verification email dispatched.', 'success');
      setRole('investor');
      setInvestorPage('dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      const message =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email address already exists.'
          : err.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters.'
          : err.message || 'Registration failed.';
      showToast(message, 'error');
      throw err;
    }
  };

  // Password Reset
  const sendPasswordReset = async (email: string) => {
    try {
      await AuthService.sendPasswordReset(email);
      showToast('Password reset link sent to your email address.', 'info');
    } catch (err: any) {
      console.error('Password reset error:', err);
      showToast(err.message || 'Failed to dispatch password reset email.', 'error');
      throw err;
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await AuthService.signOut();
      setFirebaseUser(null);
      setRole('public');
      setPublicPage('home');
      showToast('Successfully signed out.', 'info');
    } catch (err: any) {
      console.error('Sign-out error:', err);
      showToast('Error during sign out.', 'error');
    }
  };

  // 1. Firebase Auth Listener & User Profile Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setAuthLoading(false);

      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          if (!snap.exists()) {
            const initialProfile: UserProfile = {
              id: fbUser.uid,
              fullName: fbUser.displayName || 'Kwame Mensah',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+233 24 582 9104',
              avatarUrl: fbUser.photoURL || undefined,
              address: 'Independence Avenue, Airport Residential Area',
              city: 'Accra',
              country: 'Ghana',
              nationality: 'Ghanaian',
              kycStatus: 'Verified',
              kycSubmittedDate: new Date().toISOString().split('T')[0],
              idType: 'Ghana Card (National ID)',
              idNumber: 'GHA-729104821-4',
              idDocumentName: 'ghana_card_verified.pdf',
              bankName: 'Ecobank Ghana PLC',
              accountNumber: '1441002948192',
              routingNumber: 'ECOBGHAC',
              mobileMoneyProvider: 'MTN Mobile Money',
              mobileMoneyNumber: '0245829104',
              availableCashBalance: 7500.00,
              twoFactorEnabled: true,
              riskTolerance: 'Moderate',
              joinedDate: new Date().toISOString().split('T')[0],
              totalInvested: 12500.00,
              referralCode: 'FIN' + fbUser.uid.substring(0, 5).toUpperCase(),
            };

            await setDoc(userDocRef, initialProfile);
            setUser(initialProfile);

            // Register admin document if bootstrap email
            if (fbUser.email === ADMIN_BOOTSTRAP_EMAIL) {
              await setDoc(doc(db, 'admins', fbUser.uid), {
                email: fbUser.email,
                role: 'admin',
                grantedAt: new Date().toISOString(),
              });
            }

            // Seed user subcollection holdings
            for (const h of INITIAL_HOLDINGS) {
              await setDoc(doc(db, 'users', fbUser.uid, 'holdings', h.id), {
                ...h,
                userId: fbUser.uid,
              });
            }

            // Seed user subcollection transactions
            for (const tx of INITIAL_TRANSACTIONS) {
              await setDoc(doc(db, 'users', fbUser.uid, 'transactions', tx.id), {
                ...tx,
                userId: fbUser.uid,
              });
            }
          } else {
            setUser(snap.data() as UserProfile);
          }
        } catch (error) {
          console.warn('User profile sync notice:', error);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Listeners for User Holdings & Transactions (when signed in)
  useEffect(() => {
    if (!firebaseUser) return;

    // Listen to user profile changes
    const unsubUser = onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as UserProfile);
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );

    // Listen to user holdings
    const unsubHoldings = onSnapshot(
      collection(db, 'users', firebaseUser.uid, 'holdings'),
      (snapshot) => {
        if (!snapshot.empty) {
          setHoldings(snapshot.docs.map((d) => d.data() as PortfolioHolding));
        }
      },
      (error) => {
        console.error('Error listening to holdings:', error);
      }
    );

    // Listen to user transactions
    const unsubTx = onSnapshot(
      collection(db, 'users', firebaseUser.uid, 'transactions'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as Transaction);
          list.sort((a, b) => (b.date > a.date ? 1 : -1));
          setTransactions(list);
        }
      },
      (error) => {
        console.error('Error listening to transactions:', error);
      }
    );

    return () => {
      unsubUser();
      unsubHoldings();
      unsubTx();
    };
  }, [firebaseUser]);

  // 3. Products Catalog Listener (Public & Real-time)
  useEffect(() => {
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      async (snapshot) => {
        if (!snapshot.empty) {
          setProducts(snapshot.docs.map((d) => d.data() as InvestmentProduct));
        } else {
          // First boot: populate catalog with products
          try {
            for (const p of INITIAL_PRODUCTS) {
              await setDoc(doc(db, 'products', p.id), p);
            }
          } catch (e) {
            console.warn('Initial products seed notice:', e);
          }
        }
      },
      (error) => {
        console.error('Products listener error:', error);
      }
    );

    return () => unsubProducts();
  }, []);

  // 4. Withdrawals Queue Listener (Real-time)
  useEffect(() => {
    const unsubWth = onSnapshot(
      collection(db, 'withdrawals'),
      async (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as WithdrawalRequest);
          list.sort((a, b) => ((b.requestedAt || '') > (a.requestedAt || '') ? 1 : -1));
          setWithdrawalsQueue(list);
        } else {
          try {
            for (const w of INITIAL_WITHDRAWALS) {
              await setDoc(doc(db, 'withdrawals', w.id), w);
            }
          } catch (e) {
            console.warn('Initial withdrawals seed notice:', e);
          }
        }
      },
      (error) => {
        console.warn('Withdrawals listener error:', error);
      }
    );

    return () => unsubWth();
  }, []);

  // 5. KYC Applications Listener (Real-time)
  useEffect(() => {
    const unsubKyc = onSnapshot(
      collection(db, 'kyc_applications'),
      async (snapshot) => {
        if (!snapshot.empty) {
          setKycQueue(snapshot.docs.map((d) => d.data() as AdminKycApplication));
        } else {
          try {
            for (const k of INITIAL_KYC_QUEUE) {
              await setDoc(doc(db, 'kyc_applications', k.id), k);
            }
          } catch (e) {
            console.warn('Initial KYC seed notice:', e);
          }
        }
      },
      (error) => {
        console.warn('KYC listener error:', error);
      }
    );

    return () => unsubKyc();
  }, []);

  // 6. Audit Logs Listener (Real-time)
  useEffect(() => {
    const unsubLogs = onSnapshot(
      collection(db, 'audit_logs'),
      async (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as AdminAuditLogItem);
          list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
          setAuditLogs(list);
        } else {
          try {
            for (const log of INITIAL_AUDIT_LOGS) {
              await setDoc(doc(db, 'audit_logs', log.id), log);
            }
          } catch (e) {
            console.warn('Initial audit log seed notice:', e);
          }
        }
      },
      (error) => {
        console.warn('Audit logs listener notice:', error);
      }
    );

    return () => unsubLogs();
  }, []);

  // 7. Deposits Queue Listener (Real-time)
  useEffect(() => {
    const unsubDeposits = onSnapshot(
      collection(db, 'deposits'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as DepositRequest);
          list.sort((a, b) => ((b.requestedAt || '') > (a.requestedAt || '') ? 1 : -1));
          setDepositsQueue(list);
        }
      },
      (error) => {
        console.warn('Deposits listener notice:', error);
      }
    );

    return () => unsubDeposits();
  }, []);

  // 8. General Ledger Entries Listener (Real-time)
  useEffect(() => {
    const unsubLedger = onSnapshot(
      collection(db, 'ledger_entries'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as LedgerEntry);
          list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
          setLedgerEntries(list);
        }
      },
      (error) => {
        console.warn('Ledger entries listener notice:', error);
      }
    );

    return () => unsubLedger();
  }, []);

  // 9. Valuation Records Listener (Real-time)
  useEffect(() => {
    const unsubValuations = onSnapshot(
      collection(db, 'valuations'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as ValuationRecord);
          list.sort((a, b) => (b.effectiveDate > a.effectiveDate ? 1 : -1));
          setValuations(list);
        }
      },
      (error) => {
        console.warn('Valuations listener notice:', error);
      }
    );

    return () => unsubValuations();
  }, []);

  // Computed metrics
  const totalInvested = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.totalCost, 0);
  }, [holdings]);

  const totalPortfolioValue = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.currentValue, 0);
  }, [holdings]);

  const totalReturn = useMemo(() => {
    return totalPortfolioValue - totalInvested;
  }, [totalPortfolioValue, totalInvested]);

  const totalReturnPercent = useMemo(() => {
    if (totalInvested === 0) return 0;
    return (totalReturn / totalInvested) * 100;
  }, [totalReturn, totalInvested]);

  const adminStats = useMemo(() => ({
    totalAum: products.reduce((acc, p) => acc + (p.simulatedAum || 0), 0) || 18420000,
    totalInvestors: adminUsers.length || 2548,
    activeProductsCount: products.filter((p) => p.status === 'active').length,
    pendingKycCount: kycQueue.filter((k) => k.status === 'Pending' || k.status === 'Under Review').length,
    platformVolume: 48200000,
    totalTransactionsCount: transactions.length + 18920,
  }), [products, kycQueue, adminUsers, transactions]);

  // Workflow: Make Investment via FinancialEngine
  const makeInvestment = async (productId: string, amount: number) => {
    try {
      const res = await FinancialEngine.executeInvestment({
        userId: firebaseUser?.uid || user.id,
        productId,
        amount,
        userName: user.fullName,
      });
      showToast(res.message, 'success');
      return res;
    } catch (err: any) {
      console.error('Investment transaction error:', err);
      showToast(err.message || 'Investment execution failed.', 'error');
      return { success: false, reference: '', message: err.message || 'Investment failed.' };
    }
  };

  // Workflow: Deposit Cash via FinancialEngine (Atomic runTransaction)
  const makeDeposit = async (amount: number, method: string) => {
    try {
      const isMobileMoney = method.toLowerCase().includes('momo') || method.toLowerCase().includes('mobile');
      const provider = isMobileMoney ? 'MTN Mobile Money' : 'Ecobank Ghana (Direct Bank)';
      const accountDetails = isMobileMoney ? (user.mobileMoneyNumber || '0245829104') : (user.accountNumber || '1441002948192');

      const res = await FinancialEngine.submitDeposit({
        userId: firebaseUser?.uid || user.id,
        userName: user.fullName,
        userEmail: user.email,
        amount,
        method: isMobileMoney ? 'Mobile Money' : 'Bank Transfer',
        provider,
        accountDetails,
        autoCompleteSandbox: true,
      });

      showToast(res.message, 'success');
      return { success: true, reference: res.reference };
    } catch (err: any) {
      console.error('Deposit transaction error:', err);
      showToast(err.message || 'Deposit submission failed.', 'error');
      return { success: false, reference: '' };
    }
  };

  const recordDeposit = (amount: number, method: string) => {
    return makeDeposit(amount, method);
  };

  // Workflow: Request Withdrawal via FinancialEngine (Atomic Escrow runTransaction)
  const requestWithdrawal = async (amount: number, methodOrDest: string, destination?: string) => {
    try {
      const actualMethod: 'Bank Transfer' | 'Mobile Money' = destination
        ? (methodOrDest.includes('Mobile') || methodOrDest.includes('momo') || methodOrDest.includes('MTN') || methodOrDest.includes('Telecel') ? 'Mobile Money' : 'Bank Transfer')
        : (methodOrDest.includes('MTN') || methodOrDest.includes('Telecel') || methodOrDest.includes('AT') || methodOrDest.includes('MoMo') ? 'Mobile Money' : 'Bank Transfer');
      const actualDest = destination || methodOrDest;

      const res = await FinancialEngine.requestWithdrawal({
        userId: firebaseUser?.uid || user.id,
        userName: user.fullName,
        userEmail: user.email,
        amount,
        method: actualMethod,
        destination: actualDest,
      });

      showToast(res.message, 'info');
      return { success: true, reference: res.reference, message: res.message };
    } catch (err: any) {
      console.error('Withdrawal transaction error:', err);
      showToast(err.message || 'Withdrawal submission failed.', 'error');
      return { success: false, reference: '', message: err.message };
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const userId = firebaseUser?.uid || user.id;
    try {
      await updateDoc(doc(db, 'users', userId), updates);
      setUser((prev) => ({ ...prev, ...updates }));
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      console.error('Error updating user profile:', err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const submitKycApplication = async (idType: string, idNumber: string, documentName: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const userId = firebaseUser?.uid || user.id;

    try {
      await updateDoc(doc(db, 'users', userId), {
        kycStatus: 'Under Review',
        idType,
        idNumber,
        idDocumentName: documentName,
        kycSubmittedDate: now.split(' ')[0],
      });

      const appId = `kyc_${Date.now()}`;
      const newApp: AdminKycApplication = {
        id: appId,
        userId,
        userName: user.fullName,
        userEmail: user.email,
        idType,
        idNumber,
        documentName,
        submittedAt: now,
        submittedDate: now.split(' ')[0],
        status: 'Under Review',
        riskRating: 'Low',
        reviewNotes: 'Submitted via investor profile verification form.',
      };
      await setDoc(doc(db, 'kyc_applications', appId), newApp);

      showToast('KYC documents submitted for compliance review!', 'success');
    } catch (err) {
      console.error('KYC submission error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'kyc_applications');
    }
  };

  const submitKycVerification = (params: { idType: string; idNumber: string }) => {
    return submitKycApplication(params.idType, params.idNumber, 'ghana_card_scanned.pdf');
  };

  // Admin Actions in Firestore
  const updateKycStatusByAdmin = async (applicationId: string, status: KycStatus, notes?: string) => {
    try {
      const app = kycQueue.find((k) => k.id === applicationId);
      await updateDoc(doc(db, 'kyc_applications', applicationId), {
        status,
        reviewNotes: notes || app?.reviewNotes || 'Reviewed by Admin',
        reviewedBy: 'Chief Compliance Officer (Admin)',
        reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      if (app?.userId) {
        await updateDoc(doc(db, 'users', app.userId), {
          kycStatus: status,
        });
      }

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        administrator: 'Chief Compliance Officer (Admin)',
        action: `Updated KYC verification status to ${status}`,
        entity: `User KYC: ${app?.userName || applicationId}`,
        reference: applicationId,
        ipDevice: '197.251.134.18 (Admin Console)',
        result: status === 'Rejected' ? 'Flagged' : 'Success',
      });

      showToast(`KYC status for ${app?.userName || 'User'} updated to ${status}.`, 'info');
    } catch (err) {
      console.error('Update KYC error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `kyc_applications/${applicationId}`);
    }
  };

  const approveKyc = (applicationId: string) => {
    return updateKycStatusByAdmin(applicationId, 'Verified');
  };

  const rejectKyc = (applicationId: string, notes?: string) => {
    return updateKycStatusByAdmin(applicationId, 'Rejected', notes);
  };

  const updateWithdrawalStatusByAdmin = async (withdrawalId: string, status: WithdrawalRequest['status'], notes?: string) => {
    try {
      const wth = withdrawalsQueue.find((w) => w.id === withdrawalId);
      await updateDoc(doc(db, 'withdrawals', withdrawalId), {
        status,
        reviewNotes: notes || wth?.reviewNotes || 'Authorized by Disbursement Operations',
      });

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        administrator: 'Disbursement Operations Admin',
        action: `Updated withdrawal status to ${status}`,
        entity: `Redemption Order: ${withdrawalId}`,
        reference: withdrawalId,
        ipDevice: '197.251.134.18 (Admin Console)',
        result: status === 'Rejected' ? 'Flagged' : 'Success',
      });

      showToast(`Withdrawal status updated to ${status}.`, 'info');
    } catch (err) {
      console.error('Update withdrawal error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `withdrawals/${withdrawalId}`);
    }
  };

  const approveWithdrawal = async (withdrawalId: string) => {
    try {
      await FinancialEngine.approveWithdrawal(withdrawalId, {
        name: user.fullName || 'Chief Operations Officer (Admin)',
        email: user.email || 'ops@finora.com',
      });
      showToast('Withdrawal order approved and disbursed via gateway.', 'success');
    } catch (err: any) {
      console.error('Approve withdrawal error:', err);
      showToast(err.message || 'Failed to approve withdrawal.', 'error');
    }
  };

  const rejectWithdrawal = async (withdrawalId: string, notes?: string) => {
    try {
      await FinancialEngine.rejectWithdrawal(withdrawalId, notes || 'Compliance threshold flagged', {
        name: user.fullName || 'Chief Compliance Officer (Admin)',
        email: user.email || 'compliance@finora.com',
      });
      showToast('Withdrawal rejected and escrow funds restored to investor.', 'info');
    } catch (err: any) {
      console.error('Reject withdrawal error:', err);
      showToast(err.message || 'Failed to reject withdrawal.', 'error');
    }
  };

  const approveDepositByAdmin = async (depositId: string) => {
    try {
      await FinancialEngine.approveDepositByAdmin(depositId, {
        name: user.fullName || 'Treasury Operations (Admin)',
        email: user.email || 'treasury@finora.com',
      });
      showToast('Deposit cleared and investor cash balance credited.', 'success');
    } catch (err: any) {
      console.error('Approve deposit error:', err);
      showToast(err.message || 'Failed to approve deposit.', 'error');
    }
  };

  const applyProductValuation = async (productId: string, newReturn: number, changePercent: number, reason: string) => {
    try {
      await FinancialEngine.applyProductValuation({
        productId,
        newHistoricalReturn: newReturn,
        changePercent,
        reason,
        adminUser: {
          name: user.fullName || 'Valuation Committee (Admin)',
          email: user.email || 'valuations@finora.com',
        },
      });
      showToast('Product valuation adjusted and NAV recomputed.', 'success');
    } catch (err: any) {
      console.error('Valuation error:', err);
      showToast(err.message || 'Failed to apply valuation adjustment.', 'error');
    }
  };

  const createProductByAdmin = async (productData: any) => {
    const id = `prod_${Date.now()}`;
    const newProduct: InvestmentProduct = {
      ...productData,
      id,
      totalInvestors: 0,
      simulatedAum: 0,
      inceptionDate: new Date().toISOString().split('T')[0],
    };

    try {
      await setDoc(doc(db, 'products', id), newProduct);

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        administrator: 'Product Management Officer',
        action: `Created new investment product "${newProduct.name}"`,
        entity: `Product: ${newProduct.name}`,
        reference: id,
        ipDevice: '197.251.134.18 (Admin Console)',
        result: 'Success',
      });

      showToast(`Product "${newProduct.name}" deployed to marketplace.`, 'success');
    } catch (err) {
      console.error('Create product error:', err);
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
  };

  const addProduct = (productData: any) => {
    return createProductByAdmin(productData);
  };

  const updateProductByAdmin = async (id: string, updates: Partial<InvestmentProduct>) => {
    try {
      await updateDoc(doc(db, 'products', id), updates);
      showToast('Product configuration updated in Firestore.', 'success');
    } catch (err) {
      console.error('Update product error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const toggleProductStatus = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const newStatus = prod.status === 'active' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(db, 'products', id), { status: newStatus });
      showToast(`Product status toggled to ${newStatus}.`, 'info');
    } catch (err) {
      console.error('Toggle product error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const updateProductStatus = (id: string, status: any) => {
    return updateProductByAdmin(id, { status: status === 'active' ? 'active' : 'inactive' });
  };

  // Presentation Reset & Jump
  const resetToDemoState = () => {
    setUser(INITIAL_USER);
    setProducts(INITIAL_PRODUCTS);
    setHoldings(INITIAL_HOLDINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReferrals(INITIAL_REFERRALS);
    setAdminUsers(ADMIN_USERS_LIST);
    setKycQueue(INITIAL_KYC_QUEUE);
    setWithdrawalsQueue(INITIAL_WITHDRAWALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showToast('Platform reset to standard demonstration state', 'success');
  };

  const setDemoEmptyState = () => {
    setHoldings([]);
    setTransactions([]);
    setNotifications([]);
    setUser((prev) => ({
      ...prev,
      availableCashBalance: 0,
      totalInvested: 0,
      kycStatus: 'Pending',
    }));
    showToast('Switched to zero-balance onboarding state', 'info');
  };

  const jumpToStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        setRole('public');
        setPublicPage('home');
        break;
      case 2:
        setRole('public');
        setPublicPage('investments');
        break;
      case 3:
        setRole('public');
        setPublicPage('login');
        break;
      case 4:
        setRole('investor');
        setInvestorPage('dashboard');
        break;
      case 5:
        setRole('investor');
        setInvestorPage('marketplace');
        break;
      case 6:
        setRole('investor');
        setSelectedProductId('prod_bgp_03');
        setInvestorPage('product-details');
        break;
      case 7: {
        setRole('investor');
        const prod = products.find((p) => p.id === 'prod_bgp_03') || products[0];
        setInvestmentModalProduct(prod);
        break;
      }
      case 8:
        setRole('investor');
        setInvestorPage('portfolio');
        break;
      case 9:
        setRole('investor');
        setInvestorPage('transactions');
        break;
      case 10:
        setRole('investor');
        setInvestorPage('deposits');
        break;
      case 11:
        setRole('investor');
        setInvestorPage('withdrawals');
        break;
      case 12:
        setRole('investor');
        setInvestorPage('referrals');
        break;
      case 13:
        setRole('investor');
        setInvestorPage('notifications');
        break;
      case 14:
        setRole('investor');
        setInvestorPage('profile');
        break;
      case 15:
        setRole('admin');
        setAdminPage('overview');
        break;
      case 16:
        setRole('admin');
        setAdminPage('users');
        break;
      case 17:
        setRole('admin');
        setAdminPage('kyc');
        break;
      case 18:
        setRole('admin');
        setAdminPage('products');
        break;
      case 19:
        setRole('admin');
        setAdminPage('reports');
        break;
      case 20:
        setRole('admin');
        setAdminPage('audit');
        break;
      default:
        break;
    }
    showToast(`Jumped to Presentation Step ${stepNumber}`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        publicPage,
        setPublicPage,
        investorPage,
        setInvestorPage,
        adminPage,
        setAdminPage,
        selectedProductId,
        setSelectedProductId,
        selectedAdminUserId,
        setSelectedAdminUserId,
        investmentModalProduct,
        setInvestmentModalProduct,
        activeHoldingDetail,
        setActiveHoldingDetail,
        user,
        firebaseUser,
        authLoading,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        sendPasswordReset,
        signOutUser,
        products,
        holdings,
        transactions,
        notifications,
        referrals,
        adminUsers,
        kycQueue,
        withdrawalsQueue,
        depositsQueue,
        ledgerEntries,
        valuations,
        auditLogs,
        toasts,
        showToast,
        dismissToast,
        totalPortfolioValue,
        totalInvested,
        totalReturn,
        totalReturnPercent,
        adminStats,
        makeInvestment,
        makeDeposit,
        recordDeposit,
        requestWithdrawal,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserProfile,
        submitKycApplication,
        submitKycVerification,
        updateKycStatusByAdmin,
        approveKyc,
        rejectKyc,
        updateWithdrawalStatusByAdmin,
        approveWithdrawal,
        rejectWithdrawal,
        approveDepositByAdmin,
        applyProductValuation,
        createProductByAdmin,
        addProduct,
        updateProductByAdmin,
        updateProductStatus,
        toggleProductStatus,
        resetToDemoState,
        setDemoEmptyState,
        jumpToStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
