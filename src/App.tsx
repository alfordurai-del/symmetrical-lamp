// App.tsx
import React, { useState, useEffect } from 'react'; // Unchanged
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // Unchanged
import BottomNavigation from './components/BottomNavigation'; // Unchanged
import Market from './components/Market'; // Unchanged
import SmartTrading from './components/SmartTrading'; // Unchanged
import Account from './components/Account'; // Unchanged
import Borrow from './components/Borrow'; // Unchanged
import MarketDetail from './components/MarketDetail'; // Unchanged
import StartVerification from './components/StartVerification'; // Unchanged

import ConnectWalletGate from './components/ConnectWalletGate'; // Unchanged
import { Loader2 } from 'lucide-react'; // Unchanged

// ...
// All your data (MarketItem, futuresItems, etfItems, etc.) is unchanged
// ...
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
  // ... rest of your data
];

export const etfItems: MarketItem[] = [
  {
    symbol: 'VPU',
    name: 'Vanguard Utilities ETF',
    change24h: 0.46, 
    price: '195.67',
    icon: 'V',
    bgColor: 'bg-red-500',
  },
  // ... rest of your data
];

export const cryptoItems: MarketItem[] = [
  { symbol: 'BTC', name: 'Bitcoin', change24h: 2.5, price: '95,000.00', icon: '₿', bgColor: 'bg-orange-500' },
  { symbol: 'ETH', name: 'Ethereum', change24h: 1.2, price: '4,200.00', icon: 'Ξ', bgColor: 'bg-purple-500' },
];

export const forexItems: MarketItem[] = [
  { symbol: 'EURUSD', name: 'EUR/USD', change24h: 0.15, price: '1.0850', icon: '€$', bgColor: 'bg-blue-600' },
  { symbol: 'GBPUSD', name: 'GBP/USD', change24h: -0.08, price: '1.2950', icon: '£$', bgColor: 'bg-green-600' },
];

export const stocksItems: MarketItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', change24h: 1.1, price: '250.00', icon: 'A', bgColor: 'bg-gray-600' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', change24h: 0.9, price: '180.00', icon: 'G', bgColor: 'bg-red-500' },
];

// ...
// All your components (getItemsForAssetClass, MarketWrapper, BottomNavWithRouter, MainApp) are unchanged
// ...
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

const BottomNavWithRouter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === '/') return 'chart';
    if (location.pathname === '/smart') return 'dollar';
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

const MainApp: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<MarketWrapper />} />
        <Route path="/smart" element={<SmartTrading />} />
        <Route path="/wallet" element={<Borrow />} />
        <Route path="/kyc" element={<StartVerification />} />
        <Route path="/market/:ticker" element={<MarketDetail />} />
        <Route path="/account" element={<Account />} /> 
      </Routes>
      <BottomNavWithRouter />
    </div>
  );
}


const App: React.FC = () => {
  
  const [isDAppBrowser, setIsDAppBrowser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- MODIFIED LOGIC ---
  useEffect(() => {
    // Check if we are on a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    // Check if a wallet is injected
    const hasEthereum = typeof (window as any).ethereum !== 'undefined';

    // We only set to 'true' if the user is on a mobile device AND has a wallet
    if (isMobile && hasEthereum) {
      setIsDAppBrowser(true);
    } else {
      // All other cases (desktop browser with extension, mobile without wallet, etc.)
      setIsDAppBrowser(false);
    }
    
    setIsLoading(false); 
  }, []); 
  // --- END OF MODIFIED LOGIC ---


  if (isLoading) {
    return (
      <div className="bg-[#0D0F1C] text-white min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <Router>
      {isDAppBrowser ? <MainApp /> : <ConnectWalletGate />}
    </Router>
  );
};

export default App;