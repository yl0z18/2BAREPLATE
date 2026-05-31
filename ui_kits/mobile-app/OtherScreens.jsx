// ============================================================
// BarePlate UI Kit — Grocery, Profile, Add flow, states
// ============================================================

// Common measurement units for the manual grocery-add dropdown
const GROC_UNITS = [
  { id: 'none', label: 'Unit' },
  { id: 'g', label: 'g' }, { id: 'kg', label: 'kg' },
  { id: 'ml', label: 'ml' }, { id: 'L', label: 'L' },
  { id: 'oz', label: 'oz' }, { id: 'lb', label: 'lb' },
  { id: 'cups', label: 'cups' }, { id: 'tbsp', label: 'tbsp' }, { id: 'tsp', label: 'tsp' },
  { id: 'cloves', label: 'cloves' }, { id: 'pcs', label: 'pcs' },
  { id: 'bunch', label: 'bunch' }, { id: 'head', label: 'head' },
  { id: 'can', label: 'can' }, { id: 'bottle', label: 'bottle' },
  { id: 'pack', label: 'pack' }, { id: 'jar', label: 'jar' },
  { id: 'other', label: 'Other…' },
];

function GroceryRow({ item, onToggle, onDelete, onEdit }) {
  const REVEAL = 84;
  const [dx, setDx] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAmt, setEditAmt] = useState('');
  const startX = useRef(null);
  const base = useRef(0);
  const moved = useRef(false);

  const begin = (x) => { startX.current = x; moved.current = false; };
  const move = (x) => {
    if (startX.current == null) return;
    if (Math.abs(x - startX.current) > 6) moved.current = true;
    let d = base.current + (x - startX.current);
    setDx(Math.max(-REVEAL, Math.min(0, d)));
  };
  const end = () => {
    if (startX.current == null) return;
    const open = dx < -REVEAL / 2;
    base.current = open ? -REVEAL : 0;
    setDx(base.current);
    startX.current = null;
  };
  const click = () => {
    if (moved.current) return;
    if (base.current < 0) { base.current = 0; setDx(0); return; }
    onToggle();
  };
  const startEdit = (e) => {
    e.stopPropagation();
    setEditName(item.name);
    setEditAmt(item.amt || '');
    setEditing(true);
  };
  const saveEdit = () => {
    if (editName.trim()) { onEdit(editName.trim(), editAmt.trim()); setEditing(false); }
  };

  if (editing) {
    return (
      <div className="bp-groc-edit-card">
        <input className="bp-groc-add-name" value={editName} autoFocus
          onChange={e => setEditName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }} />
        <div className="bp-groc-edit-row">
          <input className="bp-groc-add-amt" placeholder="Amount" value={editAmt}
            onChange={e => setEditAmt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); }} />
          <button className="bp-groc-add-go" onClick={saveEdit} disabled={!editName.trim()}>
            <Icon name="check" size={16} strokeWidth={2.6} color="var(--on-accent)" />Save
          </button>
          <button className="bp-groc-edit-cancel" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bp-groc-swipe">
      <button className="bp-groc-del" tabIndex={-1} aria-label={'Delete ' + item.name} onClick={onDelete}
        style={{ opacity: dx < 0 ? 1 : 0, transition: startX.current == null ? 'opacity 0.2s' : 'none' }}>
        <Icon name="trash-2" size={20} strokeWidth={2} color="#fff" />
      </button>
      <div
        className={'bp-groc-row' + (item.checked ? ' checked' : '')}
        style={{ transform: `translateX(${dx}px)`, transition: startX.current == null ? 'transform 0.22s cubic-bezier(0.22,0.61,0.36,1)' : 'none' }}
        onClick={click}
        onTouchStart={e => begin(e.touches[0].clientX)}
        onTouchMove={e => move(e.touches[0].clientX)}
        onTouchEnd={end}
        onMouseDown={e => begin(e.clientX)}
        onMouseMove={e => { if (startX.current != null) move(e.clientX); }}
        onMouseUp={end}
        onMouseLeave={() => { if (startX.current != null) end(); }}>
        <span className={'bp-check' + (item.checked ? ' on' : '')}>{item.checked && <Icon name="check" size={14} strokeWidth={3} color="var(--on-accent)" />}</span>
        <span className="bp-groc-name">{item.name}</span>
        <span className="bp-groc-amt">{item.amt}</span>
        <span className="bp-groc-src">{item.src}</span>
        <button className="bp-groc-edit-btn" onClick={startEdit} aria-label={'Edit ' + item.name} tabIndex={-1}>
          <Icon name="pencil" size={14} strokeWidth={2.2} color="var(--fg3)" />
        </button>
      </div>
    </div>
  );
}

function GroceryHome({ lists, onOpen, onNew, onDeleteLists }) {
  const [manage, setManage] = useState(false);
  const [picked, setPicked] = useState(() => new Set());

  const exitManage = () => { setManage(false); setPicked(new Set()); };
  const togglePick = (id) => setPicked(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const runDelete = () => {
    if (onDeleteLists) onDeleteLists([...picked]);
    exitManage();
  };

  return (
    <div className="bp-screen-inner" data-screen-label="Grocery">
      <NavBar large
        left={manage ? <button className="bp-link bp-nav-modebtn" onClick={exitManage}>Cancel</button> : null}
        right={manage ? null : (
          <div className="bp-nav-actions">
            {lists.length > 0 && <IconButton name="list-checks" onClick={() => setManage(true)} />}
            <IconButton name="plus" onClick={onNew} />
          </div>
        )}
      />
      <div className="bp-screen-pad">
        <h1 className="bp-h1 bp-screen-title">Grocery</h1>
        <div className="bp-subrow">
          <span className="bp-subrow-count">
            {manage ? (picked.size > 0 ? `${picked.size} selected` : 'Select lists to delete') : `${lists.length} ${lists.length === 1 ? 'list' : 'lists'}`}
          </span>
        </div>
        {lists.length === 0
          ? <div className="bp-coll-empty">
              <div className="bp-coll-tile big"><Icon name="shopping-basket" size={30} strokeWidth={1.8} color="var(--accent-deep)" /></div>
              <div className="bp-empty-title">No lists yet</div>
              <div className="bp-empty-sub">Create a grocery list to get started.</div>
            </div>
          : <div className="bp-recipe-list">
              {lists.map(l => {
                const count = l.groups.reduce((n, g) => n + g.items.length, 0);
                return (
                  <button key={l.id} 
                    className={'bp-recipe-card' + (manage && picked.has(l.id) ? ' picked' : '')} 
                    onClick={() => manage ? togglePick(l.id) : onOpen(l)}>
                    {manage &&
                      <span className={'bp-pick-box' + (picked.has(l.id) ? ' on' : '')}>
                        {picked.has(l.id) && <Icon name="check" size={15} strokeWidth={3} color="var(--on-accent)" />}
                      </span>}
                    <div className="bp-recipe-tap">
                      <div className="bp-recipe-body">
                        <div className="bp-recipe-title">{l.name}</div>
                        <div className="bp-recipe-meta">
  {count === 0 ? 'Empty' : `${count} ${count === 1 ? 'item' : 'items'}`}
  {l.createdAt ? ` · ${new Date(l.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric'})}` : ''}
</div>
                      </div>
                      {!manage && <Icon name="chevron-right" size={18} strokeWidth={2} color="var(--fg3)" />}
                    </div>
                  </button>
                );
              })}
            </div>}
      </div>
      {manage && (
        <div className="bp-bulk-bar">
          <button className="bp-bulk-btn danger" disabled={picked.size === 0} onClick={runDelete}>
            <Icon name="trash-2" size={20} strokeWidth={2} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function GroceryList({ name: listName, data, onBack, onToggle, onAddItem, onEditItem, onClearChecked, onToggleAll, onDeleteList, onDeleteItem, onRenameList }) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(listName);
  const nameRef = useRef(null);
  const [adding, setAdding] = useState(false);
  const [itemName, setItemName] = useState('');
  const [amt, setAmt] = useState('');
  const [unit, setUnit] = useState('none');
  const [customUnit, setCustomUnit] = useState('');
  const customRef = useRef(null);
  const nameRef = useRef(null);
  const all = data.flatMap(g => g.items);
  const checked = all.filter(i => i.checked).length;
  const empty = all.length === 0;
  const allChecked = !empty && checked === all.length;

  const openAdd = () => { setAdding(true); setTimeout(() => nameRef.current && nameRef.current.focus(), 60); };
  const closeAdd = () => { setAdding(false); setItemName(''); setAmt(''); setUnit('none'); setCustomUnit(''); };
  const submit = () => {
    const n = itemName.trim();
    if (!n) return;
    const u = unit === 'other' ? customUnit.trim() : (unit !== 'none' ? unit : '');
    const fullAmt = [amt.trim(), u].filter(Boolean).join(' ');
    onAddItem(n, fullAmt);
    setItemName(''); setAmt(''); setUnit('none'); setCustomUnit('');
    setTimeout(() => nameRef.current && nameRef.current.focus(), 20);
  };
  const pickUnit = (v) => {
    setUnit(v);
    if (v === 'other') setTimeout(() => customRef.current && customRef.current.focus(), 40);
  };

  return (
    <div className="bp-screen-inner" data-screen-label="Grocery List">
      <NavBar large
        left={<button className="bp-link bp-back-link" onClick={onBack}><Icon name="chevron-left" size={20} strokeWidth={2.4} />Grocery</button>}
        right={<div className="bp-nav-actions">
          <IconButton name="plus" onClick={openAdd} />
          <IconButton name="trash-2" onClick={onDeleteList} color={empty ? 'var(--fg3)' : undefined} />
        </div>} />
      <div className="bp-screen-pad">
        <h1 className="bp-h1 bp-screen-title">{listName || 'Grocery List'}</h1>
        <div className="bp-subrow">
          <span className="bp-subrow-count">{empty ? 'No items yet' : `${checked}/${all.length} items checked`}</span>
          {!empty && <button className="bp-link" onClick={() => onToggleAll(!allChecked)}>{allChecked ? 'Uncheck All' : 'Check All'}</button>}
        </div>

        {editingName ? (
  <input
    ref={nameRef}
    className="bp-list-name-input"
    value={draftName}
    onChange={e => setDraftName(e.target.value)}
    onBlur={() => { if (draftName.trim()) { onRenameList && onRenameList(draftName.trim()); } setEditingName(false); }}
    onKeyDown={e => { if (e.key === 'Enter') { if (draftName.trim()) onRenameList && onRenameList(draftName.trim()); setEditingName(false); } if (e.key === 'Escape') setEditingName(false); }}
  />
) : (
  <h1 className="bp-h1 bp-screen-title bp-list-name-tap" onClick={() => { setDraftName(listName); setEditingName(true); setTimeout(() => nameRef.current && nameRef.current.focus(), 40); }}>
    {listName || 'Grocery List'}
    <Icon name="pencil" size={14} strokeWidth={2.2} color="var(--fg3)" style={{marginLeft:8}} />
  </h1>
)}

        {adding &&
          <div className="bp-groc-add-card">
            <div className="bp-groc-add-head">
              <span className="bp-groc-add-title">Add item</span>
              <button className="bp-groc-add-close" onClick={closeAdd} aria-label="Close add item">
                <Icon name="x" size={18} strokeWidth={2.4} color="var(--fg2)" />
              </button>
            </div>
            <input ref={nameRef} className="bp-groc-add-name" placeholder="Item name" value={itemName}
              onChange={e => setItemName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') closeAdd(); }} />
            <div className="bp-groc-add-row">
              <input className="bp-groc-add-amt" placeholder="Amount" value={amt} inputMode="decimal"
                onChange={e => setAmt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()} />
              <div className="bp-groc-add-unit">
                {unit === 'other'
                  ? <input ref={customRef} className="bp-groc-add-custom" placeholder="Unit" value={customUnit}
                      maxLength={12}
                      onChange={e => setCustomUnit(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setUnit('none'); }} />
                  : <React.Fragment>
                      <select value={unit} onChange={e => pickUnit(e.target.value)} aria-label="Measurement unit">
                        {GROC_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                      </select>
                      <Icon name="chevron-down" size={15} strokeWidth={2} color="var(--fg3)" />
                    </React.Fragment>}
              </div>
              <button className="bp-groc-add-go" onClick={submit} disabled={!itemName.trim()} aria-label="Add item">
                <Icon name="plus" size={18} strokeWidth={2.6} color="var(--on-accent)" />Add
              </button>
            </div>
          </div>}

        {empty
          ? <div className="bp-coll-empty">
              <div className="bp-coll-tile big"><Icon name="shopping-basket" size={30} strokeWidth={1.8} color="var(--accent-deep)" /></div>
              <div className="bp-empty-title">Your list is empty</div>
              <div className="bp-empty-sub">Add items by hand, or send ingredients here after cooking.</div>
            </div>
          : <div className="bp-grocery">
              {data.map((g, gi) => (
                <div key={gi} className="bp-aisle">
                  <div className="bp-label-row">{g.aisle}</div>
                  {g.items.map((it, ii) => (
                    <GroceryRow key={ii} item={it} onToggle={() => onToggle(gi, ii)} onDelete={() => onDeleteItem(gi, ii)} onEdit={(n, a) => onEditItem(gi, ii, n, a)} />
                  ))}
                </div>
              ))}
            </div>}
      </div>
    </div>
  );
}

function Row({ icon, label, value, onClick, danger, last }) {
  return (
    <button className={'bp-set-row' + (last ? ' last' : '')} onClick={onClick}>
      <Icon name={icon} size={20} strokeWidth={1.9} color={danger ? 'var(--danger)' : 'var(--fg2)'} />
      <span className="bp-set-label" style={danger ? { color: 'var(--danger)' } : null}>{label}</span>
      {value && <span className="bp-set-value">{value}</span>}
      {!danger && <Icon name="chevron-right" size={18} strokeWidth={2} color="var(--fg3)" />}
    </button>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button className="bp-switch" onClick={() => onChange(!on)}
      style={{ background: on ? 'var(--accent)' : 'var(--surface-2)' }}>
      <span className="bp-knob" style={{ left: on ? 23 : 3 }}></span>
    </button>
  );
}

function Profile({ theme, setTheme, mode, setMode, textSize, setTextSize, language, langLabel, onLanguage, onDeleteAll, onSignIn, onBackup, onPrivacy }) {
  const [autosave, setAutosave] = useState(true);
  return (
    <div className="bp-screen-inner">
      <NavBar large />
      <div className="bp-screen-pad bp-profile">
        <h1 className="bp-h1 bp-screen-title">Settings</h1>

        <div className="bp-profile-row" onClick={onSignIn}>
          <div className="bp-avatar"><Icon name="user" size={26} strokeWidth={1.8} color="var(--accent-deep)" /></div>
          <div className="bp-profile-text">
            <div className="bp-profile-name">Not signed in</div>
            <div className="bp-profile-status">Recipes saved on this device</div>
          </div>
          <button className="bp-link">Sign In</button>
        </div>

        <div className="bp-set-group-label">Appearance</div>
        <div className="bp-set-card">
          <div className="bp-set-row themes">
            <Icon name="palette" size={20} strokeWidth={1.9} color="var(--fg2)" />
            <span className="bp-set-label">Theme</span>
            <div className="bp-theme-dots">
              {THEMES.map(t => (
                <button key={t.id} className={'bp-theme-dot' + (theme === t.id ? ' sel' : '')}
                        style={{ background: t.color }} onClick={() => setTheme(t.id)} aria-label={t.name}></button>
              ))}
            </div>
          </div>
          <div className="bp-set-row last">
            <Icon name="moon" size={20} strokeWidth={1.9} color="var(--fg2)" />
            <span className="bp-set-label">Dark Mode</span>
            <Toggle key={'dm-' + (mode === 'dark')} on={mode === 'dark'} onChange={v => setMode(v ? 'dark' : 'light')} />
          </div>
        </div>

        <div className="bp-set-group-label">Recipes</div>
        <div className="bp-set-card">
          <div className="bp-set-row">
            <Icon name="save" size={20} strokeWidth={1.9} color="var(--fg2)" />
            <span className="bp-set-label">Auto-Save</span>
            <Toggle key={'as-' + autosave} on={autosave} onChange={setAutosave} />
          </div>
          <Row icon="globe" label="Language" value={langLabel || 'English'} onClick={onLanguage} last />
        </div>

        <div className="bp-set-group-label">Account</div>
        <div className="bp-set-card">
        <Row icon="cloud" label="Backup" value="On device" onClick={onBackup} />
          <Row icon="shield" label="Privacy" onClick={onPrivacy} last />
        </div>

        <div className="bp-set-group-label danger">Danger Zone</div>
        <div className="bp-set-card">
          <Row icon="trash-2" label="Delete All Data" danger last onClick={onDeleteAll} />
        </div>
        <div className="bp-set-foot">BarePlate · Save recipes from anywhere. Clean and simple.</div>
      </div>
    </div>
  );
}

function AddRecipeSheet({ open, onClose, onPaste, onScan, onWrite }) {
  const [url, setUrl] = useState('');
  const scanRef = useRef(null);
  return (
    <Sheet open={open} onClose={onClose} title="Add a Recipe">
      <div className="bp-add-paste">
        <input className="bp-add-input" placeholder="Paste a URL" value={url} onChange={e => setUrl(e.target.value)} />
        <button className="bp-add-go" onClick={() => onPaste(url || 'smittenkitchen.com')}>Go</button>
      </div>
      <input ref={scanRef} type="file" accept="image/*" capture="environment" hidden onChange={e => { const f = e.target.files && e.target.files[0]; if (f) onScan(f); e.target.value = ''; }} />
      <button className="bp-add-opt" onClick={() => scanRef.current && scanRef.current.click()}>
        <div className="bp-add-icon"><Icon name="camera" size={22} strokeWidth={1.9} color="var(--accent-deep)" /></div>
        <div className="bp-add-opt-text"><div className="t">Scan with camera</div><div className="s">Cookbook, card, or handwriting</div></div>
      </button>
      <button className="bp-add-opt" onClick={onWrite}>
        <div className="bp-add-icon"><Icon name="pencil" size={20} strokeWidth={1.9} color="var(--accent-deep)" /></div>
        <div className="bp-add-opt-text"><div className="t">Write it myself</div><div className="s">From memory, a friend, or family</div></div>
      </button>
      <div className="bp-add-hint">or share directly from Safari, YouTube, TikTok, and more</div>
    </Sheet>
  );
}

const LOAD_STEPS = ['Reading the page', 'Stripping ads', 'Extracting recipe', 'Reviewing for accuracy'];

function ExtractionLoading({ url, onCancel, onComplete }) {
  const [stepI, setStepI] = useState(0);
  useEffect(() => {
    if (stepI >= LOAD_STEPS.length) { const d = setTimeout(() => onComplete && onComplete(), 500); return () => clearTimeout(d); }
    const t = setTimeout(() => setStepI(stepI + 1), 750);
    return () => clearTimeout(t);
  }, [stepI]);
  const pct = Math.min(100, (stepI / LOAD_STEPS.length) * 100 + 8);
  return (
    <div className="bp-extract">
      <NavBar title="Adding Recipe" left={<IconButton name="x" onClick={onCancel} />} />
      <div className="bp-extract-body">
        <div className="bp-url-chip"><Icon name="link" size={15} strokeWidth={2} />{url}</div>
        <div className="bp-spinner"><div className="bp-spin-ring"></div></div>
        <div className="bp-progress"><div className="bp-progress-fill" style={{ width: pct + '%' }}></div></div>
        <div className="bp-load-steps">
          {LOAD_STEPS.map((s, i) => (
            <div key={i} className={'bp-load-step' + (i < stepI ? ' done' : i === stepI ? ' active' : '')}>
              {i < stepI ? <Icon name="check" size={16} strokeWidth={2.6} /> : <span className="bp-load-bullet"></span>}
              {s}
            </div>
          ))}
        </div>
        <div className="bp-extract-note"><Icon name="info" size={14} strokeWidth={2} />Video sources are transcribed — review before cooking.</div>
        <button className="bp-link bp-extract-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function ExtractionFailure({ url, onClose, onRetry, onScan, onWrite }) {
  return (
    <div className="bp-extract">
      <NavBar title="Adding Recipe" left={<IconButton name="x" onClick={onClose} />} />
      <div className="bp-extract-body fail">
        <div className="bp-url-chip"><Icon name="link" size={15} strokeWidth={2} />{url}</div>
        <div className="bp-fail-icon"><Icon name="lock" size={30} strokeWidth={1.8} color="var(--accent-deep)" /></div>
        <div className="bp-fail-title">This page is behind a paywall</div>
        <div className="bp-fail-sub">Try pasting the recipe text directly, or use another method.</div>
        <div className="bp-fail-opts">
        <button className="bp-cta bp-fail-primary" onClick={onWrite}><Icon name="clipboard" size={19} strokeWidth={2} />Paste the recipe text</button>
          <button className="bp-fail-opt" onClick={onScan}><Icon name="camera" size={19} strokeWidth={1.9} />Scan with camera</button>
          <button className="bp-fail-opt" onClick={onWrite}><Icon name="pencil" size={18} strokeWidth={1.9} />Write it myself</button>
          <button className="bp-fail-opt" onClick={onRetry}><Icon name="rotate-ccw" size={18} strokeWidth={1.9} />Try again</button>
        </div>
        <button className="bp-done-back" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function SignInSheet({ open, onClose, count }) {
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="bp-signin">
        <div className="bp-signin-icon"><Icon name="cloud" size={28} strokeWidth={1.8} color="var(--accent-deep)" /></div>
        <div className="bp-signin-title">Keep your recipes safe</div>
        <div className="bp-signin-sub">You've saved {count} recipes. Sign in to keep them safe across all your devices — free forever.</div>
        <button className="bp-auth apple"><Icon name="apple" size={19} strokeWidth={2} />Continue with Apple</button>
        <button className="bp-auth"><Icon name="chrome" size={19} strokeWidth={2} />Continue with Google</button>
        <button className="bp-auth"><Icon name="mail" size={19} strokeWidth={2} />Email magic link</button>
        <button className="bp-done-back" onClick={onClose}>Not now</button>
      </div>
    </Sheet>
  );
}

Object.assign(window, { GroceryHome, GroceryList, Profile, AddRecipeSheet, ExtractionLoading, ExtractionFailure, SignInSheet });
