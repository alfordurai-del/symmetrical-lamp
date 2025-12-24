import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { fetchMarketData } from '../services/marketDataService';
import type { MarketAsset } from '../services/marketDataService';

// --- TYPE DEFINITIONS ---
interface FeaturedAssetProps {
  ticker: string;
  exchange: string;
  price: string;
  change: number;
  isActive: boolean;
  id?: string;
  icon?: React.ReactNode;
}

interface FeaturedCardComponentProps extends FeaturedAssetProps {
  onSelect: (ticker: string) => void;
}

interface Asset {
  id: string;
  ticker: string;
  name: string;
  change: number;
  price: string;
  chartData: number[];
  icon?: React.ReactNode;
}

interface AssetRowProps {
  asset: Asset;
  onSelect: (ticker: string) => void;
}

interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

interface AssetCategory {
  featured: FeaturedAssetProps[];
  all: Asset[];
}

type MarketDataState = {
  [key: string]: AssetCategory;
};

// --- HELPER FUNCTIONS ---
const getChangeColor = (change: number) =>
  change >= 0 ? 'text-green-500' : 'text-red-500';

const getChartColor = (change: number) => (change >= 0 ? '#22c55e' : '#ef4444');

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

// --- SPARKLINE COMPONENT ---
const Sparkline: React.FC<SparklineProps> = ({ data, color, width = 100, height = 30 }) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data
    .map((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// --- FEATURED CARD COMPONENT ---
const FeaturedCard: React.FC<FeaturedCardComponentProps> = ({
  ticker,
  price,
  change,
  isActive,
  onSelect,
  icon,
}) => {
  const bgColor = isActive ? 'bg-blue-600' : 'bg-[#1F2333]';
  const textColor = isActive ? 'text-blue-100' : 'text-gray-400';
  const priceColor = isActive ? 'text-white' : 'text-white';
  return (
    <div
      onClick={() => onSelect(ticker)}
      className={`flex-shrink-0 card-font w-36 p-4 rounded-3xl ${bgColor} flex flex-col justify-between cursor-pointer`}
      style={{ height: '180px' }}
    >
      <div className="space-y-1">
        {icon && <div className="mb-2">{icon}</div>}
        <div className={`${priceColor} text-lg font-bold`}>{ticker}</div>
        <div className={`text-sm ${textColor} opacity-60`}>{!icon ? ticker : ''}</div>
      </div>
      <div>
        <div className={`text-sm ${priceColor} mb-1`}>{price}</div>
        <div className={`text-sm font-medium ${change > 0 ? 'text-neon-green' : 'text-neon-red'}`}>
          {change > 0 ? '+' : ''}
          {change?.toFixed(2) || 0}%
        </div>
      </div>
    </div>
  );
};

// --- ASSET ROW COMPONENT ---
const AssetRow: React.FC<AssetRowProps> = ({ asset, onSelect }) => {
  const { ticker, change, price, chartData, icon } = asset;
  const changeColor = getChangeColor(change);
  const chartColor = getChartColor(change);
  return (
    <div
      onClick={() => onSelect(ticker)}
      className="flex items-center p-4 cursor-pointer hover:bg-[#1a1d2d] transition-colors rounded-xl border border-gray-800 mb-2"
    >
      <div className="flex-1 text-left flex items-center space-x-3">
        {icon && <div className='icon-row'>{icon}</div>}
        <span className="font-xs text-white text-sm tracking-wide">{ticker}</span>
      </div>
      <div className={`flex-1 text-center text-sm font-xs ${changeColor}`}>
        {change > 0 ? '+' : ''}
        {change?.toFixed(2) || 0}%
      </div>
      <div className="flex-1">
        <Sparkline data={chartData} color={chartColor} />
      </div>
      <div className="flex-1 text-right font-xs text-white text-sm">{price}</div>
    </div>
  );
};

// --- HELPER: Transform API data to component format ---
const transformToAsset = (apiAsset: MarketAsset, category: string): Asset => {
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
    change: apiAsset.changePercent,
    price: apiAsset.priceFormatted,
    chartData: apiAsset.chartData,
    icon,
  };
};

const transformToFeatured = (asset: Asset, index: number): FeaturedAssetProps => ({
  id: asset.id,
  ticker: asset.ticker,
  exchange: asset.name,
  price: asset.price,
  change: asset.change,
  isActive: index === 0,
  icon: asset.icon,
});

// --- MAIN MARKET COMPONENT ---
const categories = ['Futures', 'Crypto', 'Forex', 'Stocks', 'ETF'];

const emptyCategory: AssetCategory = {
  featured: [],
  all: [],
};

const Market: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Futures');
  const navigate = useNavigate();

  const [marketData, setMarketData] = useState<MarketDataState>({
    Futures: emptyCategory,
    Crypto: emptyCategory,
    Forex: emptyCategory,
    Stocks: emptyCategory,
    ETF: emptyCategory,
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

  const handleAssetSelect = (ticker: string) => {
    // Replace slash with dash to avoid URL routing issues (BTC/USDT -> BTC-USDT)
    const encodedTicker = ticker.toUpperCase().replace('/', '-');
    navigate(`/market/${encodedTicker}`);
  };

  // Fetch data for a specific category
  const fetchCategoryData = async (category: string) => {
    setLoadingStates(prev => ({ ...prev, [category]: true }));
    setErrors(prev => ({ ...prev, [category]: null }));

    try {
      const apiData = await fetchMarketData(category);
      const assets = apiData.map(item => transformToAsset(item, category));
      const featured = assets.slice(0, 5).map((asset, index) => transformToFeatured(asset, index));

      setMarketData(prev => ({
        ...prev,
        [category]: {
          all: assets,
          featured,
        },
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

  // Refresh data when category changes (optional: for real-time updates)
  useEffect(() => {
    // Only refetch if data is stale (more than 1 minute old) - for now, just use cached
    // To enable auto-refresh, uncomment:
    // fetchCategoryData(activeCategory);
  }, [activeCategory]);

  const { featured: featuredAssetsData, all: allAssetsData } =
    marketData[activeCategory] || emptyCategory;

  const isLoading = loadingStates[activeCategory];
  const error = errors[activeCategory];

  const allSearchableAssets = categories.flatMap(cat => marketData[cat]?.all || []);

  const filteredResults = allSearchableAssets.filter(
    (asset) =>
      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#0D0F1C] text-white font-sans">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="max-w-md mx-auto bg-[#010117]">
        <Header
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
              <div className="">
                {filteredResults.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    onSelect={handleAssetSelect}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <nav className="px-4 py-2 marginTop-header">
              <div className="bg-[#1F2333] rounded-full flex p-2 categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-1 py-2 px-3 rounded-full category-button text-sm font-medium transition-colors ${activeCategory === category
                      ? 'bg-black text-blue-500 active'
                      : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </nav>

            {isLoading ? (
              <div className="flex justify-center items-center h-86">
                <Loader2 size={40} className="animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-86 text-red-500 px-4">
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
                {/* Featured Cards Scroller */}
                <section className="py-6">
                  <div className="flex overflow-x-auto space-x-4 px-4 pb-2 no-scrollbar">
                    {featuredAssetsData.map((asset, index) => (
                      <FeaturedCard
                        key={asset.id || asset.ticker}
                        {...asset}
                        isActive={index === 0}
                        onSelect={handleAssetSelect}
                      />
                    ))}
                  </div>
                </section>

                {/* Asset List */}
                <section>
                  <header className="flex justify-between text-xs text-gray-400 font-medium px-4 mb-2 tracking-wider">
                    <div className="flex-1 text-left">Name</div>
                    <div className="flex-1 text-center">24h%</div>
                    <div className="flex-1 text-center">Chart</div>
                    <div className="flex-1 text-right">Price</div>
                  </header>
                  <div className="">
                    {allAssetsData.map((asset) => (
                      <AssetRow
                        key={asset.id}
                        asset={asset}
                        onSelect={handleAssetSelect}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Market;