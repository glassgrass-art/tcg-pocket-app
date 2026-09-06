// src/utils/tcgdex.js

// 支持的语言列表
export const LANGUAGES = [
  { code: 'zh-cn', name: '简体中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh-tw', name: '繁體中文' },
  { code: 'ko', name: '한국어' }
];

// 核心 fetch 封装，自带 CORS 代理降级
const fetchWithProxy = async (url) => {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.json();
    throw new Error('Direct fetch failed');
  } catch (err) {
    // 直连失败时使用代理兜底，解决 CORS 及网络问题
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const proxyRes = await fetch(proxyUrl);
    if (!proxyRes.ok) throw new Error('Proxy fetch failed');
    return await proxyRes.json();
  }
};

/**
 * 拉取 TCG Pocket 全量卡牌数据
 * @param {string} lang - 语言代码 (zh-cn, en, ja...)
 */
export const fetchPocketCards = async (lang = 'zh-cn') => {
  try {
    // 1. 获取 Pocket 系列包含的所有扩展包 (A1, A1a 等)
    const seriesData = await fetchWithProxy(`https://api.tcgdex.net/v2/${lang}/series/pocket`);
    if (!seriesData || !seriesData.sets) return [];

    let allCards = [];

    // 2. 遍历拉取每一个扩展包中的全量卡牌
    for (const set of seriesData.sets) {
      try {
        const setData = await fetchWithProxy(`https://api.tcgdex.net/v2/${lang}/sets/${set.id}`);
        if (setData && setData.cards) {
          const cardsWithDetails = setData.cards.map(card => {
            // 处理高清图片 CDN 路径，同样添加代理保证加载成功
            const rawImageUrl = card.image ? `${card.image}/high.webp` : '';
            const safeImageUrl = rawImageUrl ? `https://wsrv.nl/?url=${encodeURIComponent(rawImageUrl)}` : '';

            return {
              id: `${set.id}-${card.localId}`,
              localId: card.localId,
              setId: set.id,
              name: card.name || 'Unknown',
              image: safeImageUrl,
              rarity: card.rarity || 'Common'
            };
          });
          allCards.push(...cardsWithDetails);
        }
      } catch (e) {
        console.error(`Failed to fetch set ${set.id}:`, e);
      }
    }

    return allCards;
  } catch (error) {
    console.error('Failed to fetch TCG Pocket cards:', error);
    return [];
  }
};
