// ============================================================
// BarePlate UI Kit — shared primitives
// ============================================================
const { useState, useEffect, useRef } = React;

// --- Icon: thin Lucide line icons rendered as real React SVG (no DOM mutation). ---
function toPascal(name) {
  return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}
function Icon({ name, size = 22, color, strokeWidth = 1.75, fill, style }) {
  const map = (window.lucide && window.lucide.icons) || {};
  let node = map[toPascal(name)];
  // lucide variants: node may be [[tag,attrs],...] OR { node:[...] }
  if (node && !Array.isArray(node) && node.node) node = node.node;
  const kids = Array.isArray(node)
    ? node.filter(c => Array.isArray(c)).map((c, i) => React.createElement(c[0], { key: i, ...c[1] }))
    : null;
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: fill || 'none', stroke: 'currentColor', strokeWidth,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { color: color || 'inherit', display: 'inline-block', flex: '0 0 auto', ...style }
  }, kids);
}

// --- iOS status bar ---
function StatusBar({ dark }) {
  const col = dark ? '#F5F2EC' : '#1C1A17';
  return (
    <div className="bp-statusbar" style={{ color: col }}>
      <span className="bp-time">9:41</span>
      <div className="bp-status-right">
        <Icon name="signal" size={17} strokeWidth={2.2} />
        <Icon name="wifi" size={17} strokeWidth={2.2} />
        <Icon name="battery-full" size={20} strokeWidth={2} />
      </div>
    </div>
  );
}

// --- Bottom tab bar ---
function TabBar({ active, onChange, faded }) {
  const tabs = [
    { id: 'recipes', label: 'My Recipes', icon: 'notebook-text' },
    { id: 'grocery', label: 'Grocery List', icon: 'shopping-basket' },
    { id: 'profile', label: 'Settings', icon: 'settings' },
  ];
  return (
    <div className="bp-tabbar" style={{ opacity: faded ? 0.04 : 1, pointerEvents: faded ? 'none' : 'auto' }}>
      {tabs.map(t => (
        <button key={t.id} className={'bp-tab' + (active === t.id ? ' active' : '')} onClick={() => onChange(t.id)}>
          <Icon name={t.icon} size={24} strokeWidth={active === t.id ? 2 : 1.75} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// --- The floating "+ Add a Recipe" pill (or any pinned CTA) ---
function PinnedCTA({ children, onClick, icon }) {
  return (
    <div className="bp-cta-wrap">
      <button className="bp-cta" onClick={onClick}>
        {icon && <Icon name={icon} size={20} strokeWidth={2.2} />}
        {children}
      </button>
    </div>
  );
}

// --- Phone frame: scales to fit its container, letterboxed ---
function PhoneFrame({ children, theme, mode, readScale }) {
  return (
    <div className="bp-phone" data-theme={theme} data-mode={mode} style={{ '--read-scale': readScale || 1 }}>
      <div className="bp-notch"></div>
      <div className="bp-screen">{children}</div>
      <div className="bp-homebar-wrap"><div className="bp-homebar"></div></div>
    </div>
  );
}

// --- Generic top nav bar for a screen ---
function NavBar({ title, left, right, large }) {
  return (
    <div className={'bp-nav' + (large ? ' large' : '')}>
      <div className="bp-nav-side left">{left}</div>
      {!large && <div className="bp-nav-title">{title}</div>}
      <div className="bp-nav-side right">{right}</div>
    </div>
  );
}

function IconButton({ name, onClick, color, badge }) {
  return (
    <button className="bp-iconbtn" onClick={onClick}>
      <Icon name={name} size={22} color={color} />
    </button>
  );
}

// --- Star rating (display) ---
function Stars({ value, size = 16 }) {
  return (
    <span className="bp-stars">
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name="star" size={size} strokeWidth={1.75}
          color={i <= value ? 'var(--accent)' : 'var(--fg3)'}
          fill={i <= value ? 'var(--accent)' : 'none'} />
      ))}
    </span>
  );
}

// --- Bottom sheet shell ---
function Sheet({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="bp-scrim" onClick={onClose}>
      <div className="bp-sheet" onClick={e => e.stopPropagation()}>
        <div className="bp-sheet-grip"></div>
        {title && <div className="bp-sheet-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, StatusBar, TabBar, PinnedCTA, PhoneFrame, NavBar, IconButton, Stars, Sheet });
