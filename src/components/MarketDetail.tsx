import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, ChevronDown, Plus, Minus, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCandleData } from '../services/marketDataService';
import type { CandleData } from '../services/marketDataService';

// --- CANDLESTICK CHART COMPONENT ---
interface CandlestickChartProps {
  data: CandleData[];
  width?: number;
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = 350,
  height = 250
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No chart data available
      </div>
    );
  }

  const padding = { top: 20, right: 10, bottom: 40, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate price range
  const allPrices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  // Scale functions
  const candleWidth = Math.max(2, (chartWidth / data.length) * 0.7);
  const gap = (chartWidth / data.length) * 0.3;

  const scaleY = (price: number) => {
    return padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  const scaleX = (index: number) => {
    return padding.left + (index * (candleWidth + gap)) + candleWidth / 2;
  };

  // Volume data for bottom bars
  const volumes = data.map(d => Math.abs(d.close - d.open));
  const maxVolume = Math.max(...volumes) || 1;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = padding.top + chartHeight * ratio;
        const price = maxPrice - ratio * priceRange;
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#2a2d3e"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </g>
        );
      })}

      {/* Candlesticks */}
      {data.map((candle, index) => {
        const x = scaleX(index);
        const isGreen = candle.close >= candle.open;
        const color = isGreen ? '#22c55e' : '#ef4444';

        const bodyTop = scaleY(Math.max(candle.open, candle.close));
        const bodyBottom = scaleY(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        return (
          <g key={index}>
            {/* Wick */}
            <line
              x1={x}
              y1={scaleY(candle.high)}
              x2={x}
              y2={scaleY(candle.low)}
              stroke={color}
              strokeWidth="1"
            />
            {/* Body */}
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
            />
          </g>
        );
      })}

      {/* Volume bars at bottom */}
      {data.map((candle, index) => {
        const x = scaleX(index);
        const isGreen = candle.close >= candle.open;
        const volume = Math.abs(candle.close - candle.open);
        const barHeight = (volume / maxVolume) * 30;

        return (
          <rect
            key={`vol-${index}`}
            x={x - candleWidth / 2}
            y={height - padding.bottom + 5}
            width={candleWidth}
            height={barHeight}
            fill={isGreen ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}
          />
        );
      })}

      {/* Current price line */}
      {data.length > 0 && (
        <>
          <line
            x1={padding.left}
            y1={scaleY(data[data.length - 1].close)}
            x2={width - padding.right}
            y2={scaleY(data[data.length - 1].close)}
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <text
            x={width - padding.right + 5}
            y={scaleY(data[data.length - 1].close) + 4}
            fill="#3b82f6"
            fontSize="10"
          >
            {data[data.length - 1].close.toFixed(2)}
          </text>
        </>
      )}

      {/* Time labels */}
      {data.length > 0 && [0, Math.floor(data.length / 2), data.length - 1].map((idx) => {
        if (idx >= data.length) return null;
        const date = new Date(data[idx].time * 1000);
        const label = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
        return (
          <text
            key={idx}
            x={scaleX(idx)}
            y={height - 5}
            fill="#6b7280"
            fontSize="9"
            textAnchor="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// --- MAIN COMPONENT ---
const MarketDetail: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();

  // Decode ticker (BTC-USDT -> BTC/USDT)
  const displayTicker = ticker?.replace('-', '/') || 'UNKNOWN';
  const binanceSymbol = ticker?.replace('-', '') || '';

  const [selectedTime, setSelectedTime] = useState<number>(60);
  const [investmentAmount, setInvestmentAmount] = useState<string>('1000');
  const [selectedInterval, setSelectedInterval] = useState<string>('15m');
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState({
    price: 0,
    change: 0,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });

  // Fetch candle data
  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // Fetch candle data from Binance
      const candles = await fetchCandleData(binanceSymbol, selectedInterval, 50);
      setCandleData(candles);

      if (candles.length > 0) {
        const latest = candles[candles.length - 1];
        const first = candles[0];
        const changePercent = ((latest.close - first.open) / first.open) * 100;

        setPriceData({
          price: latest.close,
          change: changePercent,
          open: latest.open,
          high: Math.max(...candles.map(c => c.high)),
          low: Math.min(...candles.map(c => c.low)),
          close: latest.close,
        });
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial load and polling for candle updates
  useEffect(() => {
    if (binanceSymbol) {
      loadData(true);

      // Refresh candles every 5 seconds
      const pollInterval = setInterval(() => {
        loadData(false);
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [binanceSymbol, selectedInterval]);

  // Real-time price updates via Binance WebSocket
  useEffect(() => {
    if (!binanceSymbol) return;

    const wsSymbol = binanceSymbol.toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@trade`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newPrice = parseFloat(data.p);

      setPriceData(prev => {
        const changePercent = prev.open > 0
          ? ((newPrice - prev.open) / prev.open) * 100
          : prev.change;

        return {
          ...prev,
          price: newPrice,
          close: newPrice,
          change: changePercent,
          high: Math.max(prev.high, newPrice),
          low: prev.low > 0 ? Math.min(prev.low, newPrice) : newPrice,
        };
      });

      // Update the last candle with new price
      setCandleData(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const lastCandle = { ...updated[updated.length - 1] };
        lastCandle.close = newPrice;
        lastCandle.high = Math.max(lastCandle.high, newPrice);
        lastCandle.low = Math.min(lastCandle.low, newPrice);
        updated[updated.length - 1] = lastCandle;
        return updated;
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [binanceSymbol]);

  const handleBack = () => {
    navigate('/');
  };

  const adjustInvestment = (amount: number) => {
    setInvestmentAmount((prev) => {
      const current = parseFloat(prev) || 0;
      const newAmount = Math.max(0, current + amount);
      return newAmount.toString();
    });
  };

  const timeOptions = [
    { duration: 60, return: '20.00%' },
    { duration: 120, return: '25.00%' },
    { duration: 180, return: '30.00%' },
    { duration: 240, return: '35.00%' },
  ];

  const intervalOptions = ['15m', '1h', '4h', '1d'];

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(6);
  };

  return (
    <div className="min-h-screen w-full bg-[#010117] text-white font-sans flex flex-col">

      {/* --- Header --- */}
      <header className="flex items-center justify-between p-4">
        <button onClick={handleBack} className="flex items-center space-x-3">
          <ChevronLeft size={24} className="text-gray-400" />
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
            {displayTicker.charAt(0)}
          </div>
          <span className="text-xl font-semibold">{displayTicker}</span>
        </button>
        <Star size={24} className="text-gray-400" />
      </header>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">

        {/* --- Asset Info --- */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {loading ? '...' : `${formatPrice(priceData.price)} USD`}
            </h1>
            <p className={priceData.change >= 0 ? 'text-green-500' : 'text-red-500'}>
              {loading ? '...' : `${priceData.change >= 0 ? '+' : ''}${priceData.change.toFixed(2)}%`}
            </p>
          </div>
          <div className="relative">
            <button
              className="flex items-center space-x-1 bg-[#1F2333] px-3 py-1.5 rounded-lg text-sm"
              onClick={() => {
                const currentIdx = intervalOptions.indexOf(selectedInterval);
                const nextIdx = (currentIdx + 1) % intervalOptions.length;
                setSelectedInterval(intervalOptions[nextIdx]);
              }}
            >
              <span>{selectedInterval}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
          <p>Open: <span className="text-green-400">{formatPrice(priceData.open)}</span></p>
          <p>Low: <span className="text-white">{formatPrice(priceData.low)}</span></p>
          <p>High: <span className="text-green-400">{formatPrice(priceData.high)}</span></p>
          <p>Close: <span className="text-white">{formatPrice(priceData.close)}</span></p>
        </div>

        {/* --- Chart --- */}
        <div className="w-full h-72 bg-[#0a0b14] rounded-lg flex flex-col justify-between p-2 border border-gray-800">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <CandlestickChart data={candleData} width={340} height={260} />
            </div>
          )}
        </div>

        {/* --- Trading Form --- */}
        <div className="space-y-4">
          {/* Tab Button */}
          <div className="flex justify-center">
            <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg border-2 border-blue-500">
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
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors ${selectedTime === opt.duration
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
                className="bg-blue-600 p-2 rounded-lg mx-1"
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
          <div className="grid grid-cols-2 gap-4 pt-2 pb-6">
            <button className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95">
              Up
            </button>
            <button className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95">
              Down
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;