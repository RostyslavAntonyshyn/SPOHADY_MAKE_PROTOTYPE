import App, { AppInitialState } from './App'

// ─── Scale each 390×844 frame down for grid display ──────────────────────────
const SCALE = 0.36
const W = Math.round(390 * SCALE)  // 140px
const H = Math.round(844 * SCALE)  // 304px

function Frame({ name, init }: { name: string; init?: AppInitialState }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: '#888', letterSpacing: '0.07em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>
        {name}
      </p>
      <div style={{ width: W, height: H, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', flexShrink: 0, position: 'relative' }}>
        <div style={{ width: 390, height: 844, transform: `scale(${SCALE})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
          <App init={init} />
        </div>
      </div>
    </div>
  )
}

// ─── Section grouping ─────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: 11, fontWeight: 700, color: '#1C1F23', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid #E8E8E6' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {children}
      </div>
    </section>
  )
}

// ─── Design Reference page ────────────────────────────────────────────────────
export default function DesignReference() {
  return (
    <div style={{ background: '#F2F2EF', minHeight: '100vh', padding: '40px 48px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF6B57' }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1C1F23' }}>SPOHADY</span>
          <span style={{ fontSize: 13, color: '#AAA', marginLeft: 8 }}>Design Reference — всі екрани</span>
        </div>
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
          Тільки для дизайн-хендофу. Не впливає на роботу застосунку.
          {' · '}Масштаб {Math.round(SCALE * 100)}%
          {' · '}
          <a href="/" style={{ color: '#FF6B57' }}>← Повернутись до застосунку</a>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>

        {/* ── Onboarding ── */}
        <Section title="Онбординг">
          <Frame name="1. Welcome" init={{ screen: 'welcome' }} />
          <Frame name="2. Реєстрація" init={{ screen: 'register' }} />
          <Frame name="3. Доступ до фото" init={{ screen: 'photo-permission' }} />
          <Frame name="4. Аналіз фото" init={{ screen: 'photo-analysis' }} />
        </Section>

        {/* ── Main tabs ── */}
        <Section title="Головна навігація">
          <Frame name="5. Головна" init={{ screen: 'home' }} />
          <Frame name="6. Головна — меню «Створити»" init={{ screen: 'home', showCreateMenu: true }} />
          <Frame name="7. Мої книги" init={{ screen: 'my-books', tab: 'my-books' }} />
          <Frame name="8. Профіль" init={{ screen: 'profile', tab: 'profile' }} />
        </Section>

        {/* ── Album flow ── */}
        <Section title="Перегляд альбому">
          <Frame name="9. Перегляд альбому" init={{ screen: 'album-preview' }} />
          <Frame name="10. Перегляд фото" init={{ screen: 'review-photos' }} />
          <Frame name="11. Додати фото" init={{ screen: 'add-photos' }} />
          <Frame name="12. Обрізати фото" init={{ screen: 'crop-photo' }} />
        </Section>

        {/* ── AI creation ── */}
        <Section title="Пошук та ручний вибір">
          <Frame name="13. AI-пошук" init={{ screen: 'ai-search' }} />
          <Frame name="14. AI-результати" init={{ screen: 'ai-results', aiQuery: 'Карпати' }} />
          <Frame name="15. Ручний вибір" init={{ screen: 'manual-gallery' }} />
        </Section>

        {/* ── Book production ── */}
        <Section title="Налаштування книги">
          <Frame name="16. Розмір книги" init={{ screen: 'book-size' }} />
          <Frame name="17. Генерація AI" init={{ screen: 'ai-generation' }} />
          <Frame name="18. Вибір дизайну" init={{ screen: 'design-selection' }} />
          <Frame name="19. Обкладинка" init={{ screen: 'cover-selection' }} />
          <Frame name="20. Обкладинка — пісок" init={{ screen: 'cover-selection', coverColor: 'sand' }} />
          <Frame name="21. Обкладинка — корал" init={{ screen: 'cover-selection', coverColor: 'coral' }} />
        </Section>

        {/* ── Book editor ── */}
        <Section title="Редактор книги">
          <Frame name="22. Редактор" init={{ screen: 'book-editor' }} />
          <Frame name="23. Редактор — аркуш макетів" init={{ screen: 'book-editor', showLayoutSheet: true }} />
          <Frame name="24. Редактор — аркуш тексту" init={{ screen: 'book-editor', showTextSheet: true }} />
          <Frame name="25. Огляд сторінок" init={{ screen: 'book-overview' }} />
          <Frame name="26. Перегляд — обкладинка" init={{ screen: 'preview-mode' }} />
        </Section>

        {/* ── Checkout — print ── */}
        <Section title="Оформлення замовлення (друк)">
          <Frame name="27. Підсумок продукту" init={{ screen: 'product-summary' }} />
          <Frame name="28. Конфігурація друку" init={{ screen: 'print-config' }} />
          <Frame name="29. Доставка — вибір перевізника" init={{ screen: 'shipping' }} />
          <Frame name="30. Доставка — Нова Пошта" init={{ screen: 'shipping', carrier: 'nova-poshta' }} />
          <Frame name="31. Доставка — Укрпошта" init={{ screen: 'shipping', carrier: 'ukrposhta' }} />
          <Frame name="32. Оплата" init={{ screen: 'payment' }} />
          <Frame name="33. Підтвердження замовлення" init={{ screen: 'order-confirmation' }} />
        </Section>

        {/* ── PDF ── */}
        <Section title="PDF">
          <Frame name="34. Купити PDF" init={{ screen: 'pdf-purchase' }} />
          <Frame name="35. PDF готовий" init={{ screen: 'pdf-success' }} />
        </Section>

        {/* ── Order details ── */}
        <Section title="Деталі замовлення">
          <Frame name="36. Деталі — друк" init={{ screen: 'order-details', activeOrderId: 'rb2' }} />
          <Frame name="37. Деталі — PDF" init={{ screen: 'order-details', activeOrderId: 'rb3' }} />
        </Section>

      </div>

      <p style={{ marginTop: 64, fontSize: 11, color: '#CCC', textAlign: 'center' }}>
        SPOHADY Design Reference · {new Date().toLocaleDateString('uk-UA')}
      </p>
    </div>
  )
}
