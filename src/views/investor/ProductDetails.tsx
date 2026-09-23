import React from 'react';
import { useApp } from '../../context/AppContext';
import { SimpleLineChart } from '../../components/common/SimpleLineChart';
import {
  ArrowLeft,
  Shield,
  Clock,
  Coins,
  Percent,
  CheckCircle,
  AlertTriangle,
  FileText,
  Briefcase,
  ArrowRight
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setInvestorPage,
    setInvestmentModalProduct,
    user,
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  if (!product) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500">Product not found.</p>
        <button
          onClick={() => setInvestorPage('marketplace')}
          className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setInvestorPage('marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Investment Marketplace</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          ID: {product.id}
        </span>
      </div>

      {/* Hero Product Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-mono">
              Risk: {product.riskRating}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {product.category.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {product.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="text-right sm:pr-4 sm:border-r border-slate-200">
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Demo Historical Yield
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600">
              {product.demoHistoricalReturn}
            </div>
          </div>

          <button
            onClick={() => setInvestmentModalProduct(product)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Invest Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Key Product Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Coins className="w-4 h-4 text-slate-400" />
            <span>Minimum Investment</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            GH₵{product.minInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Initial subscription</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Investment Horizon</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {product.horizon}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Suggested holding duration</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Percent className="w-4 h-4 text-slate-400" />
            <span>Management Fee</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {product.managementFee}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Accrued daily into NAV</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span>Simulated AUM</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            GH₵{(product.simulatedAum / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{product.totalInvestors} Investors</div>
        </div>
      </div>

      {/* Main Details Grid: Strategy, Allocation, Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Performance Chart & Investment Strategy */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Historical Demo Performance Simulation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulated Net Asset Value performance over trailing observation windows.
                </p>
              </div>
            </div>

            <SimpleLineChart
              currentValue={1000 * (1 + product.historicalAnnualReturnNumber / 100)}
              initialValue={1000}
              height={220}
            />
          </div>

          {/* Investment Strategy */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Investment Strategy & Mandate
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.strategy}
            </p>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">Portfolio Custody & Execution: </span>
              All underlying sovereign debt certificates and listed equities are held in segregated custody with authorized institutional custodians and audited on a quarterly basis.
            </div>
          </div>
        </div>

        {/* Right Col: Asset Allocation, Risk Information & Terms */}
        <div className="space-y-6">
          {/* Asset Allocation Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
              Asset Allocation Model
            </h3>

            <div className="space-y-2.5">
              {product.assetAllocation.map((item) => (
                <div key={item.label} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-700 font-medium">{item.label}</span>
                    <span className="font-mono font-bold text-slate-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Risk Classification & Disclosures
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.riskInformation}
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-800 mb-3">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Product Terms & Redemption Conditions
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {product.terms.map((term, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
