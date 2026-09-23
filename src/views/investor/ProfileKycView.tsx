import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Shield,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  CreditCard,
  Save,
  HelpCircle
} from 'lucide-react';

export const ProfileKycView: React.FC = () => {
  const { user, updateUserProfile, showToast, submitKycVerification } = useApp();

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [idType, setIdType] = useState(user.idType);
  const [idNumber, setIdNumber] = useState(user.idNumber);
  const [riskTolerance, setRiskTolerance] = useState(user.riskTolerance);
  const [kycSubmitted, setKycSubmitted] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      email,
      phone,
      address,
      riskTolerance,
    });
    showToast('Personal profile updated successfully.', 'success');
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKycVerification({
      idType,
      idNumber,
    });
    setKycSubmitted(true);
    showToast('KYC documents submitted for compliance review.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Profile & KYC Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your regulatory identity verification, settlement details, and investor classification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.kycStatus === 'Verified' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Identity Verified (Tier 2)</span>
            </span>
          ) : user.kycStatus === 'Under Review' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>KYC Under Review</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Pending Submission</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
              Personal Information
            </h2>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Risk Profile Classification
                  </label>
                  <select
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Conservative">Conservative (Capital Preservation)</option>
                    <option value="Balanced">Balanced (Steady Real Return)</option>
                    <option value="Aggressive">Aggressive (Maximum Capital Growth)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* KYC Document Verification Submission Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              National Identification (KYC)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Upload your valid government identification to unlock unlimited withdrawals and tier-2 portfolio limits.
            </p>

            <form onSubmit={handleKycSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Document Type
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Ghana Card (NIA)">Ghana Card (NIA)</option>
                    <option value="Passport">International Passport</option>
                    <option value="Driver's License">Driver's License</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Document Identification Number
                  </label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Upload Document Box */}
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center hover:bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-800">
                  Ghana Card Front & Back Document (GHA-01928374-1.pdf)
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">
                  ✓ Verified cryptographic document hash attached
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Status: <strong className="text-emerald-700">{user.kycStatus}</strong>
                </span>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Re-Submit KYC Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Settlement Details & Tier Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Settlement Accounts
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Default financial destination verified for automated withdrawal payouts.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Standard Chartered Bank</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Acct: ••••••••5678 (Kwame Mensah)
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                Primary Settlement Channel
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>MTN Mobile Money</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Number: +233 24 412 3456
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide">
              Investor Tier & Limits
            </h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Account Tier:</span>
                <span className="font-bold text-slate-900">Tier 2 (Verified)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Daily Deposit Limit:</span>
                <span className="font-mono text-slate-900">GH₵50,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Daily Withdrawal Limit:</span>
                <span className="font-mono text-slate-900">GH₵20,000</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Tax Exemption ID:</span>
                <span className="font-mono text-slate-900">GH-WHT-9821</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
