
// Bybit V5 API URL
const BYBIT_API_URL = 'https://api.bybit.com/v5/market/tickers?category=spot';

// Reuse similar proxy logic for reliability
const PROXY_PROVIDERS = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];

interface BybitTicker {
  symbol: string;
  lastPrice: string;
}

interface BybitResponse {
  retCode: number;
  result: {
    list: BybitTicker[];
  };
}

export const fetchBybitTickers = async (): Promise<Record<string, number>> => {
  // Add timestamp to prevent caching
  const timestamp = new Date().getTime();
  const targetUrl = `${BYBIT_API_URL}&_=${timestamp}`;

  let lastError;

  for (const getProxyUrl of PROXY_PROVIDERS) {
    try {
      const proxyUrl = getProxyUrl(targetUrl);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) continue;

      const data: BybitResponse = await response.json();

      if (data.retCode !== 0) {
        throw new Error(`Bybit API Error Code: ${data.retCode}`);
      }

      // Map "BTCUSDT" -> "BTC": price
      const priceMap: Record<string, number> = {};
      
      data.result.list.forEach(ticker => {
        if (ticker.symbol.endsWith('USDT')) {
          const symbol = ticker.symbol.replace('USDT', '');
          priceMap[symbol] = parseFloat(ticker.lastPrice);
        }
      });

      return priceMap;
    } catch (error) {
      console.warn(`Bybit Proxy failed, trying next...`, error);
      lastError = error;
    }
  }

  console.error("Failed to fetch Bybit data");
  return {}; // Return empty object on failure to allow app to continue with just Bithumb data
};
