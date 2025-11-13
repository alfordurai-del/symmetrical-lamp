import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- ADDED
import { Icon } from '@iconify/react';
import Header from './Header'; 
import { DollarSign, TrendingUp, TrendingDown, Bitcoin, Droplets } from 'lucide-react';


// --- TYPE DEFINITIONS ---
interface FeaturedAssetProps {
  ticker: string;
  exchange: string;
  price: string;
  change: number;
  icon: React.ReactNode;
  isActive: boolean;
  id?: string; // <-- ADDED: For unique keys from crypto API
}

// <-- ADDED: New type for the component's props
interface FeaturedCardComponentProps extends FeaturedAssetProps {
  onSelect: (ticker: string) => void;
}

interface Asset {
  id: string; 
  ticker: string; 
  name: string; 
  icon: React.ReactNode; 
  change: number;
  price: string;
  chartData: number[];
}

interface AssetRowProps {
  asset: Asset;
  onSelect: (ticker: string) => void; // <-- ADDED
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

type MarketData = {
  [key: string]: AssetCategory;
};

// --- API & HELPER FUNCTIONS (Unchanged) ---

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: amount < 1 ? 8 : 2,
  }).format(amount);
};

const getChangeColor = (change: number) =>
  change >= 0 ? 'text-green-500' : 'text-red-500';

const getChartColor = (change: number) => (change >= 0 ? '#22c55e' : '#ef4444');

// --- ICONS (Unchanged) ---
// (All your Icon components remain here)
// ...
// Futures/ETF Generic Text Icons (like VPU, RYU)
const GenericTextIcon: React.FC<{ text: string }> = ({ text }) => (
  <div className="bg-gray-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">
    {text.substring(0, 1)}
  </div>
);

// Futures specific icons for the images
const IconXAU = () => (<div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm">Au</div>);
const IconNG = () => (<div className="bg-gradient-to-br from-blue-300 to-blue-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">NG</div>);
const IconHO = () => (<div className="bg-orange-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">HO</div>);
const IconCL = () => (<div className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">CL</div>);
const IconOIL = () => (<div className="bg-gray-800 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">OIL</div>);
const IconGASO = () => (<div className="bg-red-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">GO</div>);
const IconGC = () => (<div className="bg-yellow-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">GC</div>);
const IconSI = () => (<div className="bg-blue-300 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">SI</div>);

// Forex Flag Icons
const FlagIcon: React.FC<{ code: string }> = ({ code }) => {
  let flag = '';
  switch (code) {
    case 'EUR': flag = '🇪🇺'; break;
    case 'USD': flag = '🇺🇸'; break;
    case 'HKD': flag = '🇭🇰'; break;
    case 'GBP': flag = '🇬🇧'; break;
    case 'CNH': flag = '🇨🇳'; break;
    case 'JPY': flag = '🇯🇵'; break;
    case 'CHF': flag = '🇨🇭'; break;
    case 'SGD': flag = '🇸🇬'; break;
    default: flag = '🌐';
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1F2333] text-lg">
      {flag}
    </div>
  );
};

// Stock Icons (using placeholder images for logos)
const IconMSFT = () => (<img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="MSFT" className="w-8 h-8 p-1 rounded-lg bg-white" />);
const IconAAPL = () => (<img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="AAPL" className="w-8 h-8 p-1 rounded-lg bg-white" />);
const IconAMZN = () => (<img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="AMZN" className="w-8 h-8 p-1 rounded-lg bg-white" />);
const IconSOHU = () => (<div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">SH</div>);
const IconGOOG = () => (<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="GOOG" className="w-8 h-8 p-1 rounded-lg bg-white" />);
const IconNETE = () => (<div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">NT</div>);
const IconTM = () => (<img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Toyota_logo_white.svg" alt="TM" className="w-8 h-8 p-1 rounded-lg bg-red-600" />);

// ETF Icons (based on the images, VPU, RYU, XLU, FUTY, ICF, QLD, ITB are text-based or abstract)
const IconVPU = () => (<div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm">V</div>);
const IconRYU = () => (<div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#003A70"/><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#003A70" strokeWidth="2" strokeLinejoin="round"/><path d="M12 12L22 7M12 12V22M12 12L2 7M17 4.5L7 9.5" stroke="white" strokeWidth="1.5"/></svg></div>);
const IconXLU = () => (<div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center p-1"><svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#000" width="20"><path d="M20,30 L20,70 L35,70 L35,55 L50,55 L50,70 L65,70 L65,30 L50,30 L50,45 L35,45 L35,30 Z M75,30 L90,30 L90,70 L75,70 Z"/></svg></div>);
const IconFUTY = () => (<div className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 12m-5 0a5 5 0 1 0 10 0 5 5 0 1 0-10 0"/></svg></div>);
const IconICF = () => (<div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" width="20"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg></div>);
const IconQLD = () => (<div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" width="20"><path d="M12 2L2 7l10 5 10-5L12 2zm0 11.5L3.5 9 2 10.5l10 5 10-5L20.5 9 12 13.5zm0 6.5L3.5 15 2 16.5l10 5 10-5L20.5 15 12 20z"/></svg></div>);
const IconITB = () => (<div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" width="20"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg></div>);
// ...

// --- MOCK DATA (Unchanged) ---
const futuresAssets: AssetCategory = {
  featured: [
    { ticker: 'XAU', exchange: 'XAU', price: '$4197.44', change: 1.69, icon: <IconXAU />, isActive: true },
    { ticker: 'NG', exchange: 'NG', price: '$3.94', change: 0.28, icon: <IconNG />, isActive: false },
    { ticker: 'HO', exchange: 'HO', price: '$2.51', change: -2.75, icon: <IconHO />, isActive: false },
    { ticker: 'CL', exchange: 'CL', price: '$58.41', change: -4.18, icon: <IconCL />, isActive: false },
  ],
 all: [
  // --- Commodities ---
  { id: 'xau', ticker: 'XAU', name: 'Gold', icon: <IconXAU />, change: 1.69, price: '$2,197.44', chartData: [10, 12, 11, 14, 15, 13, 16] },
  { id: 'xag', ticker: 'XAG', name: 'Silver', icon: <DollarSign />, change: 0.83, price: '$25.11', chartData: [8, 9, 10, 9, 11, 12, 13] },
  { id: 'oil', ticker: 'OIL', name: 'Crude Oil', icon: <IconOIL />, change: -3.91, price: '$82.60', chartData: [16, 14, 15, 12, 11, 13, 10] },
  { id: 'ng', ticker: 'NG', name: 'Natural Gas', icon: <Icon icon="mdi:gas" />, change: 2.15, price: '$3.12', chartData: [5, 6, 6, 7, 8, 7, 9] },

  // --- Cryptocurrencies ---
  { id: 'btc', ticker: 'BTC', name: 'Bitcoin', icon: <Icon icon="mdi:btc" />, change: 4.25, price: '$67,440.20', chartData: [25, 27, 28, 26, 29, 32, 35] },
  { id: 'eth', ticker: 'ETH', name: 'Ethereum', icon: <Icon icon="mdi:eth" />, change: 3.80, price: '$3,580.50', chartData: [20, 21, 22, 23, 25, 24, 27] },
  { id: 'bnb', ticker: 'BNB', name: 'Binance Coin', icon: <Icon icon="mdi:bnb" />, change: 2.55, price: '$412.33', chartData: [10, 11, 12, 11, 13, 14, 15] },
  { id: 'sol', ticker: 'SOL', name: 'Solana', icon: <Icon icon="mdi:solana" />, change: 5.10, price: '$168.42', chartData: [7, 8, 9, 8, 10, 12, 13] },
  { id: 'xrp', ticker: 'XRP', name: 'Ripple', icon: <Icon icon="mdi:xrp" />, change: -1.80, price: '$0.59', chartData: [4, 4, 5, 4, 6, 5, 5] },
  { id: 'ada', ticker: 'ADA', name: 'Cardano', icon: <Icon icon="mdi:ada" />, change: 0.91, price: '$0.49', chartData: [3, 3, 4, 5, 5, 6, 7] },
  { id: 'doge', ticker: 'DOGE', name: 'Dogecoin', icon: <Icon icon="mdi:doge" />, change: 6.32, price: '$0.17', chartData: [1, 2, 3, 2, 3, 4, 5] },
  { id: 'dot', ticker: 'DOT', name: 'Polkadot', icon: <Icon icon="mdi:polkadot" />, change: -0.45, price: '$9.21', chartData: [6, 6, 5, 7, 8, 9, 10] },
  { id: 'avax', ticker: 'AVAX', name: 'Avalanche', icon: <Icon icon="mdi:avalanche" />, change: 3.77, price: '$44.88', chartData: [5, 6, 7, 8, 9, 10, 12] },
  { id: 'matic', ticker: 'MATIC', name: 'Polygon', icon: <Icon icon="mdi:polygon" />, change: 1.12, price: '$0.92', chartData: [3, 3, 4, 4, 5, 5, 6] },]
};
const forexAssets: AssetCategory = {
  featured: [
    { ticker: 'EUR/USD', exchange: 'US Dollar', price: '1.1544', change: -0.36, icon: <FlagIcon code="EUR" />, isActive: true },
    { ticker: 'USD/HKD', exchange: 'USDHKD', price: '7.7698', change: -0.02, icon: <FlagIcon code="HKD" />, isActive: false },
    { ticker: 'GBP/USD', exchange: 'US Dollar', price: '1.3133', change: -0.26, icon: <FlagIcon code="GBP" />, isActive: false },
  ],
  all: [
    { id: 'usd/cnh', ticker: 'USD/CNH', name: 'USD/CNH', icon: <FlagIcon code="CNH" />, change: -0.20, price: '7.1076', chartData: [16, 14, 15, 12, 11, 13, 10] },
    { id: 'usd/jpy', ticker: 'USD/JPY', name: 'USD/JPY', icon: <FlagIcon code="JPY" />, change: 0.45, price: '154.7044', chartData: [10, 12, 11, 14, 15, 13, 16] },
    { id: 'eur/usd', ticker: 'EUR/USD', name: 'EUR/USD', icon: <FlagIcon code="EUR" />, change: -0.36, price: '1.1544', chartData: [15, 14, 13, 12, 11, 10, 9] },
    { id: 'usd/chf', ticker: 'USD/CHF', name: 'USD/CHF', icon: <FlagIcon code="CHF" />, change: 0.27, price: '0.8026', chartData: [20, 22, 21, 24, 25, 23, 26] },
    { id: 'usd/hkd', ticker: 'USD/HKD', name: 'USD/HKD', icon: <FlagIcon code="HKD" />, change: -0.02, price: '7.7698', chartData: [10, 10.1, 10, 9.9, 10, 10.1, 10] },
    { id: 'usd/sgd', ticker: 'USD/SGD', name: 'USD/SGD', icon: <FlagIcon code="SGD" />, change: 0.29, price: '1.3050', chartData: [5, 6, 8, 7, 9, 10, 12] },
    { id: 'gbp/usd', ticker: 'GBP/USD', name: 'GBP/USD', icon: <FlagIcon code="GBP" />, change: -0.26, price: '1.3133', chartData: [30, 28, 25, 22, 20, 18, 17] },
  ],
};

const stocksAssets: AssetCategory = {
  featured: [
    { ticker: 'MSFT', exchange: 'Microsoft', price: '$508.6810', change: 0.77, icon: <IconMSFT />, isActive: true },
    { ticker: 'AAPL', exchange: 'Apple Inc', price: '$275.2554', change: 2.02, icon: <IconAAPL />, isActive: false },
    { ticker: 'AMZN', exchange: 'Amazon.com', price: '$249.0997', change: 0.28, icon: <IconAMZN />, isActive: false },
  ],
  all: [
    { id: 'sohu', ticker: 'SOHU', name: 'Sohu.com Ltd', icon: <IconSOHU />, change: -0.44, price: '$14.9643', chartData: [16, 14, 15, 12, 11, 13, 10] },
    { id: 'goog', ticker: 'GOOG', name: 'Alphabet', icon: <IconGOOG />, change: 1.24, price: '$291.3098', chartData: [10, 12, 11, 14, 15, 13, 16] },
    { id: 'msft', ticker: 'MSFT', name: 'Microsoft', icon: <IconMSFT />, change: 0.77, price: '$508.6810', chartData: [20, 22, 21, 24, 25, 23, 26] },
    { id: 'aapl', ticker: 'AAPL', name: 'Apple Inc', icon: <IconAAPL />, change: 2.02, price: '$275.2554', chartData: [15, 17, 18, 19, 21, 20, 22] },
    { id: 'nete', ticker: 'NETE', name: 'NetEase Inc', icon: <IconNETE />, change: 0.90, price: '$142.3740', chartData: [5, 6, 8, 7, 9, 10, 12] },
    { id: 'tm', ticker: 'TM', name: 'Toyota Motor', icon: <IconTM />, change: 0.78, price: '$205.9872', chartData: [10, 12, 11, 14, 15, 13, 16] },
    { id: 'amzn', ticker: 'AMZN', name: 'Amazon.com', icon: <IconAMZN />, change: 0.28, price: '$249.0997', chartData: [30, 28, 25, 22, 20, 18, 17] },
  ],
};

const etfAssets: AssetCategory = {
  featured: [
    { ticker: 'VPU', exchange: 'NYSEARCA', price: '$194.5698', change: -0.10, icon: <IconVPU />, isActive: true },
    { ticker: 'RYU', exchange: 'NYSEARCA', price: '$78.3212', change: -0.01, icon: <IconRYU />, isActive: false },
    { ticker: 'XLU', exchange: 'NYSEARCA', price: '$89.7602', change: -0.01, icon: <IconXLU />, isActive: false },
    { ticker: 'FUTY', exchange: 'NYSEARCA', price: '$57.9898', change: -0.02, icon: <IconFUTY />, isActive: false },
  ],
  all: [
    { id: 'vpu', ticker: 'VPU', name: 'VPU', icon: <IconVPU />, change: -0.10, price: '$194.5698', chartData: [16, 14, 15, 12, 11, 13, 10] },
    { id: 'ryu', ticker: 'RYU', name: 'RYU', icon: <IconRYU />, change: -0.01, price: '$78.3212', chartData: [10, 12, 11, 14, 15, 13, 16] },
    { id: 'xlu', ticker: 'XLU', name: 'XLU', icon: <IconXLU />, change: -0.01, price: '$89.7602', chartData: [20, 22, 21, 24, 25, 23, 26] },
    { id: 'futy', ticker: 'FUTY', name: 'FUTY', icon: <IconFUTY />, change: -0.02, price: '$57.9898', chartData: [15, 14, 13, 12, 11, 10, 9] },
    { id: 'icf', ticker: 'ICF', name: 'ICF', icon: <IconICF />, change: -0.25, price: '$61.5159', chartData: [30, 28, 25, 22, 20, 18, 17] },
    { id: 'qld', ticker: 'QLD', name: 'QLD', icon: <IconQLD />, change: -1.44, price: '$144.7985', chartData: [10, 12, 11, 14, 15, 13, 10] },
    { id: 'itb', ticker: 'ITB', name: 'ITB', icon: <IconITB />, change: -0.20, price: '$99.5606', chartData: [5, 6, 8, 7, 9, 10, 12] },
  ],
};


// --- CHILD COMPONENTS (Sparkline, FeaturedCard, AssetRow) ---

const Sparkline: React.FC<SparklineProps> = ({
  // (Unchanged)
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

// <-- MODIFIED: Changed props to use new type
const FeaturedCard: React.FC<FeaturedCardComponentProps> = ({
  ticker,
  exchange,
  price,
  change,
  icon,
  isActive,
  onSelect, // <-- MODIFIED
}) => {
  const bgColor = isActive ? 'bg-blue-600' : 'bg-[#1F2333]';
  const textColor = isActive ? 'text-blue-100' : 'text-gray-400';
  const priceColor = isActive ? 'text-white' : 'text-white';
  return (
    <div
      onClick={() => onSelect(ticker)} // <-- MODIFIED
      className={`flex-shrink-0 w-40 p-4 rounded-2xl ${bgColor} space-y-2 cursor-pointer`} // <-- MODIFIED
    >
      <div className="flex items-center space-x-2">
        {icon}
        <div>
          <div className={`font-bold text-lg ${priceColor}`}>{ticker}</div>
          <div className={`text-xs ${textColor} truncate`}>{exchange}</div>
        </div>
      </div>
      <div>
        <div className={`font-bold text-xl ${priceColor}`}>{price}</div>
        <div className={`text-sm font-medium ${getChangeColor(change)}`}>
          {change > 0 ? '+' : ''}
          {change?.toFixed(2) || 0}%
        </div>
      </div>
    </div>
  );
};

// <-- MODIFIED: Added onSelect to destructuring
const AssetRow: React.FC<AssetRowProps> = ({ asset, onSelect }) => {
  const { ticker, icon, change, price, chartData } = asset;
  const changeColor = getChangeColor(change);
  const chartColor = getChartColor(change);
  return (
    <div
      onClick={() => onSelect(ticker)} // <-- MODIFIED
      className="flex items-center p-4 cursor-pointer" // <-- MODIFIED
    >
      <div className="flex-1 flex items-center space-x-3">
        {icon}
        <span className="font-medium text-white">{ticker}</span>
      </div>
      <div className={`flex-1 text-left font-medium ${changeColor}`}>
        {change > 0 ? '+' : ''}
        {change?.toFixed(2) || 0}%
      </div>
      <div className="flex-1 flex justify-center">
        <Sparkline data={chartData} color={chartColor} />
      </div>
      <div className="flex-1 text-right font-medium text-white">{price}</div>
    </div>
  );
};

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
  const navigate = useNavigate(); // <-- ADDED

  const [marketData, setMarketData] = useState<MarketData>({
    Futures: futuresAssets,
    Crypto: emptyCategory, 
    Forex: forexAssets,
    Stocks: stocksAssets,
    ETF: etfAssets,
  });
  
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(true); 
  const [cryptoError, setCryptoError] = useState<string | null>(null);

  // --- ADDED: Navigation handler ---
  const handleAssetSelect = (ticker: string) => {
    // Navigate to the detail page, using the ticker for the URL
    // e.g., /market/OIL, /market/BTC
    navigate(`/market/${ticker.toUpperCase()}`);
  };

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

        const allAssets: Asset[] = data.map((coin: any) => ({
          id: coin.id,
          ticker: coin.symbol.toUpperCase(),
          name: coin.name,
          icon: (
            <img
              src={coin.image}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/32x32/334155/94a3b8?text=?')}
            />
          ),
          change: coin.price_change_percentage_24h || 0,
          price: formatCurrency(coin.current_price),
          chartData: coin.sparkline_in_7d?.price || [],
        }));

        // <-- MODIFIED: Ensure 'id' is included in featured data
        const featuredAssets: FeaturedAssetProps[] = allAssets
          .slice(0, 5) 
          .map((asset, index) => ({
            id: asset.id, // <-- MODIFIED
            ticker: asset.ticker,
            exchange: asset.name,
            price: asset.price,
            change: asset.change,
            icon: asset.icon,
            isActive: index === 0, 
          }));
        
        setMarketData((prevData) => ({
          ...prevData,
          Crypto: {
            all: allAssets,
            featured: featuredAssets,
          },
        }));

      } catch (err) {
        if (err instanceof Error) {
          setCryptoError(err.message);
        } else {
          setCryptoError('An unknown error occurred while fetching crypto data');
        }
      } finally {
        setIsLoadingCrypto(false);
      }
    };

    fetchCryptoData();
  }, []); 

  const { featured: featuredAssetsData, all: allAssetsData } =
    marketData[activeCategory];
    
  const allSearchableAssets = categories.flatMap(cat => marketData[cat].all);

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

      <div className="max-w-md mx-auto">
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
              <div className="divide-y divide-gray-800">
                {/* <-- MODIFIED: Pass onSelect prop */}
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
              {/* ... (tabs are unchanged) ... */}
              <div className="bg-[#1F2333] rounded-full flex p-1 categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      setActiveCategory(category)
                    }
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

            {isLoadingCrypto && activeCategory === 'Crypto' ? (
              // ... (loading state is unchanged) ...
              <div className="flex justify-center items-center h-64">
                <Loader2 size={40} className="animate-spin text-blue-500" />
              </div>
            ) : cryptoError && activeCategory === 'Crypto' ? (
              // ... (error state is unchanged) ...
              <div className="flex justify-center items-center h-64 text-red-500">
                <p>Error: {cryptoError}</p>
              </div>
            ) : (
              <>
                {/* Featured Cards Scroller */}
                <section className="py-4">
                  <div className="flex overflow-x-auto space-x-4 px-4 pb-2 no-scrollbar">
                    {/* <-- MODIFIED: Pass onSelect prop */}
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
                  <header className="flex text-gray-400 text-sm px-4 py-2">
                    {/* ... (header is unchanged) ... */}
                    <div className="flex-1">Name</div>
                    <div className="flex-1 text-left">24h%</div>
                    <div className="flex-1 text-center">Chart</div>
                    <div className="flex-1 text-right">Price</div>
                  </header>
                  <div className="divide-y divide-gray-800">
                    {/* <-- MODIFIED: Pass onSelect prop */}
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