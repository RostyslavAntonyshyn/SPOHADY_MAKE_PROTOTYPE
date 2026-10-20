import { ReactNode } from 'react'
import App, { AppInitialState } from './App'

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 390

// Frame heights — screens with lots of scrollable content need tall frames;
// sheet overlays and fixed-layout screens use phone-height frames so sheets
// appear at the correct position within the viewport.
const H_PHONE  = 844   // fixed viewport screens and all sheet/overlay states
const H_TALL   = 1500  // scrollable-content screens (forms, lists, editor)

const noAnim = `
  *, *::before, *::after {
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
  }
`

// ─── Frame ────────────────────────────────────────────────────────────────────
interface FrameProps {
  name: string
  init: AppInitialState
  h?: number
}

function Frame({ name, init, h = H_TALL }: FrameProps) {
  const fullInit: AppInitialState = { exportMode: true, exportFrameHeight: h, ...init }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
      <p style={{
        fontSize: 10, fontWeight: 700, color: '#777', letterSpacing: '0.08em',
        textTransform: 'uppercase', margin: 0, lineHeight: 1,
        fontFamily: 'system-ui, sans-serif',
      }}>
        {name}
      </p>
      <div style={{
        width: W,
        height: h,
        overflow: 'hidden',
        border: '1px solid #E2E2E0',
        borderRadius: 4,
        position: 'relative',
        background: 'white',
        flexShrink: 0,
      }}>
        <App init={fullInit} />
      </div>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
        paddingBottom: 12, borderBottom: '2px solid #1C1F23',
      }}>
        <h2 style={{
          fontSize: 12, fontWeight: 700, color: '#1C1F23',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          margin: 0, fontFamily: 'system-ui, sans-serif',
        }}>
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  )
}

// ─── Design Export page ───────────────────────────────────────────────────────
export default function DesignExport() {
  return (
    <div style={{
      background: '#F5F4F0',
      minHeight: '100vh',
      padding: '48px 56px 96px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <style>{noAnim}</style>

      {/* Header */}
      <div style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF6B57', flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1C1F23' }}>
            SPOHADY
          </span>
          <span style={{ fontSize: 14, color: '#AAA', marginLeft: 8 }}>
            Design Export — усі екрани у повну висоту
          </span>
        </div>
        <p style={{ fontSize: 11, color: '#999', margin: 0, lineHeight: 1.6 }}>
          Всі мобільні екрани у натуральному розмірі 390px · Скролений вміст повністю розгорнуто · Анімації вимкнено
          {' · '}
          <a href="/" style={{ color: '#FF6B57', textDecoration: 'none' }}>← Повернутись до застосунку</a>
          {' · '}
          <a href="/design-reference" style={{ color: '#FF6B57', textDecoration: 'none' }}>→ Зменшений перегляд</a>
        </p>
      </div>

      {/* ── Онбординг ── */}
      <Section title="Онбординг">
        <Frame name="1 · Welcome" h={H_PHONE}
          init={{ screen: 'welcome' }} />
        <Frame name="2 · Реєстрація — вибір методу"
          init={{ screen: 'register' }} />
        <Frame name="3 · Доступ до фото"
          init={{ screen: 'photo-permission' }} />
        <Frame name="4 · Аналіз фото (в процесі)" h={H_PHONE}
          init={{ screen: 'photo-analysis' }} />
      </Section>

      {/* ── Головна навігація ── */}
      <Section title="Головна навігація">
        <Frame name="5 · Головна"
          init={{ screen: 'home' }} />
        <Frame name="6 · Головна — меню «Створити»" h={H_PHONE}
          init={{ screen: 'home', showCreateMenu: true }} />
        <Frame name="7 · Мої книги — всі"
          init={{ screen: 'my-books', tab: 'my-books' }} />
        <Frame name="8 · Профіль"
          init={{ screen: 'profile', tab: 'profile' }} />
      </Section>

      {/* ── Перегляд альбому ── */}
      <Section title="Перегляд альбому">
        <Frame name="9 · Перегляд — Італія 2026"
          init={{ screen: 'album-preview', selectedAlbumId: 'italy-2026' }} />
        <Frame name="10 · Перегляд — Карпати 2025"
          init={{ screen: 'album-preview', selectedAlbumId: 'carpathians' }} />
        <Frame name="11 · Перегляд фото"
          init={{ screen: 'review-photos', selectedAlbumId: 'italy-2026' }} />
        <Frame name="12 · Додати фото"
          init={{ screen: 'add-photos' }} />
        <Frame name="13 · Обрізати фото" h={H_PHONE}
          init={{ screen: 'crop-photo' }} />
      </Section>

      {/* ── AI пошук і вибір ── */}
      <Section title="AI пошук і ручний вибір">
        <Frame name="14 · AI-пошук (порожній)"
          init={{ screen: 'ai-search' }} />
        <Frame name="15 · AI-результати — Карпати"
          init={{ screen: 'ai-results', aiQuery: 'Карпати' }} />
        <Frame name="16 · Ручний вибір"
          init={{ screen: 'manual-gallery' }} />
      </Section>

      {/* ── Налаштування книги ── */}
      <Section title="Налаштування книги">
        <Frame name="17 · Розмір книги"
          init={{ screen: 'book-size' }} />
        <Frame name="18 · Генерація AI (в процесі)" h={H_PHONE}
          init={{ screen: 'ai-generation' }} />
        <Frame name="19 · Вибір дизайну"
          init={{ screen: 'design-selection' }} />
        <Frame name="20 · Обкладинка — темно-синя"
          init={{ screen: 'cover-selection', coverColor: 'navy' }} />
        <Frame name="21 · Обкладинка — пісочна"
          init={{ screen: 'cover-selection', coverColor: 'sand' }} />
        <Frame name="22 · Обкладинка — коралова"
          init={{ screen: 'cover-selection', coverColor: 'coral' }} />
        <Frame name="23 · Обкладинка — чорна"
          init={{ screen: 'cover-selection', coverColor: 'black' }} />
      </Section>

      {/* ── Редактор ── */}
      <Section title="Редактор книги">
        <Frame name="24 · Редактор — спреди" h={1700}
          init={{ screen: 'book-editor' }} />
        <Frame name="25 · Редактор — аркуш макетів" h={H_PHONE}
          init={{ screen: 'book-editor', showLayoutSheet: true }} />
        <Frame name="26 · Редактор — аркуш тексту" h={H_PHONE}
          init={{ screen: 'book-editor', showTextSheet: true }} />
        <Frame name="27 · Огляд сторінок"
          init={{ screen: 'book-overview' }} />
        <Frame name="28 · Перегляд — обкладинка" h={H_PHONE}
          init={{ screen: 'preview-mode' }} />
      </Section>

      {/* ── Оформлення замовлення — друк ── */}
      <Section title="Оформлення замовлення — друк">
        <Frame name="29 · Підсумок продукту"
          init={{ screen: 'product-summary' }} />
        <Frame name="30 · Конфігурація друку"
          init={{ screen: 'print-config' }} />
        <Frame name="31 · Доставка — вибір перевізника"
          init={{ screen: 'shipping' }} />
        <Frame name="32 · Доставка — Нова Пошта (деталі)"
          init={{ screen: 'shipping', carrier: 'nova-poshta', shippingInitStep: 'details' }} />
        <Frame name="33 · Доставка — Укрпошта (деталі)"
          init={{ screen: 'shipping', carrier: 'ukrposhta', shippingInitStep: 'details' }} />
        <Frame name="34 · Оплата — Google Pay"
          init={{ screen: 'payment', carrier: 'nova-poshta' }} />
        <Frame name="35 · Оплата — картка" h={1300}
          init={{ screen: 'payment', carrier: 'nova-poshta' }} />
        <Frame name="36 · Підтвердження замовлення"
          init={{ screen: 'order-confirmation' }} />
      </Section>

      {/* ── PDF ── */}
      <Section title="PDF">
        <Frame name="37 · Купити PDF"
          init={{ screen: 'pdf-purchase' }} />
        <Frame name="38 · PDF готовий"
          init={{ screen: 'pdf-success' }} />
      </Section>

      {/* ── Деталі замовлення ── */}
      <Section title="Деталі замовлення">
        <Frame name="39 · Деталі — друкований"
          init={{ screen: 'order-details', activeOrderId: 'rb2' }} />
        <Frame name="40 · Деталі — PDF"
          init={{ screen: 'order-details', activeOrderId: 'rb3' }} />
      </Section>

      <p style={{ marginTop: 48, fontSize: 11, color: '#CCC', textAlign: 'center' }}>
        SPOHADY Design Export · {new Date().toLocaleDateString('uk-UA')} · Тільки для внутрішнього використання
      </p>
    </div>
  )
}
