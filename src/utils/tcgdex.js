/**
 * TCGdex CDN 多语言卡牌图片拼接工具
 */

const TCGDEX_CDN_BASE = 'https://assets.tcgdex.net';

/**
 * 格式化卡牌序号，确保至少为 3 位字符串 (例如 5 -> "001", 86 -> "086", 120 -> "120")
 * @param {string|number} cardId 
 * @returns {string}
 */
export const formatCardId = (cardId) => {
  const strId = String(cardId).trim();
  return strId.padStart(3, '0');
};

/**
 * 获取对应语言和尺寸的卡图 URL
 * @param {string} setId - 卡包扩展包代码 (例如 "A1", "A1a", "PROMO")
 * @param {string|number} cardId - 卡牌序号 (例如 86)
 * @param {string} lang - 语言代码 (例如 'zh-tw', 'en', 'ja')
 * @param {'high'|'low'} quality - 图片清晰度，默认 'high'
 * @returns {string} CDN WebP 图像直链
 */
export const getCardImageUrl = (setId, cardId, lang = 'zh-tw', quality = 'high') => {
  if (!setId || !cardId) {
    return '/placeholder-card.webp'; // 兜底占位图
  }

  const formattedSetId = String(setId).toUpperCase();
  const formattedCardId = formatCardId(cardId);
  
  // TCGdex 规范路径: https://assets.tcgdex.net/{lang}/pocket/{setId}/{cardId}/{quality}.webp
  return `${TCGDEX_CDN_BASE}/${lang}/pocket/${formattedSetId}/${formattedCardId}/${quality}.webp`;
};

/**
 * 卡图加载失败时的降级兜底函数 (当选定语言缺失卡图时，自动降级为英文卡图)
 * @param {Event} event 
 * @param {string} setId 
 * @param {string|number} cardId 
 */
export const handleCardImageError = (event, setId, cardId) => {
  const target = event.target;
  
  // 如果已经是英文图加载失败，直接加载本地通用占位图，防止死循环
  if (target.dataset.fallbackAttempted === 'true') {
    target.src = '/placeholder-card.webp';
    return;
  }

  target.dataset.fallbackAttempted = 'true';
  target.src = getCardImageUrl(setId, cardId, 'en', 'high');
};
