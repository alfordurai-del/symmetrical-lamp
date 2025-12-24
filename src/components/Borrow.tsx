import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- ADDED
import Header from './Header'; // Import the Header component

// --- Main Borrow Component ---
const Borrow: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [term, setTerm] = useState<number>(7); // Default loan term in days
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // <-- ADDED

  const navigate = useNavigate(); // <-- ADDED

  const dailyInterestRate = 0.00308; // 0.308%

  // Calculate total interest amount
  const totalInterestAmount = useMemo(() => {
    const principal = parseFloat(amount);
    if (isNaN(principal) || principal <= 0) {
      return 0;
    }
    // Simple interest calculation: P * r * t
    const interest = principal * dailyInterestRate * term;
    return interest;
  }, [amount, term]);

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // --- ADDED: Handler to navigate to KYC page ---
  const handleGoToKyc = () => {
    navigate('/kyc');
  };

  // Dummy assets for Header (empty since no search needed)
  const dummyAssets = [];

  return (
    <div className="min-h-screen w-full bg-[#0D0F1C] text-white font-sans flex flex-col">
      {/* Header */}
      <Header
        title="Borrow"
        isSearchOpen={isSearchOpen}
        searchTerm={searchTerm}
        onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
        onSearchChange={setSearchTerm}
        assets={dummyAssets}
      />

      <div className="flex-1 p-6 borrow-pt">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header Section */}
          <div>
            <h1 className="text-4xl font-semibold text-white">10,000,000 USD</h1>
          </div>

          {/* Verification Button */}
          <button
            onClick={handleGoToKyc} // <-- ADDED
            className="bg-blue-600 text-black font-semibold py-3 px-3 rounded-2xl shadow-lg transition-transform transform active:scale-95"
          >
            Start verification
          </button>

          {/* --- Loan Input Form --- */}
          <div className="space-y-4">
            {/* Amount Input */}
            <div className="flex items-center bg-[#1F2333] rounded-xl p-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="I want to borrow..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 p-3 outline-none border-none"
              />
              <div className="flex items-center bg-black text-white px-4 py-2 rounded-lg">
                <span>USD</span>
                {/* This could be a dropdown, but is static for this UI */}
              </div>
            </div>

            {/* Term Input */}
            <div className="flex items-center bg-blue-600 rounded-xl p-2 relative">
              <span className="flex-1 text-black p-3 font-light font-xs">
                Loan term (Days):
              </span>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg"
              >
                <span>{term} Days</span>
                <ChevronDown size={20} className={`ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#1F2333] border border-gray-700 rounded-xl shadow-2xl z-50 py-2 w-48 overflow-hidden">
                  {[7, 30, 90, 120].map((days) => (
                    <button
                      key={days}
                      onClick={() => {
                        setTerm(days);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-blue-600 transition-colors bg-[#1F2333]"
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- Loan Details --- */}
          <div className="space-y-4 pt-4">
            <div>
              <p className="text-gray-400">Daily interest rate:</p>
              <p className="text-white text-2xl font-semibold">
                {(dailyInterestRate * 100).toFixed(3)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total interest amount:</p>
              <p className="text-white text-2xl font-semibold">
                {formatCurrency(totalInterestAmount)}
              </p>
            </div>
          </div>

          {/* Borrow Button */}
          <button
            onClick={handleGoToKyc} // <-- ADDED
            className="w-full bg-blue-600 text-black font-semibold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95"
          >
            Borrow now
          </button>
        </div>
      </div>
      <div className='scroller'>

      </div>
    </div>
  );
};

export default Borrow;