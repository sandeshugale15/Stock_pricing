export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  history: { time: string; price: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MARKET_ANALYSIS = 'MARKET_ANALYSIS',
  SETTINGS = 'SETTINGS',
}