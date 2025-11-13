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

interface SettingRowProps {
  label: string;
}

interface ToggleSettingRowProps {
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
}

// --- CHILD COMPONENTS ---

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
 * Renders a settings row with a navigation arrow.
 */
const SettingRow: React.FC<SettingRowProps> = ({ label }) => {
  return (
    <button className="flex items-center justify-between w-full p-4 bg-[#1F2333] rounded-lg">
      <span className="text-white font-medium">{label}</span>
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
};

/**
 * Renders a settings row with a toggle switch.
 */
const ToggleSettingRow: React.FC<ToggleSettingRowProps> = ({
  label,
  isEnabled,
  onToggle,
}) => {
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
  return (
    <div className="p-4 space-y-4">
      {/* User Dropdown & Icons */}
      <div className="flex items-center justify-between">
        <button className="flex items-center space-x-2 bg-[#1F2333] text-white px-4 py-2 rounded-full">
          <span>fdad17</span>
          <ChevronDown size={16} />
        </button>
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
        <div className="text-white text-3xl font-bold">0.00 USD</div>
        <div className="mt-4 space-y-2">
          <div className="text-blue-100">
            Balance: <span className="text-white underline">0.00 USD</span>
          </div>
          <div className="text-blue-100">
            Loan: <span className="text-white underline">0.00 USD</span>
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
      <div className="bg-[#1F2333] rounded-full flex p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors
              ${
                activeTab === tab
                  ? 'bg-black text-white'
                  : 'text-gray-400 hover:text-white'
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

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      <div className="space-y-3">
        <SettingRow label="Account verification" />
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
        <SettingRow label="Invite your friends" />
        <SettingRow label="Contact us" />
        <SettingRow label="Help center (FAQ)" />
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