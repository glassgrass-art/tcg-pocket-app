import React, { useState, useEffect } from 'react';
import { CollectionGrid } from './components/CollectionGrid';
import { TradePlaza } from './components/TradePlaza';
import { getUserTradeStatus } from './utils/tradeMatcher';

export const App = () => {
  const [activeTab, setActiveTab] = useState('cards');

  // 初始化持卡数据
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('tcg_pocket_inventory');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // 保存数据
  useEffect(() => {
    try {
      localStorage.setItem('tcg_pocket_inventory', JSON.stringify(inventory));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [inventory]);

  const handleUpdateCardCount = (cardKey, delta) => {
    setInventory(prev => {
      const safePrev = prev || {};
      const currentCount = safePrev[cardKey]?.count || 0;
      const newCount = Math.max(0, currentCount + delta);
      return {
        ...safePrev,
        [cardKey]: { ...safePrev[cardKey], count: newCount }
      };
    });
  };

  // 安全获取交易状态，避免 undefined
  const tradeStatus = getUserTradeStatus(inventory || {}) || { offers: [], wants: [] };
  const userOffers = Array.isArray(tradeStatus.offers) ? tradeStatus.offers : [];
  const userWants = Array.isArray(tradeStatus.wants) ? tradeStatus.wants : [];

  return (
    <div className="min-h-screen bg-[#0F0F16] text-gray-100 flex flex-col font-sans">
      
      {/* 顶部导航 */}
      <header className="bg-[#181824] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30">
              🎴
            </div>
            <h1 className="font-extrabold text-lg tracking-wide text-white">
              TCG Pocket <span className="text-indigo-400 font-normal text-sm">Trade Hub</span>
            </h1>
          </div>

          <nav className="flex items-center gap-2 bg-[#0F0F16] p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cards'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🃏 我的卡牌库
            </button>
            <button
              onClick={() => setActiveTab('plaza')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                activeTab === 'plaza'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🤝 交易广场
              {(userOffers.length > 0 || userWants.length > 0) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* 主界面切换 */}
      <main className="flex-1">
        {activeTab === 'cards' ? (
          <CollectionGrid 
            inventory={inventory || {}} 
            onUpdateCount={handleUpdateCardCount} 
          />
        ) : (
          <TradePlaza 
            userOffers={userOffers} 
            userWants={userWants} 
          />
        )}
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-gray-500">
        <p>Pokémon TCG Pocket Trade Matcher &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
