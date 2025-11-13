import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Bell,
  Plus,
  ArrowLeft,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import Header from './Header'; // Import the Header component

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

type MarketData = {
  [key: string]: SmartAsset[];
};

// <-- MODIFIED: Added onOpenPlan to the props
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

// --- MOCK DATA (Smart Trading) ---
// (All your mock data arrays like smartFuturesAssets, smartCryptoAssets, etc., stay here)
const smartFuturesAssets: SmartAsset[] = [
  {
    ticker: 'XAU',
    spotPrice: '$4198.66',
    change: 1.72,
    chartData: [10, 15, 12, 18, 20, 25, 23],
  },
  {
    ticker: 'OIL',
    spotPrice: '$62.56',
    change: -3.98,
    chartData: [5, 8, 10, 15, 14, 18, 20],
  },
  {
    ticker: 'NG',
    spotPrice: '$4.04',
    change: 2.83,
    chartData: [2, 4, 3, 5, 7, 6, 8],
  },
  {
    ticker: 'HO',
    spotPrice: '$2.43',
    change: -5.85,
    chartData: [10, 12, 11, 14, 13, 15, 16],
  },
  {
    ticker: 'GASO',
    spotPrice: '$1.85',
    change: -5.03,
    chartData: [30, 25, 28, 20, 22, 18, 15],
  },
  {
    ticker: 'GC',
    spotPrice: '$4208.57',
    change: 1.78,
    chartData: [15, 16, 15, 17, 16, 18, 18],
  },
  {
    ticker: 'SI',
    spotPrice: '$53.51',
    change: 4.77,
    chartData: [20, 22, 21, 25, 24, 28, 30],
  },
  {
    ticker: 'HG',
    spotPrice: '$509.78',
    change: 0.68,
    chartData: [10, 8, 9, 7, 8, 6, 5],
  },
  {
    ticker: 'LHC',
    spotPrice: '$98.32',
    change: -1.3,
    chartData: [10, 12, 15, 14, 17, 18, 20],
  },
  {
    ticker: 'C',
    spotPrice: '$468.40',
    change: -0.23,
    chartData: [10, 12, 15, 14, 17, 18, 20],
  },
];

const smartCryptoAssets: SmartAsset[] = [
  {
    ticker: 'BTC',
    spotPrice: '$68,000',
    change: 2.5,
    chartData: [65000, 66000, 67000, 68000, 69000, 68000, 70000],
  },
  {
    ticker: 'ETH',
    spotPrice: '$3,500',
    change: 1.2,
    chartData: [3400, 3450, 3500, 3550, 3600, 3550, 3650],
  },
  // ... other crypto assets
];

const smartForexAssets: SmartAsset[] = [
  {
    ticker: 'EUR/USD',
    spotPrice: '1.0845',
    change: -0.15,
    chartData: [1.085, 1.084, 1.0835, 1.084, 1.0855, 1.0845, 1.086],
  },
  // ... other forex assets
];

const smartStocksAssets: SmartAsset[] = [
  {
    ticker: 'AAPL',
    spotPrice: '$225.00',
    change: 1.5,
    chartData: [220, 222, 225, 224, 226, 225, 228],
  },
  // ... other stock assets
];

const smartEtfAssets: SmartAsset[] = [
  {
    ticker: 'SPY',
    spotPrice: '$450.00',
    change: 0.2,
    chartData: [445, 448, 450, 449, 451, 450, 452],
  },
  // ... other etf assets
];
// (Keep all your other mock data arrays here)


const categories = ['Futures', 'Crypto', 'Forex', 'Stocks', 'ETF'];

const emptyCategory: SmartAsset[] = [];

// --- HELPER FUNCTIONS ---
const getChangeColor = (change: number) =>
  change >= 0 ? 'text-green-500' : 'text-red-500';

const getChartColor = (change: number) => (change >= 0 ? '#22c55e' : '#ef4444');

const formatCurrency = (
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {}
) => {
  if (value == null) return 'N/A';
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 100 ? 2 : 6,
    ...options,
  };
  return new Intl.NumberFormat('en-US', defaultOptions).format(value);
};

// --- CHILD COMPONENTS ---

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

/**
 * Renders a single row in the Smart Trading asset list.
 * <-- MODIFIED: To match screenshot layout
 */
const AssetRow: React.FC<AssetRowProps> = ({ asset, onOpenPlan }) => {
  const { ticker, spotPrice, change, chartData, name, icon } = asset;
  const changeColor = getChangeColor(change);
  const chartColor = getChartColor(change);

  return (
    <div className="flex items-center p-4">
      {/* Name (Icon + Ticker) */}
      <div className="flex-[2] flex items-center space-x-3">
        {icon ? (
          icon
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-sm">
            {ticker.slice(0, 2)}
          </div>
        )}
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


/**
 * Renders the "Create a plan" modal.
 */
const CreatePlanModal: React.FC<{
  product: string | null;
  onClose: () => void;
}> = ({ product, onClose }) => {
  return (
    // <-- MODIFIED: Added styles for modal overlay
    <div className="absolute inset-0 z-50 bg-[#0D0F1C] p-4">
      {/* Modal Header */}
      <header className="flex items-center space-x-4">
        <button onClick={onClose} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="bg-blue-600 p-2 rounded-lg">
          <Shield size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Create a plan</h2>
      </header>

      {/* Modal Form */}
      <div className="mt-8 space-y-4">
        {/* Form Row */}
        <div className="flex items-center justify-between bg-blue-600 p-4 rounded-lg">
          <span className="text-blue-100">Amount Limit:</span>
          <span className="font-semibold text-white">
            2000-18000 <span className="text-blue-100">USD</span>
          </span>
        </div>

        {/* Form Row */}
        <div className="flex items-center justify-between bg-blue-600 p-4 rounded-lg">
          <span className="text-blue-100">Daily yield:</span>
          <span className="font-semibold text-white">0.65%-0.80%</span>
        </div>

        {/* Form Row */}
        <div className="flex items-center justify-between bg-blue-600 p-4 rounded-lg">
          <span className="text-blue-100">Product:</span>
          <span className="font-semibold text-white">{product || 'N/A'}</span>
        </div>

        {/* Form Row */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 bg-blue-600 p-4 rounded-lg">
            <span className="text-blue-100">Timeframe:</span>
          </div>
          <div classNameclassName="flex-1 bg-black p-4 rounded-lg">
            <button className="w-full flex justify-between items-center text-white">
              <span>1 Days</span>
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {/* Form Row */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 bg-blue-600 p-4 rounded-lg">
            <span className="text-blue-100">Amount:</span>
          </div>
          <div className="flex-1 bg-black p-4 rounded-lg">
            <input
              type="text"
              placeholder="Enter investment amount..."
              className="bg-transparent text-white placeholder-gray-400 w-full outline-none"
            />
          </div>
        </div>
      </div>
      
      {/* <-- ADDED: Create Button at bottom --> */}
      <div className="absolute bottom-4 left-4 right-4">
          <button 
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-500 transition-colors"
            onClick={onClose} // Just closes for now
          >
            Create
          </button>
      </div>

    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  // State definitions
  const [activeCategory, setActiveCategory] = useState<string>('Futures');
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false); // <-- NOW USED
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null); // <-- NOW USED
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(true);
  const [cryptoError, setCryptoError] = useState<string | null>(null);

  const [smartMarketData, setSmartMarketData] = useState<MarketData>({
    Futures: smartFuturesAssets,
    Crypto: smartCryptoAssets,
    Forex: smartForexAssets,
    Stocks: smartStocksAssets,
    ETF: smartEtfAssets,
  });

  // <-- MODIFIED: These handlers are now wired up
  const handleOpenPlan = (ticker: string) => {
    setSelectedProduct(ticker);
    setIsCreatePlanOpen(true);
  };

  const handleClosePlan = () => {
    setIsCreatePlanOpen(false);
    setSelectedProduct(null);
  };

  // Fetch data from CoinGecko API on component mount
  useEffect(() => {
    const fetchCryptoData = async () => {
      setIsLoadingCrypto(true);
      setCryptoError(null);
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data from CoinGecko');
        }
        const data = await response.json();
        const allAssets: SmartAsset[] = data.map((coin: any) => ({
          id: coin.id,
          ticker: coin.symbol.toUpperCase(),
          name: coin.name,
          icon: (
            <img
              src={coin.image}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
              onError={(e) =>
                (e.currentTarget.src =
                  'https://placehold.co/32x32/334155/94a3b8?text=?')
              }
            />
          ),
          change: coin.price_change_percentage_24h || 0,
          spotPrice: formatCurrency(coin.current_price),
          chartData: coin.sparkline_in_7d?.price || [],
        }));

        setSmartMarketData((prevData) => ({
          ...prevData,
          Crypto: allAssets,
        }));
      } catch (err) {
        if (err instanceof Error) {
          setCryptoError(err.message);
        } else {
          setCryptoError(
            'An unknown error occurred while fetching crypto data'
          );
        }
      } finally {
        setIsLoadingCrypto(false);
      }
    };
    fetchCryptoData();
  }, []);

  const allAssetsData =
    smartMarketData[activeCategory as keyof MarketData] || emptyCategory;

  // Combine all assets for search
  const allSearchableAssets: SmartAsset[] = categories.flatMap((cat) =>
    (smartMarketData[cat as keyof MarketData] || []).map((asset) => ({
      ...asset,
      id: asset.id || `${cat.toLowerCase()}-${asset.ticker.toLowerCase()}`,
      name: asset.name || asset.ticker,
      spotPrice: asset.spotPrice,
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
      {/* Style tag to hide scrollbar */}
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
      
      {/* <-- MODIFIED: Added relative position for modal overlay --> */}
      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <Header
          title="Smart trading"
          isSearchOpen={isSearchOpen}
          searchTerm={searchTerm}
          onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
          onSearchChange={setSearchTerm}
        />
        
        {/* Conditional Content */}
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
                {/* <-- MODIFIED: Pass onOpenPlan to search results --> */}
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
                    className={`flex-1 py-2 px-3 rounded-full category-button text-sm font-medium transition-colors ${
                      activeCategory === category
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
            {isLoadingCrypto && activeCategory === 'Crypto' ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 size={40} className="animate-spin text-blue-500" />
              </div>
            ) : cryptoError && activeCategory === 'Crypto' ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                <p>Error: {cryptoError}</p>
              </div>
            ) : (
              <>
                {/* Asset List */}
                <section>
                  {/* <-- MODIFIED: Header updated to match screenshot --> */}
                  <header className="flex text-gray-400 text-sm px-4 py-2">
                    <div className="flex-[2]">Name</div>
                    <div className="flex-[2] text-left">Spot price</div>
                    <div className="flex-1 text-left">24h%</div>
                    <div className="flex-1 text-center">Chart</div>
                    <div className="flex-shrink-0 w-8 ml-2"></div> {/* Spacer */}
                  </header>
                  
                  <div className="divide-y divide-gray-800">
                    {/* <-- MODIFIED: Pass onOpenPlan to main list --> */}
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
        
        {/* <-- MODIFIED: Conditionally render the modal --> */}
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

export default App;