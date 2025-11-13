// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import Market from './components/Market';
import SmartTrading from './components/SmartTrading';
import Account from './components/Account';
import Borrow from './components/borrow';
import MarketDetail from './components/MarketDetail';
import StartVerification from './components/StartVerification';

// Sample data for Futures (updated with approximate real-time values as of Nov 2025 simulation)
export interface MarketItem {
  symbol: string;
  name: string;
  change24h: number;
  price: string;
  icon: string;
  bgColor?: string;
  chartUrl?: string;
}

export const futuresItems: MarketItem[] = [
  {
    symbol: 'XAU',
    name: 'Gold Spot',
    change24h: 2.37,
    price: '4,103.82',
    icon: 'Au',
    bgColor: 'bg-yellow-500',
  },
  {
    symbol: 'OIL',
    name: 'Crude Oil',
    change24h: 0.07,
    price: '60.61',
    icon: '🛢️',
    bgColor: 'bg-black',
  },
  {
    symbol: 'NG',
    name: 'Natural Gas',
    change24h: -0.64,
    price: '4.35',
    icon: 'NG',
    bgColor: 'bg-blue-500',
  },
  {
    symbol: 'HO',
    name: 'Heating Oil',
    change24h: -0.50, // Approximate
    price: '2.44',
    icon: '🔥',
    bgColor: 'bg-orange-500',
  },
  {
    symbol: 'GASO',
    name: 'Gasoline RBOB',
    change24h: 0.10,
    price: '1.96',
    icon: '⛽',
    bgColor: 'bg-gray-500',
  },
  {
    symbol: 'GC',
    name: 'Gold Futures',
    change24h: 2.37,
    price: '4,103.82',
    icon: 'GC',
    bgColor: 'bg-yellow-600',
  },
  {
    symbol: 'SI',
    name: 'Silver Futures',
    change24h: 4.77,
    price: '50.45',
    icon: 'Ag',
    bgColor: 'bg-gray-400',
  },
];

// Sample data for ETFs (updated with available real-time values)
export const etfItems: MarketItem[] = [
  {
    symbol: 'VPU',
    name: 'Vanguard Utilities ETF',
    change24h: 0.46, // Approximate from recent
    price: '195.67',
    icon: 'V',
    bgColor: 'bg-red-500',
  },
  {
    symbol: 'RYU',
    name: 'Invesco S&P 500 Equal Weight Utilities ETF',
    change24h: 1.19,
    price: '78.10',
    icon: 'RYU',
    bgColor: 'bg-blue-500',
  },
  {
    symbol: 'XLU',
    name: 'Utilities Select Sector SPDR Fund',
    change24h: 0.28,
    price: '90.36',
    icon: 'X',
    bgColor: 'bg-green-500',
  },
  {
    symbol: 'FUTY',
    name: 'Fidelity MSCI Utilities Index ETF',
    change24h: 1.84,
    price: '58.00',
    icon: 'F',
    bgColor: 'bg-green-600',
  },
  {
    symbol: 'IDU',
    name: 'iShares U.S. Utilities ETF',
    change24h: 0.35,
    price: '85.20',
    icon: 'IDU',
    bgColor: 'bg-black',
  },
];

// Additional sample data for other tabs (Crypto, Forex, Stocks) - placeholders
export const cryptoItems: MarketItem[] = [
  { symbol: 'BTC', name: 'Bitcoin', change24h: 2.5, price: '95,000.00', icon: '₿', bgColor: 'bg-orange-500' },
  { symbol: 'ETH', name: 'Ethereum', change24h: 1.2, price: '4,200.00', icon: 'Ξ', bgColor: 'bg-purple-500' },
  // Add more...
];

export const forexItems: MarketItem[] = [
  { symbol: 'EURUSD', name: 'EUR/USD', change24h: 0.15, price: '1.0850', icon: '€$', bgColor: 'bg-blue-600' },
  { symbol: 'GBPUSD', name: 'GBP/USD', change24h: -0.08, price: '1.2950', icon: '£$', bgColor: 'bg-green-600' },
  // Add more...
];

export const stocksItems: MarketItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', change24h: 1.1, price: '250.00', icon: 'A', bgColor: 'bg-gray-600' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', change24h: 0.9, price: '180.00', icon: 'G', bgColor: 'bg-red-500' },
  // Add more...
];

const getItemsForAssetClass = (assetClass: string): MarketItem[] => {
  switch (assetClass) {
    case 'Futures': return futuresItems;
    case 'Crypto': return cryptoItems;
    case 'Forex': return forexItems;
    case 'Stocks': return stocksItems;
    case 'ETF': return etfItems;
    default: return futuresItems;
  }
};

// MarketWrapper to handle local state for asset class
const MarketWrapper: React.FC = () => {
  const [activeAssetClass, setActiveAssetClass] = useState<'Futures' | 'Crypto' | 'Forex' | 'Stocks' | 'ETF'>('Futures');

  return (
    <Market
      assetClass={activeAssetClass}
      items={getItemsForAssetClass(activeAssetClass)}
      onAssetClassChange={setActiveAssetClass}
    />
  );
};

// BottomNavigation with router hooks (updated for 4 tabs)
const BottomNavWithRouter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === '/') return 'chart';
    if (location.pathname === '/loan') return 'dollar';
    if (location.pathname === '/wallet') return 'wallet';
    if (location.pathname === '/account') return 'account';
    return 'chart';
  };

  const handleTabChange = (tab: 'chart' | 'dollar' | 'wallet' | 'account') => {
    switch (tab) {
      case 'chart':
        navigate('/');
        break;
      case 'dollar':
        navigate('/smart');
        break;
      case 'wallet':
        navigate('/wallet');
        break;
      case 'account':
        navigate('/account');
        break;
    }
  };

  return (
    <BottomNavigation
      activeTab={getActiveTab()}
      onTabChange={handleTabChange}
    />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<MarketWrapper />} />
          <Route path="/smart" element={<SmartTrading />} />
          <Route path="/wallet" element={<Borrow />} />
          <Route path="/kyc" element={<StartVerification />} />
          <Route path="/market/:ticker" element={<MarketDetail />} />
          <Route path="/account" element={<Account />} /> {/* Or a different component for account/settings */}
        </Routes>
        <BottomNavWithRouter />
      </div>
    </Router>
  );
};

export default App;