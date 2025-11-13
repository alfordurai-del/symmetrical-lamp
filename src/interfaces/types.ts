// types.ts

export interface MarketItem {
  name: string;
  data1: string; // Spot Price
  data2: string; // 24h%
  data3?: string; // Additional data point if not using action button
  isPositive: boolean;
}

export interface MarketPageConfig {
  headers: string[];
  isActionable: boolean;
  hasChart: boolean;
  data: MarketItem[];
}