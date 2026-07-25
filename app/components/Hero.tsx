"use client";

import { useState } from "react";

export default function Hero() {
  const [searching, setSearching] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#7a9e5f] animate-pulse" />
            Горные маршруты Кыргызстана
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Найди своё
            <br />
            <span className="text-[#a8c97f]">горное место</span>
          </h1>

          <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-lg">
            Сотни маршрутов, локаций и услуг в одном месте. 
            От тихих озёр до высокогорных перевалов — выбери своё приключение.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 flex items-center bg-white rounded-2xl px-5 py-4 gap-3 shadow-2xl">
              <svg className="w-5 h-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Поиск локации..."
                className="flex-1 outline-none text-stone-700 placeholder-stone-400 bg-transparent text-base"
                onFocus={() => setSearching(true)}
                onBlur={() => setSearching(false)}
              />
            </div>
            <button className="bg-[#3d5a3e] hover:bg-[#2d4330] text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95">
              Найти
            </button>
          </div>

          {/* Random pick button */}
          <button className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full transition-all">
            <svg className="w-5 h-5 text-[#a8c97f] group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">Не могу выбрать — выбери за меня</span>
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/20">
          {[
            { value: "50+", label: "Локаций" },
            { value: "7", label: "Областей" },
            { value: "200+", label: "Партнёров" },
            { value: "10K+", label: "Туристов" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs tracking-widest uppercase">Листай вниз</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
      </div>
    </section>
  );
}
