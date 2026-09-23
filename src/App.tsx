import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PresentationToolbar } from './components/layout/PresentationToolbar';
import { ToastContainer } from './components/common/Toast';

// Public layout & views
import { HeaderPublic } from './components/layout/HeaderPublic';
import { FooterPublic } from './components/layout/FooterPublic';
import { LandingPage } from './views/public/LandingPage';
import {
  LoginView,
  RegisterView,
  EmailVerificationView,
  ForgotPasswordView
} from './views/public/AuthViews';
import {
  PublicInvestmentsView,
  PublicHowItWorksView,
  PublicAboutView,
  PublicFaqView,
  PublicContactView
} from './views/public/PublicSecondaryViews';

// Investor layout & views
import { InvestorSidebar } from './components/layout/InvestorSidebar';
import { InvestorTopbar } from './components/layout/InvestorTopbar';
import { InvestorDashboard } from './views/investor/InvestorDashboard';
import { InvestmentMarketplace } from './views/investor/InvestmentMarketplace';
import { ProductDetails } from './views/investor/ProductDetails';
import { InvestmentModal } from './views/investor/InvestmentModal';
import { PortfolioView } from './views/investor/PortfolioView';
import { TransactionsView } from './views/investor/TransactionsView';
import { DepositsView } from './views/investor/DepositsView';
import { WithdrawalsView } from './views/investor/WithdrawalsView';
import { ReferralsView } from './views/investor/ReferralsView';
import { NotificationsView } from './views/investor/NotificationsView';
import { ProfileKycView } from './views/investor/ProfileKycView';
import { SettingsView } from './views/investor/SettingsView';

// Admin layout & views
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminTopbar } from './components/layout/AdminTopbar';
import { AdminOverview } from './views/admin/AdminOverview';
import { AdminUsersKycView } from './views/admin/AdminUsersKycView';
import { AdminProductsView } from './views/admin/AdminProductsView';
import { AdminCashFlowView } from './views/admin/AdminCashFlowView';
import { AdminReportsAuditView } from './views/admin/AdminReportsAuditView';
import { AdminSettingsView } from './views/admin/AdminSettingsView';

const MainAppContent: React.FC = () => {
  const { role, publicPage, investorPage, adminPage } = useApp();
  const [investorMobileOpen, setInvestorMobileOpen] = useState(false);
  const [adminMobileOpen, setAdminMobileOpen] = useState(false);

  // 1. PUBLIC WEBSITE & AUTH
  if (role === 'public') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
        <PresentationToolbar />
        <HeaderPublic />

        <main className="flex-1">
          {publicPage === 'home' && <LandingPage />}
          {publicPage === 'investments' && <PublicInvestmentsView />}
          {publicPage === 'how-it-works' && <PublicHowItWorksView />}
          {publicPage === 'about' && <PublicAboutView />}
          {publicPage === 'faq' && <PublicFaqView />}
          {publicPage === 'contact' && <PublicContactView />}
          {publicPage === 'login' && <LoginView />}
          {publicPage === 'register' && <RegisterView />}
          {publicPage === 'verify-email' && <EmailVerificationView />}
          {publicPage === 'forgot-password' && <ForgotPasswordView />}
        </main>

        <FooterPublic />
        <ToastContainer />
      </div>
    );
  }

  // 2. INVESTOR PORTAL
  if (role === 'investor') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
        <PresentationToolbar />

        <div className="flex-1 flex overflow-hidden">
          <InvestorSidebar
            mobileOpen={investorMobileOpen}
            setMobileOpen={setInvestorMobileOpen}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <InvestorTopbar onOpenMobileMenu={() => setInvestorMobileOpen(true)} />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {investorPage === 'dashboard' && <InvestorDashboard />}
              {investorPage === 'marketplace' && <InvestmentMarketplace />}
              {investorPage === 'product-details' && <ProductDetails />}
              {investorPage === 'portfolio' && <PortfolioView />}
              {investorPage === 'transactions' && <TransactionsView />}
              {investorPage === 'deposits' && <DepositsView />}
              {investorPage === 'withdrawals' && <WithdrawalsView />}
              {investorPage === 'referrals' && <ReferralsView />}
              {investorPage === 'notifications' && <NotificationsView />}
              {investorPage === 'profile' && <ProfileKycView />}
              {investorPage === 'settings' && <SettingsView />}
            </main>
          </div>
        </div>

        {/* Global Multi-step Investment Modal */}
        <InvestmentModal />
        <ToastContainer />
      </div>
    );
  }

  // 3. ADMIN PORTAL
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <PresentationToolbar />

      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar
          mobileOpen={adminMobileOpen}
          setMobileOpen={setAdminMobileOpen}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-100 text-slate-900">
          <AdminTopbar onOpenMobileMenu={() => setAdminMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {adminPage === 'overview' && <AdminOverview />}
            {adminPage === 'users' && <AdminUsersKycView initialTab="users" />}
            {adminPage === 'kyc' && <AdminUsersKycView initialTab="kyc" />}
            {adminPage === 'products' && <AdminProductsView />}
            {adminPage === 'investments' && <AdminCashFlowView initialMode="withdrawals" />}
            {adminPage === 'deposits' && <AdminCashFlowView initialMode="deposits" />}
            {adminPage === 'withdrawals' && <AdminCashFlowView initialMode="withdrawals" />}
            {adminPage === 'reports' && <AdminReportsAuditView initialTab="reports" />}
            {adminPage === 'audit' && <AdminReportsAuditView initialTab="audit" />}
            {adminPage === 'settings' && <AdminSettingsView />}
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
