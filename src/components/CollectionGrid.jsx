// src/components/CollectionGrid.jsx
import React, { useState, useEffect } from 'react';
import { fetchPocketCards, LANGUAGES } from '../utils/tcgdex';

export const CollectionGrid = ({ inventory = {}, onUpdateCount }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentLang, setCurrentLang] = useState('zh-cn');

  // 当语言切换时重新向 TCGDex 抓取该语言数据
  useEffect(() => {
    let isMounted = true;
    const loadCards = async () => {
      setLoading(true);
      const data = await fetchPocketCards(currentLang);
      if (isMounted) {
        setCards(data);
        setLoading(false);
      }
    };
    loadCards();
    return () => { isMounted = false; };
  }, [currentLang]);

  // 按卡名或编号筛选
  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* 顶部控制栏：搜索 + 语言切换 + 计数 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        
        {/* 搜索框 */}
        <div className="w-full md:w-auto flex-1 max-w-md">
          <input
            type="text"
            placeholder="搜索卡牌名称或编号 (如: 超梦 / A1-086 / Charizard)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#181824] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
        </div>

        {/* 语言切换器 & 数量统计 */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">🌐 语言:</span>
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-[#181824] border border-white/10 text-xs text-indigo-400 rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-gray-400">
            已加载 <span className="text-indigo-400 font-bold">{cards.length}</span> 张卡牌
          </div>
        </div>
      </div>

      {/* Loading 状态 */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-400 font-medium">
            正在从 TCGDex 加载 <span className="text-indigo-400">{LANGUAGES.find(l => l.code === currentLang)?.name}</span> 全量卡牌数据...
          </p>
        </div>
      ) : (
        /* 卡牌网格 */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCards.map(card => {
            const count = inventory[card.id]?.count || 0;

            return (
              <div
                key={card.id}
                className={`bg-[#181824] border rounded-2xl p-3 flex flex-col items-center relative transition-all duration-200 ${
                  count > 0
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                    : 'border-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {/* 编号徽章 */}
                <span className="absolute top-2 left-2 text-[10px] font-mono text-gray-300 bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-md z-10">
                  {card.id}
                </span>

                {/* 卡图位 */}
                <div className="w-full aspect-[3/4] relative flex items-center justify-center my-1 rounded-lg overflow-hidden bg-black/30">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-contain rounded-lg transform hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-xs text-gray-600">暂无图片</div>
                  )}
                </div>

                {/* 卡牌名称 */}
                <h3 className="text-xs font-bold text-white text-center truncate w-full my-2">
                  {card.name}
                </h3>

                {/* 持有量控制 */}
                <div className="flex items-center gap-3 bg-[#0F0F16] px-3 py-1.5 rounded-xl border border-white/10 w-full justify-between">
                  <button
                    onClick={() => onUpdateCount(card.id, -1)}
                    className="text-gray-400 hover:text-white font-black text-sm px-2 rounded hover:bg-white/5 transition"
                  >
                    -
                  </button>
                  <span className={`text-xs font-bold ${count > 0 ? 'text-indigo-400 font-mono text-sm' : 'text-gray-500'}`}>
                    {count}
                  </span>
                  <button
                    onClick={() => onUpdateCount(card.id, 1)}
                    className="text-gray-400 hover:text-white font-black text-sm px-2 rounded hover:bg-white/5 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollectionGrid;
