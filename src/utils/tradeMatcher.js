// src/utils/tradeMatcher.js

/**
 * 从本地持卡数据提取 Have (多余可出, count >= 2) 与 Want (缺少的卡, count == 0)
 */
export const getUserTradeStatus = (userCollection, allCards = []) => {
  const offerKeys = []; 
  const wantKeys = [];  

  allCards.forEach(card => {
    const key = `${card.setId}-${card.id}`;
    const count = userCollection[key] || 0;
    if (count >= 2) offerKeys.push(key);
    if (count === 0) wantKeys.push(key);
  });

  return { offerKeys, wantKeys };
};

/**
 * 计算两个玩家之间的交易匹配度
 */
export const calculateMatchScore = (myOffers, myWants, targetOffers, targetWants) => {
  const iCanGive = myOffers.filter(key => targetWants.includes(key));
  const targetCanGive = targetOffers.filter(key => myWants.includes(key));

  const isPerfectMatch = iCanGive.length > 0 && targetCanGive.length > 0;
  const matchCount = iCanGive.length + targetCanGive.length;

  return {
    iCanGive,
    targetCanGive,
    isPerfectMatch,
    matchCount
  };
};
