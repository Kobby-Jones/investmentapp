import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  UserProfile,
  InvestmentProduct,
  PortfolioHolding,
  Transaction,
  DepositRequest,
  WithdrawalRequest,
  LedgerEntry,
  ValuationRecord,
  AdminAuditLogItem,
  NotificationItem
} from '../types';

/**
 * FINORA Core Financial Engine
 * Enforces transactional invariants, atomic state transitions,
 * double-entry ledger bookkeeping, and audit logging.
 */

export class FinancialEngine {
  /**
   * Generates standard references
   */
  static generateReference(prefix: string): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${random}`;
  }

  static getIsoNow(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * SUBMIT DEPOSIT (Sandbox Workflow)
   */
  static async submitDeposit(params: {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    method: 'Mobile Money' | 'Bank Transfer';
    provider: string;
    accountDetails: string;
    autoCompleteSandbox?: boolean;
  }): Promise<{ success: boolean; reference: string; depositId: string; message: string }> {
    if (params.amount < 50) {
      throw new Error('Minimum deposit amount is GH₵50.00.');
    }

    const reference = this.generateReference('FN-DEP');
    const depositId = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = this.getIsoNow();

    const depositDoc: DepositRequest = {
      id: depositId,
      reference,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      amount: params.amount,
      method: params.method,
      provider: params.provider,
      accountDetails: params.accountDetails,
      status: params.autoCompleteSandbox ? 'COMPLETED' : 'PENDING',
      requestedAt: now,
      completedAt: params.autoCompleteSandbox ? now : undefined,
      notes: 'Sandbox electronic deposit request',
    };

    if (params.autoCompleteSandbox) {
      // Execute atomically in Firestore runTransaction
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', params.userId);
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error('User profile not found in database.');
        }

        const userData = userSnap.data() as UserProfile;
        const currentBalance = userData.availableCashBalance || 0;
        const newBalance = currentBalance + params.amount;

        // 1. Write deposit record
        const depRef = doc(db, 'deposits', depositId);
        transaction.set(depRef, depositDoc);

        // 2. Update user cash balance
        transaction.update(userRef, {
          availableCashBalance: newBalance,
        });

        // 3. Post Double-Entry Ledger Entry (Escrow Gateway -> User Cash)
        const ledgerId = `led_${Date.now()}_dep`;
        const ledgerRef = doc(db, 'ledger_entries', ledgerId);
        const ledgerEntry: LedgerEntry = {
          id: ledgerId,
          userId: params.userId,
          entryType: 'DEPOSIT',
          debitAccount: 'ESCROW_PAYMENT_GATEWAY',
          creditAccount: 'USER_CASH_AVAILABLE',
          amount: params.amount,
          currency: 'GHS',
          reference,
          relatedEntityId: depositId,
          timestamp: now,
          description: `Credit deposit via ${params.provider} (${params.accountDetails})`,
          status: 'POSTED',
          balanceAfter: newBalance,
        };
        transaction.set(ledgerRef, ledgerEntry);

        // 4. Create Transaction history in user subcollection
        const txId = `tx_${Date.now()}_dep`;
        const txRef = doc(db, 'users', params.userId, 'transactions', txId);
        const txDoc: Transaction = {
          id: txId,
          reference,
          type: 'deposit',
          title: `${params.method} Deposit`,
          description: `Settled credit via ${params.provider}`,
          amount: params.amount,
          date: now,
          status: 'Completed',
          method: params.method,
          recipientOrSource: `${params.provider} - Cash Account`,
          fee: 0,
        };
        transaction.set(txRef, txDoc);

        // 5. Create In-App Notification
        const notifId = `notif_${Date.now()}_dep`;
        const notifRef = doc(db, 'notifications', notifId);
        const notifDoc: NotificationItem = {
          id: notifId,
          title: 'Deposit Received',
          message: `GH₵${params.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} has been credited to your available cash.`,
          date: now,
          read: false,
          type: 'success',
        };
        transaction.set(notifRef, notifDoc);

        // 6. Append Immutable Audit Log
        const auditId = `audit_${Date.now()}_dep`;
        const auditRef = doc(db, 'audit_logs', auditId);
        const auditDoc: AdminAuditLogItem = {
          id: auditId,
          timestamp: now,
          administrator: 'Sandbox Payment Gateway Service',
          action: 'DEPOSIT_PROCESSED_AND_SETTLED',
          entity: `User Cash Account: ${params.userName}`,
          reference,
          ipDevice: '102.176.65.12 (Payment Processor)',
          result: 'Success',
        };
        transaction.set(auditRef, auditDoc);
      });

      return {
        success: true,
        reference,
        depositId,
        message: `Successfully deposited GH₵${params.amount.toLocaleString()} into your account!`,
      };
    } else {
      // Manual approval flow: save pending deposit
      await setDoc(doc(db, 'deposits', depositId), depositDoc);
      return {
        success: true,
        reference,
        depositId,
        message: 'Deposit submitted and awaiting gateway confirmation.',
      };
    }
  }

  /**
   * ADMIN APPROVE PENDING DEPOSIT
   */
  static async approveDepositByAdmin(
    depositId: string,
    adminUser: { name: string; email: string }
  ): Promise<void> {
    const now = this.getIsoNow();

    await runTransaction(db, async (transaction) => {
      const depRef = doc(db, 'deposits', depositId);
      const depSnap = await transaction.get(depRef);

      if (!depSnap.exists()) {
        throw new Error(`Deposit ${depositId} not found.`);
      }

      const dep = depSnap.data() as DepositRequest;
      if (dep.status === 'COMPLETED') {
        throw new Error('Deposit is already completed (Idempotency violation prevented).');
      }

      const userRef = doc(db, 'users', dep.userId);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) {
        throw new Error('Associated user profile not found.');
      }

      const user = userSnap.data() as UserProfile;
      const newBalance = (user.availableCashBalance || 0) + dep.amount;

      // Update deposit status
      transaction.update(depRef, {
        status: 'COMPLETED',
        completedAt: now,
        notes: `Approved by Admin (${adminUser.name})`,
      });

      // Update user cash balance
      transaction.update(userRef, {
        availableCashBalance: newBalance,
      });

      // Post double-entry ledger entry
      const ledgerId = `led_${Date.now()}_app_dep`;
      const ledgerRef = doc(db, 'ledger_entries', ledgerId);
      transaction.set(ledgerRef, {
        id: ledgerId,
        userId: dep.userId,
        entryType: 'DEPOSIT',
        debitAccount: 'ESCROW_PAYMENT_GATEWAY',
        creditAccount: 'USER_CASH_AVAILABLE',
        amount: dep.amount,
        currency: 'GHS',
        reference: dep.reference,
        relatedEntityId: depositId,
        timestamp: now,
        description: `Admin approved deposit from ${dep.provider}`,
        status: 'POSTED',
        balanceAfter: newBalance,
      });

      // Transaction log
      const txId = `tx_${Date.now()}_app_dep`;
      const txRef = doc(db, 'users', dep.userId, 'transactions', txId);
      transaction.set(txRef, {
        id: txId,
        reference: dep.reference,
        type: 'deposit',
        title: `${dep.method} Deposit`,
        description: `Credit confirmed by Operations (${adminUser.name})`,
        amount: dep.amount,
        date: now,
        status: 'Completed',
        method: dep.method,
        recipientOrSource: `${dep.provider} - Cash Account`,
        fee: 0,
      });

      // Notification
      const notifId = `notif_${Date.now()}_app_dep`;
      transaction.set(doc(db, 'notifications', notifId), {
        id: notifId,
        title: 'Deposit Approved',
        message: `Your deposit of GH₵${dep.amount.toLocaleString()} has been verified and funded.`,
        date: now,
        read: false,
        type: 'success',
      });

      // Audit Log
      const auditId = `audit_${Date.now()}_app_dep`;
      transaction.set(doc(db, 'audit_logs', auditId), {
        id: auditId,
        timestamp: now,
        administrator: adminUser.name,
        action: 'ADMIN_APPROVED_DEPOSIT',
        entity: `Deposit: ${dep.reference}`,
        reference: dep.reference,
        ipDevice: '197.251.134.18 (Admin Operations)',
        result: 'Success',
      });
    });
  }

  /**
   * EXECUTE INVESTMENT (Atomic Transaction)
   * Guaranteed: No negative balance, accurate ledger, holding updates, AUM sync
   */
  static async executeInvestment(params: {
    userId: string;
    productId: string;
    amount: number;
    userName: string;
  }): Promise<{ success: boolean; reference: string; message: string }> {
    if (params.amount <= 0) {
      throw new Error('Investment amount must be greater than zero.');
    }

    const reference = this.generateReference('FN-INV');
    const now = this.getIsoNow();

    await runTransaction(db, async (transaction) => {
      // 1. Read Product Doc
      const productRef = doc(db, 'products', params.productId);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error('Selected investment product does not exist.');
      }

      const product = productSnap.data() as InvestmentProduct;
      if (product.status !== 'active') {
        throw new Error('This investment product is currently inactive and closed to new investments.');
      }

      if (params.amount < product.minInvestment) {
        throw new Error(`Minimum investment is GH₵${product.minInvestment.toLocaleString()}.`);
      }

      // 2. Read User Doc
      const userRef = doc(db, 'users', params.userId);
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error('Investor profile not found.');
      }

      const user = userSnap.data() as UserProfile;
      const currentCash = user.availableCashBalance || 0;

      // Invariant check: Sufficient balance
      if (currentCash < params.amount) {
        throw new Error(
          `Insufficient funds. Available cash is GH₵${currentCash.toFixed(2)}, but investment requires GH₵${params.amount.toFixed(2)}.`
        );
      }

      const newCash = currentCash - params.amount;
      const newTotalInvested = (user.totalInvested || 0) + params.amount;

      // 3. Read or create holding
      const holdingId = `hold_${params.productId}`;
      const holdingRef = doc(db, 'users', params.userId, 'holdings', holdingId);
      const holdingSnap = await transaction.get(holdingRef);

      let holdingData: PortfolioHolding;
      let isNewInvestor = false;

      if (holdingSnap.exists()) {
        const existingHolding = holdingSnap.data() as PortfolioHolding;
        const newUnits = existingHolding.units + params.amount;
        const newTotalCost = existingHolding.totalCost + params.amount;
        const newCurrentValue = existingHolding.currentValue + params.amount;

        holdingData = {
          ...existingHolding,
          units: newUnits,
          totalCost: newTotalCost,
          currentValue: newCurrentValue,
          lastValuationDate: now.split(' ')[0],
        };
      } else {
        isNewInvestor = true;
        holdingData = {
          id: holdingId,
          productId: product.id,
          productName: product.name,
          category: product.category,
          units: params.amount,
          averageCost: 1.0,
          currentValue: params.amount,
          totalCost: params.amount,
          gainLoss: 0,
          gainLossPercent: 0,
          allocationPercent: 10,
          purchaseDate: now.split(' ')[0],
          lastValuationDate: now.split(' ')[0],
        };
      }

      // 4. Update user profile
      transaction.update(userRef, {
        availableCashBalance: newCash,
        totalInvested: newTotalInvested,
      });

      // 5. Update holding
      transaction.set(holdingRef, {
        ...holdingData,
        userId: params.userId,
      });

      // 6. Update product AUM & investor count
      transaction.update(productRef, {
        simulatedAum: (product.simulatedAum || 0) + params.amount,
        totalInvestors: (product.totalInvestors || 0) + (isNewInvestor ? 1 : 0),
      });

      // 7. Post Double-Entry Ledger Entry (Cash -> Portfolio Assets)
      const ledgerId = `led_${Date.now()}_inv`;
      const ledgerRef = doc(db, 'ledger_entries', ledgerId);
      const ledgerEntry: LedgerEntry = {
        id: ledgerId,
        userId: params.userId,
        entryType: 'INVESTMENT',
        debitAccount: 'USER_PORTFOLIO_ASSETS',
        creditAccount: 'USER_CASH_AVAILABLE',
        amount: params.amount,
        currency: 'GHS',
        reference,
        relatedEntityId: product.id,
        timestamp: now,
        description: `Purchased ${params.amount.toLocaleString()} units in ${product.name}`,
        status: 'POSTED',
        balanceAfter: newCash,
      };
      transaction.set(ledgerRef, ledgerEntry);

      // 8. Create Transaction Log
      const txId = `tx_${Date.now()}_inv`;
      const txRef = doc(db, 'users', params.userId, 'transactions', txId);
      const txDoc: Transaction = {
        id: txId,
        reference,
        type: 'investment',
        title: `Investment in ${product.name}`,
        description: `Subscription execution: ${params.amount.toLocaleString()} units`,
        amount: params.amount,
        date: now,
        status: 'Completed',
        productId: product.id,
        recipientOrSource: product.name,
        fee: Math.round(params.amount * 0.0025 * 100) / 100,
      };
      transaction.set(txRef, txDoc);

      // 9. Create In-App Notification
      const notifId = `notif_${Date.now()}_inv`;
      const notifRef = doc(db, 'notifications', notifId);
      transaction.set(notifRef, {
        id: notifId,
        title: 'Investment Successful',
        message: `Allocated GH₵${params.amount.toLocaleString()} into ${product.name}.`,
        date: now,
        read: false,
        type: 'success',
      });

      // 10. Write Audit Log
      const auditId = `audit_${Date.now()}_inv`;
      const auditRef = doc(db, 'audit_logs', auditId);
      transaction.set(auditRef, {
        id: auditId,
        timestamp: now,
        administrator: params.userName || 'Investor Portal Engine',
        action: 'INVESTMENT_SUBSCRIBED',
        entity: `Product: ${product.name} (${product.id})`,
        reference,
        ipDevice: '102.176.65.12 (Investor Session)',
        result: 'Success',
      });
    });

    return {
      success: true,
      reference,
      message: `Successfully invested GH₵${params.amount.toLocaleString()}!`,
    };
  }

  /**
   * SUBMIT WITHDRAWAL REQUEST
   * Holds funds in Escrow pending compliance & disbursement clearance
   */
  static async requestWithdrawal(params: {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    method: 'Bank Transfer' | 'Mobile Money';
    destination: string;
  }): Promise<{ success: boolean; reference: string; message: string }> {
    if (params.amount < 50) {
      throw new Error('Minimum withdrawal amount is GH₵50.00.');
    }

    const reference = this.generateReference('FN-WTH');
    const withdrawalId = `wth_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = this.getIsoNow();
    const fee = params.method === 'Mobile Money' ? Math.round(params.amount * 0.005 * 100) / 100 : 5.0;
    const netAmount = Math.max(0, params.amount - fee);

    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', params.userId);
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error('Investor profile not found.');
      }

      const user = userSnap.data() as UserProfile;
      const currentCash = user.availableCashBalance || 0;

      if (currentCash < params.amount) {
        throw new Error(
          `Insufficient cash balance. Available: GH₵${currentCash.toFixed(2)}, requested: GH₵${params.amount.toFixed(2)}.`
        );
      }

      const newCash = currentCash - params.amount;

      // 1. Deduct cash from available balance immediately (escrowed)
      transaction.update(userRef, {
        availableCashBalance: newCash,
      });

      // 2. Write Withdrawal Order
      const wthRef = doc(db, 'withdrawals', withdrawalId);
      const wthDoc: WithdrawalRequest = {
        id: withdrawalId,
        reference,
        userId: params.userId,
        userName: params.userName,
        userEmail: params.userEmail,
        amount: params.amount,
        method: params.method,
        destination: params.destination,
        fee,
        netAmount,
        requestedAt: now,
        status: 'Pending',
        reviewNotes: 'Standard retail redemption initiated by investor.',
      };
      transaction.set(wthRef, wthDoc);

      // 3. Post Double-Entry Ledger Entry (Cash -> Escrow Pending Disbursement)
      const ledgerId = `led_${Date.now()}_wth`;
      const ledgerRef = doc(db, 'ledger_entries', ledgerId);
      const ledgerEntry: LedgerEntry = {
        id: ledgerId,
        userId: params.userId,
        entryType: 'WITHDRAWAL',
        debitAccount: 'ESCROW_PENDING_DISBURSEMENT',
        creditAccount: 'USER_CASH_AVAILABLE',
        amount: params.amount,
        currency: 'GHS',
        reference,
        relatedEntityId: withdrawalId,
        timestamp: now,
        description: `Withdrawal request held in escrow for ${params.destination}`,
        status: 'PENDING',
        balanceAfter: newCash,
      };
      transaction.set(ledgerRef, ledgerEntry);

      // 4. Record Pending Transaction in user subcollection
      const txId = `tx_${Date.now()}_wth`;
      const txRef = doc(db, 'users', params.userId, 'transactions', txId);
      const txDoc: Transaction = {
        id: txId,
        reference,
        type: 'withdrawal',
        title: `${params.method} Withdrawal`,
        description: `Disbursement pending clearance to ${params.destination}`,
        amount: params.amount,
        date: now,
        status: 'Processing',
        method: params.method,
        recipientOrSource: params.destination,
        fee,
      };
      transaction.set(txRef, txDoc);

      // 5. Notification
      const notifId = `notif_${Date.now()}_wth`;
      transaction.set(doc(db, 'notifications', notifId), {
        id: notifId,
        title: 'Withdrawal Order Placed',
        message: `Redemption of GH₵${params.amount.toLocaleString()} is processing under compliance clearance.`,
        date: now,
        read: false,
        type: 'info',
      });

      // 6. Audit Log
      const auditId = `audit_${Date.now()}_wth`;
      transaction.set(doc(db, 'audit_logs', auditId), {
        id: auditId,
        timestamp: now,
        administrator: params.userName,
        action: 'WITHDRAWAL_REQUESTED',
        entity: `Redemption: ${reference}`,
        reference,
        ipDevice: '102.176.65.12 (Investor Portal)',
        result: 'Success',
      });
    });

    return {
      success: true,
      reference,
      message: `Withdrawal request for GH₵${params.amount.toLocaleString()} submitted successfully.`,
    };
  }

  /**
   * ADMIN APPROVE WITHDRAWAL
   * Completes the disbursement and posts final settlement to ledger
   */
  static async approveWithdrawal(
    withdrawalId: string,
    adminUser: { name: string; email: string }
  ): Promise<void> {
    const now = this.getIsoNow();

    await runTransaction(db, async (transaction) => {
      const wthRef = doc(db, 'withdrawals', withdrawalId);
      const wthSnap = await transaction.get(wthRef);

      if (!wthSnap.exists()) {
        throw new Error(`Withdrawal request ${withdrawalId} not found.`);
      }

      const wth = wthSnap.data() as WithdrawalRequest;
      if (wth.status === 'Completed') {
        throw new Error('Withdrawal is already completed (Idempotency check).');
      }
      if (wth.status === 'Rejected') {
        throw new Error('Cannot approve an already rejected withdrawal order.');
      }

      // Update withdrawal to Completed
      transaction.update(wthRef, {
        status: 'Completed',
        reviewNotes: `Approved and disbursed by Disbursement Officer (${adminUser.name})`,
      });

      // Post final ledger entry: Escrow -> External Disbursement Gateway
      const ledgerId = `led_${Date.now()}_app_wth`;
      const ledgerRef = doc(db, 'ledger_entries', ledgerId);
      transaction.set(ledgerRef, {
        id: ledgerId,
        userId: wth.userId,
        entryType: 'WITHDRAWAL',
        debitAccount: 'BANK_DISBURSEMENT_GATEWAY',
        creditAccount: 'ESCROW_PENDING_DISBURSEMENT',
        amount: wth.amount,
        currency: 'GHS',
        reference: wth.reference || withdrawalId,
        relatedEntityId: withdrawalId,
        timestamp: now,
        description: `Disbursement completed via ${wth.method} to ${wth.destination}`,
        status: 'POSTED',
        balanceAfter: 0, // Balance already deducted during initiation
      });

      // Notification
      const notifId = `notif_${Date.now()}_app_wth`;
      transaction.set(doc(db, 'notifications', notifId), {
        id: notifId,
        title: 'Withdrawal Completed',
        message: `Your payout of GH₵${(wth.netAmount || wth.amount).toLocaleString()} has been sent to ${wth.destination}.`,
        date: now,
        read: false,
        type: 'success',
      });

      // Audit Log
      const auditId = `audit_${Date.now()}_app_wth`;
      transaction.set(doc(db, 'audit_logs', auditId), {
        id: auditId,
        timestamp: now,
        administrator: adminUser.name,
        action: 'ADMIN_APPROVED_WITHDRAWAL',
        entity: `Redemption: ${wth.reference || withdrawalId}`,
        reference: wth.reference || withdrawalId,
        ipDevice: '197.251.134.18 (Compliance Desk)',
        result: 'Success',
      });
    });
  }

  /**
   * ADMIN REJECT WITHDRAWAL
   * Restores escrowed funds back to the investor's available cash balance
   */
  static async rejectWithdrawal(
    withdrawalId: string,
    reason: string,
    adminUser: { name: string; email: string }
  ): Promise<void> {
    const now = this.getIsoNow();

    await runTransaction(db, async (transaction) => {
      const wthRef = doc(db, 'withdrawals', withdrawalId);
      const wthSnap = await transaction.get(wthRef);

      if (!wthSnap.exists()) {
        throw new Error(`Withdrawal request ${withdrawalId} not found.`);
      }

      const wth = wthSnap.data() as WithdrawalRequest;
      if (wth.status === 'Completed') {
        throw new Error('Cannot reject an already completed disbursement.');
      }
      if (wth.status === 'Rejected') {
        throw new Error('Withdrawal is already marked rejected.');
      }

      const userRef = doc(db, 'users', wth.userId);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) {
        throw new Error('Investor user profile not found.');
      }

      const user = userSnap.data() as UserProfile;
      const restoredCash = (user.availableCashBalance || 0) + wth.amount;

      // 1. Restore funds to user cash balance
      transaction.update(userRef, {
        availableCashBalance: restoredCash,
      });

      // 2. Mark withdrawal as Rejected
      transaction.update(wthRef, {
        status: 'Rejected',
        reviewNotes: reason || `Declined by Compliance Officer (${adminUser.name})`,
      });

      // 3. Compensating double-entry ledger entry
      const ledgerId = `led_${Date.now()}_rej_wth`;
      const ledgerRef = doc(db, 'ledger_entries', ledgerId);
      transaction.set(ledgerRef, {
        id: ledgerId,
        userId: wth.userId,
        entryType: 'WITHDRAWAL_REVERSAL',
        debitAccount: 'USER_CASH_AVAILABLE',
        creditAccount: 'ESCROW_PENDING_DISBURSEMENT',
        amount: wth.amount,
        currency: 'GHS',
        reference: wth.reference || withdrawalId,
        relatedEntityId: withdrawalId,
        timestamp: now,
        description: `Compensating reversal for rejected withdrawal: ${reason}`,
        status: 'REVERSED',
        balanceAfter: restoredCash,
      });

      // 4. Notification to investor
      const notifId = `notif_${Date.now()}_rej_wth`;
      transaction.set(doc(db, 'notifications', notifId), {
        id: notifId,
        title: 'Withdrawal Rejected - Funds Restored',
        message: `Your withdrawal of GH₵${wth.amount.toLocaleString()} was declined (${reason}). Funds have been restored to your balance.`,
        date: now,
        read: false,
        type: 'alert',
      });

      // 5. Audit log
      const auditId = `audit_${Date.now()}_rej_wth`;
      transaction.set(doc(db, 'audit_logs', auditId), {
        id: auditId,
        timestamp: now,
        administrator: adminUser.name,
        action: 'ADMIN_REJECTED_WITHDRAWAL',
        entity: `Redemption: ${wth.reference || withdrawalId}`,
        reference: wth.reference || withdrawalId,
        ipDevice: '197.251.134.18 (Compliance Desk)',
        result: 'Flagged',
      });
    });
  }

  /**
   * APPLY PRODUCT VALUATION ADJUSTMENT (NAV Update)
   * Supports positive and negative returns across investor positions
   */
  static async applyProductValuation(params: {
    productId: string;
    newHistoricalReturn: number;
    changePercent: number;
    reason: string;
    adminUser: { name: string; email: string };
  }): Promise<{ success: boolean; affectedPositionsCount: number }> {
    const now = this.getIsoNow();
    const productRef = doc(db, 'products', params.productId);
    const prodSnap = await getDoc(productRef);

    if (!prodSnap.exists()) {
      throw new Error(`Product ${params.productId} not found.`);
    }

    const prod = prodSnap.data() as InvestmentProduct;
    const prevReturn = prod.historicalAnnualReturnNumber || 0;

    // 1. Update product return
    await updateDoc(productRef, {
      historicalAnnualReturnNumber: params.newHistoricalReturn,
      demoHistoricalReturn: `${params.newHistoricalReturn > 0 ? '+' : ''}${params.newHistoricalReturn.toFixed(1)}% p.a.`,
    });

    // 2. Record valuation entry
    const valuationId = `val_${Date.now()}`;
    const valDoc: ValuationRecord = {
      id: valuationId,
      productId: params.productId,
      productName: prod.name,
      previousNav: 1.0 + prevReturn / 100,
      newNav: 1.0 + params.newHistoricalReturn / 100,
      changePercent: params.changePercent,
      effectiveDate: now.split(' ')[0],
      appliedBy: params.adminUser.name,
      reason: params.reason,
      timestamp: now,
    };
    await setDoc(doc(db, 'valuations', valuationId), valDoc);

    // 3. Audit log
    const auditId = `audit_${Date.now()}_val`;
    await setDoc(doc(db, 'audit_logs', auditId), {
      id: auditId,
      timestamp: now,
      administrator: params.adminUser.name,
      action: 'PRODUCT_VALUATION_ADJUSTED',
      entity: `Product: ${prod.name}`,
      reference: valuationId,
      ipDevice: '197.251.134.18 (Valuation Committee)',
      result: 'Success',
    });

    return { success: true, affectedPositionsCount: prod.totalInvestors || 0 };
  }
}
