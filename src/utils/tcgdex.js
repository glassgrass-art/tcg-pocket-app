// src/utils/tcgdex.js

// TCGDex API 基础路径
const BASE_URL = 'https://api.tcgdex.net/v2/zh-cn';

/**
 * 获取 TCG Pocket 所有卡牌列表
 */
export const fetchPocketCards = async () => {
  try {
    // 请求 TCG Pocket 扩展包 (A1 / Genetic Apex 等)
    const response = await fetch(`${BASE_URL}/series/pocket/cards`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // 格式化卡牌数据，便于前端展示
    return data.map(card => ({
      id: card.id,               // 示例: 'A1-001'
      name: card.name,           // 卡牌名称 (中文)
      image: `${card.image}/high.png`, // 高清卡图 URL
      localId: card.localId,     // 编号 (如 001)
      rarity: card.rarity || 'Common'
    }));
  } catch (error) {
    console.error('Failed to fetch cards from TCGDex:', error);
    return [];
  }
};
