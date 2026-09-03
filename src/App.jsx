// src/App.jsx
import React, { useState } from 'react';
import { CollectionGrid } from './components/CollectionGrid';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './constants/languages';

export default function App() {
  const [currentLang, setCurrentLang] = useState(DEFAULT_LANGUAGE);

  return (
    <div className="min-h-screen bg-[#0F0F16] text-white">
      {/* 顶部 Header */}
      <header className="border-b border-white/10 bg-[#181824]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎴</span>
            <h1 className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
              TCG Pocket Hub
            </h1>
          </div>

          {/* 语言切换器 */}
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            className="bg-[#0F0F16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* 主体集卡图鉴墙 */}
      <main>
        <CollectionGrid currentLang={currentLang} />
      </main>
    </div>
  );
}
