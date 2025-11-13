import React from 'react';
import { ChevronLeft, Star, ChevronDown, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- ADDED

// You might want to pass in asset data as props later,
// but for now, we'll use static data from the screenshot.

const MarketDetail: React.FC = () => {
  // State for the selected time
  const [selectedTime, setSelectedTime] = React.useState<number>(60);
  // State for the investment amount
  const [investmentAmount, setInvestmentAmount] = React.useState<string>('1000');

  const navigate = useNavigate(); // <-- ADDED

  // --- ADDED: Handler for back navigation ---
  const handleBack = () => {
    navigate("../"); // -1 goes to the previous page in history
  };

  // Simple handler to increment/decrement investment
  const adjustInvestment = (amount: number) => {
    setInvestmentAmount((prev) => {
      const current = parseFloat(prev) || 0;
      return (current + amount).toString();
    });
  };

  const timeOptions = [
    { duration: 60, return: '20.00%' },
    { duration: 120, return: '25.00%' },
    { duration: 180, return: '30.00%' },
    { duration: 240, return: '35.00%' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0D0F1C] text-white font-sans flex flex-col ">
      
      {/* --- Header --- */}
      <header className="flex items-center justify-between p-4">
        {/* --- MODIFIED: Changed div to button and added onClick --- */}
        <button onClick={handleBack} className="flex items-center space-x-3">
          <ChevronLeft size={24} className="text-gray-400" />
          {/* Placeholder for asset icon */}
          <div className="w-6 h-6 bg-gray-700 rounded-full"></div> 
          <span className="text-xl font-semibold">OIL</span>
        </button>
        <Star size={24} className="text-gray-400" />
      </header>

      {/* --- Main Content Area (Unchanged) --- */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        
        {/* --- Asset Info (Unchanged) --- */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">62.70 USD</h1>
            <p className="text-red-500">-3.76%</p>
          </div>
          <button className="flex items-center space-x-1 bg-[#1F2333] px-3 py-1.5 rounded-lg text-sm">
            <span>15min</span>
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
          <p>Open: <span className="text-white">65.150</span></p>
          <p>Low: <span className="text-white">62.560</span></p>
          <p>High: <span className="text-white">65.150</span></p>
          <p>Close: <span className="text-white">62.66</span></p>
        </div>

        {/* --- Chart Placeholder (Unchanged) --- */}
        <div className="w-full h-64 bg-[#1F2333] rounded-lg flex flex-col justify-between p-4">
          <div className="flex-1 relative">
            {/* This is a placeholder for your chart library (e.g., TradingView, Lightweight Charts) */}
            <span className="text-sm text-gray-500">[Chart Area]</span>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <span className="text-red-500 text-sm">62.7</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>10 19:15:00</span>
            <span>2025-11-11 15:30:00</span>
            <span>2025-11-12 11:45:00</span>
          </div>
        </div>

        {/* --- Trading Form (Unchanged) --- */}
        <div className="space-y-4">
          {/* Tab Button */}
          <div className="flex justify-center">
            <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg">
              Options
            </button>
          </div>

          {/* Time Selection */}
          <div>
            <label className="text-gray-400 mb-2 block">Time:</label>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.duration}
                  onClick={() => setSelectedTime(opt.duration)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                    selectedTime === opt.duration
                      ? 'bg-blue-600'
                      : 'bg-[#1F2333]'
                  }`}
                >
                  <span className="text-lg font-semibold">{opt.duration}s</span>
                  <span className="text-xs text-gray-300">{opt.return} return</span>
                </button>
              ))}
            </div>
          </div>

          {/* Investment Input */}
          <div>
            <div className="flex items-center bg-[#1F2333] rounded-lg p-2">
              <input
                type="text"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="Investment..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 px-3 py-2 outline-none border-none"
              />
              <button 
                onClick={() => adjustInvestment(100)}
                className="bg-gray-700 p-2 rounded-lg mx-1"
              >
                <Plus size={20} />
              </button>
              <button 
                onClick={() => adjustInvestment(-100)}
                className="bg-gray-700 p-2 rounded-lg"
              >
                <Minus size={20} />
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
              <span>Available: 0.00</span>
              <span>Amount Range: 100 - 1000000</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95">
              Up
            </button>
            <button className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95">
              Down
            </button>
          </div>

        </div>
      </div>
       <div className='scroller'>
        {/* Unchanged */}
      </div>
    </div>
  );
};

export default MarketDetail;