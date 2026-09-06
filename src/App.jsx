import React, { useState, useEffect } from 'react';
import { CollectionGrid } from './components/CollectionGrid';
import { TradePlaza } from './components/TradePlaza';
import { getUserTradeStatus } from './utils/tradeMatcher';

export const App = () => {
  // 当前激活的标签页：'cards' (卡牌图鉴) | 'plaza' (交易广场)
  const [activeTab, setActiveTab] = useState('cards');

  // 用户持有的卡牌数据，格式如: { 'A1-001': { count: 2 }, 'A1-002': { count: 0 } }
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('tcg_pocket_inventory');
    return saved ? JSON.parse(saved) : {};
  });

  // 持久化保存用户持卡数据
  useEffect(() => {
    localStorage.setItem('tcg_pocket_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // 更新某张卡牌的持有数量
  const handleUpdateCardCount = (cardKey, delta) => {
    setInventory(prev => {
      const currentCount = prev[cardKey]?.count || 0;
      const newCount = Math.max(0, currentCount + delta);
      return {
        ...prev,
        [cardKey]: { ...prev[cardKey], count: newCount }
      };
    });
  };

  // 自动计算当前用户“可提供交易(offers)”和“寻求求购(wants)”的卡牌 Key 列表
  const { offers: userOffers, wants: userWants } = getUserTradeStatus(inventory);

  return (
    <div className="min-h-screen bg-[#0F0F16] text-gray-100 flex flex-col font-sans">
      
      {/* 顶部导航栏 */}
      <header className="bg-[#181824] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo 标题 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30">
              🎴
            </div>
            <h1 className="font-extrabold text-lg tracking-wide text-white">
              TCG Pocket <span className="text-indigo-400 font-normal text-sm">Trade Hub</span>
            </h1>
          </div>

          {/* 切换 Tab 按钮 */}
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
              {/* 如果有可交易项，显示小红点提示 */}
              {(userOffers.length > 0 || userWants.length > 0) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* 主体内容区域 */}
      <main className="flex-1">
        {activeTab === 'cards' ? (
          <CollectionGrid 
            inventory={inventory} 
            onUpdateCount={handleUpdateCardCount} 
          />
        ) : (
          <TradePlaza 
            userOffers={userOffers} 
            userWants={userWants} 
          />
        )}
      </main>

      {/* 底部 Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-gray-500">
        <p>Pokémon TCG Pocket Trade Matcher &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
