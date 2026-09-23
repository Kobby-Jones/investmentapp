import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';
import { INITIAL_HOLDINGS, INITIAL_TRANSACTIONS } from '../mock/initialData';

export const ADMIN_BOOTSTRAP_EMAIL = 'kobbyjones154@gmail.com';

export class AuthService {
  /**
   * Register with Email & Password
   */
  static async registerWithEmail(params: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<FirebaseUser> {
    const cred = await createUserWithEmailAndPassword(auth, params.email, params.password);
    const fbUser = cred.user;

    await updateProfile(fbUser, {
      displayName: params.fullName,
    });

    const isBootstrapAdmin = params.email.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();

    const initialProfile: UserProfile = {
      id: fbUser.uid,
      fullName: params.fullName,
      email: params.email,
      phone: params.phone || '+233 24 582 9104',
      address: 'Airport Residential Area, Airport City',
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
      mobileMoneyNumber: params.phone || '0245829104',
      availableCashBalance: 7500.0,
      twoFactorEnabled: true,
      riskTolerance: 'Moderate',
      joinedDate: new Date().toISOString().split('T')[0],
      totalInvested: 12500.0,
      referralCode: 'FIN' + fbUser.uid.substring(0, 5).toUpperCase(),
    };

    // Save user document
    await setDoc(doc(db, 'users', fbUser.uid), initialProfile);

    // If bootstrap email, write admin document
    if (isBootstrapAdmin) {
      await setDoc(doc(db, 'admins', fbUser.uid), {
        email: params.email,
        role: 'admin',
        grantedAt: new Date().toISOString(),
      });
    }

    // Seed initial demo holdings so user can immediately view active portfolio
    for (const h of INITIAL_HOLDINGS) {
      await setDoc(doc(db, 'users', fbUser.uid, 'holdings', h.id), {
        ...h,
        userId: fbUser.uid,
      });
    }

    // Seed initial transactions
    for (const tx of INITIAL_TRANSACTIONS) {
      await setDoc(doc(db, 'users', fbUser.uid, 'transactions', tx.id), {
        ...tx,
        userId: fbUser.uid,
      });
    }

    // Attempt to dispatch verification email
    try {
      await sendEmailVerification(fbUser);
    } catch (e) {
      console.warn('Email verification dispatch notice:', e);
    }

    return fbUser;
  }

  /**
   * Sign In with Email & Password
   */
  static async loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  /**
   * Password Reset Email
   */
  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Resend Email Verification
   */
  static async resendVerificationEmail(): Promise<void> {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }

  /**
   * Sign Out
   */
  static async signOut(): Promise<void> {
    await fbSignOut(auth);
  }
}
