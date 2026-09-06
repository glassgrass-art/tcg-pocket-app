// src/utils/tcgdex.js

// 保底数据，确保 API 失败或延迟时也能正常展示卡牌
const FALLBACK_CARDS = [
  { id: 'A1-001', name: '妙蛙种子', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/001/high.png', localId: '001' },
  { id: 'A1-002', name: '妙蛙草', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/002/high.png', localId: '002' },
  { id: 'A1-003', name: '妙蛙花ex', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/003/high.png', localId: '003' },
  { id: 'A1-004', name: '小火龙', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/004/high.png', localId: '004' },
  { id: 'A1-086', name: '超梦ex', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/086/high.png', localId: '086' },
  { id: 'A1-096', name: '皮卡丘ex', image: 'https://assets.tcgdex.net/zh-cn/pocket/A1/096/high.png', localId: '096' }
];

export const fetchPocketCards = async () => {
  try {
    // 尝试拉取 TCGDex Pocket 系列 (A1 扩展包)
    const res = await fetch('https://api.tcgdex.net/v2/zh-cn/sets/A1');
    if (!res.ok) throw new Error('API Response Error');
    
    const data = await res.json();
    if (data && Array.isArray(data.cards) && data.cards.length > 0) {
      return data.cards.map(card => ({
        id: `A1-${card.localId}`,
        name: card.name,
        image: card.image ? `${card.image}/high.png` : 'https://assets.tcgdex.net/zh-cn/pocket/A1/001/high.png',
        localId: card.localId
      }));
    }
    return FALLBACK_CARDS;
  } catch (error) {
    console.warn('TCGDex API Fetch fallback:', error);
    return FALLBACK_CARDS;
  }
};
