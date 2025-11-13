import React, { useRef, useEffect } from 'react';
import { Shield, Search, Bell, X } from 'lucide-react';

interface Asset {
  id: string;
  ticker: string;
  name: string;
  icon?: React.ReactNode;
  change: number;
  price: string;
  chartData: number[];
}

// Define the props the Header component expects
interface MarketHeaderProps {
  title?: string;
  isSearchOpen: boolean;
  searchTerm: string;
  onSearchToggle: () => void;
  onSearchChange: (term: string) => void;
  assets?: Asset[];
}

const Header: React.FC<MarketHeaderProps> = ({
  title = "Market",
  isSearchOpen,
  searchTerm,
  onSearchToggle,
  onSearchChange,
  assets,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onSearchToggle();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, onSearchToggle]);

  const filteredAssets = assets?.filter(
    (asset) =>
      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getChangeColor = (change: number) =>
    change >= 0 ? 'text-green-500' : 'text-red-500';

  const SearchAssetRow: React.FC<{ asset: Asset }> = ({ asset }) => {
    const { ticker, icon, price, change } = asset;
    return (
      <div className="flex justify-between items-center p-3 hover:bg-[#2D3142] rounded-lg">
        <div className="flex items-center space-x-3 flex-1">
          {icon}
          <span className="font-medium text-white">{ticker}</span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-medium text-white text-sm">{price}</div>
          <div className={`text-xs ${getChangeColor(change)}`}>
            {change > 0 ? '+' : ''}
            {change.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="relative flex justify-between items-center p-4 header-market">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onSearchToggle}
            className="text-gray-400"
          >
            <Search size={24} />
          </button>
          <Bell size={24} className="text-gray-400" />
        </div>
        {isSearchOpen && (
          <div 
            ref={popupRef}
            className="absolute top-full left-0 w-full mt-2 bg-[#1F2333] rounded-xl shadow-lg z-10 max-h-96 overflow-y-auto"
          >
            <div className="p-4">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search here..."
                  className="w-full pl-10 pr-4 py-2 bg-[#2D3142] border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              {searchTerm === '' ? (
                <div className="text-center py-8">
                  <p className="text-white font-medium text-lg">Nothing found yet!</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white font-medium text-lg">No results found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredAssets.map((asset) => (
                    <SearchAssetRow key={asset.id} asset={asset} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={onSearchToggle}
        />
      )}
    </>
  );
};

export default Header;