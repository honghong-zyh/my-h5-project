
export enum AppTab {
  WORKBENCH = 'workbench',
  MARKET = 'market',
  AGENT = 'agent',
  DISCOVERY = 'discovery',
  PROFILE = 'profile',
  PRODUCT_DETAIL = 'product_detail'
}

export interface ShopStats {
  gmv: string;
  orders: number;
  visitors: number;
  conversion: string;
}

export interface MarketTrend {
  category: string;
  growth: number;
  volume: string;
  topItem: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  groundingSources?: any[];
}