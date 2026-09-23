import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/authService';
import {
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { setPublicPage, showToast, signInWithGoogle, signInWithEmail } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoInvestor = () => {
    setEmail('kwame.mensah@gmail.com');
    setPassword('DemoPass2026!');
  };

  const fillDemoAdmin = () => {
    setEmail('kobbyjones154@gmail.com');
    setPassword('AdminSecure2026!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
            F
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to FINORA
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access your investment portfolio and asset allocations
          </p>
        </div>

        {/* Primary Firebase Authentication */}
        <div>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg text-xs border border-slate-300 transition-colors flex items-center justify-center gap-2.5 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google (Firebase)</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 text-[10px] tracking-wider font-semibold">
                Or Sign In with Email & Password
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setPublicPage('forgot-password')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quick Demo Pre-fill */}
          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <span className="text-slate-500 font-medium">Quick Fill:</span>
            <button
              type="button"
              onClick={fillDemoInvestor}
              className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors"
            >
              Demo Investor
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 transition-colors"
            >
              Demo Admin
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? 'Authenticating with Firebase...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={() => setPublicPage('register')}
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterView: React.FC = () => {
  const { setPublicPage, showToast, registerWithEmail, signInWithGoogle } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('Please accept the platform terms and risk disclosure.');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(fullName, email, phone, password);
      showToast('Registration complete! Welcome to FINORA.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
            F
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an Investor Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Start managing your investment portfolio today
          </p>
        </div>

        {/* Primary Firebase Sign Up */}
        <div>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg text-xs border border-slate-300 transition-colors flex items-center justify-center gap-2.5 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign Up with Google (Firebase)</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 text-[10px] tracking-wider font-semibold">
                Or Register with Email
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Kwame Mensah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="kwame.mensah@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="+233 24 582 9104"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="text-xs text-slate-600 leading-tight">
              I agree to the Terms of Service, Privacy Policy, and understand all investments carry financial risk.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? 'Creating Account in Firebase...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => setPublicPage('login')}
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const EmailVerificationView: React.FC = () => {
  const { setRole, setInvestorPage, showToast, user } = useApp();
  const [resending, setResending] = useState(false);

  const handleVerify = () => {
    showToast('Email verified successfully! Welcome to FINORA.', 'success');
    setRole('investor');
    setInvestorPage('dashboard');
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await AuthService.resendVerificationEmail();
      showToast('Verification email resent! Please check your inbox.', 'info');
    } catch (e: any) {
      showToast(e.message || 'Failed to resend email.', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto">
          We dispatched a verification link and security token to{' '}
          <span className="font-semibold text-slate-900">{user.email || 'your email'}</span>.
        </p>

        <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
          <p className="font-semibold text-slate-800">Check Your Inbox</p>
          <p className="mt-1 text-[11px] text-slate-500">
            Click the link in the message to activate two-tier identity verification.
          </p>
        </div>

        <button
          onClick={handleVerify}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
        >
          I've Verified My Email &rarr; Enter Dashboard
        </button>

        <div className="mt-4 text-xs text-slate-500">
          Didn't receive the email?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-emerald-600 font-semibold hover:underline"
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordView: React.FC = () => {
  const { setPublicPage, sendPasswordReset, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-700">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Recover Password
        </h2>
        <p className="text-xs text-slate-600 mt-2">
          Enter your registered email address to receive recovery instructions.
        </p>

        {error && (
          <div className="my-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 text-left">
            {error}
          </div>
        )}

        {sent ? (
          <div className="my-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
            A password reset link has been dispatched to <strong>{email}</strong> via Firebase Auth. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="my-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <button
          onClick={() => setPublicPage('login')}
          className="text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          &larr; Back to Login
        </button>
      </div>
    </div>
  );
};
