// API Configuration for Market Data Services
// Store your API keys in .env file as VITE_FINNHUB_API_KEY and VITE_ALPHA_VANTAGE_API_KEY

export const API_CONFIG = {
    // Finnhub - Free tier: 60 calls/min
    // Sign up at: https://finnhub.io/register
    FINNHUB: {
        BASE_URL: 'https://finnhub.io/api/v1',
        API_KEY: import.meta.env.VITE_FINNHUB_API_KEY || 'demo', // 'demo' works for basic testing
    },

    // CoinGecko - No API key required for basic usage
    // Free tier: 10-50 calls/min
    COINGECKO: {
        BASE_URL: 'https://api.coingecko.com/api/v3',
    },

    // Alpha Vantage - Free tier: 25 calls/day
    // Sign up at: https://www.alphavantage.co/support/#api-key
    ALPHA_VANTAGE: {
        BASE_URL: 'https://www.alphavantage.co/query',
        API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo',
    },
};

// Asset symbols for each category
export const MARKET_SYMBOLS = {
    // Forex pairs (Finnhub format)
    FOREX: [
        { symbol: 'OANDA:EUR_USD', display: 'EUR/USD', base: 'EUR', quote: 'USD' },
        { symbol: 'OANDA:GBP_USD', display: 'GBP/USD', base: 'GBP', quote: 'USD' },
        { symbol: 'OANDA:USD_JPY', display: 'USD/JPY', base: 'USD', quote: 'JPY' },
        { symbol: 'OANDA:USD_CHF', display: 'USD/CHF', base: 'USD', quote: 'CHF' },
        { symbol: 'OANDA:AUD_USD', display: 'AUD/USD', base: 'AUD', quote: 'USD' },
        { symbol: 'OANDA:USD_CAD', display: 'USD/CAD', base: 'USD', quote: 'CAD' },
        { symbol: 'OANDA:NZD_USD', display: 'NZD/USD', base: 'NZD', quote: 'USD' },
    ],

    // US Stocks (Finnhub uses standard ticker symbols)
    STOCKS: [
        { symbol: 'AAPL', name: 'Apple Inc' },
        { symbol: 'MSFT', name: 'Microsoft' },
        { symbol: 'GOOGL', name: 'Alphabet' },
        { symbol: 'AMZN', name: 'Amazon' },
        { symbol: 'TSLA', name: 'Tesla' },
        { symbol: 'META', name: 'Meta Platforms' },
        { symbol: 'NVDA', name: 'NVIDIA' },
        { symbol: 'JPM', name: 'JPMorgan Chase' },
    ],

    // ETFs (same as stocks on Finnhub)
    ETF: [
        { symbol: 'SPY', name: 'SPDR S&P 500' },
        { symbol: 'QQQ', name: 'Invesco QQQ' },
        { symbol: 'IWM', name: 'iShares Russell 2000' },
        { symbol: 'VTI', name: 'Vanguard Total Stock' },
        { symbol: 'EFA', name: 'iShares MSCI EAFE' },
        { symbol: 'GLD', name: 'SPDR Gold Shares' },
    ],

    // Futures/Commodities (using Alpha Vantage commodity functions)
    FUTURES: [
        { symbol: 'WTI', name: 'Crude Oil WTI', display: 'OIL' },
        { symbol: 'BRENT', name: 'Brent Crude', display: 'BRENT' },
        { symbol: 'NATURAL_GAS', name: 'Natural Gas', display: 'NG' },
        { symbol: 'COPPER', name: 'Copper', display: 'HG' },
        { symbol: 'ALUMINUM', name: 'Aluminum', display: 'AL' },
    ],
};

// Country code mappings for forex flags
export const CURRENCY_FLAGS: Record<string, string> = {
    EUR: 'eu',
    USD: 'us',
    GBP: 'gb',
    JPY: 'jp',
    CHF: 'ch',
    AUD: 'au',
    CAD: 'ca',
    NZD: 'nz',
    CNH: 'cn',
    HKD: 'hk',
    SGD: 'sg',
};
