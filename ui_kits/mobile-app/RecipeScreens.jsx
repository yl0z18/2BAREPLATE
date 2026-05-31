// ============================================================
// BarePlate UI Kit — My Recipes & Recipe Detail
// ============================================================

function MyRecipes({ recipes, totalCount, onOpen, onSearch, onCollections, onAdd, onSortFilter, onBulkDelete, onBulkCollection }) {
  const total = totalCount == null ? recipes.length : totalCount;
  const [selectMode, setSelectMode] = useState(false);
  const [picked, setPicked] = useState(() => new Set());

  const exitSelect = () => { setSelectMode(false); setPicked(new Set()); };
  const togglePick = (id) => setPicked(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const allPicked = recipes.length > 0 && picked.size === recipes.length;
  const toggleAll = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setPicked(p => p.size === recipes.length ? new Set() : new Set(recipes.map(r => r.id)));
  };

  const runDelete = () => { onBulkDelete && onBulkDelete([...picked]); exitSelect(); };
  const runCollection = () => { onBulkCollection && onBulkCollection([...picked]); exitSelect(); };

  if (total === 0) {
    return (
      <div className="bp-screen-inner">
        <div className="bp-empty">
          <BowlMark size={76} />
          <div className="bp-empty-title">Your cookbook is empty</div>
          <div className="bp-empty-sub">Save your first recipe to get started.</div>
        </div>
        <PinnedCTA icon="plus" onClick={onAdd}>Add a Recipe</PinnedCTA>
      </div>
    );
  }
  return (
    <div className="bp-screen-inner">
      <NavBar large
        left={selectMode
          ? <button className="bp-link bp-nav-modebtn" onClick={exitSelect}>Cancel</button>
          : null}
        right={selectMode
          ? <button className="bp-link bp-nav-modebtn" onClick={toggleAll}>{allPicked ? 'Deselect All' : 'Select All'}</button>
          : <div className="bp-nav-actions">
              <IconButton name="search" onClick={onSearch} />
              <IconButton name="folder" onClick={onCollections} />
              <IconButton name="list-checks" onClick={() => setSelectMode(true)} />
            </div>} />
      <div className="bp-screen-pad">
        <h1 className="bp-h1 bp-screen-title">My Recipes</h1>
        <div className="bp-subrow">
          <span className="bp-subrow-count">
            {selectMode
              ? (picked.size > 0 ? `${picked.size} selected` : 'Select recipes')
              : `${recipes.length} recipes`}
          </span>
          {!selectMode && <button className="bp-link" onClick={onSortFilter}>Sort &amp; Filter</button>}
        </div>
        {recipes.length === 0
          ? <div className="bp-coll-empty">
              <BowlMark size={60} />
              <div className="bp-empty-title">Nothing matches</div>
              <div className="bp-empty-sub">No recipes fit this filter — adjust Sort &amp; Filter to see more.</div>
            </div>
          : <div className="bp-recipe-list">
          {recipes.map(r => (
            <button key={r.id}
              className={'bp-recipe-card' + (selectMode && picked.has(r.id) ? ' picked' : '')}
              onClick={() => selectMode ? togglePick(r.id) : onOpen(r)}>
              {selectMode &&
                <span className={'bp-pick-box' + (picked.has(r.id) ? ' on' : '')}>
                  {picked.has(r.id) && <Icon name="check" size={15} strokeWidth={3} color="var(--on-accent)" />}
                </span>}
              <div className="bp-recipe-body">
                <div className="bp-recipe-title">{r.title}</div>
                <div className="bp-recipe-meta">{r.time}</div>
              </div>
              {!selectMode && (r.cooked > 0
                ? <span className="bp-cooked"><Icon name="chef-hat" size={17} strokeWidth={2} />{r.cooked}×</span>
                : <span className="bp-cooked-dash">—</span>)}
            </button>
          ))}
        </div>}
      </div>
      {selectMode
        ? <div className="bp-bulk-bar">
            <button className="bp-bulk-btn" disabled={picked.size === 0} onClick={runCollection}>
              <Icon name="folder-plus" size={20} strokeWidth={2} />
              Add to Collection
            </button>
            <button className="bp-bulk-btn danger" disabled={picked.size === 0} onClick={runDelete}>
              <Icon name="trash-2" size={20} strokeWidth={2} />
              Delete
            </button>
          </div>
        : <PinnedCTA icon="plus" onClick={onAdd}>Add a Recipe</PinnedCTA>}
    </div>
  );
}

function BowlMark({ size = 72, color = 'var(--fg3)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
      <path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1z" />
      <path d="M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
      <path d="M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
      <path d="M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
    </svg>
  );
}

function RecipeDetail({ recipe, units, onBack, onEdit, onShare, onCook, onAdjustCooked }) {
  const [tab, setTab] = useState('ingredients');
  const [serves, setServes] = useState(recipe.serves);
  const [metric, setMetric] = useState(units !== 'us');
  const [reviewTip, setReviewTip] = useState(false);
  const scrollRef = useRef(null);
  const [showTop, setShowTop] = useState(false);
  const factor = serves / recipe.serves;
  useEffect(() => { setServes(recipe.serves); setTab('ingredients'); setReviewTip(false); }, [recipe.id]);
  useEffect(() => { setMetric(units !== 'us'); }, [units]);

  const toTop = () => { if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' }); };
  // Reddit-style: reveal the scroll-to-top affordance as soon as the user has
  // scrolled a bit, regardless of how far down the page they are.
  const onScroll = (e) => setShowTop(e.target.scrollTop > 40);

  return (
    <div className="bp-screen-inner">
      <div className="bp-detail-scroll" ref={scrollRef} onScroll={onScroll}>
        {/* Photo header */}
        <div className="bp-photo">
          {recipe.photo
            ? <img src={recipe.photo} alt="" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('noimg'); }} />
            : null}
          {!recipe.photo && <div className="bp-photo-placeholder"><BowlMark size={64} color="var(--accent)" /></div>}
          <div className="bp-photo-nav">
          <button className="bp-round-btn" onClick={onBack}><Icon name="chevron-left" size={22} strokeWidth={2.4} /></button>
            <div className="bp-nav-actions">
              <button className="bp-round-btn" onClick={onEdit}><Icon name="pencil" size={18} strokeWidth={2.2} /></button>
              <button className="bp-round-btn" onClick={onShare}><Icon name="share" size={18} strokeWidth={2.2} /></button>
            </div>
          </div>
          <button className="bp-photo-cam" onClick={onEdit}><Icon name="camera" size={18} strokeWidth={2} /></button>
        </div>

        <div className="bp-screen-pad bp-detail-pad">
          <h2 className="bp-h2 bp-detail-title">{recipe.title}</h2>
          {/* source · status on the left, rating on the right */}
          <div className="bp-detail-meta-line">
            <span className="bp-meta-text">
              {[recipe.source,
                recipe.flags.includes('offline') && 'Offline',
              ].filter(Boolean).map((t, i, arr) => (
                <React.Fragment key={i}>
                  <span>{t}</span>
                  {i < arr.length - 1 && <span className="bp-meta-dot">•</span>}
                </React.Fragment>
              ))}
              {recipe.flags.includes('review') && (
                <React.Fragment>
                  {(recipe.source || recipe.flags.includes('offline')) && <span className="bp-meta-dot">•</span>}
                  <span className="review">Needs review</span>
                  <button className="bp-review-info-btn" onClick={e => { e.stopPropagation(); setReviewTip(v => !v); }} aria-label="What does needs review mean?">
                    <Icon name="info" size={13} strokeWidth={2} color="var(--accent)" />
                  </button>
                </React.Fragment>
              )}
            </span>
            <Stars value={recipe.rating} />
          </div>
          {reviewTip && (
            <div className="bp-review-tip">
              This recipe was extracted from a video. Double-check the ingredients and steps match what you saw before cooking.
              <button className="bp-review-tip-close" onClick={() => setReviewTip(false)}>Got it</button>
            </div>
          )}

          {/* stats — time + cook count */}
          <div className="bp-stat-row">
            <span className="bp-stat"><Icon name="clock" size={18} strokeWidth={2} />{recipe.time}</span>
            {recipe.cooked > 0 &&
              <span className="bp-stat"><Icon name="chef-hat" size={18} strokeWidth={2} />{recipe.cooked}×</span>}
          </div>
          {/* controls — units toggle + inline servings stepper */}
          <div className="bp-controls-row">
            <button className="bp-stat-pill units" onClick={() => setMetric(!metric)}>
              {metric ? 'Metric' : 'US'}
              <Icon name="chevrons-up-down" size={15} strokeWidth={2} color="var(--fg3)" />
            </button>
            <div className="bp-serves-stepper">
              <span className="lbl">Serves</span>
              <button onClick={() => setServes(Math.max(1, serves - 1))} aria-label="Fewer servings"><Icon name="minus" size={16} strokeWidth={2.6} /></button>
              <span className="val">{serves}</span>
              <button onClick={() => setServes(serves + 1)} aria-label="More servings"><Icon name="plus" size={16} strokeWidth={2.6} /></button>
            </div>
          </div>
          <div className="bp-detail-divider"></div>

          {/* tabs */}
          <div className="bp-tabs">
            <button className={tab === 'ingredients' ? 'active' : ''} onClick={() => setTab('ingredients')}>Ingredients</button>
            <button className={tab === 'steps' ? 'active' : ''} onClick={() => setTab('steps')}>Steps</button>
          </div>

          {tab === 'ingredients'
            ? <IngredientsTab recipe={recipe} factor={factor} metric={metric} />
            : <StepsTab recipe={recipe} />}
        </div>
      </div>
      <button
        className={'bp-fab-top' + (showTop ? ' show' : '')}
        onClick={toTop}
        aria-label="Scroll to top"
        tabIndex={showTop ? 0 : -1}>
        <Icon name="arrow-up" size={20} strokeWidth={2.4} />
      </button>
      <PinnedCTA icon="flame" onClick={onCook}>Start Cooking</PinnedCTA>
    </div>
  );
}

function scaleAmt(amt, factor) {
  if (factor === 1) return amt;
  const m = amt.match(/^([\d.½⅓¼¾⅔]+)\s*(.*)$/);
  if (!m) return amt;
  const map = { '½': 0.5, '⅓': 0.333, '¼': 0.25, '¾': 0.75, '⅔': 0.667 };
  let n = map[m[1]] != null ? map[m[1]] : parseFloat(m[1]);
  if (isNaN(n)) return amt;
  let v = n * factor;
  let out = Math.round(v * 100) / 100;
  return out + (m[2] ? ' ' + m[2] : '');
}

function convertAmt(amt, metric) {
  if (metric) return amt;
  const m = amt.match(/^([\d.]+)\s*(kg|g|ml|l)\b(.*)$/i);
  if (!m) return amt;
  const n = parseFloat(m[1]); const u = m[2].toLowerCase(); const rest = m[3] || '';
  let v, unit;
  if (u === 'g') { v = n * 0.03527; unit = 'oz'; }
  else if (u === 'kg') { v = n * 2.205; unit = 'lb'; }
  else if (u === 'ml') { v = n * 0.03381; unit = 'fl oz'; }
  else { v = n * 4.227; unit = 'cup' + (n * 4.227 >= 2 ? 's' : ''); }
  const r = v < 10 ? Math.round(v * 10) / 10 : Math.round(v);
  return r + ' ' + unit + rest;
}

function IngredientsTab({ recipe, factor, metric }) {
  const srcUrl = recipe.source && /\.[a-z]{2,}/i.test(recipe.source)
    ? 'https://' + recipe.source.replace(/^https?:\/\//, '')
    : null;
  return (
    <div className="bp-tabpanel">
      {recipe.sections.map((sec, i) => (
        <div key={i} className="bp-ing-section">
          <div className="bp-label-row">{sec.label}</div>
          {sec.items.map((it, j) => (
            <div key={j} className="bp-ing-row">
              <span className="bp-ing-name">{it.name}</span>
              <span className="bp-ing-amt">{convertAmt(scaleAmt(it.amt, factor), metric)}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="bp-tab-footer">
      <button className="bp-link" onClick={() => srcUrl && window.open(srcUrl, '_blank')}
          style={!srcUrl ? { opacity: 0.35, pointerEvents: 'none' } : {}}>
          <Icon name="external-link" size={15} strokeWidth={2} />View Original
        </button>
      </div>
    </div>
  );
}

function StepsTab({ recipe }) {
  return (
    <div className="bp-tabpanel">
      {recipe.steps.map((s, i) => (
        <div key={i} className="bp-step">
          <div className="bp-step-num">{i + 1}</div>
          <div className="bp-step-body">
            {(s.pills.length > 0 || s.timer) &&
              <div className="bp-step-pills">
                {s.pills.map((p, j) => <span key={j} className="bp-pill-ing">{p.amt} {p.name}</span>)}
                {s.timer && <span className="bp-pill-timer"><Icon name="timer" size={14} strokeWidth={2} />{s.timer.label} {s.timer.mins} min</span>}
              </div>}
            <p className="bp-step-text">{s.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { MyRecipes, RecipeDetail, BowlMark });

// --- Search: live-filtered recipe finder ---
function SearchScreen({ recipes, onBack, onOpen }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60); return () => clearTimeout(t); }, []);

  const query = q.trim().toLowerCase();
  const results = query
    ? recipes.filter(r => (r.title + ' ' + r.creator + ' ' + r.source).toLowerCase().includes(query))
    : recipes;

  return (
    <div className="bp-screen-inner" data-screen-label="Search">
      <div className="bp-search-bar">
        <div className="bp-search-field">
          <Icon name="search" size={18} strokeWidth={2} color="var(--fg3)" />
          <input ref={inputRef} className="bp-search-input" placeholder="Search recipes" value={q}
            onChange={e => setQ(e.target.value)} />
          {q && <button className="bp-search-clear" onClick={() => setQ('')} aria-label="Clear">
            <Icon name="x" size={15} strokeWidth={2.6} color="var(--bg)" /></button>}
        </div>
        <button className="bp-link bp-search-cancel" onClick={onBack}>Cancel</button>
      </div>
      <div className="bp-screen-pad bp-search-pad">
        <div className="bp-subrow">
          <span className="bp-subrow-count">
            {query
              ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
              : 'All recipes'}
          </span>
        </div>
        {results.length === 0
          ? <div className="bp-coll-empty">
              <BowlMark size={60} />
              <div className="bp-empty-title">No matches</div>
              <div className="bp-empty-sub">Nothing in your cookbook matches “{q}”.</div>
            </div>
          : <div className="bp-recipe-list">
              {results.map(r => (
                <button key={r.id} className="bp-recipe-card" onClick={() => onOpen(r)}>
                  <div className="bp-recipe-body">
                    <div className="bp-recipe-title">{highlight(r.title, query)}</div>
                    <div className="bp-recipe-meta">{r.time} · {r.creator}</div>
                  </div>
                  {r.cooked > 0
                    ? <span className="bp-cooked"><Icon name="chef-hat" size={17} strokeWidth={2} />{r.cooked}×</span>
                    : <span className="bp-cooked-dash">—</span>}
                </button>
              ))}
            </div>}
      </div>
    </div>
  );
}

// highlight matched substring in a title
function highlight(text, query) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query);
  if (i < 0) return text;
  return [
    text.slice(0, i),
    React.createElement('mark', { key: 'm', className: 'bp-hl' }, text.slice(i, i + query.length)),
    text.slice(i + query.length),
  ];
}

Object.assign(window, { SearchScreen });
