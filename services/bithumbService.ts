
import { BithumbApiResponse, CryptoItem, BithumbTicker, BithumbAssetsStatusResponse, BithumbAssetStatus } from '../types';

// Bithumb API URLs
const BITHUMB_API_URL = 'https://api.bithumb.com/public/ticker/ALL_KRW';
const BITHUMB_ASSETS_STATUS_URL = 'https://api.bithumb.com/public/assetsstatus/ALL';

// List of CORS proxies to try in order
const PROXY_PROVIDERS = [
  // Provider 1: AllOrigins (Raw JSON)
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  // Provider 2: CORSProxy.io
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];

/**
 * Fetch ticker data from Bithumb
 */
export const fetchTicker = async (): Promise<CryptoItem[]> => {
  let lastError;

  // Add timestamp to prevent caching
  const timestamp = new Date().getTime();
  const targetUrl = `${BITHUMB_API_URL}?_=${timestamp}`;

  // Try proxies sequentially
  for (const getProxyUrl of PROXY_PROVIDERS) {
    try {
      const proxyUrl = getProxyUrl(targetUrl);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // For 'raw' endpoints, we get the JSON directly
      const parsedData: BithumbApiResponse = await response.json();

      if (parsedData.status !== '0000') {
        throw new Error(`Bithumb API Error: ${parsedData.status}`);
      }

      return processData(parsedData);
    } catch (error) {
      console.warn(`Proxy failed, trying next...`, error);
      lastError = error;
      // Continue to next proxy
    }
  }

  console.error("All proxies failed to fetch Bithumb data");
  throw lastError || new Error("Failed to connect to Bithumb API");
};

/**
 * Fetch asset status (Deposit/Withdrawal availability)
 */
export const fetchAssetsStatus = async (): Promise<Record<string, BithumbAssetStatus>> => {
  // Add timestamp to prevent caching
  const timestamp = new Date().getTime();
  const targetUrl = `${BITHUMB_ASSETS_STATUS_URL}?_=${timestamp}`;

  for (const getProxyUrl of PROXY_PROVIDERS) {
    try {
      const proxyUrl = getProxyUrl(targetUrl);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) continue;

      const parsedData: BithumbAssetsStatusResponse = await response.json();

      if (parsedData.status !== '0000') {
        continue; // Try next proxy or fail silently
      }

      return parsedData.data;
    } catch (error) {
      console.warn(`Assets Status Proxy failed, trying next...`, error);
    }
  }
  
  return {}; // Return empty object if fail, so app can continue without status
};

// Helper to process raw API response into CryptoItem[]
const processData = (parsedData: BithumbApiResponse): CryptoItem[] => {
  const cryptoList: CryptoItem[] = [];
  const rawData = parsedData.data;

  for (const key in rawData) {
    if (key === 'date') continue;

    const ticker = rawData[key] as BithumbTicker;
    
    // Validation
    if (!ticker.closing_price) continue;

    cryptoList.push({
      symbol: key,
      price: parseFloat(ticker.closing_price),
      prevPrice: parseFloat(ticker.prev_closing_price),
      chgAmt: parseFloat(ticker.fluctate_24H),
      chgRate: ticker.fluctate_rate_24H,
      volume: parseFloat(ticker.units_traded_24H),
      tradeValue: parseFloat(ticker.acc_trade_value_24H),
      high: parseFloat(ticker.max_price),
      low: parseFloat(ticker.min_price),
    });
  }

  // Sort by Trade Value (Volume) descending
  return cryptoList.sort((a, b) => b.tradeValue - a.tradeValue);
};
