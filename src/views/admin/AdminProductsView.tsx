import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentProduct, ProductCategory, RiskLevel } from '../../types';
import {
  Package,
  Plus,
  CheckCircle2,
  XCircle,
  Edit2,
  Eye,
  X,
  Save,
  AlertCircle
} from 'lucide-react';

export const AdminProductsView: React.FC = () => {
  const { products, addProduct, updateProductStatus, showToast } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('fixed_income');
  const [riskRating, setRiskRating] = useState<RiskLevel>('Medium');
  const [minInvestment, setMinInvestment] = useState<number>(500);
  const [horizon, setHorizon] = useState('1–2 Years');
  const [demoHistoricalReturn, setDemoHistoricalReturn] = useState('8.4% p.a.');
  const [managementFee, setManagementFee] = useState('1.25% p.a.');
  const [description, setDescription] = useState('');
  const [strategy, setStrategy] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !strategy) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    addProduct({
      name,
      category,
      riskRating,
      minInvestment,
      horizon,
      demoHistoricalReturn,
      historicalAnnualReturnNumber: parseFloat(demoHistoricalReturn) || 8.0,
      managementFee,
      description,
      strategy,
      status: 'active',
      simulatedAum: 500000,
      totalInvestors: 1,
      assetAllocation: [
        { label: 'Primary Instruments', percentage: 70, color: '#059669' },
        { label: 'Secondary Reserves', percentage: 30, color: '#0284C7' },
      ],
      terms: ['Daily valuation', '90-day minimum lock-up period', 'Fiduciary oversight'],
      riskInformation: 'Standard market volatility applies. Returns not guaranteed.',
    });

    setCreateModalOpen(false);
    // Reset form
    setName('');
    setDescription('');
    setStrategy('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Investment Product Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure fund terms, risk tiers, management fees, and issuance status across the marketplace.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Fund Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Risk Level</th>
                <th className="py-3 px-4 text-right">Min Invest</th>
                <th className="py-3 px-4">Horizon</th>
                <th className="py-3 px-4 text-right">Simulated AUM</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{p.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-700">
                    {p.category.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {p.riskRating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                    GH₵{p.minInvestment.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {p.horizon}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    GH₵{(p.simulatedAum / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        p.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() =>
                        updateProductStatus(p.id, p.status === 'active' ? 'draft' : 'active')
                      }
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
                    >
                      {p.status === 'active' ? 'Deactivate' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setCreateModalOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Create New Investment Product
              </h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infrastructure Bond Trust"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Asset Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="money_market">Money Market</option>
                    <option value="fixed_income">Fixed Income</option>
                    <option value="balanced">Balanced Growth</option>
                    <option value="equity">Equity Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Risk Classification
                  </label>
                  <select
                    value={riskRating}
                    onChange={(e) => setRiskRating(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Low–Medium">Low–Medium Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Medium–High">Medium–High Risk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Min Invest (GH₵)
                  </label>
                  <input
                    type="number"
                    required
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(parseFloat(e.target.value) || 100)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Horizon
                  </label>
                  <input
                    type="text"
                    required
                    value={horizon}
                    onChange={(e) => setHorizon(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mgmt Fee
                  </label>
                  <input
                    type="text"
                    required
                    value={managementFee}
                    onChange={(e) => setManagementFee(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short overview for marketplace card..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Investment Strategy & Mandate
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed asset allocation methodology..."
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
