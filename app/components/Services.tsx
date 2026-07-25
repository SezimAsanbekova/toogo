const services = [
  {
    name: "Трансфер",
    desc: "Трансфер до любой локации",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17H5a2 2 0 01-2-2V9a2 2 0 012-2h11l3 4v4a2 2 0 01-2 2h-1m-7 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 9h11" />
      </svg>
    ),
  },
  {
    name: "Гостевой дом",
    desc: "Уютное размещение у местных",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Фрейм-домик",
    desc: "Треугольные домики в горах",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L2 19h20L12 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19v-5h4v5" />
      </svg>
    ),
  },
  {
    name: "Глэмпинг",
    desc: "Комфорт посреди природы",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
  {
    name: "Юрта",
    desc: "Традиционное кыргызское жильё",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17c0 0 2-6 9-6s9 6 9 6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17h18M12 11V7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17v2m10-2v2" />
        <ellipse cx="12" cy="7" rx="5" ry="2" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    name: "Гид",
    desc: "Опытные местные проводники",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Конные прогулки",
    desc: "Маршруты верхом на лошади",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-1-4-3-1 1-3 3-1 2-4h4l1 3 3 2-1 3-3 1-1 4H9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l-2 4m8-4l2 4" />
      </svg>
    ),
  },
  {
    name: "Аренда снаряжения",
    desc: "Палатки, трекинговые палки и др.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    name: "Кафе",
    desc: "Местная кухня рядом с горами",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13V5a4 4 0 018 0v8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 13h12l-1.5 6H7.5L6 13z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 5h2a1 1 0 011 1v3a1 1 0 01-1 1h-2" />
      </svg>
    ),
  },
  {
    name: "Другое",
    desc: "Уникальные предложения партнёров",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Left text */}
          <div className="md:w-2/5 shrink-0">
            <span className="inline-block bg-[#3d5a3e]/10 text-[#3d5a3e] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
              Услуги
            </span>
            <h2 className="text-4xl font-bold text-stone-800 leading-tight mb-4">
              Всё что нужно
              <br />
              для поездки
            </h2>
            <p className="text-stone-500 leading-relaxed mb-8">
              На каждой странице локации собраны предложения местных партнёров —
              от трансфера до аренды снаряжения. Свяжись напрямую и договорись сам.
            </p>
            <button className="bg-[#3d5a3e] hover:bg-[#2d4330] text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-lg">
              Найти локацию
            </button>
          </div>

          {/* Right grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((s) => (
              <div
                key={s.name}
                className="group bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border border-transparent hover:border-[#3d5a3e]/20"
              >
                <div className="w-11 h-11 rounded-xl bg-[#3d5a3e]/8 flex items-center justify-center text-[#3d5a3e] group-hover:bg-[#3d5a3e] group-hover:text-white transition-all">
                  {s.icon}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{s.name}</p>
                  <p className="text-xs text-stone-400 leading-snug mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
