import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentProduct, RiskLevel, ProductCategory } from '../../types';
import {
  Compass,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Coins,
  CheckCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

export const InvestmentMarketplace: React.FC = () => {
  const {
    products,
    setSelectedProductId,
    setInvestorPage,
    setInvestmentModalProduct,
    user,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Visibility
      if (prod.status !== 'active') return false;

      // Search
      if (search) {
        const query = search.toLowerCase();
        const match =
          prod.name.toLowerCase().includes(query) ||
          prod.description.toLowerCase().includes(query) ||
          prod.strategy.toLowerCase().includes(query);
        if (!match) return false;
      }

      // Risk
      if (selectedRisk !== 'all' && prod.riskRating !== selectedRisk) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // Duration
      if (selectedDuration !== 'all') {
        if (selectedDuration === 'short' && !prod.horizon.includes('90 days')) return false;
        if (selectedDuration === 'medium' && !prod.horizon.includes('6–12 months') && !prod.horizon.includes('1–3 years')) return false;
        if (selectedDuration === 'long' && !prod.horizon.includes('3+ years')) return false;
      }

      return true;
    });
  }, [products, search, selectedRisk, selectedCategory, selectedDuration]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Explore Investment Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover curated institutional debt, money market, and equity funds. Historical figures are simulated demo estimates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
          <Coins className="w-4 h-4 text-emerald-600" />
          <span>Available Cash to Invest:</span>
          <span className="font-mono font-bold text-slate-900">
            GH₵{user.availableCashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, asset class, or strategy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:bg-white bg-slate-50 text-slate-900"
            />
          </div>

          {/* Reset Filters button */}
          {(selectedRisk !== 'all' || selectedCategory !== 'all' || selectedDuration !== 'all' || search) && (
            <button
              onClick={() => {
                setSelectedRisk('all');
                setSelectedCategory('all');
                setSelectedDuration('all');
                setSearch('');
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0">
              Risk:
            </span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Low–Medium">Low–Medium Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Medium–High">Medium–High Risk</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0">
              Type:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Asset Classes</option>
              <option value="money_market">Money Market</option>
              <option value="fixed_income">Fixed Income</option>
              <option value="balanced">Balanced Growth</option>
              <option value="equity">Equity Growth</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0">
              Horizon:
            </span>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Horizons</option>
              <option value="short">Short Term (90 Days+)</option>
              <option value="medium">Medium Term (6–36 Months)</option>
              <option value="long">Long Term (3+ Years)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No Matching Investment Products</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or resetting filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((prod) => {
            return (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all group"
              >
                <div>
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-mono">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Risk: {prod.riskRating}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Min: GH₵{prod.minInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>

                  {/* Financial stats box */}
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Demo Return
                      </div>
                      <div className="text-sm font-bold font-mono text-emerald-600 mt-0.5">
                        {prod.demoHistoricalReturn.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">simulated p.a.</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Horizon
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
                        {prod.horizon}
                      </div>
                      <div className="text-[9px] text-slate-400">liquidity window</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        Mgmt Fee
                      </div>
                      <div className="text-xs font-semibold font-mono text-slate-800 mt-1">
                        {prod.managementFee}
                      </div>
                      <div className="text-[9px] text-slate-400">accrued in NAV</div>
                    </div>
                  </div>

                  {/* Asset Allocation Breakdown Pill */}
                  <div className="mt-4">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                      <span>Target Allocation</span>
                      <span className="font-mono text-[10px] text-slate-400">{prod.assetAllocation.length} Asset Classes</span>
                    </div>
                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-100">
                      {prod.assetAllocation.map((item) => (
                        <div
                          key={item.label}
                          title={`${item.label}: ${item.percentage}%`}
                          className="h-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-600">
                      {prod.assetAllocation.slice(0, 3).map((item) => (
                        <span key={item.label} className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.label} ({item.percentage}%)
                        </span>
                      ))}
                      {prod.assetAllocation.length > 3 && (
                        <span className="text-slate-400">+{prod.assetAllocation.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setInvestorPage('product-details');
                    }}
                    className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      setInvestmentModalProduct(prod);
                    }}
                    className="flex-1 py-2 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Invest Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prototype Disclosure Footer */}
      <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Prototype Investment Disclosure: </span>
          Past simulated performance is not indicative of future returns. Investment values fluctuate with market forces and exchange rates. Asset liquidation timeframes and net payouts depend on market liquidity and product terms.
        </div>
      </div>
    </div>
  );
};
