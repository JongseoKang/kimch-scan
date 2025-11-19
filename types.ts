
export interface BithumbTicker {
  opening_price: string;
  closing_price: string;
  min_price: string;
  max_price: string;
  units_traded: string;
  acc_trade_value: string;
  prev_closing_price: string;
  units_traded_24H: string;
  acc_trade_value_24H: string;
  fluctate_24H: string;
  fluctate_rate_24H: string;
}

export interface BithumbApiResponse {
  status: string;
  data: {
    [key: string]: BithumbTicker | string; // 'date' is string, tickers are objects
  };
}

export interface BithumbAssetStatus {
  deposit_status: number; // 1 = normal, 0 = blocked
  withdrawal_status: number; // 1 = normal, 0 = blocked
}

export interface BithumbAssetsStatusResponse {
  status: string;
  data: {
    [key: string]: BithumbAssetStatus;
  };
}

export interface CryptoItem {
  symbol: string;
  price: number; // closing_price (Bithumb)
  prevPrice: number;
  chgAmt: number; // fluctate_24H
  chgRate: string; // fluctate_rate_24H
  volume: number; // units_traded_24H
  tradeValue: number; // acc_trade_value_24H
  high: number;
  low: number;
  // Bybit Data
  bybitPrice?: number; // Converted to KRW
  premium?: number; // Kimchi Premium %
  // Asset Status
  depositStatus?: number;
  withdrawalStatus?: number;
}
