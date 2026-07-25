const locations = [
  {
    id: 1,
    name: "Озеро Иссык-Куль",
    region: "Иссык-Кульская область",
    distance: "260 км",
    difficulty: "easy",
    season: "Лето",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    tags: ["Озеро", "Пляж", "Семейный"],
  },
  {
    id: 2,
    name: "Перевал Ала-Куль",
    region: "Иссык-Кульская область",
    distance: "380 км",
    difficulty: "hard",
    season: "Лето",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    tags: ["Треккинг", "Высокогорье"],
  },
  {
    id: 3,
    name: "Долина Джеты-Огуз",
    region: "Иссык-Кульская область",
    distance: "300 км",
    difficulty: "medium",
    season: "Весна / Лето",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    tags: ["Каньон", "Конные прогулки"],
  },
  {
    id: 4,
    name: "Ущелье Ала-Арча",
    region: "Чуйская область",
    distance: "40 км",
    difficulty: "medium",
    season: "Круглый год",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    tags: ["Природный парк", "Треккинг"],
  },
];

const difficultyLabel: Record<string, { label: string; color: string }> = {
  easy: { label: "Лёгкий", color: "bg-emerald-100 text-emerald-700" },
  medium: { label: "Средний", color: "bg-amber-100 text-amber-700" },
  hard: { label: "Сложный", color: "bg-red-100 text-red-700" },
};

export default function PopularLocations() {
  return (
    <section id="locations" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block bg-[#3d5a3e]/10 text-[#3d5a3e] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
              Популярное
            </span>
            <h2 className="text-4xl font-bold text-stone-800 leading-tight">
              Популярные локации
            </h2>
            <p className="text-stone-500 mt-2 text-base">
              Места, которые выбирают чаще всего
            </p>
          </div>
          <button className="self-start sm:self-auto text-sm font-medium text-[#3d5a3e] hover:underline flex items-center gap-1">
            Все локации
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Favourite */}
                <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Tags */}
                <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                  {loc.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#3d5a3e] transition-colors">
                      {loc.name}
                    </h3>
                    <p className="text-sm text-stone-400 mt-0.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {loc.region}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${difficultyLabel[loc.difficulty].color}`}>
                    {difficultyLabel[loc.difficulty].label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {loc.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                      {loc.season}
                    </span>
                  </div>
                  <button className="text-sm font-semibold text-[#3d5a3e] flex items-center gap-1 hover:gap-2 transition-all">
                    Подробнее
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
