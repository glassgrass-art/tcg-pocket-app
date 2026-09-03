// src/components/TradePlaza.jsx
import React, { useState } from 'react';
import { calculateMatchScore } from '../utils/tradeMatcher';

// 模拟广场玩家数据（后续可接入 Firebase / Cloudflare D1 数据库）
const MOCK_PLAZA_USERS = [
  {
    id: 'user_01',
    name: 'Red_Trainer',
    friendId: '1234-5678-9012-3456',
    contact: 'Discord: red#1234',
    offers: ['A1-086', 'A1-004'], // 超梦ex, 妙蛙花ex
    wants: ['A1-001', 'A1a-001']   // 妙蛙种子, 梦幻
  },
  {
    id: 'user_02',
    name: 'Ash_Ketchum',
    friendId: '9876-5432-1098-7654',
    contact: 'Telegram: @ash_tcg',
    offers: ['A1-001'],            // 妙蛙种子
    wants: ['A1-086']              // 超梦ex
  }
];

export const TradePlaza = ({ userOffers = [], userWants = [] }) => {
  const [copiedId, setCopiedId] = useState('');

  const handleCopy = (friendId) => {
    navigator.clipboard.writeText(friendId);
    setCopiedId(friendId);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* 顶部发布提示面板 */}
      <div className="bg-[#181824] border border-indigo-500/20 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🤝</span> 交易配对广场 (Trade Plaza)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            根据你当前的图鉴，系统已为你精选出最匹配互补的交易玩家。
          </p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 hover:opacity-90 transition whitespace-nowrap">
          发布我的交易需求
        </button>
      </div>

      {/* 玩家卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PLAZA_USERS.map(player => {
          const match = calculateMatchScore(userOffers, userWants, player.offers, player.wants);

          return (
            <div 
              key={player.id}
              className={`bg-[#181824] border rounded-2xl p-5 relative transition ${
                match.isPerfectMatch ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'border-white/5'
              }`}
            >
              {/* 完美匹配标签 */}
              {match.isPerfectMatch && (
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold rounded-full">
                  双向双赢匹配 🎉
                </span>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400">
                  {player.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{player.name}</h3>
                  <p className="text-xs text-gray-400">{player.contact}</p>
                </div>
              </div>

              {/* 16位 Friend ID 复制区域 */}
              <div className="bg-[#0F0F16] rounded-xl p-2.5 mb-4 flex items-center justify-between border border-white/5">
                <span className="text-xs font-mono text-gray-300 tracking-wider">
                  ID: {player.friendId}
                </span>
                <button
                  onClick={() => handleCopy(player.friendId)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition"
                >
                  {copiedId === player.friendId ? '已复制！' : '复制 ID'}
                </button>
              </div>

              {/* 卡牌供需清单 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-950/30 border border-emerald-500/10 p-2.5 rounded-xl">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1">对方提供 (Offers)</span>
                  <div className="flex flex-wrap gap-1">
                    {player.offers.map(key => (
                      <span key={key} className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-950/30 border border-amber-500/10 p-2.5 rounded-xl">
                  <span className="text-[10px] text-amber-400 font-bold block mb-1">对方需求 (Wants)</span>
                  <div className="flex flex-wrap gap-1">
                    {player.wants.map(key => (
                      <span key={key} className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px]">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
