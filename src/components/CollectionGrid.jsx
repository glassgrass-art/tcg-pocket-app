// src/components/CollectionGrid.jsx
import React, { useState, useEffect } from 'react';
import { fetchPocketCards } from '../utils/tcgdex';

export const CollectionGrid = ({ inventory = {}, onUpdateCount }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadCards = async () => {
      setLoading(true);
      const cardList = await fetchPocketCards();
      if (isMounted) {
        setCards(cardList || []);
        setLoading(false);
      }
    };
    loadCards();
    return () => { isMounted = false; };
  }, []);

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        <p>正在加载卡牌数据...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      
      {/* 搜索与卡牌计数栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          placeholder="搜索卡牌名字或编号 (如: 妙蛙种子 / A1-001)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#181824',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff',
            width: '300px'
          }}
        />
        <div style={{ color: '#aaa', fontSize: '14px' }}>
          已加载 <strong style={{ color: '#818cf8' }}>{filteredCards.length}</strong> 张卡牌
        </div>
      </div>

      {/* 卡牌网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px'
      }}>
        {filteredCards.map(card => {
          const count = inventory[card.id]?.count || 0;

          return (
            <div
              key={card.id}
              style={{
                backgroundColor: '#181824',
                border: count > 0 ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                opacity: count > 0 ? 1 : 0.7
              }}
            >
              {/* 卡牌编号 */}
              <span style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                fontSize: '10px',
                color: '#aaa',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '2px 4px',
                borderRadius: '4px'
              }}>
                {card.id}
              </span>

              {/* 卡图 */}
              <img
                src={card.image}
                alt={card.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '6px',
                  margin: '16px 0 8px 0',
                  minHeight: '120px',
                  backgroundColor: '#0F0F16',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150x210?text=Pokémon';
                }}
              />

              {/* 卡牌名称 */}
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '8px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%'
              }}>
                {card.name}
              </div>

              {/* 数量调整按钮 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#0F0F16',
                padding: '4px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <button
                  onClick={() => onUpdateCount(card.id, -1)}
                  style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  -
                </button>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: count > 0 ? '#818cf8' : '#666' }}>
                  {count}
                </span>
                <button
                  onClick={() => onUpdateCount(card.id, 1)}
                  style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
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

export default CollectionGrid;
