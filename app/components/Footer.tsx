export default function Footer() {
  return (
    <footer className="py-16 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Too<span style={{ color: "var(--accent-light)" }}>Go</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
              Сервис поиска горных мест Кыргызстана. Помогаем туристам находить
              лучшие локации и местных партнёров.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Сервис</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              {["Все локации", "Поиск", "Фильтры", "Избранное"].map((item) => (
                <li key={item}><a href="#" className="transition-colors hover:text-[var(--accent-light)]">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Партнёрам</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li><a href="/partner" className="transition-colors hover:text-[var(--accent-light)]">Регистрация</a></li>
              <li><a href="/partner" className="transition-colors hover:text-[var(--accent-light)]">Мои объявления</a></li>
              <li><a href="/admin" className="transition-colors hover:text-[var(--accent-light)]">Администраторам</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <p className="text-xs">© 2025 TooGo. Все права защищены.</p>
          <p className="text-xs">Кыргызская Республика</p>
        </div>
      </div>
    </footer>
  );
}
