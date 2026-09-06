// src/components/CollectionGrid.jsx
import React, { useState, useEffect } from 'react';
import { fetchPocketCards } from '../utils/tcgdex';

export const CollectionGrid = ({ inventory = {}, onUpdateCount }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 页面加载时自动从 TCGDex 拉取卡牌
  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      const cardList = await fetchPocketCards();
      setCards(cardList);
      setLoading(false);
    };
    loadCards();
  }, []);

  // 名字搜索过滤
  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400">
        <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm">正在加载 TCG Pocket 多语言卡牌数据库...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 搜索与统计栏 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索卡牌名字或编号 (如: 妙蛙种子 / A1-001)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 bg-[#181824] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
        />
        <div className="text-xs text-gray-400">
          已加载 <span className="text-indigo-400 font-bold">{cards.length}</span> 张卡牌
        </div>
      </div>

      {/* 卡牌网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCards.map(card => {
          const count = inventory[card.id]?.count || 0;

          return (
            <div
              key={card.id}
              className={`bg-[#181824] border rounded-2xl p-3 flex flex-col items-center relative transition ${
                count > 0 ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-white/5 opacity-60'
              }`}
            >
              {/* 卡牌编号 */}
              <span className="absolute top-2 left-2 text-[10px] font-mono text-gray-400 bg-black/40 px-1.5 py-0.5 rounded">
                {card.id}
              </span>

              {/* 卡图 */}
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-auto rounded-lg my-2 object-cover"
                loading="lazy"
              />

              {/* 卡牌名称 */}
              <h3 className="text-xs font-bold text-white text-center truncate w-full mb-2">
                {card.name}
              </h3>

              {/* 持有数量加减操作 */}
              <div className="flex items-center gap-3 bg-[#0F0F16] px-3 py-1 rounded-xl border border-white/5">
                <button
                  onClick={() => onUpdateCount(card.id, -1)}
                  className="text-gray-400 hover:text-white font-bold text-sm px-1"
                >
                  -
                </button>
                <span className={`text-xs font-bold ${count > 0 ? 'text-indigo-400' : 'text-gray-500'}`}>
                  {count}
                </span>
                <button
                  onClick={() => onUpdateCount(card.id, 1)}
                  className="text-gray-400 hover:text-white font-bold text-sm px-1"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionGrid;
