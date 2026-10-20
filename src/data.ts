export interface Photo {
  id: string;
  url: string;
  alt: string;
  portrait?: boolean;
}

export interface Album {
  id: AlbumId;
  title: string;
  subtitle: string;
  photoCount: number;
  coverPhoto: Photo;
  photos: Photo[];
  dates?: string;
  location?: string;
}

export type AlbumId = 'italy-2026' | 'mark-first-year' | 'summer-2026' | 'carpathians' | 'family-2025' | 'bella';

export type BookSize = 'small' | 'medium' | 'large';
export type CoverColor = 'white' | 'sand' | 'coral' | 'terracotta' | 'navy' | 'forest' | 'black';
export type DesignVariant = 0 | 1 | 2;

const up = (id: string, w = 600, h = 750) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ─── Італія 2026 ───────────────────────────────────────────────────────────────
export const italyPhotos: Photo[] = [
  { id: 'it1', url: up('1552832230-c0197dd311b5'), alt: 'Колізей у Римі на золотій годині' },
  { id: 'it2', url: up('1523906834658-6e24ef2386f9'), alt: 'Венеціанський канал з гондолою' },
  { id: 'it3', url: up('1516483638261-f4dbaf036963'), alt: 'Барвисте містечко Чинкве-Терре' },
  { id: 'it4', url: up('1651309259727-99b5f13f3a1a', 800, 600), alt: 'Тосканська дорога серед полів' },
  { id: 'it5', url: up('1777363804224-5e6c6df8c1a8', 800, 600), alt: 'Флоренція — вид на Дуомо і річку Арно' },
  { id: 'it6', url: up('1655480259894-cdcbb11b900f', 600, 800), alt: 'Вузька вулиця з крамницями' },
  { id: 'it7', url: up('1630324388631-421e708e0926', 600, 800), alt: 'Вулиця з прапорами над головою' },
  { id: 'it8', url: up('1552598715-7eeb9232a2ac', 800, 600), alt: 'Тосканський будинок у полі на заході' },
  { id: 'it9', url: up('1512850183-6d7990f42385', 600, 800), alt: 'Неаполітанська піца з печі' },
  { id: 'it10', url: up('1504214763-bcba8b1d9e2b', 800, 600), alt: 'Руїни Римського форуму' },
  { id: 'it11', url: up('1499678587897-fed1b14cd851', 800, 600), alt: 'Дорога узбережжя Амальфі' },
  { id: 'it12', url: up('1509023464722-18d996393ca8', 600, 800), alt: 'Флорентійський шкіряний ринок' },
];

// ─── Перший рік Марка ──────────────────────────────────────────────────────────
export const markPhotos: Photo[] = [
  { id: 'mk1', url: up('1784642095446-9c14a9acb928'), alt: 'Марко — маленький і щасливий' },
  { id: 'mk2', url: up('1770872937853-ca90d3699c3a'), alt: 'Перші дні — новонароджений сонний' },
  { id: 'mk3', url: up('1780329942066-6fcd2604c0f0'), alt: 'Марко тримає ніжки — 3 місяці' },
  { id: 'mk4', url: up('1764859878528-2b512ab9d4d9'), alt: 'Марко спить на білому ліжечку' },
  { id: 'mk5', url: up('1571211468362-33f20cb1982f'), alt: 'Перші кроки на травичці' },
  { id: 'mk6', url: up('1568385247005-0d371d214a2c'), alt: 'Марко стоїть і сміється' },
  { id: 'mk7', url: up('1787350539130-930024a3cb76'), alt: 'Перший день народження — торт і свічки' },
  { id: 'mk8', url: up('1556815798-86e1fc06afc4'), alt: 'Гра з водою влітку' },
];

// ─── Літо 2026 ─────────────────────────────────────────────────────────────────
export const summerPhotos: Photo[] = [
  { id: 'su1', url: up('1507525428034-b723cf961d3e', 800, 600), alt: 'Тропічний пляж на заході сонця' },
  { id: 'su2', url: up('1439853949212-36652a89ba46', 800, 600), alt: 'Блакитний басейн у сонячний день' },
  { id: 'su3', url: up('1473496169904-523b7e3f1ae0', 800, 600), alt: 'Пікнік на пляжі на золотій годині' },
  { id: 'su4', url: up('1505118380757-91f5f5632de0', 800, 600), alt: 'Каяк на гірському озері' },
  { id: 'su5', url: up('1516589091380-5d8e87df6999'), alt: 'Пара спостерігає захід сонця над морем' },
  { id: 'su6', url: up('1519046904884-53103b34b206', 800, 600), alt: 'Пляжна парасолька вранці' },
  { id: 'su7', url: up('1571019613454-1cb2f99b2d8b'), alt: 'Морозиво тане в літню спеку' },
  { id: 'su8', url: up('1534447904706-a6d7b6bfc1f0', 800, 600), alt: 'Вогні літнього фестивалю' },
];

// ─── Карпати ───────────────────────────────────────────────────────────────────
export const carpathiansPhotos: Photo[] = [
  { id: 'ca1', url: up('1464822759023-fed622ff2c3b', 800, 600), alt: 'Гірська вершина на сході сонця' },
  { id: 'ca2', url: up('1506905925346-21bda4d32df4', 800, 600), alt: 'Панорама Карпатського хребта' },
  { id: 'ca3', url: up('1454496522488-7a8e488e8606', 800, 600), alt: 'Гірське озеро — дзеркальне відображення' },
  { id: 'ca4', url: up('1483728642387-6c3bdd6c93e5', 800, 600), alt: 'Туманна лісова гірська стежка' },
  { id: 'ca5', url: up('1501854140801-50d01698950b', 800, 600), alt: 'Туманна долина між вершинами' },
  { id: 'ca6', url: up('1519681393784-d120267933ba', 800, 600), alt: 'Засніжені гірські вершини' },
  { id: 'ca7', url: up('1510553787993-ae3e89d44ea9'), alt: 'Туристична стежка через альпійський луг' },
  { id: 'ca8', url: up('1464547453801-bd0c1db26b81', 800, 600), alt: 'Вогнище в гірському таборі' },
];

// ─── Наша сім'я 2025 ───────────────────────────────────────────────────────────
export const familyPhotos: Photo[] = [
  { id: 'fa1', url: up('1611024847487-e26177381a3f', 800, 600), alt: 'Вся родина у полі — радісний момент' },
  { id: 'fa2', url: up('1763013259279-3195d6330519', 800, 600), alt: 'Щаслива сім\'я з двома дітьми' },
  { id: 'fa3', url: up('1772723246543-213f2a4fc526', 800, 600), alt: 'Сімейне фото — нас п\'ятеро' },
  { id: 'fa4', url: up('1578496780896-7081cc23c111', 800, 600), alt: 'Недільна вечеря всією родиною' },
  { id: 'fa5', url: up('1666819256222-7034f91340a7', 800, 600), alt: 'Пікнік на траві разом' },
  { id: 'fa6', url: up('1624448445915-97154f5e688c', 800, 600), alt: 'Мама з малюком на руках' },
  { id: 'fa7', url: up('1627007410492-f410bb5ae2d6', 800, 600), alt: 'Тато несе доньку на прогулянці' },
  { id: 'fa8', url: up('1603367563698-67012943fd67', 800, 600), alt: 'Обійми у сонячний день' },
];

// ─── Белла ─────────────────────────────────────────────────────────────────────
export const bellaPhotos: Photo[] = [
  { id: 'be1', url: up('1587300003388-59208cc962cb'), alt: 'Белла у парку на сході сонця' },
  { id: 'be2', url: up('1518717758536-85ae29035b6d'), alt: 'Белла на пляжі' },
  { id: 'be3', url: up('1552053831-71594a27632d'), alt: 'Портрет Белли крупним планом' },
  { id: 'be4', url: up('1583337130417-3346a1be7dee', 800, 600), alt: 'Белла біжить полем' },
  { id: 'be5', url: up('1601758228041-f3b2795255f1'), alt: 'Белла з улюбленою іграшкою' },
  { id: 'be6', url: up('1548199973-03ea55d95035'), alt: 'Белла дрімає в сонячному промені' },
  { id: 'be7', url: up('1589965342519-5f7ab7b3e45e'), alt: 'Белла в осінньому листі' },
  { id: 'be8', url: up('1537151625747-0d5cd1df529e'), alt: 'Белла дивиться у вікно' },
];

export const ALBUMS: Record<AlbumId, Album> = {
  'italy-2026': {
    id: 'italy-2026',
    title: 'Італія 2026',
    subtitle: 'Рим · Флоренція · Тоскана',
    photoCount: 87,
    coverPhoto: italyPhotos[0],
    photos: italyPhotos,
    dates: '12–20 травня 2026',
    location: 'Італія',
  },
  'mark-first-year': {
    id: 'mark-first-year',
    title: 'Перший рік Марка',
    subtitle: 'Перші кроки, перші слова, перше все',
    photoCount: 142,
    coverPhoto: markPhotos[0],
    photos: markPhotos,
    dates: 'Сiч. 2025 – Сiч. 2026',
  },
  'summer-2026': {
    id: 'summer-2026',
    title: 'Літо 2026',
    subtitle: 'Пляжні дні та довгі вечори',
    photoCount: 116,
    coverPhoto: summerPhotos[0],
    photos: summerPhotos,
    dates: 'Черв.–Серп. 2026',
  },
  'carpathians': {
    id: 'carpathians',
    title: 'Вихідні в Карпатах',
    subtitle: 'Пішохідні маршрути · Гори · Свіже повітря',
    photoCount: 64,
    coverPhoto: carpathiansPhotos[0],
    photos: carpathiansPhotos,
    dates: '3–5 серп. 2026',
    location: 'Карпати',
  },
  'family-2025': {
    id: 'family-2025',
    title: "Наша сім'я 2025",
    subtitle: 'Цілий рік разом',
    photoCount: 203,
    coverPhoto: familyPhotos[0],
    photos: familyPhotos,
    dates: '2025',
  },
  'bella': {
    id: 'bella',
    title: 'Белла',
    subtitle: 'Наша золота дівчинка',
    photoCount: 94,
    coverPhoto: bellaPhotos[0],
    photos: bellaPhotos,
    dates: '2024–2026',
  },
};

export const SUGGESTED_ALBUMS: AlbumId[] = ['italy-2026', 'mark-first-year', 'summer-2026', 'carpathians', 'family-2025', 'bella'];

export interface RecentBook {
  id: string;
  title: string;
  status: 'draft' | 'ordered' | 'pdf';
  date: string;
  albumId: AlbumId;
  coverPhoto: Photo;
  size?: BookSize;
  pages?: number;
  orderId?: string;
  estimatedDelivery?: string;
}

export const RECENT_BOOKS: RecentBook[] = [
  {
    id: 'rb1',
    title: 'Італія 2026',
    status: 'draft',
    date: '28 серп. 2026',
    albumId: 'italy-2026',
    coverPhoto: italyPhotos[0],
    size: 'medium',
    pages: 28,
  },
  {
    id: 'rb2',
    title: 'Сімейний альбом',
    status: 'ordered',
    date: '15 серп. 2026',
    albumId: 'family-2025',
    coverPhoto: familyPhotos[0],
    size: 'large',
    pages: 48,
    orderId: 'M-10391',
    estimatedDelivery: '3–5 вер.',
  },
  {
    id: 'rb3',
    title: 'Літо 2026',
    status: 'pdf',
    date: '22 лип. 2026',
    albumId: 'summer-2026',
    coverPhoto: summerPhotos[0],
    size: 'medium',
    pages: 32,
  },
];

export const BOOK_SIZES: Record<BookSize, { label: string; dimensions: string; price: number; priceLabel: string }> = {
  small:  { label: 'Малий',    dimensions: '20 × 20 см', price: 899,  priceLabel: '₴899' },
  medium: { label: 'Середній', dimensions: '25 × 25 см', price: 1299, priceLabel: '₴1 299' },
  large:  { label: 'Великий',  dimensions: '30 × 30 см', price: 1799, priceLabel: '₴1 799' },
};

export const COVER_COLORS: Record<CoverColor, { label: string; hex: string }> = {
  white:      { label: 'Білий',       hex: '#FFFFFF' },
  sand:       { label: 'Пісок',       hex: '#DDD0BB' },
  coral:      { label: 'Корал',       hex: '#E96F5B' },
  terracotta: { label: 'Теракот',     hex: '#C85C3A' },
  navy:       { label: 'Темно-синій', hex: '#1B2B4B' },
  forest:     { label: 'Хакі',        hex: '#2D4A3E' },
  black:      { label: 'Чорний',      hex: '#181818' },
};

export const DESIGN_VARIANTS = [
  { name: 'Редакційний', description: 'Фото на повну сторінку, мінімум тексту, серифна типографіка' },
  { name: 'Класичний',   description: 'Біле тло, елегантна рамка, центрована композиція' },
  { name: 'Сучасний',    description: 'Сміливість, контраст, асиметрія — сучасний вигляд' },
];

// Cover colors assigned to each design variant for visual differentiation
export const DESIGN_VARIANT_COLORS: Record<DesignVariant, CoverColor> = {
  0: 'navy',
  1: 'sand',
  2: 'coral',
};

export const ALL_GALLERY_PHOTOS: Photo[] = [
  ...italyPhotos,
  ...markPhotos.slice(0, 4),
  ...summerPhotos.slice(0, 4),
  ...carpathiansPhotos.slice(0, 4),
  ...familyPhotos.slice(0, 4),
  ...bellaPhotos.slice(0, 4),
];

export const AI_SEARCH_SUGGESTIONS = ['Подорожі', 'Сім\'я', 'Дитина', 'Улюбленець', 'Пара', 'День народження', 'Природа', 'Минулий рік'];

export const ANALYSIS_STEPS = [
  'Переглядаємо ваші спогади…',
  'Шукаємо подорожі…',
  'Знаходимо людей…',
  'Групуємо моменти…',
  'Відбираємо найкращі фото…',
];
