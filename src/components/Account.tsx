import React, { useState } from 'react';
import {
  Shield,
  Search,
  Bell,
  ChevronDown,
  PieChart,
  Users,
  ChevronRight,
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
type OrderTab = 'All orders' | 'Options' | 'Smart';

/**
 * A custom reusable toggle switch component.
 */
const ToggleSwitch: React.FC<{
  isEnabled: boolean;
  onToggle: () => void;
}> = ({ isEnabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors
        ${isEnabled ? 'bg-blue-600' : 'bg-gray-700'}
      `}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
          ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

/**
 * Renders a settings row with a navigation arrow or accordion behavior.
 */
interface SettingRowProps {
  label: string;
  onClick?: () => void;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, onClick, isExpanded, children }) => {
  return (
    <div className="bg-[#1F2333] rounded-lg overflow-hidden">
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full p-4 hover:bg-[#2a2f42] transition-colors"
      >
        <span className="text-white font-medium">{label}</span>
        {children ? (
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        ) : (
          <ChevronRight size={20} className="text-gray-400" />
        )}
      </button>
      {isExpanded && children && (
        <div className="p-4 pt-0 text-gray-400 text-sm border-t border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Renders a settings row with a toggle switch.
 */
const ToggleSettingRow: React.FC<{
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}> = ({ label, isEnabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between w-full p-4 bg-[#1F2333] rounded-lg">
      <span className="text-white font-medium">{label}</span>
      <ToggleSwitch isEnabled={isEnabled} onToggle={onToggle} />
    </div>
  );
};

/**
 * Renders the user/balance section.
 */
const UserSection: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  return (
    <div className="p-4 space-y-4">
      {/* User Dropdown & Icons */}
      <div className="flex items-center justify-between relative z-20">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition-colors"
          >
            <span>{isDemo ? 'Demo' : 'fdad17'}</span>
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1F2333] border border-gray-700 rounded-xl shadow-xl overflow-hidden z-30">
              <button
                onClick={() => { setIsDemo(false); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-3 hover:bg-[#2a2f42] text-sm transition-colors ${!isDemo ? 'text-blue-500 font-semibold' : 'text-white'}`}
              >
                Real Account
              </button>
              <button
                onClick={() => { setIsDemo(true); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-3 hover:bg-[#2a2f42] text-sm transition-colors ${isDemo ? 'text-blue-500 font-semibold' : 'text-white'}`}
              >
                Demo Account
              </button>
              <div className="h-px bg-gray-700 my-1"></div>
              <button className="w-full text-left px-4 py-3 hover:bg-[#2a2f42] text-sm text-red-500 transition-colors">
                Log Out
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button className="text-blue-500 bg-[#1F2333] p-2 rounded-full">
            <PieChart size={24} />
          </button>
          <button className="text-blue-500 bg-[#1F2333] p-2 rounded-full">
            <Users size={24} />
          </button>
        </div>
      </div>
      {/* UID */}
      <div className="text-gray-400 text-sm">UID: 100169</div>
      {/* Balance Card */}
      <div
        className="bg-blue-600 p-6 rounded-2xl"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '1.5rem 1.5rem',
        }}
      >
        <div className="text-white text-3xl font-bold">{isDemo ? '50,000.00' : '0.00'} USD</div>
        <div className="mt-4 space-y-2">
          <div className="text-blue-100">
            Balance: <span className="text-white underline">{isDemo ? '50,000.00' : '0.00'} USD</span>
          </div>
          <div className="text-blue-100">
            Loan: <span className="text-white underline">{isDemo ? '1,500.00' : '0.00'} USD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the "Order" section with tabs.
 */
const OrderSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('Options');
  const tabs: OrderTab[] = ['All orders', 'Options', 'Smart'];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white">Order</h2>
      {/* Order Tabs */}
      <div className="bg-blue-600 rounded-full flex p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-3 rounded-full text-sm font-medium transition-colors
              ${activeTab === tab
                ? 'bg-black text-blue-500'
                : 'text-black hover:text-gray-900'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Order Content */}
      <div className="flex items-center justify-center h-24">
        <span className="text-gray-500">No more data</span>
      </div>
    </div>
  );
};

/**
 * Renders the "Settings" section.
 */
const SettingsSection: React.FC = () => {
  const [usdtNode, setUsdtNode] = useState(true);
  const [usdcNode, setUsdcNode] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (label: string) => {
    setActiveAccordion(activeAccordion === label ? null : label);
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      <div className="space-y-3">
        <SettingRow
          label="Account verification"
          isExpanded={activeAccordion === 'Verification'}
          onClick={() => toggleAccordion('Verification')}
        >
          <div className="flex flex-col space-y-2">
            <p>Status: <span className="text-orange-400">Pending Review</span></p>
            <p className="text-xs">Please allow 24-48 hours for verification.</p>
            <button className="bg-blue-600 text-white py-2 rounded-lg text-sm mt-2">Upload Documents</button>
          </div>
        </SettingRow>

        <ToggleSettingRow
          label="USDT Node"
          isEnabled={usdtNode}
          onToggle={() => setUsdtNode(!usdtNode)}
        />
        <ToggleSettingRow
          label="USDC Node"
          isEnabled={usdcNode}
          onToggle={() => setUsdcNode(!usdcNode)}
        />

        <SettingRow
          label="Invite your friends"
          isExpanded={activeAccordion === 'Invite'}
          onClick={() => toggleAccordion('Invite')}
        >
          <div className="flex flex-col space-y-2">
            <p>Referral Code: <span className="font-mono text-blue-400 bg-gray-800 px-2 py-1 rounded">BUZZ2024</span></p>
            <p className="text-xs">Share this code to earn rewards!</p>
            <button className="bg-blue-600 text-white py-2 rounded-lg text-sm mt-2">Copy Link</button>
          </div>
        </SettingRow>

        <SettingRow
          label="Contact us"
          isExpanded={activeAccordion === 'Contact'}
          onClick={() => toggleAccordion('Contact')}
        >
          <div className="space-y-2">
            <p>Email: <span className="text-blue-400">support@buzzone.com</span></p>
            <p>Phone: +1 (555) 123-4567</p>
            <p className="text-xs text-gray-500">Available Mon-Fri, 9am - 5pm UTC</p>
          </div>
        </SettingRow>

        <SettingRow
          label="Help center (FAQ)"
          isExpanded={activeAccordion === 'FAQ'}
          onClick={() => toggleAccordion('FAQ')}
        >
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-white">Q: How do I deposit funds?</p>
              <p>A: Go to the Wallet section and click Deposit.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Q: What are the fees?</p>
              <p>A: Trading fees are 0.1% per transaction.</p>
            </div>
          </div>
        </SettingRow>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const Account: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#0D0F1C] text-white font-sans">
      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <header className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">My account</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400">
              <Search size={24} />
            </button>
            <Bell size={24} className="text-gray-400" />
          </div>
        </header>

        {/* Page Content */}
        <UserSection />
        <OrderSection />
        <SettingsSection />
      </div>
    </div>
  );
};

export default Account;