// Market Data Service - Uses ONLY public APIs that require NO API keys
// Crypto: Binance public API (free, no auth, CORS-friendly)
// Other categories: Realistic simulated data (free APIs for forex/stocks require keys)

import { CURRENCY_FLAGS } from './apiConfig';

// --- TYPE DEFINITIONS ---
export interface MarketAsset {
    id: string;
    ticker: string;
    name: string;
    price: number;
    priceFormatted: string;
    change: number;
    changePercent: number;
    chartData: number[];
    icon?: string; // URL for icon/logo
    flags?: { base: string; quote: string }; // For forex pairs
}

export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number, decimals = 2): string => {
    if (value >= 1000) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value < 1 ? 6 : decimals,
        maximumFractionDigits: value < 1 ? 6 : decimals,
    }).format(value);
};

const getFlagUrl = (currencyCode: string): string => {
    const countryCode = CURRENCY_FLAGS[currencyCode] || 'un';
    return `https://flagcdn.com/w40/${countryCode}.png`;
};

// Generate realistic sparkline data based on current price and change
const generateSparklineFromChange = (currentPrice: number, changePercent: number): number[] => {
    const points = 7;
    const data: number[] = [];
    const startPrice = currentPrice / (1 + changePercent / 100);
    const step = (currentPrice - startPrice) / (points - 1);

    for (let i = 0; i < points; i++) {
        const noise = (Math.random() - 0.5) * Math.abs(step) * 0.5;
        data.push(startPrice + step * i + noise);
    }
    data[points - 1] = currentPrice;
    return data;
};

// --- CRYPTO DATA (Binance Public API - NO API KEY REQUIRED) ---
const CRYPTO_SYMBOLS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', id: 'bitcoin' },
    { symbol: 'ETHUSDT', name: 'Ethereum', id: 'ethereum' },
    { symbol: 'BNBUSDT', name: 'BNB', id: 'bnb' },
    { symbol: 'XRPUSDT', name: 'XRP', id: 'xrp' },
    { symbol: 'SOLUSDT', name: 'Solana', id: 'solana' },
    { symbol: 'ADAUSDT', name: 'Cardano', id: 'cardano' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', id: 'dogecoin' },
    { symbol: 'DOTUSDT', name: 'Polkadot', id: 'polkadot' },
    { symbol: 'MATICUSDT', name: 'Polygon', id: 'polygon' },
    { symbol: 'LTCUSDT', name: 'Litecoin', id: 'litecoin' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', id: 'avalanche' },
    { symbol: 'LINKUSDT', name: 'Chainlink', id: 'chainlink' },
    { symbol: 'UNIUSDT', name: 'Uniswap', id: 'uniswap' },
    { symbol: 'ATOMUSDT', name: 'Cosmos', id: 'cosmos' },
    { symbol: 'XLMUSDT', name: 'Stellar', id: 'stellar' },
];

// Crypto icon URLs (using CoinGecko's static image URLs)
const CRYPTO_ICONS: Record<string, string> = {
    bitcoin: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    bnb: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    xrp: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    solana: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    cardano: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    dogecoin: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    polkadot: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    polygon: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    litecoin: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
    avalanche: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    chainlink: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    uniswap: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    cosmos: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
    stellar: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
};

export const fetchCryptoData = async (): Promise<MarketAsset[]> => {
    try {
        // Binance 24hr ticker API - completely free, no API key needed
        const symbols = CRYPTO_SYMBOLS.map(s => s.symbol);
        const response = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch crypto data from Binance');
        }

        const data = await response.json();

        return data.map((ticker: any) => {
            const cryptoInfo = CRYPTO_SYMBOLS.find(s => s.symbol === ticker.symbol);
            const price = parseFloat(ticker.lastPrice);
            const changePercent = parseFloat(ticker.priceChangePercent);
            const change = parseFloat(ticker.priceChange);

            return {
                id: cryptoInfo?.id || ticker.symbol.toLowerCase(),
                ticker: `${ticker.symbol.replace('USDT', '')}/USDT`,
                name: cryptoInfo?.name || ticker.symbol,
                price,
                priceFormatted: formatCurrency(price),
                change,
                changePercent,
                chartData: generateSparklineFromChange(price, changePercent),
                icon: CRYPTO_ICONS[cryptoInfo?.id || ''] || undefined,
            };
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        throw error;
    }
};

// --- FOREX DATA (Simulated with realistic prices) ---
// Note: Free real-time forex APIs mostly require API keys
const FOREX_DATA = [
    { id: 'eurusd', symbol: 'EUR/USD', base: 'EUR', quote: 'USD', basePrice: 1.0850, volatility: 0.003 },
    { id: 'gbpusd', symbol: 'GBP/USD', base: 'GBP', quote: 'USD', basePrice: 1.2950, volatility: 0.004 },
    { id: 'usdjpy', symbol: 'USD/JPY', base: 'USD', quote: 'JPY', basePrice: 149.50, volatility: 0.003 },
    { id: 'usdchf', symbol: 'USD/CHF', base: 'USD', quote: 'CHF', basePrice: 0.8750, volatility: 0.003 },
    { id: 'audusd', symbol: 'AUD/USD', base: 'AUD', quote: 'USD', basePrice: 0.6550, volatility: 0.004 },
    { id: 'usdcad', symbol: 'USD/CAD', base: 'USD', quote: 'CAD', basePrice: 1.3450, volatility: 0.003 },
    { id: 'nzdusd', symbol: 'NZD/USD', base: 'NZD', quote: 'USD', basePrice: 0.6150, volatility: 0.004 },
    { id: 'eurgbp', symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP', basePrice: 0.8380, volatility: 0.003 },
];

export const fetchForexData = async (): Promise<MarketAsset[]> => {
    // Simulated forex data with realistic market behavior
    return FOREX_DATA.map((pair) => {
        const changePercent = (Math.random() - 0.5) * pair.volatility * 100;
        const price = pair.basePrice * (1 + changePercent / 100);
        const change = price - pair.basePrice;

        return {
            id: pair.id,
            ticker: pair.symbol,
            name: pair.symbol,
            price,
            priceFormatted: price.toFixed(4),
            change,
            changePercent,
            chartData: generateSparklineFromChange(price, changePercent),
            flags: {
                base: getFlagUrl(pair.base),
                quote: getFlagUrl(pair.quote),
            },
        };
    });
};

// --- STOCKS DATA (Simulated with realistic prices) ---
const STOCKS_DATA = [
    { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc', basePrice: 250.00, volatility: 0.02 },
    { id: 'msft', symbol: 'MSFT', name: 'Microsoft', basePrice: 440.00, volatility: 0.018 },
    { id: 'googl', symbol: 'GOOGL', name: 'Alphabet', basePrice: 180.00, volatility: 0.022 },
    { id: 'amzn', symbol: 'AMZN', name: 'Amazon', basePrice: 225.00, volatility: 0.025 },
    { id: 'tsla', symbol: 'TSLA', name: 'Tesla', basePrice: 420.00, volatility: 0.04 },
    { id: 'meta', symbol: 'META', name: 'Meta Platforms', basePrice: 590.00, volatility: 0.025 },
    { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA', basePrice: 130.00, volatility: 0.035 },
    { id: 'jpm', symbol: 'JPM', name: 'JPMorgan Chase', basePrice: 240.00, volatility: 0.015 },
    { id: 'v', symbol: 'V', name: 'Visa Inc', basePrice: 315.00, volatility: 0.015 },
    { id: 'wmt', symbol: 'WMT', name: 'Walmart', basePrice: 92.00, volatility: 0.012 },
];

export const fetchStocksData = async (): Promise<MarketAsset[]> => {
    return STOCKS_DATA.map((stock) => {
        const changePercent = (Math.random() - 0.5) * stock.volatility * 100;
        const price = stock.basePrice * (1 + changePercent / 100);
        const change = price - stock.basePrice;

        return {
            id: stock.id,
            ticker: stock.symbol,
            name: stock.name,
            price,
            priceFormatted: formatCurrency(price),
            change,
            changePercent,
            chartData: generateSparklineFromChange(price, changePercent),
        };
    });
};

// --- ETF DATA (Simulated with realistic prices) ---
const ETF_DATA = [
    { id: 'spy', symbol: 'SPY', name: 'SPDR S&P 500', basePrice: 595.00, volatility: 0.012 },
    { id: 'qqq', symbol: 'QQQ', name: 'Invesco QQQ', basePrice: 520.00, volatility: 0.015 },
    { id: 'iwm', symbol: 'IWM', name: 'iShares Russell 2000', basePrice: 225.00, volatility: 0.018 },
    { id: 'vti', symbol: 'VTI', name: 'Vanguard Total Stock', basePrice: 285.00, volatility: 0.012 },
    { id: 'efa', symbol: 'EFA', name: 'iShares MSCI EAFE', basePrice: 82.00, volatility: 0.014 },
    { id: 'gld', symbol: 'GLD', name: 'SPDR Gold Shares', basePrice: 245.00, volatility: 0.01 },
    { id: 'voo', symbol: 'VOO', name: 'Vanguard S&P 500', basePrice: 545.00, volatility: 0.012 },
    { id: 'arkk', symbol: 'ARKK', name: 'ARK Innovation', basePrice: 52.00, volatility: 0.035 },
];

export const fetchETFData = async (): Promise<MarketAsset[]> => {
    return ETF_DATA.map((etf) => {
        const changePercent = (Math.random() - 0.5) * etf.volatility * 100;
        const price = etf.basePrice * (1 + changePercent / 100);
        const change = price - etf.basePrice;

        return {
            id: etf.id,
            ticker: etf.symbol,
            name: etf.name,
            price,
            priceFormatted: formatCurrency(price),
            change,
            changePercent,
            chartData: generateSparklineFromChange(price, changePercent),
        };
    });
};

// --- FUTURES/COMMODITIES DATA (Simulated with realistic prices) ---
const FUTURES_DATA = [
    { id: 'xau', ticker: 'XAU', name: 'Gold', basePrice: 2650, volatility: 0.015 },
    { id: 'xag', ticker: 'XAG', name: 'Silver', basePrice: 31.5, volatility: 0.025 },
    { id: 'oil', ticker: 'OIL', name: 'Crude Oil WTI', basePrice: 72.5, volatility: 0.03 },
    { id: 'ng', ticker: 'NG', name: 'Natural Gas', basePrice: 3.2, volatility: 0.04 },
    { id: 'hg', ticker: 'HG', name: 'Copper', basePrice: 4.15, volatility: 0.02 },
    { id: 'gc', ticker: 'GC', name: 'Gold Futures', basePrice: 2655, volatility: 0.015 },
    { id: 'si', ticker: 'SI', name: 'Silver Futures', basePrice: 31.8, volatility: 0.025 },
    { id: 'cl', ticker: 'CL', name: 'Light Crude', basePrice: 73.0, volatility: 0.03 },
];

export const fetchFuturesData = async (): Promise<MarketAsset[]> => {
    return FUTURES_DATA.map((item) => {
        const changePercent = (Math.random() - 0.5) * item.volatility * 100;
        const price = item.basePrice * (1 + changePercent / 100);
        const change = price - item.basePrice;

        return {
            id: item.id,
            ticker: item.ticker,
            name: item.name,
            price,
            priceFormatted: formatCurrency(price),
            change,
            changePercent,
            chartData: generateSparklineFromChange(price, changePercent),
        };
    });
};

// --- FETCH CANDLE DATA (Binance Klines - for crypto only, no API key needed) ---
export const fetchCandleData = async (
    symbol: string,
    interval: string = '1d', // 1m, 5m, 15m, 1h, 4h, 1d, 1w
    limit: number = 30
): Promise<CandleData[]> => {
    try {
        // Convert symbol format (BTC/USDT -> BTCUSDT)
        const binanceSymbol = symbol.replace('/', '').toUpperCase();

        const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();

        return data.map((kline: any[]) => ({
            time: Math.floor(kline[0] / 1000), // Convert ms to seconds
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
        }));
    } catch (error) {
        console.error('Error fetching candle data:', error);
        return [];
    }
};

// --- UNIFIED FETCH FUNCTION ---
export const fetchMarketData = async (category: string): Promise<MarketAsset[]> => {
    switch (category) {
        case 'Crypto':
            return fetchCryptoData();
        case 'Forex':
            return fetchForexData();
        case 'Stocks':
            return fetchStocksData();
        case 'ETF':
            return fetchETFData();
        case 'Futures':
            return fetchFuturesData();
        default:
            throw new Error(`Unknown category: ${category}`);
    }
};
