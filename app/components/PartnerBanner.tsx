export default function PartnerBanner() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-[#3d5a3e]">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3d5a3e] via-[#3d5a3e]/90 to-transparent" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-16">
            <div className="max-w-lg">
              <span className="inline-block bg-white/15 text-white/80 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                Для бизнеса
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Ты предприниматель
                в горном туризме?
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Размести свои услуги рядом с популярными локациями и получай клиентов
                напрямую — без комиссий и посредников.
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "Бесплатная регистрация",
                  "Туристы находят тебя сами",
                  "Прямая связь — телефон, WhatsApp, Telegram",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#a8c97f]/30 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-[#a8c97f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <a
                href="/partner"
                className="bg-white text-[#3d5a3e] font-bold px-8 py-4 rounded-2xl hover:bg-stone-50 transition-all text-center shadow-lg hover:shadow-xl"
              >
                Стать партнёром
              </a>
              <p className="text-white/50 text-xs text-center">
                Регистрация занимает 5 минут
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
