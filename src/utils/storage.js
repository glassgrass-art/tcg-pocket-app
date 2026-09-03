const STORAGE_KEY = 'tcg_pocket_user_collection';

/**
 * 读取本地卡牌数据
 * @returns {Object} 格式为 { "A1-086": 2, "A1-087": 0 }
 */
export const getLocalCollection = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('读取本地集卡数据失败:', error);
    return {};
  }
};

/**
 * 更新单张卡牌的持卡数量
 * @param {string} cardKey - 唯一键名，如 "A1-086"
 * @param {number} count - 持有数量
 */
export const updateCardCount = (cardKey, count) => {
  try {
    const collection = getLocalCollection();
    if (count <= 0) {
      delete collection[cardKey];
    } else {
      collection[cardKey] = count;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    return collection;
  } catch (error) {
    console.error('写入本地集卡数据失败:', error);
    return null;
  }
};
