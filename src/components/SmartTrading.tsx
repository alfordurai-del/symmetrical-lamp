import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  ArrowLeft,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import Header from './Header';
import { fetchMarketData } from '../services/marketDataService';
import type { MarketAsset } from '../services/marketDataService';

// --- TYPE DEFINITIONS ---
interface SmartAsset {
  id?: string;
  ticker: string;
  name?: string;
  icon?: React.ReactNode;
  spotPrice: string;
  change: number;
  chartData: number[];
}

type MarketDataState = {
  [key: string]: SmartAsset[];
};

interface AssetRowProps {
  asset: SmartAsset;
  onOpenPlan?: (ticker: string) => void;
}

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

// --- ICON COMPONENTS ---
const SimpleIcon = ({ txt, color }: { txt: string, color: string }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${color}`}>
    {txt}
  </div>
);

const ImgIcon = ({ src }: { src: string }) => (
  <img src={src} alt="icon" className="w-8 h-8 rounded-full object-cover" />
);

const DoubleFlagIcon = ({ url1, url2 }: { url1: string; url2: string }) => (
  <div className="relative w-10 h-8 flex items-center">
    <img src={url1} alt="icon1" className="w-6 h-6 rounded-full object-cover absolute left-0 z-10 border border-[#0D0F1C]" />
    <img src={url2} alt="icon2" className="w-6 h-6 rounded-full object-cover absolute left-3 z-0 border border-[#0D0F1C]" />
  </div>
);

// --- HELPER FUNCTIONS ---
const getChangeColor = (change: number) =>
  change >= 0 ? 'text-green-500' : 'text-red-500';

const getChartColor = (change: number) => (change >= 0 ? '#22c55e' : '#ef4444');

// --- SPARKLINE COMPONENT ---
const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  width = 60,
  height = 20,
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

// --- ASSET ROW COMPONENT ---
const AssetRow: React.FC<AssetRowProps> = ({ asset, onOpenPlan }) => {
  const { ticker, spotPrice, change, chartData, name, icon } = asset;
  const changeColor = getChangeColor(change);
  const chartColor = getChartColor(change);

  return (
    <div className="flex items-center p-4">
      {/* Name (Icon + Ticker) */}
      <div className="flex-[2] flex items-center space-x-3">
        {icon && icon}
        <div>
          <span className="font-medium text-white text-base leading-none">
            {ticker}
          </span>
          {name && name !== ticker && (
            <span className="text-gray-400 text-sm leading-none block">
              {name}
            </span>
          )}
        </div>
      </div>

      {/* Spot price */}
      <div className="flex-[2] text-left font-medium text-white">
        {spotPrice}
      </div>

      {/* 24h% */}
      <div className={`flex-1 text-left font-medium ${changeColor}`}>
        {change > 0 ? '+' : ''}
        {change.toFixed(2)}%
      </div>

      {/* Chart */}
      <div className="flex-1 flex justify-center">
        <Sparkline data={chartData} color={chartColor} />
      </div>

      {/* Button */}
      <div className="flex-shrink-0 w-8 ml-2">
        {onOpenPlan && (
          <button
            onClick={() => onOpenPlan(asset.ticker)}
            className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors"
            aria-label={`Create plan for ${ticker}`}
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// --- CREATE PLAN MODAL ---
const CreatePlanModal: React.FC<{
  product: string | null;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1 Days');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const timeframes = ['1 Days', '5 Days', '30 Days', '90 Days', '120 Days'];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0D0F1C] flex flex-col smart-trading-modal">
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Modal Header */}
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={onClose} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Create a plan</h2>
        </header>

        {/* Modal Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-blue-600 p-4 rounded-lg">
            <span className="text-blue-100">Amount Limit:</span>
            <span className="text-black">
              2000-18000 <span className="text-blue-100 currency-sign">USD</span>
            </span>
          </div>

          <div className="flex items-center justify-between bg-blue-600 p-4 rounded-lg">
            <span className="text-blue-100">Daily yield:</span>
            <span className="text-black">0.65%-0.80%</span>
          </div>

          <div className="flex items-center justify-between bg-blue-600 p-4 rounded-lg">
            <span className="text-blue-100">Product:</span>
            <span className="font-semibold text-white">{product || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between bg-blue-600 p-2 rounded-lg relative">
            <span className="text-blue-100 pl-2">Timeframe:</span>
            <div className="bg-black p-3 rounded-lg w-1/2">
              <button
                onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                className="w-full flex justify-between items-center text-white"
              >
                <span>{selectedTimeframe}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isTimeframeOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isTimeframeOpen && (
              <div className="absolute top-full right-0 mt-2 w-1/2 bg-white rounded-xl shadow-2xl z-50 py-2 overflow-hidden">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setSelectedTimeframe(tf);
                      setIsTimeframeOpen(false);
                    }}
                    className="w-full text-center py-3 text-black font-medium text-lg hover:bg-gray-100 transition-colors"
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between bg-blue-600 p-2 rounded-lg">
            <span className="text-blue-100 pl-2">Amount:</span>
            <div className="bg-black p-3 rounded-lg w-1/2">
              <input
                type="text"
                placeholder="Enter investment amount..."
                className="bg-transparent text-white placeholder-gray-500 w-full outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="mt-8">
          <button
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-500 transition-colors"
            onClick={onClose}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

// --- HELPER: Transform API data to SmartAsset format ---
const transformToSmartAsset = (apiAsset: MarketAsset, category: string): SmartAsset => {
  let icon: React.ReactNode = undefined;

  if (category === 'Crypto' && apiAsset.icon) {
    icon = <ImgIcon src={apiAsset.icon} />;
  } else if (category === 'Forex' && apiAsset.flags) {
    icon = <DoubleFlagIcon url1={apiAsset.flags.base} url2={apiAsset.flags.quote} />;
  } else if ((category === 'Stocks' || category === 'ETF') && apiAsset.icon) {
    icon = <ImgIcon src={apiAsset.icon} />;
  } else if (category === 'Stocks' || category === 'ETF') {
    icon = <SimpleIcon txt={apiAsset.ticker.charAt(0)} color="bg-blue-500" />;
  }
  // Futures has no icons as requested

  return {
    id: apiAsset.id,
    ticker: apiAsset.ticker,
    name: apiAsset.name,
    spotPrice: apiAsset.priceFormatted,
    change: apiAsset.changePercent,
    chartData: apiAsset.chartData,
    icon,
  };
};

// --- MAIN COMPONENT ---
const categories = ['Futures', 'Crypto', 'Forex', 'Stocks', 'ETF'];

const SmartTrading: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Futures');
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [smartMarketData, setSmartMarketData] = useState<MarketDataState>({
    Futures: [],
    Crypto: [],
    Forex: [],
    Stocks: [],
    ETF: [],
  });

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    Futures: true,
    Crypto: true,
    Forex: true,
    Stocks: true,
    ETF: true,
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({
    Futures: null,
    Crypto: null,
    Forex: null,
    Stocks: null,
    ETF: null,
  });

  const handleOpenPlan = (ticker: string) => {
    setSelectedProduct(ticker);
    setIsCreatePlanOpen(true);
  };

  const handleClosePlan = () => {
    setIsCreatePlanOpen(false);
    setSelectedProduct(null);
  };

  // Fetch data for a specific category
  const fetchCategoryData = async (category: string) => {
    setLoadingStates(prev => ({ ...prev, [category]: true }));
    setErrors(prev => ({ ...prev, [category]: null }));

    try {
      const apiData = await fetchMarketData(category);
      const assets = apiData.map(item => transformToSmartAsset(item, category));

      setSmartMarketData(prev => ({
        ...prev,
        [category]: assets,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setErrors(prev => ({ ...prev, [category]: errorMessage }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [category]: false }));
    }
  };

  // Fetch all categories on mount
  useEffect(() => {
    categories.forEach(category => {
      fetchCategoryData(category);
    });
  }, []);

  const allAssetsData = smartMarketData[activeCategory] || [];
  const isLoading = loadingStates[activeCategory];
  const error = errors[activeCategory];

  // Combine all assets for search
  const allSearchableAssets: SmartAsset[] = categories.flatMap((cat) =>
    (smartMarketData[cat] || []).map((asset) => ({
      ...asset,
      id: asset.id || `${cat.toLowerCase()}-${asset.ticker.toLowerCase()}`,
      name: asset.name || asset.ticker,
    }))
  );

  const filteredResults = allSearchableAssets.filter(
    (asset) =>
      (asset.name &&
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#0D0F1C] text-white font-sans">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <div className="max-w-md mx-auto relative">
        <Header
          title="Smart trading"
          isSearchOpen={isSearchOpen}
          searchTerm={searchTerm}
          onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
          onSearchChange={setSearchTerm}
        />

        {isSearchOpen ? (
          <div className="px-4 pt-8">
            {filteredResults.length === 0 ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">
                  {searchTerm ? 'No results found' : 'Search for an asset'}
                </h3>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredResults.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    onOpenPlan={handleOpenPlan}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <nav className="px-4 py-2 marginTop-header">
              <div className="bg-[#1F2333] rounded-full flex p-1 categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-1 py-2 px-3 rounded-full category-button text-sm font-medium transition-colors ${activeCategory === category
                      ? 'bg-blue-600 text-white active'
                      : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </nav>

            {/* Loading and Error States */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 size={40} className="animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-64 text-red-500 px-4">
                <p>Error: {error}</p>
                <button
                  onClick={() => fetchCategoryData(activeCategory)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Asset List */}
                <section>
                  <header className="flex text-gray-400 text-sm px-4 py-2">
                    <div className="flex-[2]">Name</div>
                    <div className="flex-[2] text-left">Spot price</div>
                    <div className="flex-1 text-left">24h%</div>
                    <div className="flex-1 text-center">Chart</div>
                    <div className="flex-shrink-0 w-8 ml-2"></div>
                  </header>

                  <div className="divide-y divide-gray-800">
                    {allAssetsData.map((asset) => (
                      <AssetRow
                        key={asset.id || asset.ticker}
                        asset={asset}
                        onOpenPlan={handleOpenPlan}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {isCreatePlanOpen && (
          <CreatePlanModal
            product={selectedProduct}
            onClose={handleClosePlan}
          />
        )}
      </div>
    </div>
  );
};

export default SmartTrading;