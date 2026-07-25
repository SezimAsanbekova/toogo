export type Difficulty = "easy" | "medium" | "hard";
export type Season = "spring" | "summer" | "autumn" | "winter" | "all_year";

export interface Location {
  id: number;
  name: string;
  region: string;
  description: string;
  distance: number;       // км
  travelTime: string;
  altitude: number;       // м
  difficulty: Difficulty;
  visitPrice: number;     // сом
  bestSeason: Season;
  recommendations: string;
  isPopular: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
  image: string;
  images: string[];
}

export const LOCATIONS: Location[] = [
  {
    id: 1,
    name: "Озеро Иссык-Куль",
    region: "Иссык-Кульская область",
    description:
      "Иссык-Куль — второе по величине высокогорное озеро в мире и одно из самых глубоких. Окружено горными хребтами Тянь-Шаня, не замерзает даже зимой. Чистейшая вода, песчаные пляжи и потрясающие виды привлекают тысячи туристов каждый год.",
    distance: 260,
    travelTime: "3–4 часа",
    altitude: 1607,
    difficulty: "easy",
    visitPrice: 0,
    bestSeason: "summer",
    recommendations:
      "Лучшее время для купания — июль и август. Берите солнцезащитный крем — на высоте солнце активнее. Вечером бывает прохладно, возьмите куртку.",
    isPopular: true,
    latitude: 42.4500,
    longitude: 77.3500,
    tags: ["Озеро", "Пляж", "Семейный", "Купание"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    ],
  },
  {
    id: 2,
    name: "Перевал Ала-Куль",
    region: "Иссык-Кульская область",
    description:
      "Ала-Куль — высокогорное озеро с бирюзовой водой, расположенное на высоте 3532 м. Один из самых живописных треккинговых маршрутов Кыргызстана. Путь проходит через альпийские луга и ледники.",
    distance: 380,
    travelTime: "5–6 часов",
    altitude: 3532,
    difficulty: "hard",
    visitPrice: 200,
    bestSeason: "summer",
    recommendations:
      "Маршрут только для подготовленных туристов. Необходима акклиматизация. Возьмите тёплую одежду и дождевик — погода меняется быстро. Рекомендуется гид.",
    isPopular: true,
    latitude: 42.2833,
    longitude: 78.2000,
    tags: ["Треккинг", "Высокогорье", "Озеро", "Ледник"],
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    ],
  },
  {
    id: 3,
    name: "Долина Джеты-Огуз",
    region: "Иссык-Кульская область",
    description:
      "Долина с уникальными красными скалами, напоминающими семь быков. Здесь находится знаменитая скала «Сломанное сердце». Живописные луга, горные реки и целебный воздух делают место идеальным для отдыха.",
    distance: 300,
    travelTime: "4 часа",
    altitude: 2200,
    difficulty: "medium",
    visitPrice: 0,
    bestSeason: "summer",
    recommendations:
      "Отличное место для конных прогулок. Местные предлагают экскурсии к скалам. Можно разбить лагерь в долине.",
    isPopular: true,
    latitude: 42.2500,
    longitude: 78.4167,
    tags: ["Каньон", "Конные прогулки", "Скалы", "Лагерь"],
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    ],
  },
  {
    id: 4,
    name: "Ущелье Ала-Арча",
    region: "Чуйская область",
    description:
      "Национальный природный парк в 40 км от Бишкека. Горные реки, сосновые леса, альпийские луга и заснеженные вершины. Популярное место для однодневных походов и альпинизма.",
    distance: 40,
    travelTime: "1 час",
    altitude: 2100,
    difficulty: "medium",
    visitPrice: 150,
    bestSeason: "all_year",
    recommendations:
      "Доступно круглый год. Зимой возможен снегоход и лыжи. Вход в парк платный. Хорошие тропы для семейных прогулок.",
    isPopular: true,
    latitude: 42.6333,
    longitude: 74.4833,
    tags: ["Природный парк", "Треккинг", "Альпинизм", "Однодневный"],
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    ],
  },
  {
    id: 5,
    name: "Озеро Сон-Куль",
    region: "Нарынская область",
    description:
      "Высокогорное степное озеро на высоте 3016 м — настоящее сердце кочевой культуры. Летом берега покрываются юртами пастухов. Здесь можно ощутить дух кыргызских традиций и провести ночь в юрте.",
    distance: 350,
    travelTime: "5 часов",
    altitude: 3016,
    difficulty: "medium",
    visitPrice: 0,
    bestSeason: "summer",
    recommendations:
      "Ночуйте в юрте у местных пастухов — незабываемый опыт. Берите тёплые вещи — ночью температура опускается ниже 0. Дорога частично грунтовая.",
    isPopular: false,
    latitude: 41.8167,
    longitude: 75.1333,
    tags: ["Озеро", "Юрта", "Кочевники", "Высокогорье"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    ],
  },
  {
    id: 6,
    name: "Каньон Сказка",
    region: "Иссык-Кульская область",
    description:
      "Причудливые красные и оранжевые скалы, напоминающие замки и башни. Называется «Сказкой» за фантастические формы, которые создало ветровое выветривание. Один из самых фотогеничных объектов Кыргызстана.",
    distance: 270,
    travelTime: "3.5 часа",
    altitude: 1650,
    difficulty: "easy",
    visitPrice: 100,
    bestSeason: "all_year",
    recommendations:
      "Лучшие фото — на рассвете и закате, когда скалы светятся оранжевым. Удобная обувь обязательна. Можно совместить с посещением Иссык-Куля.",
    isPopular: false,
    latitude: 42.1667,
    longitude: 77.6333,
    tags: ["Каньон", "Фото", "Скалы", "Однодневный"],
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    ],
  },
  {
    id: 7,
    name: "Ущелье Чон-Кемин",
    region: "Чуйская область",
    description:
      "Живописная долина реки Чон-Кемин с тянь-шаньскими елями, альпийскими лугами и снежными пиками. Отличное место для конного треккинга и экотуризма. Здесь сохранились традиционный уклад жизни и гостевые юрты.",
    distance: 80,
    travelTime: "1.5 часа",
    altitude: 1800,
    difficulty: "easy",
    visitPrice: 0,
    bestSeason: "spring",
    recommendations:
      "Идеально весной, когда цветут луга. Можно взять лошадь у местных жителей. Есть несколько гостевых домов для ночлега.",
    isPopular: false,
    latitude: 42.7833,
    longitude: 75.9667,
    tags: ["Долина", "Экотуризм", "Конные прогулки", "Юрта"],
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80",
    ],
  },
  {
    id: 8,
    name: "Перевал Тосор",
    region: "Иссык-Кульская область",
    description:
      "Высокогорный перевал на высоте 3893 м, соединяющий долину Иссык-Куля с нарынскими степями. Потрясающие панорамные виды на оба склона. Один из самых красивых перевалов Кыргызстана.",
    distance: 320,
    travelTime: "5 часов",
    altitude: 3893,
    difficulty: "hard",
    visitPrice: 0,
    bestSeason: "summer",
    recommendations:
      "Проходим только летом (июнь–сентябрь). Необходим полный привод. Возьмите запас топлива и еды. Погода непредсказуема.",
    isPopular: false,
    latitude: 41.9500,
    longitude: 77.7167,
    tags: ["Перевал", "4x4", "Панорама", "Экстрим"],
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",
    ],
  },
  {
    id: 9,
    name: "Долина Суусамыр",
    region: "Джалал-Абадская область",
    description:
      "Широкая высокогорная долина на высоте 2200 м, окружённая заснеженными хребтами. Летом превращается в зелёный ковёр с пасущимися табунами лошадей и отарами овец. Классическая картина кыргызского кочевничества.",
    distance: 200,
    travelTime: "3 часа",
    altitude: 2200,
    difficulty: "easy",
    visitPrice: 0,
    bestSeason: "summer",
    recommendations:
      "Идеально для фотосъёмки и наблюдения за природой. По дороге можно остановиться у юрт и попробовать кумыс. Дорога асфальтирована.",
    isPopular: false,
    latitude: 41.9833,
    longitude: 73.9333,
    tags: ["Долина", "Кочевники", "Лошади", "Фото"],
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    ],
  },
  {
    id: 10,
    name: "Пик Хан-Тенгри",
    region: "Иссык-Кульская область",
    description:
      "Легендарная вершина высотой 7010 м — «Повелитель неба» на границе Кыргызстана, Казахстана и Китая. Один из самых красивых пиков мира с мраморной пирамидальной вершиной. Мечта каждого альпиниста.",
    distance: 500,
    travelTime: "8–10 часов",
    altitude: 7010,
    difficulty: "hard",
    visitPrice: 500,
    bestSeason: "summer",
    recommendations:
      "Восхождение только для профессиональных альпинистов с опытом высотных экспедиций. Обязательна регистрация в МЧС и страховка. Базовый лагерь доступен вертолётом.",
    isPopular: false,
    latitude: 42.2167,
    longitude: 80.1833,
    tags: ["Альпинизм", "Высотный", "Экстрим", "7000м"],
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80",
    ],
  },
];

export const difficultyLabel: Record<Difficulty, { label: string; bg: string; text: string }> = {
  easy:   { label: "Лёгкий",  bg: "rgba(52,211,153,0.15)", text: "#34d399" },
  medium: { label: "Средний", bg: "rgba(251,191,36,0.15)",  text: "#fbbf24" },
  hard:   { label: "Сложный", bg: "rgba(248,113,113,0.15)", text: "#f87171" },
};

export const seasonLabel: Record<Season, string> = {
  spring:   "Весна",
  summer:   "Лето",
  autumn:   "Осень",
  winter:   "Зима",
  all_year: "Круглый год",
};
