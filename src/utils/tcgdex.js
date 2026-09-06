// src/utils/tcgdex.js

// 兜底保底卡牌（带标准可用的宝可梦卡图）
const FALLBACK_CARDS = [
  { id: 'A1-001', name: '妙蛙种子', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/001/high.webp', localId: '001' },
  { id: 'A1-002', name: '妙蛙草', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/002/high.webp', localId: '002' },
  { id: 'A1-003', name: '妙蛙花ex', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/003/high.webp', localId: '003' },
  { id: 'A1-004', name: '小火龙', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/004/high.webp', localId: '004' },
  { id: 'A1-086', name: '超梦ex', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/086/high.webp', localId: '086' },
  { id: 'A1-096', name: '皮卡丘ex', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/096/high.webp', localId: '096' }
];

export const fetchPocketCards = async () => {
  try {
    const res = await fetch('https://api.tcgdex.net/v2/zh-cn/series/pocket');
    if (!res.ok) throw new Error('API request failed');
    
    const data = await res.json();
    // 如果拿到扩展包，逐个拉取卡牌数据
    if (data && data.sets) {
      const allCards = [];
      for (const set of data.sets) {
        const setRes = await fetch(`https://api.tcgdex.net/v2/zh-cn/sets/${set.id}`);
        if (setRes.ok) {
          const setData = await setRes.json();
          if (setData.cards) {
            const formatted = setData.cards.map(c => ({
              id: `${set.id}-${c.localId}`,
              name: c.name,
              image: c.image ? `${c.image}/high.webp` : 'https://assets.tcgdex.net/zh-cn/pocket/A1/001/high.webp',
              localId: c.localId
            }));
            allCards.push(...formatted);
          }
        }
      }
      if (allCards.length > 0) return allCards;
    }
    return FALLBACK_CARDS;
  } catch (error) {
    console.warn('Using fallback cards due to API error:', error);
    return FALLBACK_CARDS;
  }
};
