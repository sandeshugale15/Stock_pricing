import React, { useState, useEffect, useCallback } from 'react';
import { User, Stock, ViewState } from './types';
import { INITIAL_STOCKS, MOCK_NEWS } from './constants';
import Layout from './components/Layout';
import StockChart from './components/StockChart';
import MarketAssistant from './components/MarketAssistant';
import { TrendingUp, TrendingDown, Clock, Newspaper, ArrowRight, ShieldCheck } from 'lucide-react';
import { generateMarketSummary } from './services/geminiService';

// --- Login Component ---
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TradeFlow AI</h1>
          <p className="text-slate-400">Intelligent Market Analysis & Real-time Tracking</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input 
              type="email" 
              defaultValue="demo@tradeflow.ai"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              defaultValue="password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
           <ShieldCheck size={16} />
           <span>Secure 256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [marketSummary, setMarketSummary] = useState<string>("");

  const user: User = {
    id: '1',
    name: 'Alex Trader',
    email: 'alex@tradeflow.ai',
    avatar: 'https://picsum.photos/200/200'
  };

  // Simulate real-time data updates
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial population of history data
    setStocks(prevStocks => prevStocks.map(stock => {
      const history = [];
      let currentPrice = stock.price;
      for (let i = 0; i < 20; i++) {
        history.push({ time: `${i}:00`, price: currentPrice });
        currentPrice = currentPrice * (1 + (Math.random() * 0.02 - 0.01));
      }
      return { ...stock, history };
    }));
    
    // Select first stock by default
    if (!selectedStock) {
        setSelectedStock(stocks[0]);
    }

    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(stock => {
        const volatility = 0.002; // 0.2% variance per tick
        const change = (Math.random() * volatility * 2) - volatility;
        const newPrice = Math.max(0, stock.price * (1 + change));
        const priceChange = newPrice - stock.price;
        
        const newHistory = [...stock.history.slice(1), { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' }), 
          price: newPrice 
        }];

        return {
          ...stock,
          price: newPrice,
          change: stock.change + priceChange,
          changePercent: ((stock.change + priceChange) / (stock.price - stock.change)) * 100,
          history: newHistory
        };
      }));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Update selected stock ref when stocks change
  useEffect(() => {
    if (selectedStock) {
      const updated = stocks.find(s => s.symbol === selectedStock.symbol);
      if (updated) setSelectedStock(updated);
    } else if (stocks.length > 0) {
        setSelectedStock(stocks[0]);
    }
  }, [stocks, selectedStock]);

  // Get AI Market Summary on Load
  useEffect(() => {
      if(isAuthenticated && !marketSummary) {
          generateMarketSummary().then(setMarketSummary);
      }
  }, [isAuthenticated, marketSummary]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout 
      user={user} 
      currentView={view} 
      onNavigate={setView} 
      onLogout={() => setIsAuthenticated(false)}
    >
      <div className="grid grid-cols-12 gap-6 h-full pb-6">
        {/* Left Column: Market List & Chart */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* Featured Chart Section */}
          {selectedStock && (
            <div className="w-full">
               <StockChart stock={selectedStock} />
            </div>
          )}

          {/* Market Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Market Sentiment Card */}
             <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                    <Newspaper className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold text-white">AI Market Pulse</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed min-h-[60px]">
                    {marketSummary || "Analyzing market data..."}
                </p>
             </div>

             {/* Top Movers Card */}
             <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
                 <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Top Movers</h3>
                </div>
                <div className="space-y-3">
                    {stocks.slice(0, 3).map(s => (
                        <div key={s.symbol} className="flex justify-between items-center text-sm">
                            <span className="text-slate-300 font-medium">{s.symbol}</span>
                            <span className={s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                {s.change > 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
             </div>
          </div>

          {/* Stock List Table */}
          <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
                <h3 className="font-bold text-white">Watchlist</h3>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> Real-time
                </span>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="p-4">Symbol</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Change</th>
                    <th className="p-4 text-right hidden sm:table-cell">Volume</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {stocks.map((stock) => (
                    <tr 
                        key={stock.symbol} 
                        onClick={() => setSelectedStock(stock)}
                        className={`hover:bg-slate-700/30 cursor-pointer transition-colors ${selectedStock?.symbol === stock.symbol ? 'bg-indigo-500/10' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-white">{stock.symbol}</span>
                            <span className="text-xs text-slate-500">{stock.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono text-slate-200">
                        ${stock.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          stock.change >= 0 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {stock.change >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-400 text-sm hidden sm:table-cell">
                        {(stock.volume / 1000000).toFixed(1)}M
                      </td>
                      <td className="p-4 text-right">
                        <ArrowRight size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant & News */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-[500px]">
          <MarketAssistant />
          
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hidden xl:block">
            <div className="flex items-center gap-2 mb-4">
                <Newspaper className="text-indigo-400 w-5 h-5" />
                <h3 className="font-bold text-white">Latest News</h3>
            </div>
            <div className="space-y-4">
                {MOCK_NEWS.map(news => (
                    <div key={news.id} className="group cursor-pointer">
                        <h4 className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-2">
                            {news.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{news.time}</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;