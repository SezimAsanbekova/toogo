export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-white mb-3">
              Too<span className="text-[#7a9e5f]">Go</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Сервис поиска горных мест Кыргызстана. Помогаем туристам находить
              лучшие локации и местных партнёров.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Сервис</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Все локации</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Поиск</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Фильтры</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Избранное</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Партнёрам</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/partner" className="hover:text-white transition-colors">Регистрация</a></li>
              <li><a href="/partner" className="hover:text-white transition-colors">Мои объявления</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors">Администраторам</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 TooGo. Все права защищены.</p>
          <p className="text-xs">Кыргызская Республика</p>
        </div>
      </div>
    </footer>
  );
}
