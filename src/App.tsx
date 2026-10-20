import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react'
import {
  Photo, AlbumId, BookSize, CoverColor, DesignVariant,
  ALBUMS, SUGGESTED_ALBUMS, RECENT_BOOKS, BOOK_SIZES, COVER_COLORS,
  DESIGN_VARIANTS, DESIGN_VARIANT_COLORS, ALL_GALLERY_PHOTOS, AI_SEARCH_SUGGESTIONS,
  ANALYSIS_STEPS, italyPhotos, carpathiansPhotos, summerPhotos, markPhotos, bellaPhotos,
} from './data'

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen =
  | 'welcome' | 'register' | 'photo-permission' | 'photo-analysis'
  | 'home' | 'my-books' | 'profile'
  | 'album-preview' | 'review-photos' | 'add-photos' | 'crop-photo'
  | 'ai-search' | 'ai-results' | 'manual-gallery'
  | 'book-size' | 'ai-generation' | 'design-selection' | 'cover-selection'
  | 'book-editor' | 'book-overview' | 'preview-mode'
  | 'product-summary' | 'print-config' | 'shipping' | 'payment' | 'order-confirmation'
  | 'pdf-purchase' | 'pdf-success' | 'order-details'

type Tab = 'home' | 'my-books' | 'profile'
type Carrier = 'nova-poshta' | 'ukrposhta'

// ─── Design tokens ───────────────────────────────────────────────────────────
const T = {
  accent:     '#E96F5B',
  accentLight:'#FBE9E5',
  bg:         '#FFFFFF',
  surface:    '#F7F7F5',
  text:       '#181818',
  muted:      '#737373',
  border:     '#E8E8E6',
  borderDark: '#D4D4D0',
  serif:      "'Playfair Display', Georgia, serif",
  sans:       "'DM Sans', system-ui, sans-serif",
}

const fmt = (n: number) => '₴ ' + n.toLocaleString('uk-UA')

// ─── Color utilities ─────────────────────────────────────────────────────────
function darkenHex(hex: string, f = 0.28): string {
  if (!hex.startsWith('#') || hex.length !== 7) return hex
  const r = Math.max(0, Math.round(parseInt(hex.slice(1, 3), 16) * (1 - f)))
  const g = Math.max(0, Math.round(parseInt(hex.slice(3, 5), 16) * (1 - f)))
  const b = Math.max(0, Math.round(parseInt(hex.slice(5, 7), 16) * (1 - f)))
  return `rgb(${r},${g},${b})`
}

function isLightHex(hex: string): boolean {
  if (!hex.startsWith('#') || hex.length !== 7) return true
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

// ─── App state ───────────────────────────────────────────────────────────────
interface AppCtx {
  stack: Screen[]; tab: Tab; selectedAlbumId: AlbumId; bookSize: BookSize
  selectedDesign: DesignVariant; coverColor: CoverColor; coverTitle: string
  coverSubtitle: string; quantity: number; aiQuery: string; aiPhotos: Photo[]
  cropPhotoId: string | null; showLayoutSheet: boolean; showTextSheet: boolean
  showCreateMenu: boolean; activeOrderId: string | null; purchaseType: 'print' | 'pdf'
  carrier: Carrier; deliveryType: 'branch' | 'parcel-locker'; currentEditorPage: number
  exportMode: boolean; shippingInitStep?: 'carrier' | 'details'
  navigate: (s: Screen) => void; goBack: () => void; resetTo: (s: Screen) => void
  setTab: (t: Tab) => void; setSelectedAlbum: (id: AlbumId) => void
  setBookSize: (s: BookSize) => void; setSelectedDesign: (d: DesignVariant) => void
  setCoverColor: (c: CoverColor) => void; setCoverTitle: (t: string) => void
  setCoverSubtitle: (t: string) => void; setQuantity: (q: number) => void
  setAiQuery: (q: string) => void; setAiPhotos: (p: Photo[]) => void
  setCropPhoto: (id: string | null) => void; setShowLayoutSheet: (v: boolean) => void
  setShowTextSheet: (v: boolean) => void; setShowCreateMenu: (v: boolean) => void
  setActiveOrder: (id: string | null) => void; setPurchaseType: (t: 'print' | 'pdf') => void
  setCarrier: (c: Carrier) => void; setDeliveryType: (d: 'branch' | 'parcel-locker') => void
  setEditorPage: (p: number) => void
}
const Ctx = createContext<AppCtx>(null!)
const useApp = () => useContext(Ctx)

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevLeft = ({ c = T.text }: { c?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 4.5L7 10L12.5 15.5" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevRight = ({ c = T.muted }: { c?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3.5L10.5 8L6 12.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CheckIco = () => (
  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
    <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const PlusIco = ({ c = 'white' }: { c?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 3.5v11M3.5 9h11" stroke={c} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ─── Logo — SPOHADY brand wordmark ───────────────────────────────────────────
// Coral dot + "SPOHADY" in wide-tracked charcoal/white
function Logo({ white = false, dotOnly = false, dotSize = 10 }: { white?: boolean; dotOnly?: boolean; dotSize?: number }) {
  const dot = '#FF6B57'
  const textColor = white ? '#FFFFFF' : '#1C1F23'
  if (dotOnly) return <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: dot, flexShrink: 0 }} />
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: dotSize * 1.55, color: textColor, letterSpacing: '0.16em', textTransform: 'uppercase', lineHeight: 1 }}>
        SPOHADY
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK COVER COMPONENT
// Physical hardcover mockup matching the reference image:
// colored cover + spine + white-bordered inset photo + title below photo
// ─────────────────────────────────────────────────────────────────────────────
const BOOK_UI_DIMS = {
  xs:  { w: 54,  spine: 5  },
  sm:  { w: 80,  spine: 7  },
  md:  { w: 130, spine: 10 },
  lg:  { w: 190, spine: 14 },
  xl:  { w: 256, spine: 18 },
}

type BookUiSize = keyof typeof BOOK_UI_DIMS

function BookCover({ photo, title, colorHex, uiSize = 'md', style }: {
  photo: Photo
  title: string
  colorHex: string
  uiSize?: BookUiSize
  style?: React.CSSProperties
}) {
  const { w, spine } = BOOK_UI_DIMS[uiSize]
  const h = Math.round(w * 0.82)
  const spineColor = darkenHex(colorHex, 0.32)
  const spineEdge  = darkenHex(colorHex, 0.48)
  const textColor  = isLightHex(colorHex) ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.92)'
  const pad  = Math.max(5, Math.round(w * 0.085))
  const matW = Math.max(2, Math.round(w * 0.022))
  const fs   = Math.max(6, Math.round(w * 0.075))

  return (
    <div style={{ display: 'flex', height: h, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.32))', flexShrink: 0, ...style }}>
      {/* Spine */}
      <div style={{
        width: spine, height: h, flexShrink: 0,
        background: `linear-gradient(to right, ${spineEdge} 0%, ${spineColor} 100%)`,
        borderRadius: '2px 0 0 2px',
      }} />
      {/* Cover */}
      <div style={{
        width: w, height: h,
        background: colorHex,
        borderRadius: '0 3px 3px 0',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: pad, gap: Math.round(pad * 0.45),
        flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Photo with white mat border */}
        <div style={{
          flex: 1, width: '100%',
          background: 'white',
          padding: matW,
          boxShadow: `0 1px ${matW * 3}px rgba(0,0,0,0.22)`,
          display: 'flex', overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img src={photo.url} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy" />
        </div>
        {/* Title */}
        <div style={{
          color: textColor,
          fontSize: fs,
          fontFamily: T.sans,
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1.2,
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          paddingBottom: Math.round(pad * 0.15),
          letterSpacing: '0.01em',
        }}>
          {title}
        </div>
      </div>
    </div>
  )
}

// Convenience wrapper that reads the current context state
function ContextBookCover({ uiSize, style }: { uiSize?: BookUiSize; style?: React.CSSProperties }) {
  const { selectedAlbumId, coverColor, coverTitle, selectedDesign } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  return (
    <BookCover
      photo={a.coverPhoto}
      title={coverTitle || a.title}
      colorHex={colorHex}
      uiSize={uiSize}
      style={style}
    />
  )
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Btn({ label, onClick, variant = 'primary', disabled }: {
  label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; disabled?: boolean
}) {
  const s: Record<string, { bg: string; color: string; border?: string }> = {
    primary:   { bg: disabled ? '#D4D4D0' : T.accent, color: 'white' },
    secondary: { bg: 'transparent', color: T.text, border: T.border },
    ghost:     { bg: 'transparent', color: T.muted },
    danger:    { bg: '#FFF5F5', color: '#CC2222', border: '#FFD0D0' },
  }
  const st = s[variant]
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full flex items-center justify-center gap-2 font-medium text-[15px] transition-all active:opacity-75"
      style={{ background: st.bg, color: st.color, border: st.border ? `1.5px solid ${st.border}` : 'none',
        borderRadius: 14, padding: '15px 20px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {label}
    </button>
  )
}

function TopBar({ title, onBack, right, light }: {
  title?: string; onBack?: () => void; right?: ReactNode; light?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-14 pb-3 flex-shrink-0"
      style={{ background: light ? 'transparent' : T.bg, borderBottom: light ? 'none' : `1px solid ${T.border}` }}>
      <button onClick={onBack} className="w-9 h-9 flex items-center justify-center -ml-2 rounded-full active:bg-black/5">
        {onBack && <ChevLeft c={light ? 'white' : T.text} />}
      </button>
      {title && <span className="text-[15px] font-medium flex-1 text-center" style={{ color: light ? 'white' : T.text }}>{title}</span>}
      <div className="w-9 flex justify-end">{right}</div>
    </div>
  )
}

function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-t-[28px] sheet-slide-up max-h-[88%] overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white pt-3 pb-2 rounded-t-[28px]">
          <div className="flex justify-center mb-2"><div className="w-10 h-1 rounded-full bg-gray-200" /></div>
          {title && (
            <div className="px-5 pb-3 border-b" style={{ borderColor: T.border }}>
              <h3 className="text-[17px] font-semibold" style={{ color: T.text }}>{title}</h3>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2 rounded-full text-[13px] font-medium transition-all flex-shrink-0"
      style={{ background: active ? T.accent : T.surface, color: active ? 'white' : T.muted }}>
      {label}
    </button>
  )
}

function Divider() {
  return <div className="w-full h-px" style={{ background: T.border }} />
}

function FormInput({ label, placeholder, type = 'text', defaultValue }: {
  label: string; placeholder?: string; type?: string; defaultValue?: string
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.muted }}>{label}</label>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue}
        className="w-full px-4 py-3.5 rounded-xl text-[14px]"
        style={{ border: `1.5px solid ${T.border}`, color: T.text, background: 'white' }}
        onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.outline = 'none' }}
        onBlur={e => { e.target.style.borderColor = T.border }} />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    draft: 'Чернетка', ordered: 'Замовлено', pdf: 'PDF',
    processing: 'Обробляється', shipped: 'Відправлено', delivered: 'Доставлено',
  }
  const map: Record<string, [string, string]> = {
    draft:      ['#F2F2F0', T.muted],
    ordered:    ['#E6F4EA', '#2E7D32'],
    pdf:        [T.accentLight, T.accent],
    processing: ['#FFF3E0', '#E65100'],
    shipped:    ['#E3F2FD', '#1565C0'],
    delivered:  ['#E6F4EA', '#2E7D32'],
  }
  const [bg, color] = map[status] || [T.surface, T.muted]
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: bg, color }}>
      {labels[status] || status}
    </span>
  )
}

// ─── Photo grid ───────────────────────────────────────────────────────────────
function PhotoGrid({ photos, selectedIds, onToggle, cols = 3 }: {
  photos: Photo[]; selectedIds?: Set<string>; onToggle?: (id: string) => void; cols?: number
}) {
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {photos.map(p => {
        const sel = selectedIds !== undefined ? selectedIds.has(p.id) : undefined
        return (
          <div key={p.id} className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onToggle?.(p.id)}>
            <img src={p.url} alt={p.alt} className="w-full h-full object-cover" loading="lazy" />
            {sel === false && <div className="absolute inset-0 bg-white/55" />}
            {selectedIds !== undefined && (
              <div className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                style={{ background: sel ? T.accent : 'rgba(0,0,0,0.28)', border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.8)' }}>
                {sel && <CheckIco />}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Album card (home grid) ───────────────────────────────────────────────────
function AlbumCard({ albumId, onPress }: { albumId: AlbumId; onPress: () => void }) {
  const a = ALBUMS[albumId]
  return (
    <button onClick={onPress} className="relative w-full overflow-hidden rounded-[18px] active:scale-[0.98] transition-transform" style={{ aspectRatio: '3/4' }}>
      <img src={a.coverPhoto.url} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.65) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-white text-[13px] font-semibold leading-snug">{a.title}</p>
        <p className="text-white/60 text-[11px] mt-0.5">{a.photoCount} фото</p>
      </div>
    </button>
  )
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────
function BottomNav() {
  const { tab, navigate, setTab } = useApp()
  const items: { key: Tab; label: string; to: Screen; icon: ReactNode; activeIcon: ReactNode }[] = [
    {
      key: 'home', label: 'Головна', to: 'home',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3L21 10.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10.5z" stroke={T.muted} strokeWidth="1.6" strokeLinejoin="round" /></svg>,
      activeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3L21 10.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10.5z" fill={T.accent} stroke={T.accent} strokeWidth="1.6" strokeLinejoin="round" /></svg>,
    },
    {
      key: 'my-books', label: 'Мої книги', to: 'my-books',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="12" height="17" rx="2" stroke={T.muted} strokeWidth="1.6" /><path d="M16 5h2a1 1 0 011 1v14a1 1 0 01-1 1H8" stroke={T.muted} strokeWidth="1.6" strokeLinecap="round" /><path d="M7 9h6M7 12h6M7 15h4" stroke={T.muted} strokeWidth="1.4" strokeLinecap="round" /></svg>,
      activeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="12" height="17" rx="2" fill={T.accent} stroke={T.accent} strokeWidth="1.6" /><path d="M16 5h2a1 1 0 011 1v14a1 1 0 01-1 1H8" stroke={T.accent} strokeWidth="1.6" strokeLinecap="round" /><path d="M7 9h6M7 12h6M7 15h4" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>,
    },
    {
      key: 'profile', label: 'Профіль', to: 'profile',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={T.muted} strokeWidth="1.6" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={T.muted} strokeWidth="1.6" strokeLinecap="round" /></svg>,
      activeIcon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill={T.accent} stroke={T.accent} strokeWidth="1.6" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={T.accent} strokeWidth="1.6" strokeLinecap="round" /></svg>,
    },
  ]
  return (
    <div className="flex-shrink-0 border-t" style={{ borderColor: T.border, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)' }}>
      <div className="flex pb-4 pt-1">
        {items.map(item => {
          const active = tab === item.key
          return (
            <button key={item.key} className="flex-1 flex flex-col items-center gap-1 pt-2 active:opacity-60 transition-opacity"
              onClick={() => { setTab(item.key); navigate(item.to) }}>
              {active ? item.activeIcon : item.icon}
              <span className="text-[10px] font-medium" style={{ color: active ? T.accent : T.muted }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
function WelcomeScreen() {
  const { navigate } = useApp()
  return (
    <div className="relative h-full flex flex-col">
      <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=1200&fit=crop&auto=format&q=90"
        alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(12,8,4,0.78) 75%, rgba(12,8,4,0.93) 100%)' }} />
      <div className="relative pt-16 pl-7">
        <Logo white dotSize={11} />
      </div>
      <div className="relative flex-1 flex flex-col justify-end px-7 pb-14">
        <h1 className="leading-[1.15] mb-4" style={{ fontFamily: T.serif, fontSize: 40, color: 'white' }}>
          Перетворіть ваші<br />фото на історії.
        </h1>
        <p className="text-white/70 text-[15px] leading-relaxed mb-10">Я знайду найкращі спогади і створю з них фотокнигу.</p>
        <div className="space-y-3">
          <button onClick={() => navigate('register')}
            className="w-full py-[15px] rounded-[14px] text-[15px] font-semibold active:opacity-80"
            style={{ background: T.accent, color: 'white' }}>
            Почати
          </button>
          <button onClick={() => navigate('home')}
            className="w-full py-[15px] rounded-[14px] text-[15px] font-medium text-white/75 active:opacity-60">
            Увійти в акаунт
          </button>
        </div>
      </div>
    </div>
  )
}

function RegisterScreen() {
  const { navigate } = useApp()
  const [emailMode, setEmailMode] = useState(false)
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-center flex-shrink-0" style={{ height: 200, background: '#F7F4ED' }}>
        <Logo dotSize={14} />
      </div>
      <div className="flex-1 px-6 pt-7 overflow-y-auto scrollbar-hide">
        <h1 className="text-[26px] font-light mb-1" style={{ fontFamily: T.serif, color: T.text }}>Створіть акаунт</h1>
        <p className="text-[14px] mb-8" style={{ color: T.muted }}>Приєднайтесь до тисяч, хто зберігає найцінніші спогади.</p>
        <div className="space-y-3">
          <button onClick={() => navigate('photo-permission')}
            className="w-full py-4 px-5 rounded-[14px] flex items-center gap-3 border active:bg-gray-50"
            style={{ borderColor: T.border }}>
            <span className="text-[18px] font-black" style={{ color: '#4285F4', width: 22, textAlign: 'center' }}>G</span>
            <span className="text-[14px] font-medium flex-1 text-left" style={{ color: T.text }}>Продовжити з Google</span>
            <ChevRight />
          </button>
          <div className="flex items-center gap-4 py-1">
            <Divider />
            <span className="text-[12px] flex-shrink-0 px-2" style={{ color: T.muted }}>або email</span>
            <Divider />
          </div>
          {emailMode ? (
            <div className="space-y-3">
              <FormInput label="Email" placeholder="you@email.com" type="email" />
              <FormInput label="Пароль" placeholder="Щонайменше 8 символів" type="password" />
              <Btn label="Створити акаунт" onClick={() => navigate('photo-permission')} />
            </div>
          ) : (
            <button onClick={() => setEmailMode(true)}
              className="w-full py-4 px-5 rounded-[14px] flex items-center gap-3 border active:bg-gray-50"
              style={{ borderColor: T.border }}>
              <span className="text-[18px]" style={{ width: 22, textAlign: 'center' }}>✉</span>
              <span className="text-[14px] font-medium flex-1 text-left" style={{ color: T.text }}>Продовжити з Email</span>
              <ChevRight />
            </button>
          )}
        </div>
      </div>
      <p className="px-6 pb-8 text-center text-[12px]" style={{ color: T.muted }}>
        Продовжуючи, ви погоджуєтесь з{' '}
        <span style={{ color: T.text, textDecoration: 'underline' }}>Умовами</span> та{' '}
        <span style={{ color: T.text, textDecoration: 'underline' }}>Політикою конфіденційності</span>.
      </p>
    </div>
  )
}

function PhotoPermissionScreen() {
  const { navigate } = useApp()
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col px-7 pt-20">
        <div className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center mb-8" style={{ background: T.accentLight }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="10" width="28" height="21" rx="4" stroke={T.accent} strokeWidth="2" />
            <circle cx="18" cy="20" r="5.5" stroke={T.accent} strokeWidth="2" />
            <path d="M12 10V8.5A2.5 2.5 0 0114.5 6h7A2.5 2.5 0 0124 8.5V10" stroke={T.accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-[28px] leading-snug mb-4" style={{ fontFamily: T.serif, color: T.text }}>
          Знайдемо спогади у ваших фото
        </h1>
        <p className="text-[15px] leading-relaxed mb-8" style={{ color: T.muted }}>
          Надайте доступ до бібліотеки фото, і ми згрупуємо подорожі, людей та свята для майбутніх альбомів.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {[italyPhotos[0], markPhotos[0], bellaPhotos[0]].map((p, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden">
              <img src={p.url} alt={p.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1a6 6 0 100 12A6 6 0 007 1zm0 4.5v3.5M7 4v.01" stroke={T.muted} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[12px]" style={{ color: T.muted }}>Ваші фото залишаються приватними і не залишають пристрій.</span>
        </div>
      </div>
      <div className="px-6 pb-12 space-y-3">
        <Btn label="Надати доступ до фото" onClick={() => navigate('photo-analysis')} />
        <Btn label="Пізніше" onClick={() => navigate('home')} variant="ghost" />
      </div>
    </div>
  )
}

function PhotoAnalysisScreen() {
  const { navigate, exportMode } = useApp()
  const [step, setStep] = useState(exportMode ? 2 : 0)
  const [progress, setProgress] = useState(exportMode ? 60 : 0)
  useEffect(() => {
    if (exportMode) return
    const pi = setInterval(() => {
      setProgress(p => { const n = p + 1.5; if (n >= 100) { clearInterval(pi); setTimeout(() => navigate('home'), 700); return 100 } return n })
    }, 55)
    const si = setInterval(() => setStep(s => Math.min(s + 1, ANALYSIS_STEPS.length - 1)), 1100)
    return () => { clearInterval(pi); clearInterval(si) }
  }, [exportMode])
  const previewPhotos = [italyPhotos[0], carpathiansPhotos[0], markPhotos[0], summerPhotos[0], bellaPhotos[0], italyPhotos[3]]
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white px-8">
      <div className="grid grid-cols-3 gap-2 w-52 mb-12">
        {previewPhotos.map((p, i) => (
          <div key={p.id} className="aspect-square rounded-xl overflow-hidden" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}>
            <img src={p.url} alt={p.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="w-full max-w-xs">
        <div className="h-[3px] rounded-full overflow-hidden mb-5" style={{ background: T.accentLight }}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: T.accent }} />
        </div>
        <p className="text-center text-[17px] font-light" style={{ fontFamily: T.serif, color: T.text, minHeight: 28 }}>
          {ANALYSIS_STEPS[step]}
        </p>
        <p className="text-center text-[12px] mt-2" style={{ color: T.muted }}>{Math.round(progress)}%</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME — suggested albums only, floating FAB
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen() {
  const { navigate, setSelectedAlbum, setShowCreateMenu } = useApp()
  return (
    <div className="h-full flex flex-col relative" style={{ background: T.bg }}>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex items-end justify-between px-5 pt-14 pb-5">
          <div>
            <p className="text-[13px] font-medium mb-0.5" style={{ color: T.muted }}>Доброго дня</p>
            <h1 className="text-[28px] leading-none" style={{ fontFamily: T.serif, color: T.text }}>Ваші спогади</h1>
          </div>
          <button className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: T.accentLight }}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" alt="" className="w-full h-full object-cover" />
          </button>
        </div>

        <div className="flex items-baseline justify-between px-5 mb-3">
          <h2 className="text-[17px] font-semibold" style={{ color: T.text }}>Пропозиції</h2>
          <span className="text-[12px]" style={{ color: T.muted }}>Знайдено 6</span>
        </div>

        {/* Featured card */}
        <div className="px-5 mb-3">
          <button onClick={() => { setSelectedAlbum('italy-2026'); navigate('album-preview') }}
            className="relative w-full overflow-hidden rounded-[18px] active:scale-[0.99] transition-transform"
            style={{ aspectRatio: '16/9' }}>
            <img src={italyPhotos[0].url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }} />
            <div className="absolute bottom-0 right-0 p-4 text-right">
              <p className="text-white text-[18px] font-semibold leading-tight" style={{ fontFamily: T.serif }}>Італія 2026</p>
              <p className="text-white/65 text-[12px] mt-0.5">87 фото</p>
            </div>
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: T.accent, color: 'white' }}>
              ✨ Рекомендовано
            </div>
          </button>
        </div>

        {/* 2-column grid */}
        <div className="px-5 grid grid-cols-2 gap-3 mb-8">
          {SUGGESTED_ALBUMS.slice(1).map(id => (
            <AlbumCard key={id} albumId={id} onPress={() => { setSelectedAlbum(id); navigate('album-preview') }} />
          ))}
        </div>
        <div className="h-20" />
      </div>

      {/* Floating create button */}
      <button onClick={() => setShowCreateMenu(true)}
        className="absolute right-5 w-14 h-14 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
        style={{ bottom: 80, background: T.accent, boxShadow: '0 4px 20px rgba(233,111,91,0.48)' }}>
        <PlusIco />
      </button>

      <CreateMenuSheet />
      <BottomNav />
    </div>
  )
}

function CreateMenuSheet() {
  const { showCreateMenu, setShowCreateMenu, navigate } = useApp()
  return (
    <Sheet open={showCreateMenu} onClose={() => setShowCreateMenu(false)} title="Створити нову книгу">
      <div className="px-5 py-4 pb-8 space-y-3">
        {[
          { emoji: '✨', title: 'Опишіть, що шукати', desc: 'Розкажіть про спогади, і ми знайдемо фото за вас.', action: () => { setShowCreateMenu(false); navigate('ai-search') } },
          { emoji: '🖼️', title: 'Обрати фото самостійно', desc: 'Перегляньте бібліотеку та оберіть фото вручну.', action: () => { setShowCreateMenu(false); navigate('manual-gallery') } },
          { emoji: '🔍', title: 'Усі пропозиції', desc: "Більше спогадів, які ми вже знайшли.", action: () => { setShowCreateMenu(false) } },
        ].map((o, i) => (
          <button key={i} onClick={o.action}
            className="flex items-start gap-4 w-full p-4 rounded-2xl text-left active:bg-gray-50"
            style={{ border: `1.5px solid ${T.border}` }}>
            <span className="text-2xl mt-0.5 flex-shrink-0">{o.emoji}</span>
            <div>
              <p className="text-[14px] font-medium mb-0.5" style={{ color: T.text }}>{o.title}</p>
              <p className="text-[12px] leading-relaxed" style={{ color: T.muted }}>{o.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Sheet>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ALBUM FLOW
// ─────────────────────────────────────────────────────────────────────────────
function AlbumPreviewScreen() {
  const { selectedAlbumId, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <div className="relative flex-shrink-0" style={{ height: '55%' }}>
        <img src={a.coverPhoto.url} alt={a.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%)' }} />
        <button onClick={goBack} className="absolute top-14 left-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <ChevLeft c="white" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <h1 className="text-white text-[30px] leading-tight" style={{ fontFamily: T.serif }}>{a.title}</h1>
          <p className="text-white/70 text-[14px] mt-1">{a.subtitle}</p>
        </div>
      </div>
      <div className="flex-1 px-5 pt-5 overflow-y-auto scrollbar-hide">
        <div className="flex gap-5 mb-6">
          <div className="text-center">
            <p className="text-[22px] font-semibold" style={{ color: T.text }}>{a.photoCount}</p>
            <p className="text-[11px]" style={{ color: T.muted }}>фото</p>
          </div>
          {a.dates && (
            <div className="border-l pl-5" style={{ borderColor: T.border }}>
              <p className="text-[14px] font-medium" style={{ color: T.text }}>{a.dates}</p>
              <p className="text-[11px]" style={{ color: T.muted }}>дати</p>
            </div>
          )}
          {a.location && (
            <div className="border-l pl-5" style={{ borderColor: T.border }}>
              <p className="text-[14px] font-medium" style={{ color: T.text }}>{a.location}</p>
              <p className="text-[11px]" style={{ color: T.muted }}>місце</p>
            </div>
          )}
        </div>
        <div className="space-y-3 pb-6">
          <Btn label="Створити фотоальбом" onClick={() => navigate('book-size')} />
          <Btn label="Переглянути фото" onClick={() => navigate('review-photos')} variant="secondary" />
          <div className="flex justify-center pt-1">
            <button onClick={goBack} className="text-[13px]" style={{ color: T.muted }}>Не цікавить</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewPhotosScreen() {
  const { selectedAlbumId, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const [deselected, setDeselected] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setDeselected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const selectedIds = new Set(a.photos.filter(p => !deselected.has(p.id)).map(p => p.id))
  const count = a.photos.length - deselected.size
  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title={a.title} onBack={goBack} right={
        <button onClick={() => navigate('add-photos')} className="text-[14px] font-medium" style={{ color: T.accent }}>+ Додати</button>
      } />
      <div className="px-5 py-2.5 flex items-center justify-between border-b" style={{ borderColor: T.border }}>
        <p className="text-[14px]" style={{ color: T.muted }}>
          <span className="font-semibold" style={{ color: T.text }}>{count} фото</span> вибрано
        </p>
        <p className="text-[12px]" style={{ color: T.muted }}>Натисніть, щоб прибрати</p>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <PhotoGrid photos={a.photos} selectedIds={selectedIds} onToggle={toggle} />
      </div>
      <div className="px-5 py-4 border-t" style={{ borderColor: T.border }}>
        <Btn label="Продовжити" onClick={() => navigate('book-size')} />
      </div>
    </div>
  )
}

function AddPhotosScreen() {
  const { goBack } = useApp()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'people' | 'places'>('all')
  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <div className="flex items-center justify-between px-4 pt-14 pb-3 border-b" style={{ borderColor: T.border }}>
        <button onClick={goBack} className="text-[14px]" style={{ color: T.muted }}>Скасувати</button>
        <span className="text-[15px] font-medium" style={{ color: T.text }}>{selected.size > 0 ? `${selected.size} вибрано` : 'Додати фото'}</span>
        <div className="w-14" />
      </div>
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b" style={{ borderColor: T.border }}>
        {[{ k: 'all', l: 'Усі' }, { k: 'favorites', l: 'Обрані' }, { k: 'people', l: 'Люди' }, { k: 'places', l: 'Місця' }].map(t => (
          <Pill key={t.k} label={t.l} active={activeTab === t.k as typeof activeTab} onClick={() => setActiveTab(t.k as typeof activeTab)} />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <PhotoGrid photos={ALL_GALLERY_PHOTOS} selectedIds={selected} onToggle={toggle} />
      </div>
      <div className="px-5 py-4 border-t" style={{ borderColor: T.border }}>
        <Btn label={selected.size > 0 ? `Додати ${selected.size} фото` : 'Оберіть фото'} onClick={goBack} disabled={selected.size === 0} />
      </div>
    </div>
  )
}

function CropPhotoScreen() {
  const { selectedAlbumId, cropPhotoId, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const photo = a.photos.find(p => p.id === cropPhotoId) || a.photos[0]
  const [ratio, setRatio] = useState<'square' | 'portrait' | 'landscape' | 'free'>('square')
  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] screen-slide-in">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={goBack} className="text-[14px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Скасувати</button>
        <span className="text-white text-[15px] font-medium">Обрізати</span>
        <button onClick={goBack} className="text-[15px] font-semibold" style={{ color: T.accent }}>Готово</button>
      </div>
      <div className="flex-1 flex items-center justify-center px-8">
        <div className={`${ratio === 'portrait' ? 'aspect-[3/4]' : ratio === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'} w-full relative overflow-hidden`} style={{ maxWidth: '70%', maxHeight: '65%' }}>
          <img src={photo.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-white/80 pointer-events-none">
            {['tl', 'tr', 'bl', 'br'].map(c => (
              <div key={c} className={`absolute w-7 h-7 border-white border-[3px] ${c.includes('t') ? 'top-0' : 'bottom-0'} ${c.includes('l') ? 'left-0' : 'right-0'} ${c === 'tl' ? 'border-r-0 border-b-0' : c === 'tr' ? 'border-l-0 border-b-0' : c === 'bl' ? 'border-r-0 border-t-0' : 'border-l-0 border-t-0'}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="pb-10 px-5">
        <div className="flex justify-center gap-2 mb-6">
          {[{ k: 'square', l: 'Квадрат' }, { k: 'portrait', l: 'Портрет' }, { k: 'landscape', l: 'Пейзаж' }, { k: 'free', l: 'Вільно' }].map(r => (
            <button key={r.k} onClick={() => setRatio(r.k as typeof ratio)}
              className="px-4 py-2 rounded-xl text-[12px] font-medium"
              style={{ background: ratio === r.k ? 'white' : 'rgba(255,255,255,0.12)', color: ratio === r.k ? T.text : 'white' }}>
              {r.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AI CREATION
// ─────────────────────────────────────────────────────────────────────────────
function AISearchScreen() {
  const { navigate, setAiQuery, setAiPhotos, goBack } = useApp()
  const [q, setQ] = useState('')
  const handleSearch = () => {
    setAiQuery(q)
    const results = q.toLowerCase().includes('карпат') ? carpathiansPhotos
      : q.toLowerCase().includes('іта') ? italyPhotos
      : q.toLowerCase().includes('літо') || q.toLowerCase().includes('пляж') ? summerPhotos
      : q.toLowerCase().includes('белл') || q.toLowerCase().includes('пес') ? bellaPhotos
      : [...italyPhotos.slice(0, 4), ...carpathiansPhotos.slice(0, 3), ...summerPhotos.slice(0, 4)]
    setAiPhotos(results)
    navigate('ai-results')
  }
  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar onBack={goBack} />
      <div className="flex-1 px-5 pt-4 overflow-y-auto scrollbar-hide">
        <h1 className="text-[28px] font-light mb-2" style={{ fontFamily: T.serif, color: T.text }}>Що шукати?</h1>
        <p className="text-[14px] mb-6" style={{ color: T.muted }}>Опишіть спогади, які хочете знайти.</p>
        <textarea value={q} onChange={e => setQ(e.target.value)}
          placeholder="Наша поїздка до Італії минулого травня…"
          rows={4}
          className="w-full px-4 py-4 rounded-2xl text-[15px] resize-none leading-relaxed mb-5"
          style={{ border: `1.5px solid ${q ? T.accent : T.border}`, color: T.text, background: 'white' }}
          onFocus={e => (e.target.style.borderColor = T.accent)}
          onBlur={e => (e.target.style.borderColor = q ? T.accent : T.border)} />
        <p className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: T.muted }}>Швидкий пошук</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {AI_SEARCH_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setQ(s)}
              className="px-4 py-2 rounded-full text-[13px] font-medium"
              style={{ background: q === s ? T.accentLight : T.surface, color: q === s ? T.accent : T.muted, border: `1.5px solid ${q === s ? T.accent : 'transparent'}` }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 pb-10 pt-4">
        <Btn label="Знайти фото" onClick={handleSearch} disabled={!q.trim()} />
      </div>
    </div>
  )
}

function AIResultsScreen() {
  const { aiQuery, aiPhotos, navigate, goBack, exportMode } = useApp()
  const [loading, setLoading] = useState(!exportMode)
  useEffect(() => { if (exportMode) return; const t = setTimeout(() => setLoading(false), 1800); return () => clearTimeout(t) }, [exportMode])
  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center bg-white screen-slide-in">
      <div className="animate-spin-slow mb-5">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="17" stroke={T.accentLight} strokeWidth="4" />
          <path d="M22 5a17 17 0 0117 17" stroke={T.accent} strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[18px] font-light animate-soft-pulse" style={{ fontFamily: T.serif, color: T.text }}>Шукаємо ваші спогади…</p>
      <p className="text-[13px] mt-2" style={{ color: T.muted }}>"{aiQuery}"</p>
    </div>
  )
  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar onBack={goBack} />
      <div className="px-5 py-4 border-b" style={{ borderColor: T.border }}>
        <p className="text-[13px]" style={{ color: T.muted }}>Результати для "{aiQuery}"</p>
        <h2 className="text-[22px] mt-0.5" style={{ fontFamily: T.serif, color: T.text }}>
          Знайдено <span style={{ color: T.accent }}>{aiPhotos.length * 4 + 14} фото</span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <PhotoGrid photos={aiPhotos} cols={3} />
      </div>
      <div className="px-5 pb-10 pt-3 space-y-2 border-t" style={{ borderColor: T.border }}>
        <Btn label="Створити фотоальбом" onClick={() => navigate('book-size')} />
        <Btn label="Переглянути фото" onClick={() => navigate('review-photos')} variant="secondary" />
      </div>
    </div>
  )
}

function ManualGalleryScreen() {
  const { navigate, goBack } = useApp()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <div className="flex items-center justify-between px-4 pt-14 pb-3 border-b" style={{ borderColor: T.border }}>
        <button onClick={goBack} className="text-[14px]" style={{ color: T.muted }}>Скасувати</button>
        <span className="text-[15px] font-medium" style={{ color: T.text }}>{selected.size > 0 ? `${selected.size} вибрано` : 'Оберіть фото'}</span>
        <div className="w-14" />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <PhotoGrid photos={ALL_GALLERY_PHOTOS} selectedIds={selected} onToggle={toggle} />
      </div>
      <div className="px-5 py-4 border-t" style={{ borderColor: T.border }}>
        <Btn label={selected.size > 0 ? `Створити з ${selected.size} фото` : 'Оберіть фото'} onClick={() => navigate('book-size')} disabled={selected.size === 0} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK PRODUCTION
// ─────────────────────────────────────────────────────────────────────────────

// Book size screen — same book at 3 physical sizes
function BookSizeScreen() {
  const { bookSize, setBookSize, selectedAlbumId, coverColor, coverTitle, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title

  // Each card shows the same book at a visually distinct physical size
  // All three must fit within the card row — fixed widths that look clearly different
  const sizeDims: Record<BookSize, { w: number; spine: number }> = {
    small:  { w: 52,  spine: 4 },
    medium: { w: 68,  spine: 6 },
    large:  { w: 86,  spine: 8 },
  }

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Оберіть розмір альбому" onBack={goBack} />
      <div className="flex-1 px-5 py-4 overflow-y-auto scrollbar-hide">
        <p className="text-[14px] mb-5" style={{ color: T.muted }}>Крейдований папір 250г, матове ламінування, тверда обкладинка.</p>
        <div className="space-y-3">
          {(['small', 'medium', 'large'] as BookSize[]).map(size => {
            const s = BOOK_SIZES[size]
            const sel = bookSize === size
            const { w, spine } = sizeDims[size]
            const h = Math.round(w * 0.82)
            const spineColor = darkenHex(colorHex, 0.32)
            const spineEdge  = darkenHex(colorHex, 0.48)
            const textColor  = isLightHex(colorHex) ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.92)'
            const pad  = Math.max(4, Math.round(w * 0.085))
            const matW = Math.max(2, Math.round(w * 0.022))
            const fs   = Math.max(5, Math.round(w * 0.075))
            return (
              <button key={size} onClick={() => setBookSize(size)}
                className="w-full p-4 rounded-2xl text-left flex items-center gap-4 active:scale-[0.99] transition-transform"
                style={{ border: `2px solid ${sel ? T.accent : T.border}`, background: sel ? T.accentLight : 'white' }}>
                {/* Physical hardcover mockup — same book, different physical size */}
                <div className="flex-shrink-0 flex items-end justify-center" style={{ width: 96, height: 76 }}>
                  <div style={{ display: 'flex', height: h, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.28))' }}>
                    <div style={{ width: spine, height: h, flexShrink: 0, background: `linear-gradient(to right, ${spineEdge}, ${spineColor})`, borderRadius: '2px 0 0 2px' }} />
                    <div style={{ width: w, height: h, background: colorHex, borderRadius: '0 3px 3px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: pad, gap: Math.round(pad * 0.4), overflow: 'hidden' }}>
                      <div style={{ flex: 1, width: '100%', background: 'white', padding: matW, display: 'flex', overflow: 'hidden' }}>
                        <img src={a.coverPhoto.url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                      </div>
                      <div style={{ color: textColor, fontSize: fs, fontFamily: T.sans, fontWeight: 500, textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{title}</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-semibold" style={{ color: T.text }}>{s.label}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: T.muted }}>{s.dimensions}</p>
                </div>
                <p className="text-[20px] font-semibold flex-shrink-0" style={{ color: sel ? T.accent : T.text }}>{s.priceLabel}</p>
              </button>
            )
          })}
        </div>
      </div>
      <div className="px-5 pb-10 pt-3 border-t" style={{ borderColor: T.border }}>
        <Btn label="Продовжити" onClick={() => navigate('ai-generation')} />
      </div>
    </div>
  )
}

function AIGenerationScreen() {
  const { navigate, exportMode } = useApp()
  const steps = ['Підбираємо розкладки', 'Складаємо вашу історію', 'Оформлюємо обкладинку', 'Готуємо сторінки']
  const [step, setStep] = useState(exportMode ? 2 : 0)
  useEffect(() => {
    if (exportMode) return
    const i = setInterval(() => setStep(s => {
      if (s >= steps.length - 1) { clearInterval(i); setTimeout(() => navigate('design-selection'), 700); return s }
      return s + 1
    }), 950)
    return () => clearInterval(i)
  }, [exportMode])
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white screen-slide-in px-8">
      <div className="mb-10"><Logo dotSize={14} /></div>
      <h1 className="text-[26px] text-center font-light mb-10" style={{ fontFamily: T.serif, color: T.text }}>Створюємо<br />ваш фотоальбом</h1>
      <div className="w-full max-w-xs space-y-5">
        {steps.map((s, i) => {
          const done = i < step; const active = i === step
          return (
            <div key={s} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                style={{ background: done ? T.accent : active ? T.accentLight : T.surface }}>
                {done ? <CheckIco /> : active ? <div className="w-2 h-2 rounded-full animate-soft-pulse" style={{ background: T.accent }} /> : null}
              </div>
              <span className="text-[14px] transition-all" style={{ color: done || active ? T.text : T.muted, fontWeight: active ? 500 : 400 }}>{s}</span>
              {done && <span className="ml-auto text-[12px]" style={{ color: T.accent }}>✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Design selection — each option is a complete physical book with a different cover design
function DesignSelectionScreen() {
  const { selectedDesign, setSelectedDesign, selectedAlbumId, coverTitle, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const title = coverTitle || a.title

  const designs = DESIGN_VARIANTS.map((d, i) => ({
    ...d,
    colorHex: COVER_COLORS[DESIGN_VARIANT_COLORS[i as DesignVariant]].hex,
  }))

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Оберіть дизайн" onBack={goBack} />
      <p className="text-[14px] px-5 pt-3 pb-1" style={{ color: T.muted }}>Три варіанти готової обкладинки на основі ваших фото.</p>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-3">
        <div className="space-y-4">
          {designs.map((d, i) => {
            const sel = selectedDesign === i
            return (
              <button key={i} onClick={() => setSelectedDesign(i as DesignVariant)}
                className="w-full rounded-2xl overflow-hidden text-left active:scale-[0.99] transition-transform"
                style={{ border: `2px solid ${sel ? T.accent : T.border}` }}>
                {/* Physical book preview centered */}
                <div className="flex items-center justify-center py-5"
                  style={{ background: sel ? T.accentLight : T.surface }}>
                  <BookCover photo={a.coverPhoto} title={title} colorHex={d.colorHex} uiSize="lg" />
                </div>
                <div className="px-4 py-3 flex items-center justify-between bg-white">
                  <div>
                    <p className="text-[15px] font-semibold" style={{ color: T.text }}>{d.name}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: T.muted }}>{d.description}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: sel ? T.accent : T.border, background: sel ? T.accent : 'transparent' }}>
                    {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="px-5 pb-10 pt-3 border-t" style={{ borderColor: T.border }}>
        <Btn label="Обрати цей дизайн" onClick={() => navigate('cover-selection')} />
      </div>
    </div>
  )
}

function CoverSelectionScreen() {
  const { selectedAlbumId, coverColor, setCoverColor, coverTitle, setCoverTitle, coverSubtitle, setCoverSubtitle, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Обкладинка" onBack={goBack} />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Physical book preview */}
        <div className="flex items-center justify-center py-8" style={{ background: T.surface }}>
          <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xl" />
        </div>

        <div className="px-5 pt-5 space-y-5 pb-8">
          {/* Color picker */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: T.muted }}>Колір обкладинки</p>
            <div className="flex gap-3 flex-wrap">
              {(Object.entries(COVER_COLORS) as [CoverColor, { label: string; hex: string }][]).map(([key, val]) => (
                <button key={key} onClick={() => setCoverColor(key)} title={val.label}
                  className="w-9 h-9 rounded-full transition-all"
                  style={{ background: val.hex, border: coverColor === key ? `2px solid ${T.accent}` : `2px solid ${T.border}`, transform: coverColor === key ? 'scale(1.18)' : 'scale(1)', boxShadow: coverColor === key ? `0 0 0 2px white, 0 0 0 4px ${T.accent}` : 'none' }} />
              ))}
            </div>
          </div>
          <FormInput label="Заголовок" placeholder={a.title} defaultValue={coverTitle} />
          <FormInput label="Підзаголовок" placeholder={a.dates || 'Додати підзаголовок'} defaultValue={coverSubtitle} />
        </div>
      </div>
      <div className="px-5 pb-10 pt-2 border-t" style={{ borderColor: T.border }}>
        <Btn label="Продовжити" onClick={() => navigate('book-editor')} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK EDITOR — scrollable spreads
// ─────────────────────────────────────────────────────────────────────────────
function BookEditorScreen() {
  const { selectedAlbumId, coverColor, coverTitle, showLayoutSheet, showTextSheet,
    setShowLayoutSheet, setShowTextSheet, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title
  const [activeSpread, setActiveSpread] = useState(0)
  const [spreadLayouts, setSpreadLayouts] = useState<number[]>([0, 0, 0, 0, 0, 0])
  const spreadRefs = useRef<(HTMLDivElement | null)[]>([])

  // Every interior spread has two photos — no nulls so there are no white gaps
  const ph = a.photos
  const spreads: [typeof ph[0] | null, typeof ph[0] | null][] = [
    [null, null],                                           // 0: cover
    [ph[0], ph[1]],                                        // 1: pages 3-4
    [ph[2], ph[3]],                                        // 2: pages 5-6
    [ph[4], ph[5]],                                        // 3: pages 7-8
    [ph[6], ph[7 % ph.length]],                            // 4: pages 9-10
    [ph[1 % ph.length], ph[2 % ph.length]],                // 5: pages 11-12
  ]

  const renderInteriorSpread = (left: typeof a.photos[0] | null, right: typeof a.photos[0] | null, layout: number, idx: number) => {
    // All layouts use absolute positioning so images are strictly clipped within the spread card
    if (layout === 0) return (
      <div className="absolute inset-0 flex gap-0.5">
        {[left, right].map((p, j) => p ? (
          <div key={j} className="flex-1 relative overflow-hidden">
            <img src={p.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ) : (
          <div key={j} className="flex-1 bg-gray-50 flex items-center justify-center" style={{ border: `1px dashed ${T.border}` }}>
            <PlusIco c={T.muted} />
          </div>
        ))}
      </div>
    )
    if (layout === 1) return (
      // Full-bleed single photo spanning the entire spread
      <div className="absolute inset-0 overflow-hidden">
        {left && <img src={left.url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      </div>
    )
    if (layout === 2) return (
      <div className="absolute inset-0 grid grid-cols-2 gap-0.5" style={{ gridTemplateRows: '1fr 1fr' }}>
        {left && (
          <div className="relative overflow-hidden" style={{ gridRow: '1 / 3' }}>
            <img src={left.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        )}
        {[right, a.photos[(idx * 2 + 3) % a.photos.length]].map((p, j) => p ? (
          <div key={j} className="relative overflow-hidden">
            <img src={p.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ) : null)}
      </div>
    )
    // Layout 3: large top photo + two smaller photos in a strip below
    const extra = a.photos[(idx + 3) % a.photos.length]
    return (
      <div className="absolute inset-0 flex flex-col gap-0.5">
        <div className="relative overflow-hidden" style={{ flex: 2 }}>
          {left && <img src={left.url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        </div>
        <div className="flex gap-0.5" style={{ flex: 1 }}>
          {[right ?? extra, extra].map((p, j) => (
            <div key={j} className="flex-1 relative overflow-hidden">
              {p && <img src={p.url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <div className="flex items-center justify-between px-4 pt-14 pb-3 border-b flex-shrink-0" style={{ borderColor: T.border }}>
        <button onClick={goBack} className="p-1 -ml-1"><ChevLeft /></button>
        <span className="text-[14px] font-medium" style={{ color: T.text }}>{a.title}</span>
        <button onClick={() => navigate('preview-mode')} className="text-[14px] font-medium" style={{ color: T.accent }}>Перегляд</button>
      </div>

      {/* Scrollable spreads */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4" style={{ background: '#E8E8E8' }}>
        {spreads.map((spread, i) => (
          <div key={i} ref={(el: HTMLDivElement | null) => { spreadRefs.current[i] = el }}
            className="rounded-xl overflow-hidden cursor-pointer relative"
            style={{
              boxShadow: activeSpread === i ? `0 0 0 2px ${T.accent}, 0 4px 16px rgba(0,0,0,0.12)` : '0 2px 10px rgba(0,0,0,0.1)',
              aspectRatio: '2/1',
            }}
            onClick={() => setActiveSpread(i)}>
            {/* Cover spread — show physical book */}
            {i === 0 ? (
              <div className="absolute inset-0 bg-[#D5D5D5] flex items-center justify-center">
                <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="md" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-white">
                {renderInteriorSpread(spread[0], spread[1], spreadLayouts[i], i)}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none" style={{ background: 'rgba(0,0,0,0.1)' }} />
                <div className="absolute top-1 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.85)' }}>
                    Розворот {i} · Стор. {i * 2 + 1}–{i * 2 + 2}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        <button className="w-full rounded-xl border-2 border-dashed flex items-center justify-center gap-2 active:opacity-60"
          style={{ borderColor: T.borderDark, aspectRatio: '4/1' }}>
          <PlusIco c={T.muted} />
          <span className="text-[13px]" style={{ color: T.muted }}>Додати розворот</span>
        </button>
      </div>

      {/* Editing toolbar */}
      <div className="flex-shrink-0 bg-white border-t" style={{ borderColor: T.border }}>
        <div className="flex items-center justify-around px-2 py-3">
          {[
            { label: 'Макет', icon: '⊞', action: () => setShowLayoutSheet(true) },
            { label: 'Текст', icon: 'Аа', action: () => setShowTextSheet(true) },
            { label: 'Замінити', icon: '↩', action: () => navigate('add-photos') },
            { label: 'Обрізати', icon: '⊡', action: () => navigate('crop-photo') },
          ].map(b => (
            <button key={b.label} onClick={b.action}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl active:bg-gray-100">
              <span className="text-[18px] font-medium" style={{ color: T.text }}>{b.icon}</span>
              <span className="text-[9px] font-medium" style={{ color: T.muted }}>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Sheet */}
      <Sheet open={showLayoutSheet} onClose={() => setShowLayoutSheet(false)} title="Макет сторінки">
        <div className="px-5 py-4 pb-8 space-y-5">
          {/* Section: photo-only layouts */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: T.muted }}>Фото</p>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: 'На весь аркуш', idx: 0, p: <div className="w-full h-full rounded-sm bg-[#CCC]" /> },
                { label: '2 рівних',      idx: 1, p: <div className="flex gap-0.5 h-full">{['#CCC','#BBB'].map((c,i)=><div key={i} className="flex-1 rounded-sm" style={{background:c}}/>)}</div> },
                { label: '1 + 2',         idx: 2, p: <div className="grid grid-cols-2 gap-0.5 h-full"><div className="row-span-2 rounded-sm bg-[#CCC]"/><div className="rounded-sm bg-[#BBB]"/><div className="rounded-sm bg-[#AAA]"/></div> },
                { label: 'Зверху + смуга',idx: 3, p: <div className="flex flex-col gap-0.5 h-full"><div className="flex-[2] rounded-sm bg-[#CCC]"/><div className="flex-1 flex gap-0.5">{['#BBB','#AAA'].map((c,i)=><div key={i} className="flex-1 rounded-sm" style={{background:c}}/>)}</div></div> },
                { label: 'Сітка 3',       idx: 4, p: <div className="grid grid-cols-3 gap-0.5 h-full">{['#CCC','#BBB','#AAA'].map((c,i)=><div key={i} className="rounded-sm" style={{background:c}}/>)}</div> },
                { label: 'Сітка 4',       idx: 5, p: <div className="grid grid-cols-2 gap-0.5 h-full">{['#CCC','#BBB','#AAA','#999'].map((c,i)=><div key={i} className="rounded-sm" style={{background:c}}/>)}</div> },
                { label: 'З відступами',  idx: 6, p: <div className="w-full h-full p-1 bg-[#F5F5F5] border border-[#DDD] rounded-sm"><div className="w-full h-full rounded-sm bg-[#CCC]"/></div> },
                { label: 'З рамкою',      idx: 7, p: <div className="w-full h-full p-1.5 border-2 border-[#BBB] rounded-sm bg-[#CCC]" /> },
              ].map((l) => (
                <button key={l.idx}
                  onClick={() => { setSpreadLayouts(prev => { const n = [...prev]; n[activeSpread] = l.idx % 4; return n }); setShowLayoutSheet(false) }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl active:scale-95"
                  style={{ border: `1.5px solid ${spreadLayouts[activeSpread] === l.idx % 4 ? T.accent : T.border}`, background: spreadLayouts[activeSpread] === l.idx % 4 ? T.accentLight : 'white' }}>
                  <div className="w-full rounded" style={{ height: 40 }}>{l.p}</div>
                  <span className="text-[8px] text-center leading-tight" style={{ color: T.muted }}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: text + photo layouts */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: T.muted }}>Текст + фото</p>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                {
                  label: 'Заголовок знизу',
                  p: <div className="flex flex-col h-full gap-0.5">
                    <div className="flex-[3] rounded-sm bg-[#CCC]"/>
                    <div className="flex-1 flex flex-col justify-center gap-0.5 px-0.5">
                      <div className="h-1.5 rounded-full bg-[#555] w-4/5"/>
                      <div className="h-1 rounded-full bg-[#BBB] w-3/5"/>
                    </div>
                  </div>,
                },
                {
                  label: 'Заголовок зверху',
                  p: <div className="flex flex-col h-full gap-0.5">
                    <div className="flex-1 flex flex-col justify-center gap-0.5 px-0.5">
                      <div className="h-1.5 rounded-full bg-[#555] w-4/5"/>
                      <div className="h-1 rounded-full bg-[#BBB] w-2/3"/>
                    </div>
                    <div className="flex-[3] rounded-sm bg-[#CCC]"/>
                  </div>,
                },
                {
                  label: 'Фото + текст праворуч',
                  p: <div className="flex h-full gap-0.5">
                    <div className="flex-[3] rounded-sm bg-[#CCC]"/>
                    <div className="flex-[2] flex flex-col justify-center gap-1 px-0.5">
                      <div className="h-1.5 rounded-full bg-[#444]"/>
                      <div className="h-1 rounded-full bg-[#BBB]"/>
                      <div className="h-1 rounded-full bg-[#BBB] w-3/4"/>
                      <div className="h-1 rounded-full bg-[#BBB] w-1/2"/>
                    </div>
                  </div>,
                },
                {
                  label: 'Текст + фото праворуч',
                  p: <div className="flex h-full gap-0.5">
                    <div className="flex-[2] flex flex-col justify-center gap-1 px-0.5">
                      <div className="h-1.5 rounded-full bg-[#444]"/>
                      <div className="h-1 rounded-full bg-[#BBB]"/>
                      <div className="h-1 rounded-full bg-[#BBB] w-3/4"/>
                      <div className="h-1 rounded-full bg-[#BBB] w-1/2"/>
                    </div>
                    <div className="flex-[3] rounded-sm bg-[#CCC]"/>
                  </div>,
                },
                {
                  label: 'Накладений текст',
                  p: <div className="relative w-full h-full rounded-sm overflow-hidden">
                    <div className="absolute inset-0 bg-[#CCC]"/>
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="h-1.5 rounded-full bg-white w-4/5 mb-0.5"/>
                      <div className="h-1 rounded-full bg-white/70 w-2/3"/>
                    </div>
                  </div>,
                },
                {
                  label: 'Текст по центру',
                  p: <div className="relative w-full h-full rounded-sm overflow-hidden">
                    <div className="absolute inset-0 bg-[#CCC] opacity-60"/>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                      <div className="h-2 rounded-full bg-[#222] w-3/4"/>
                      <div className="h-1 rounded-full bg-[#444] w-1/2"/>
                    </div>
                  </div>,
                },
                {
                  label: 'Цитата',
                  p: <div className="flex flex-col h-full gap-0.5">
                    <div className="flex-[2] rounded-sm bg-[#CCC]"/>
                    <div className="flex-[1.5] bg-[#F5F5F5] rounded-sm flex flex-col justify-center items-center gap-0.5 px-1">
                      <div className="text-[8px] font-bold" style={{ color: '#AAA' }}>"</div>
                      <div className="h-1 rounded-full bg-[#BBB] w-4/5"/>
                      <div className="h-1 rounded-full bg-[#BBB] w-2/3"/>
                      <div className="h-0.5 rounded-full bg-[#CCC] w-1/3 mt-0.5"/>
                    </div>
                  </div>,
                },
                {
                  label: 'Тільки текст',
                  p: <div className="flex flex-col justify-center h-full gap-1.5 px-1 bg-[#FAFAFA] rounded-sm">
                    <div className="h-2 rounded-full bg-[#444] w-3/4"/>
                    <div className="h-1 rounded-full bg-[#CCC] w-full"/>
                    <div className="h-1 rounded-full bg-[#CCC] w-5/6"/>
                    <div className="h-1 rounded-full bg-[#CCC] w-4/6"/>
                    <div className="h-0.5 rounded-full bg-[#DDD] w-1/3 mt-1"/>
                  </div>,
                },
              ].map((l, i) => (
                <button key={i}
                  onClick={() => setShowLayoutSheet(false)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl active:scale-95"
                  style={{ border: `1.5px solid ${T.border}`, background: 'white' }}>
                  <div className="w-full rounded overflow-hidden" style={{ height: 40 }}>{l.p}</div>
                  <span className="text-[8px] text-center leading-tight" style={{ color: T.muted }}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>

      {/* Text Sheet */}
      <Sheet open={showTextSheet} onClose={() => setShowTextSheet(false)} title="Додати текст">
        <div className="px-5 py-4 pb-8 space-y-4">
          {[{ k: 'Заголовок', ph: a.title }, { k: 'Підпис', ph: 'Момент, який запам\'ятається…' }].map(f => (
            <div key={f.k}>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.muted }}>{f.k}</label>
              <input placeholder={f.ph} className="w-full px-4 py-3 rounded-xl text-[14px]" style={{ border: `1.5px solid ${T.border}`, color: T.text }} />
            </div>
          ))}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: T.muted }}>Стиль</p>
            <div className="flex gap-2">
              {['Звичайний', 'Редакційний', 'Мінімальний'].map(s => (
                <button key={s} className="flex-1 py-2.5 rounded-xl text-[12px] font-medium" style={{ border: `1.5px solid ${T.border}`, color: T.text }}>{s}</button>
              ))}
            </div>
          </div>
          <Btn label="Додати на сторінку" onClick={() => setShowTextSheet(false)} />
        </div>
      </Sheet>
    </div>
  )
}

function BookOverviewScreen() {
  const { selectedAlbumId, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const spreads = Array.from({ length: 6 }, (_, i) => [a.photos[i * 2 % a.photos.length], a.photos[(i * 2 + 1) % a.photos.length]])
  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Усі сторінки" onBack={goBack} right={<span className="text-[12px]" style={{ color: T.muted }}>32 стор.</span>} />
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        <div className="grid grid-cols-2 gap-3">
          {spreads.map((spread, i) => (
            <button key={i} onClick={goBack} className="rounded-xl overflow-hidden border active:opacity-70" style={{ borderColor: T.border }}>
              <div className="flex h-24">
                {spread.map((p, j) => p ? <div key={j} className="flex-1 overflow-hidden"><img src={p.url} alt="" className="w-full h-full object-cover" /></div> : null)}
              </div>
              <div className="py-1.5 px-3" style={{ background: T.surface }}>
                <span className="text-[10px]" style={{ color: T.muted }}>{i === 0 ? 'Обкладинка' : `Розворот ${i}`}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Preview — physical book with real page spreads
function PreviewModeScreen() {
  const { selectedAlbumId, coverColor, coverTitle, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title
  const [page, setPage] = useState(0)

  const spreads = [
    { isCover: true },
    { left: a.photos[0], right: a.photos[1], leftCaption: '12–20 травня 2026', rightCaption: a.location || '' },
    { left: a.photos[2], right: a.photos[3], leftCaption: 'Теплий вечір', rightCaption: 'Місто вогнів' },
    { left: a.photos[4], right: a.photos[5], leftCaption: '', rightCaption: 'На заході дня' },
  ]
  const s = spreads[page]

  return (
    <div className="h-full flex flex-col screen-slide-in" style={{ background: '#1A1A1A' }}>
      <div className="flex items-center justify-between px-5 pt-14 pb-4 flex-shrink-0">
        <button onClick={goBack} className="text-[14px]" style={{ color: 'rgba(255,255,255,0.6)' }}>‹ Редагувати</button>
        <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{page + 1} / {spreads.length}</span>
        <button onClick={() => navigate('product-summary')} className="text-[14px] font-semibold" style={{ color: T.accent }}>Завершити</button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        {s.isCover ? (
          // Cover page — realistic physical book
          <div style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))' }}>
            <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xl" />
          </div>
        ) : (
          // Interior spread — white pages with margins & typography
          <div className="w-full" style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.6))' }}>
            <div className="flex rounded-lg overflow-hidden" style={{ aspectRatio: '2/1', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Left page */}
              <div className="flex-1 bg-white flex flex-col" style={{ borderRight: '2px solid rgba(0,0,0,0.1)' }}>
                {'left' in s && s.left && (
                  <div className="flex-1 flex flex-col p-3 pb-4">
                    <div className="flex-1 rounded-sm overflow-hidden">
                      <img src={s.left.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    {'leftCaption' in s && s.leftCaption && (
                      <p className="text-center text-[7px] mt-1.5 italic" style={{ color: T.muted, fontFamily: T.serif }}>{s.leftCaption}</p>
                    )}
                  </div>
                )}
                <div className="pb-1.5 pr-2 flex justify-start pl-2.5">
                  <span className="text-[7px]" style={{ color: '#CCC' }}>{page * 2 + 1}</span>
                </div>
              </div>
              {/* Right page */}
              <div className="flex-1 bg-white flex flex-col">
                {'right' in s && s.right && (
                  <div className="flex-1 flex flex-col p-3 pb-4">
                    <div className="flex-1 rounded-sm overflow-hidden">
                      <img src={s.right.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    {'rightCaption' in s && s.rightCaption && (
                      <p className="text-center text-[7px] mt-1.5 italic" style={{ color: T.muted, fontFamily: T.serif }}>{s.rightCaption}</p>
                    )}
                  </div>
                )}
                <div className="pb-1.5 pr-2.5 flex justify-end">
                  <span className="text-[7px]" style={{ color: '#CCC' }}>{page * 2 + 2}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-12 flex gap-3 flex-shrink-0 mt-4">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          className="flex-1 py-3.5 rounded-2xl text-[14px] font-medium"
          style={{ background: 'rgba(255,255,255,0.1)', color: page === 0 ? 'rgba(255,255,255,0.2)' : 'white' }}>
          ‹ Назад
        </button>
        {page < spreads.length - 1 ? (
          <button onClick={() => setPage(p => p + 1)} className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold" style={{ background: T.accent, color: 'white' }}>
            Далі ›
          </button>
        ) : (
          <button onClick={() => navigate('product-summary')} className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold" style={{ background: T.accent, color: 'white' }}>
            Завершити ›
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────────────────────────────────────────
function ProductSummaryScreen() {
  const { selectedAlbumId, bookSize, coverColor, coverTitle, setPurchaseType, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const s = BOOK_SIZES[bookSize]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Ваша книга" onBack={goBack} />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Physical book preview */}
        <div className="flex items-center justify-center py-8" style={{ background: T.surface }}>
          <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xl" />
        </div>

        {/* Book info */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            {[`${s.label} · ${s.dimensions}`, '32 сторінки', 'Тверда обкладинка'].map((tag, i) => (
              <span key={i} className="text-[12px] px-2.5 py-1 rounded-full" style={{ background: T.surface, color: T.muted }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Purchase options */}
        <div className="px-5 space-y-4 pb-10">
          <button onClick={() => { setPurchaseType('print'); navigate('print-config') }}
            className="w-full p-5 rounded-2xl text-left active:scale-[0.99] transition-transform"
            style={{ border: `2px solid ${T.accent}`, background: T.accentLight }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[17px] font-semibold" style={{ color: T.text }}>Друкований альбом</p>
                <p className="text-[13px] mt-0.5" style={{ color: T.muted }}>Тверда обкладинка, преміум друк</p>
              </div>
              <p className="text-[24px] font-semibold" style={{ color: T.accent }}>{s.priceLabel}</p>
            </div>
            <div className="flex items-center gap-2 text-[12px]" style={{ color: T.accent }}>
              <span>🚚</span><span>Відправка за 5–7 робочих днів</span>
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: T.accent + '40' }}>
              <span className="text-[14px] font-semibold" style={{ color: T.accent }}>Замовити друкований альбом →</span>
            </div>
          </button>

          <button onClick={() => { setPurchaseType('pdf'); navigate('pdf-purchase') }}
            className="w-full p-5 rounded-2xl text-left active:bg-gray-50"
            style={{ border: `1.5px solid ${T.border}` }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[15px] font-semibold" style={{ color: T.text }}>Цифровий PDF</p>
                <p className="text-[13px] mt-0.5" style={{ color: T.muted }}>Для перегляду, надсилання або самостійного друку.</p>
              </div>
              <p className="text-[18px] font-semibold ml-4" style={{ color: T.text }}>₴299</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function PrintConfigScreen() {
  const { selectedAlbumId, bookSize, coverColor, coverTitle, quantity, setQuantity, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const s = BOOK_SIZES[bookSize]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title
  const total = s.price + (quantity - 1) * 899

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Підтвердити замовлення" onBack={goBack} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-5">
        {/* Book summary with physical cover */}
        <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: T.surface }}>
          <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xs" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: T.text }}>{title}</p>
            <p className="text-[13px] mt-0.5" style={{ color: T.muted }}>{s.label} · {s.dimensions} · Тверда</p>
            <p className="text-[13px] font-medium mt-1" style={{ color: T.text }}>{s.priceLabel}</p>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: T.muted }}>Кількість</p>
          <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: T.border }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-light"
              style={{ background: T.surface, color: T.text }}>−</button>
            <span className="flex-1 text-center text-[24px] font-semibold" style={{ color: T.text }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-light"
              style={{ background: T.surface, color: T.text }}>+</button>
          </div>
          {quantity > 1 && <p className="text-[12px] mt-2 text-center" style={{ color: T.muted }}>Додаткові копії: ₴899 кожна</p>}
        </div>

        {/* Price summary */}
        <div className="p-4 rounded-xl" style={{ background: T.surface }}>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: T.muted }}>{s.label} ({s.dimensions})</span>
              <span className="text-[13px]" style={{ color: T.text }}>{s.priceLabel}</span>
            </div>
            {quantity > 1 && (
              <div className="flex justify-between">
                <span className="text-[13px]" style={{ color: T.muted }}>Додаткові копії ×{quantity - 1}</span>
                <span className="text-[13px]" style={{ color: T.text }}>{fmt((quantity - 1) * 899)}</span>
              </div>
            )}
          </div>
          <Divider />
          <div className="flex justify-between mt-2">
            <span className="text-[14px] font-semibold" style={{ color: T.text }}>Всього</span>
            <span className="text-[14px] font-semibold" style={{ color: T.text }}>{fmt(total)}</span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-10 pt-3 border-t" style={{ borderColor: T.border }}>
        <Btn label="Продовжити" onClick={() => navigate('shipping')} />
      </div>
    </div>
  )
}

function ShippingScreen() {
  const { carrier, setCarrier, deliveryType, setDeliveryType, navigate, goBack, shippingInitStep } = useApp()
  const [step, setStep] = useState<'carrier' | 'details'>(shippingInitStep ?? 'carrier')
  const isNP = carrier === 'nova-poshta'

  if (step === 'carrier') return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Доставка" onBack={goBack} />
      <div className="flex-1 px-5 py-5">
        <p className="text-[15px] font-light mb-6" style={{ fontFamily: T.serif, color: T.text }}>Оберіть службу доставки</p>
        <div className="space-y-3">
          {[
            {
              id: 'nova-poshta' as Carrier,
              label: 'Нова Пошта',
              desc: "Відділення, поштомати, кур'єр",
              logo: (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#DA291C' }}>
                  <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
                    <path d="M2 20L10 2L15 12L20 2L28 20" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ),
            },
            {
              id: 'ukrposhta' as Carrier,
              label: 'Укрпошта',
              desc: 'Відділення по всій Україні',
              logo: (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: '#003DA5' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="16" fill="#003DA5"/>
                    <rect y="16" width="32" height="16" fill="#FFD700"/>
                    <path d="M7 10h18M7 10l4 6h10l4-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 16h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
              ),
            },
          ].map(c => (
            <button key={c.id} onClick={() => { setCarrier(c.id); setStep('details') }}
              className="w-full p-5 rounded-2xl flex items-center gap-4 text-left active:scale-[0.99]"
              style={{ border: `1.5px solid ${carrier === c.id ? T.accent : T.border}`, background: carrier === c.id ? T.accentLight : 'white' }}>
              {c.logo}
              <div className="flex-1">
                <p className="text-[16px] font-semibold" style={{ color: T.text }}>{c.label}</p>
                <p className="text-[13px] mt-0.5" style={{ color: T.muted }}>{c.desc}</p>
              </div>
              <ChevRight />
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title={isNP ? 'Нова Пошта' : 'Укрпошта'} onBack={() => setStep('carrier')} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Ім'я" placeholder="Олена" />
          <FormInput label="Прізвище" placeholder="Коваленко" />
        </div>
        <FormInput label="Номер телефону" placeholder="+380 50 123 4567" type="tel" />
        <FormInput label="Місто / населений пункт" placeholder="Львів" />
        {isNP ? (
          <>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: T.muted }}>Тип отримання</p>
              <div className="space-y-2">
                {[{ id: 'branch' as const, label: 'Відділення', icon: '🏢' }, { id: 'parcel-locker' as const, label: 'Поштомат', icon: '📦' }].map(dt => (
                  <button key={dt.id} onClick={() => setDeliveryType(dt.id)}
                    className="w-full p-4 rounded-xl flex items-center gap-3"
                    style={{ border: `1.5px solid ${deliveryType === dt.id ? T.accent : T.border}`, background: deliveryType === dt.id ? T.accentLight : 'white' }}>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: deliveryType === dt.id ? T.accent : T.border }}>
                      {deliveryType === dt.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: T.accent }} />}
                    </div>
                    <span className="text-xl">{dt.icon}</span>
                    <span className="text-[14px] font-medium" style={{ color: T.text }}>{dt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <FormInput label={deliveryType === 'branch' ? 'Номер відділення' : 'Номер поштомату'}
              placeholder={deliveryType === 'branch' ? 'Відділення №12, вул. Городоцька' : 'Поштомат №4521'} />
          </>
        ) : (
          <>
            <FormInput label="Поштовий індекс" placeholder="79000" />
            <FormInput label="Відділення або адреса" placeholder="вул. Шевченка 15, відділення №5" />
          </>
        )}
      </div>
      <div className="px-5 pb-10 pt-3 border-t" style={{ borderColor: T.border }}>
        <Btn label="Продовжити" onClick={() => navigate('payment')} />
      </div>
    </div>
  )
}

function PaymentScreen() {
  const { selectedAlbumId, bookSize, coverColor, coverTitle, quantity, carrier, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const s = BOOK_SIZES[bookSize]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title
  const bookTotal = s.price + (quantity - 1) * 899
  const shipping = carrier === 'nova-poshta' ? 89 : 59
  const total = bookTotal + shipping
  const [method, setMethod] = useState<'google' | 'card'>('google')

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Оплата" onBack={goBack} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-5">
        <div className="space-y-3">
          {[
            { id: 'google' as const, label: 'Google Pay', emoji: 'G', sub: 'Відбиток пальця або PIN' },
            { id: 'card' as const, label: 'Картка Visa / Mastercard', emoji: '💳', sub: 'Дебетова або кредитна картка' },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className="w-full p-4 rounded-2xl flex items-center gap-3 text-left"
              style={{ border: `1.5px solid ${method === m.id ? T.accent : T.border}`, background: method === m.id ? T.accentLight : 'white' }}>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: method === m.id ? T.accent : T.border }}>
                {method === m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: T.accent }} />}
              </div>
              <span className="text-[16px] font-black" style={{ color: '#4285F4', width: 22, textAlign: 'center' }}>{m.emoji}</span>
              <div>
                <p className="text-[14px] font-medium" style={{ color: T.text }}>{m.label}</p>
                <p className="text-[11px]" style={{ color: T.muted }}>{m.sub}</p>
              </div>
            </button>
          ))}
        </div>
        {method === 'card' && (
          <div className="space-y-3">
            <FormInput label="Номер картки" placeholder="1234 5678 9012 3456" />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Термін дії" placeholder="MM / РР" />
              <FormInput label="CVV" placeholder="123" />
            </div>
          </div>
        )}
        {/* Order summary with physical book */}
        <div className="p-4 rounded-2xl" style={{ background: T.surface }}>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: T.muted }}>Ваше замовлення</p>
          <div className="flex items-center gap-3 mb-3 pb-3 border-b" style={{ borderColor: T.border }}>
            <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xs" />
            <div>
              <p className="text-[13px] font-medium" style={{ color: T.text }}>{title}</p>
              <p className="text-[12px]" style={{ color: T.muted }}>{s.label} · {quantity > 1 ? `${quantity} копії` : '1 копія'}</p>
            </div>
          </div>
          {[
            { label: 'Книга', val: fmt(s.price) },
            quantity > 1 ? { label: `Додаткові копії ×${quantity - 1}`, val: fmt((quantity - 1) * 899) } : null,
            { label: carrier === 'nova-poshta' ? 'Нова Пошта' : 'Укрпошта', val: fmt(shipping) },
          ].filter(Boolean).map((row, i) => row && (
            <div key={i} className="flex justify-between py-1">
              <span className="text-[13px]" style={{ color: T.muted }}>{row.label}</span>
              <span className="text-[13px]" style={{ color: T.text }}>{row.val}</span>
            </div>
          ))}
          <Divider />
          <div className="flex justify-between mt-2">
            <span className="text-[15px] font-semibold" style={{ color: T.text }}>Всього</span>
            <span className="text-[15px] font-semibold" style={{ color: T.text }}>{fmt(total)}</span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-10 pt-3 border-t" style={{ borderColor: T.border }}>
        <Btn label={`Сплатити ${fmt(total)}`} onClick={() => navigate('order-confirmation')} />
      </div>
    </div>
  )
}

function OrderConfirmationScreen() {
  const { selectedAlbumId, coverColor, coverTitle, navigate, resetTo, setTab } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: '#E6F4EA' }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M7 19l7.5 7.5L29 10" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-[28px] leading-tight mb-3" style={{ fontFamily: T.serif, color: T.text }}>Замовлення оформлено!</h1>
        <p className="text-[14px] mb-8" style={{ color: T.muted }}>Ми надішлемо номер відстеження на вашу пошту, як тільки альбом буде відправлено.</p>

        {/* Physical book in the order card */}
        <div className="w-full p-5 rounded-2xl text-left mb-6" style={{ background: T.surface }}>
          <div className="flex items-center gap-4 mb-4">
            <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xs" />
            <div>
              <p className="text-[15px] font-semibold" style={{ color: T.text }}>{title}</p>
              <p className="text-[13px] mt-0.5" style={{ color: T.muted }}>Замовлення #M-10482</p>
            </div>
          </div>
          <Divider />
          <div className="space-y-2 mt-3">
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: T.muted }}>Очікувана доставка</span>
              <span className="text-[13px] font-medium" style={{ color: T.text }}>7–10 вересня</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ color: T.muted }}>Статус</span>
              <StatusBadge status="processing" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-7 pb-12 space-y-3">
        <Btn label="Відстежити замовлення" onClick={() => navigate('order-details')} />
        <Btn label="На головну" onClick={() => { resetTo('home'); setTab('home') }} variant="secondary" />
      </div>
    </div>
  )
}

// ─── PDF ──────────────────────────────────────────────────────────────────────
function PDFPurchaseScreen() {
  const { selectedAlbumId, coverColor, coverTitle, navigate, goBack } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title
  const [method, setMethod] = useState<'google' | 'card'>('google')

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Купити PDF" onBack={goBack} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-5">
        <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: T.surface }}>
          <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xs" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: T.text }}>{title}</p>
            <p className="text-[13px]" style={{ color: T.muted }}>Цифровий PDF · 32 сторінки</p>
            <p className="text-[12px] mt-1" style={{ color: T.muted }}>Для перегляду, надсилання або самостійного друку.</p>
          </div>
          <p className="text-[20px] font-semibold flex-shrink-0" style={{ color: T.text }}>₴299</p>
        </div>
        <div className="space-y-3">
          {[{ id: 'google' as const, label: 'Google Pay', emoji: 'G' }, { id: 'card' as const, label: 'Картка Visa / Mastercard', emoji: '💳' }].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className="w-full p-4 rounded-2xl flex items-center gap-3 text-left"
              style={{ border: `1.5px solid ${method === m.id ? T.accent : T.border}`, background: method === m.id ? T.accentLight : 'white' }}>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: method === m.id ? T.accent : T.border }}>
                {method === m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: T.accent }} />}
              </div>
              <span className="text-[16px] font-black" style={{ color: '#4285F4', width: 22, textAlign: 'center' }}>{m.emoji}</span>
              <span className="text-[14px] font-medium" style={{ color: T.text }}>{m.label}</span>
            </button>
          ))}
        </div>
        {method === 'card' && (
          <div className="space-y-3">
            <FormInput label="Номер картки" placeholder="1234 5678 9012 3456" />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Термін дії" placeholder="MM / РР" />
              <FormInput label="CVV" placeholder="123" />
            </div>
          </div>
        )}
      </div>
      <div className="px-5 pb-10 pt-3 border-t" style={{ borderColor: T.border }}>
        <Btn label="Сплатити ₴299" onClick={() => navigate('pdf-success')} />
      </div>
    </div>
  )
}

function PDFSuccessScreen() {
  const { selectedAlbumId, coverColor, coverTitle, resetTo, setTab } = useApp()
  const a = ALBUMS[selectedAlbumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || a.title

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: T.accentLight }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M17 5v18M10 16l7 7 7-7" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 28h24" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-[28px] leading-tight mb-3" style={{ fontFamily: T.serif, color: T.text }}>PDF готовий!</h1>
        <p className="text-[14px] mb-8" style={{ color: T.muted }}>Завантажте в будь-який момент із розділу «Мої книги».</p>
        <div className="mb-8">
          <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="lg" />
        </div>
      </div>
      <div className="px-7 pb-12 space-y-3">
        <Btn label="Завантажити PDF" onClick={() => {}} />
        <Btn label="Поділитися" onClick={() => {}} variant="secondary" />
        <div className="flex justify-center">
          <button onClick={() => { resetTo('home'); setTab('home') }} className="text-[13px]" style={{ color: T.muted }}>На головну</button>
        </div>
      </div>
    </div>
  )
}

// ─── My Books & Profile ───────────────────────────────────────────────────────
function MyBooksScreen() {
  const { navigate, setSelectedAlbum, setActiveOrder } = useApp()
  const [filter, setFilter] = useState<'all' | 'drafts' | 'orders'>('all')
  const labels = { all: 'Всі', drafts: 'Чернетки', orders: 'Замовлення' }
  const books = RECENT_BOOKS.filter(b => filter === 'drafts' ? b.status === 'draft' : filter === 'orders' ? b.status !== 'draft' : true)

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[28px]" style={{ fontFamily: T.serif, color: T.text }}>Мої книги</h1>
        <div className="flex gap-2 mt-4">
          {(['all', 'drafts', 'orders'] as const).map(f => (
            <Pill key={f} label={labels[f]} active={filter === f} onClick={() => setFilter(f)} />
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-[15px]" style={{ color: T.muted }}>Поки що немає {labels[filter].toLowerCase()}</p>
          </div>
        ) : books.map((book, i) => {
          const colorHex = COVER_COLORS['navy'].hex
          return (
            <div key={book.id}>
              {i > 0 && <Divider />}
              <button onClick={() => {
                if (book.status === 'draft') { setSelectedAlbum(book.albumId); navigate('book-editor') }
                else { setActiveOrder(book.id); navigate('order-details') }
              }} className="flex items-center gap-3 w-full py-3.5 active:opacity-60">
                <BookCover photo={book.coverPhoto} title={book.title} colorHex={colorHex} uiSize="xs" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[14px] font-medium truncate" style={{ color: T.text }}>{book.title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: T.muted }}>{book.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={book.status} />
                  <ChevRight />
                </div>
              </button>
            </div>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}

function OrderDetailsScreen() {
  const { activeOrderId, coverColor, coverTitle, goBack, navigate, setSelectedAlbum } = useApp()
  const book = RECENT_BOOKS.find(b => b.id === activeOrderId) || RECENT_BOOKS[1]
  const a = ALBUMS[book.albumId]
  const colorHex = COVER_COLORS[coverColor].hex
  const title = coverTitle || book.title
  const isPdf = book.status === 'pdf'

  const steps = [
    { label: 'Замовлення оформлено', done: true, date: book.date },
    { label: 'Друк', done: true, date: '17 серп.' },
    { label: 'Відправлено', done: book.status === 'ordered', date: book.status === 'ordered' ? '20 серп.' : '' },
    { label: 'Доставлено', done: false, date: book.estimatedDelivery || '' },
  ]

  return (
    <div className="h-full flex flex-col bg-white screen-slide-in">
      <TopBar title="Деталі замовлення" onBack={goBack} />
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4">
        {/* Book summary with physical cover */}
        <div className="flex items-center gap-4 p-4 rounded-2xl mb-5" style={{ background: T.surface }}>
          <BookCover photo={a.coverPhoto} title={title} colorHex={colorHex} uiSize="xs" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: T.text }}>{title}</p>
            <p className="text-[13px] mt-0.5" style={{ color: T.muted }}>Замовлення #{book.orderId || 'M-10391'}</p>
            <div className="mt-1"><StatusBadge status={book.status} /></div>
          </div>
        </div>

        {isPdf ? (
          /* PDF order — no tracking, just confirmation + paid amount */
          <div className="p-4 rounded-2xl space-y-3" style={{ background: T.surface }}>
            <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: T.border }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: T.accentLight }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v10M6.5 9.5L10 13l3.5-3.5" stroke={T.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 16h12" stroke={T.accent} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: T.text }}>Замовлення оформлено</p>
                <p className="text-[12px]" style={{ color: T.muted }}>{book.date}</p>
              </div>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[13px]" style={{ color: T.muted }}>Цифровий PDF</span>
              <span className="text-[13px]" style={{ color: T.text }}>32 сторінки</span>
            </div>
            <Divider />
            <div className="flex justify-between">
              <span className="text-[14px] font-semibold" style={{ color: T.text }}>Сплачено</span>
              <span className="text-[14px] font-semibold" style={{ color: T.text }}>₴299</span>
            </div>
          </div>
        ) : (
          <>
            {/* Print order — progress tracker + shipping details */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: T.muted }}>Виробництво та доставка</p>
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: step.done ? T.accent : T.surface, border: `2px solid ${step.done ? T.accent : T.border}` }}>
                      {step.done && <CheckIco />}
                    </div>
                    {i < steps.length - 1 && <div className="w-0.5 h-8 mt-1" style={{ background: step.done ? T.accent : T.border }} />}
                  </div>
                  <div className="pb-4">
                    <p className="text-[14px] font-medium" style={{ color: step.done ? T.text : T.muted }}>{step.label}</p>
                    {step.date && <p className="text-[12px]" style={{ color: T.muted }}>{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl space-y-2" style={{ background: T.surface }}>
              {[{ label: 'Очікувана доставка', val: book.estimatedDelivery || '3–5 вер.' }, { label: 'Адреса доставки', val: 'Львів, Нова Пошта №12' }].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-[13px]" style={{ color: T.muted }}>{row.label}</span>
                  <span className="text-[13px] font-medium" style={{ color: T.text }}>{row.val}</span>
                </div>
              ))}
              <Divider />
              <div className="flex justify-between">
                <span className="text-[14px] font-semibold" style={{ color: T.text }}>Всього сплачено</span>
                <span className="text-[14px] font-semibold" style={{ color: T.text }}>₴1 388</span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="px-5 pb-10 pt-3 border-t" style={{ borderColor: T.border }}>
        {isPdf ? (
          <Btn label="Завантажити PDF" onClick={() => {}} />
        ) : (
          <div className="space-y-3">
            <Btn label="Відстежити посилку" onClick={() => {}} />
            <Btn label="Замовити ще одну копію" onClick={() => { setSelectedAlbum(book.albumId); navigate('print-config') }} variant="secondary" />
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileScreen() {
  const { resetTo } = useApp()
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 pt-14 pb-6" style={{ background: T.surface }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2" style={{ borderColor: T.accentLight }}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[18px] font-medium" style={{ color: T.text }}>Анна Коваленко</p>
            <p className="text-[13px]" style={{ color: T.muted }}>anna@example.com</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-5">
        {[
          { title: 'Акаунт', items: ['Редагувати профіль', 'Змінити пароль'] },
          { title: 'Додаток', items: ['Доступ до фото', 'Сповіщення', 'Мова'] },
          { title: 'Покупки', items: ['Замовлення', 'Методи оплати'] },
          { title: 'Підтримка', items: ['Допомога та FAQ', 'Конфіденційність', 'Умови використання'] },
        ].map(section => (
          <div key={section.title}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: T.muted }}>{section.title}</p>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: T.border }}>
              {section.items.map((item, i) => (
                <div key={item}>
                  {i > 0 && <div className="h-px mx-4" style={{ background: T.border }} />}
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-[14px]" style={{ color: T.text }}>{item}</span>
                    <ChevRight />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Btn label="Вийти" onClick={() => resetTo('welcome')} variant="danger" />
      </div>
      <BottomNav />
    </div>
  )
}

// ─── Status bar ───────────────────────────────────────────────────────────────
function StatusBar({ darkBg }: { darkBg?: boolean }) {
  const c = darkBg ? 'rgba(255,255,255,0.85)' : T.text
  return (
    <div className="absolute top-0 left-0 right-0 z-50 h-11 flex items-center justify-between px-7 pointer-events-none">
      <span className="text-[13px] font-semibold" style={{ color: c }}>9:41</span>
      <div className="w-[120px] h-[34px] bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-0" />
      <div className="flex items-center gap-1.5">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          {[1,3,5,7].map((x,i)=><rect key={x} x={x*2} y={12-(i+1)*3} width="2" height={(i+1)*3} rx="0.5" fill={c} opacity={i<3?1:0.3}/>)}
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1 1 0 100 2 1 1 0 000-2z" fill={c}/>
          <path d="M5.2 7a4 4 0 015.6 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2.8 4.6a7 7 0 0110.4 0" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={c}/>
          <rect x="2" y="2" width="15" height="8" rx="2" fill={c}/>
          <path d="M23 4.5v3a1.5 1.5 0 000-3z" fill={c} opacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export interface AppInitialState {
  screen?: Screen
  tab?: Tab
  selectedAlbumId?: AlbumId
  bookSize?: BookSize
  coverColor?: CoverColor
  selectedDesign?: DesignVariant
  showCreateMenu?: boolean
  showLayoutSheet?: boolean
  showTextSheet?: boolean
  activeOrderId?: string | null
  aiQuery?: string
  carrier?: Carrier
  exportMode?: boolean
  exportFrameHeight?: number
  shippingInitStep?: 'carrier' | 'details'
}

export default function App({ init }: { init?: AppInitialState } = {}) {
  const exportMode = init?.exportMode ?? false
  const exportFrameHeight = init?.exportFrameHeight ?? 1500
  const [stack, setStack] = useState<Screen[]>([init?.screen ?? 'welcome'])
  const [tab, setTab] = useState<Tab>(init?.tab ?? 'home')
  const [selectedAlbumId, setSelectedAlbumId] = useState<AlbumId>(init?.selectedAlbumId ?? 'italy-2026')
  const [bookSize, setBookSize] = useState<BookSize>(init?.bookSize ?? 'medium')
  const [selectedDesign, setSelectedDesign] = useState<DesignVariant>(init?.selectedDesign ?? 1)
  const [coverColor, setCoverColor] = useState<CoverColor>(init?.coverColor ?? 'navy')
  const [coverTitle, setCoverTitle] = useState('')
  const [coverSubtitle, setCoverSubtitle] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [aiQuery, setAiQuery] = useState(init?.aiQuery ?? '')
  const [aiPhotos, setAiPhotos] = useState<Photo[]>(init?.aiQuery ? italyPhotos.slice(0, 6) : [])
  const [cropPhotoId, setCropPhotoId] = useState<string | null>(null)
  const [showLayoutSheet, setShowLayoutSheet] = useState(init?.showLayoutSheet ?? false)
  const [showTextSheet, setShowTextSheet] = useState(init?.showTextSheet ?? false)
  const [showCreateMenu, setShowCreateMenu] = useState(init?.showCreateMenu ?? false)
  const [activeOrderId, setActiveOrder] = useState<string | null>(init?.activeOrderId ?? null)
  const [purchaseType, setPurchaseType] = useState<'print' | 'pdf'>('print')
  const [carrier, setCarrier] = useState<Carrier>(init?.carrier ?? 'nova-poshta')
  const [deliveryType, setDeliveryType] = useState<'branch' | 'parcel-locker'>('branch')
  const [currentEditorPage, setEditorPage] = useState(0)

  const navigate = (s: Screen) => setStack(p => [...p, s])
  const goBack = () => setStack(p => p.length > 1 ? p.slice(0, -1) : p)
  const resetTo = (s: Screen) => setStack([s])

  // When user selects a design, sync the cover color
  const setSelectedDesignAndColor = (d: DesignVariant) => {
    setSelectedDesign(d)
    setCoverColor(DESIGN_VARIANT_COLORS[d])
  }

  const ctx: AppCtx = {
    stack, tab, selectedAlbumId, bookSize, selectedDesign, coverColor, coverTitle,
    coverSubtitle, quantity, aiQuery, aiPhotos, cropPhotoId, showLayoutSheet,
    showTextSheet, showCreateMenu, activeOrderId, purchaseType, carrier,
    deliveryType, currentEditorPage, exportMode, shippingInitStep: init?.shippingInitStep,
    navigate, goBack, resetTo, setTab,
    setSelectedAlbum: (id) => { setSelectedAlbumId(id); setCoverTitle(''); setCoverSubtitle('') },
    setBookSize, setSelectedDesign: setSelectedDesignAndColor,
    setCoverColor, setCoverTitle, setCoverSubtitle, setQuantity,
    setAiQuery, setAiPhotos, setCropPhoto: setCropPhotoId,
    setShowLayoutSheet, setShowTextSheet, setShowCreateMenu,
    setActiveOrder, setPurchaseType, setCarrier, setDeliveryType, setEditorPage,
  }

  const current = stack[stack.length - 1]
  const darkBg = new Set<Screen>(['welcome', 'preview-mode', 'crop-photo'])

  // Unused import suppression
  void ContextBookCover

  const screenMap: Record<Screen, ReactNode> = {
    welcome:            <WelcomeScreen />,
    register:           <RegisterScreen />,
    'photo-permission': <PhotoPermissionScreen />,
    'photo-analysis':   <PhotoAnalysisScreen />,
    home:               <HomeScreen />,
    'my-books':         <MyBooksScreen />,
    profile:            <ProfileScreen />,
    'album-preview':    <AlbumPreviewScreen />,
    'review-photos':    <ReviewPhotosScreen />,
    'add-photos':       <AddPhotosScreen />,
    'crop-photo':       <CropPhotoScreen />,
    'ai-search':        <AISearchScreen />,
    'ai-results':       <AIResultsScreen />,
    'manual-gallery':   <ManualGalleryScreen />,
    'book-size':        <BookSizeScreen />,
    'ai-generation':    <AIGenerationScreen />,
    'design-selection': <DesignSelectionScreen />,
    'cover-selection':  <CoverSelectionScreen />,
    'book-editor':      <BookEditorScreen />,
    'book-overview':    <BookOverviewScreen />,
    'preview-mode':     <PreviewModeScreen />,
    'product-summary':  <ProductSummaryScreen />,
    'print-config':     <PrintConfigScreen />,
    shipping:           <ShippingScreen />,
    payment:            <PaymentScreen />,
    'order-confirmation':<OrderConfirmationScreen />,
    'pdf-purchase':     <PDFPurchaseScreen />,
    'pdf-success':      <PDFSuccessScreen />,
    'order-details':    <OrderDetailsScreen />,
  }

  if (exportMode) return (
    <Ctx.Provider value={ctx}>
      <div style={{ width: 390, height: exportFrameHeight, position: 'relative', background: 'white' }}>
        <div key={current} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {screenMap[current]}
        </div>
      </div>
    </Ctx.Provider>
  )

  return (
    <Ctx.Provider value={ctx}>
      <div className="min-h-screen flex items-start justify-center md:py-8" style={{ background: '#1C1C1E' }}>
        <div className="relative overflow-hidden bg-white"
          style={{ width: 390, height: 844, borderRadius: 44,
            boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(0,0,0,0.3)' }}>
          <StatusBar darkBg={darkBg.has(current)} />
          <div key={current} className="absolute inset-0 overflow-hidden screen-slide-in">
            {screenMap[current]}
          </div>
        </div>
      </div>
    </Ctx.Provider>
  )
}
