import { Stock } from './types';

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 185.92,
    change: 1.25,
    changePercent: 0.67,
    volume: 45000000,
    history: [],
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.65,
    change: -0.45,
    changePercent: -0.32,
    volume: 22000000,
    history: [],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 402.15,
    change: 3.45,
    changePercent: 0.86,
    volume: 18000000,
    history: [],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 215.55,
    change: -5.20,
    changePercent: -2.35,
    volume: 95000000,
    history: [],
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 596.54,
    change: 12.40,
    changePercent: 2.12,
    volume: 38000000,
    history: [],
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com',
    price: 155.30,
    change: 0.85,
    changePercent: 0.55,
    volume: 32000000,
    history: [],
  },
];

export const MOCK_NEWS = [
  { id: 1, title: "Tech Sector Rallies Ahead of Earnings", source: "Bloomberg", time: "2m ago" },
  { id: 2, title: "Fed Chair Signals Potential Rate Cuts", source: "Reuters", time: "15m ago" },
  { id: 3, title: "EV Market Competition Heats Up", source: "CNBC", time: "1h ago" },
];