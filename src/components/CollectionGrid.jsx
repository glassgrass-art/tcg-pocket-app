import React, { useState, useEffect } from 'react';
import { getCardImageUrl, handleCardImageError } from '../utils/tcgdex';
import { getLocalCollection, updateCardCount } from '../utils/storage';

// 示例数据扩展包与卡牌数据（后续可接动态 JSON/API）
const MOCK_SETS = [
  { id: 'A1', name: '最强的基因 (Genetic Apex)' },
  { id: 'A1a', name: '幻之岛 (Mythical Island)' },
  { id: 'PROMO-A', name: 'Promo-A 特典卡' }
];

const MOCK_CARDS = [
  { id: '001', setId: 'A1', name: '妙蛙种子', rarity: 'C' },
  { id: '002', setId: 'A1', name: '妙蛙草', rarity: 'U' },
  { id: '003', setId: 'A1', name: '妙蛙花', rarity: 'R' },
  { id: '004', setId: 'A1', name: '妙蛙花 ex', rarity: 'RR' },
  { id: '086', setId: 'A1', name: '超梦 ex', rarity: 'SAR' },
  { id: '001', setId: 'A1a', name: '梦幻', rarity: 'AR' },
];

export const CollectionGrid = ({ currentLang = 'zh-tw' }) => {
  const [selectedSet, setSelectedSet] = useState('A1');
  const [userCollection, setUserCollection] = useState({});

  // 初始化加载本地持卡数据
  useEffect(() => {
    setUserCollection(getLocalCollection());
  }, []);

  // 快捷更新持卡数量
  const handleCardClick = (cardKey, delta) => {
    const currentCount = userCollection[cardKey] || 0;
    const newCount = Math.max(0, currentCount + delta);
    const updated = updateCardCount(cardKey, newCount);
    if (updated) setUserCollection({ ...updated });
  };

  const filteredCards = MOCK_CARDS.filter(card => card.setId === selectedSet);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* 1. 扩展包筛选 Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {MOCK_SETS.map(set => (
          <button
            key={set.id}
            onClick={() => setSelectedSet(set.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              selectedSet === set.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-[#181824] text-gray-400 hover:bg-[#252538]'
            }`}
          >
            {set.name}
          </button>
        ))}
      </div>

      {/* 2. 高清瀑布流卡牌墙 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCards.map(card => {
          const cardKey = `${card.setId}-${card.id}`;
          const count = userCollection[cardKey] || 0;
          const imgUrl = getCardImageUrl(card.setId, card.id, currentLang);

          return (
            <div 
              key={cardKey} 
              className={`relative group bg-[#181824] rounded-xl p-2 border transition-all duration-200 ${
                count > 0 ? 'border-indigo-500/50 shadow-md shadow-indigo-500/10' : 'border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              {/* 卡牌图片 */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-black/40">
                <img
                  src={imgUrl}
                  alt={card.name}
                  onError={(e) => handleCardImageError(e, card.setId, card.id)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* 持有数量角标 */}
                {count > 0 && (
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-md ${
                    count >= 2 ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {count >= 2 ? `可出 x${count - 1}` : `x${count}`}
                  </span>
                )}
              </div>

              {/* 卡片名称与稀有度 */}
              <div className="mt-2 flex justify-between items-center px-1">
                <span className="text-xs text-gray-300 truncate font-medium">{card.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-amber-400 font-bold">
                  {card.rarity}
                </span>
              </div>

              {/* 极速增减按钮 */}
              <div className="mt-2 flex gap-1">
                <button
                  onClick={() => handleCardClick(cardKey, -1)}
                  className="flex-1 py-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 text-xs rounded transition"
                >
                  -
                </button>
                <button
                  onClick={() => handleCardClick(cardKey, 1)}
                  className="flex-1 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold rounded transition"
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
