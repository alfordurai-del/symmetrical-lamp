// components/BottomNavigation.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import iconChart from '../assets/icon_nav2.b05112d7.svg';
import iconDollar from '../assets/icon_nav5.bc036441.svg';
import iconWallet from '../assets/icon_nav4.4b68558c.svg';
import iconAccount from '../assets/icon_nav6.bcec3ea0.svg';

interface BottomNavigationProps {
  activeTab?: 'chart' | 'dollar' | 'wallet' | 'account';
  onTabChange?: (tab: 'chart' | 'dollar' | 'wallet' | 'account') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab: propActiveTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === '/') return 'chart';
    if (location.pathname === '/loan') return 'dollar';
    if (location.pathname === '/wallet') return 'wallet';
    if (location.pathname === '/account') return 'account';
    return 'chart';
  };

  const activeTab = propActiveTab || getActiveTab();

  const handleTabChange = (tab: 'chart' | 'dollar' | 'wallet' | 'account') => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }
    switch (tab) {
      case 'chart':
        navigate('/');
        break;
      case 'dollar':
        navigate('/loan');
        break;
      case 'wallet':
        navigate('/wallet');
        break;
      case 'account':
        navigate('/account');
        break;
    }
  };

  const tabs = [
    { id: 'chart', icon: iconChart },
    { id: 'dollar', icon: iconDollar },
    { id: 'wallet', icon: iconWallet },
    { id: 'account', icon: iconAccount },
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 bg-blue-600 border-t border-blue-500 px-4 py-3 flex justify-around items-center h-16 z-50 rounded-lg mx-2 mt-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id as any)}
          className={`flex items-center justify-center transition-transform duration-200 ${
            activeTab === tab.id ? 'scale-110' : 'opacity-70'
          } hover:opacity-100`}
        >
          <img
            src={tab.icon}
            alt={`${tab.id} icon`}
            className={`w-7 h-7 ${activeTab === tab.id ? '' : 'brightness-75'}`}
          />
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
