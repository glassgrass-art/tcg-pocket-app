// src/utils/tcgdex.js

// 采用可跨域且访问稳定的宝可梦卡图资源（添加图片代理服务防加载失败）
const getImageUrl = (originalUrl) => {
  if (!originalUrl) return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
  // 通过 wsrv.nl CDN 代理加速并强制转为 PNG，规避 CORS 限制
  return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&output=png`;
};

const FALLBACK_CARDS = [
  { id: 'A1-001', name: '妙蛙种子', image: getImageUrl('https://assets.tcgdex.net/zh-cn/pocket/A1/001/high.webp'), localId: '001' },
  { id: 'A1-002', name: '妙蛙草', image: getImageUrl('https://assets.tcgdex.net/zh-cn/pocket/A1/002/high.webp'), localId: '002' },
  { id: 'A1-003', name: '妙蛙花ex', image: getImageUrl('https://assets.tcgdex.net/zh-cn/pocket/A1/003/high.webp'), localId: '003' },
  { id: 'A1-004', name: '小火龙', image: getImageUrl('https://assets.tcgdex.net/zh-cn/pocket/A1/004/high.webp'), localId: '004' },
  { id: 'A1-086', name: '超梦ex', image: getImageUrl('https://assets.tcgdex.net/zh-cn/pocket/A1/086/high.webp'), localId: '086' },
  { id: 'A1-096', name: '皮卡丘ex', image: getImageUrl('https://assets.tcgdex.net/zh-cn/pocket/A1/096/high.webp'), localId: '096' }
];

export const fetchPocketCards = async () => {
  try {
    const res = await fetch('https://api.tcgdex.net/v2/zh-cn/sets/A1');
    if (!res.ok) throw new Error('Network error');
    
    const data = await res.json();
    if (data && Array.isArray(data.cards) && data.cards.length > 0) {
      return data.cards.map(card => ({
        id: `A1-${card.localId}`,
        name: card.name,
        image: getImageUrl(`${card.image}/high.webp`),
        localId: card.localId
      }));
    }
    return FALLBACK_CARDS;
  } catch (error) {
    console.warn('API error, using fallback:', error);
    return FALLBACK_CARDS;
  }
};
