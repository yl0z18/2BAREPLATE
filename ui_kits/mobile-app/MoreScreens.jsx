// ============================================================
// BarePlate UI Kit — Sort/Filter, Share, Edit, Voice, pickers, dialogs
// ============================================================

const clone = (x) => JSON.parse(JSON.stringify(x));

// ---------- Sort & Filter (My Recipes) ----------
const SORTS = [
  { id: 'recent', label: 'Recently added' },
  { id: 'alpha', label: 'Alphabetical (A-Z)' },
  { id: 'cooked', label: 'Most cooked' },
];
const FILTERS = [
  { id: 'all', label: 'All recipes' },
  { id: 'uncooked', label: 'Not yet cooked' },
];

function ChoiceRow({ label, on, onClick }) {
  return (
    <button className={'bp-choice-row' + (on ? ' on' : '')} onClick={onClick}>
      <span>{label}</span>
      {on && <Icon name="check" size={19} strokeWidth={2.6} color="var(--accent-deep)" />}
    </button>
  );
}

function SortFilterSheet({ open, onClose, sort, setSort, filter, setFilter }) {
  return (
    <Sheet open={open} onClose={onClose} title="Sort & Filter">
      <div className="bp-label-row sheet">Sort by</div>
      <div className="bp-choice-list">
        {SORTS.map(s => <ChoiceRow key={s.id} label={s.label} on={sort === s.id} onClick={() => setSort(s.id)} />)}
      </div>
      <div className="bp-label-row sheet">Show</div>
      <div className="bp-choice-list">
        {FILTERS.map(f => <ChoiceRow key={f.id} label={f.label} on={filter === f.id} onClick={() => setFilter(f.id)} />)}
      </div>
      <button className="bp-cta bp-sheet-cta" onClick={onClose}>Done</button>
    </Sheet>
  );
}

// ---------- Share ----------
function ShareSheet({ open, onClose, recipe, onAction }) {
  const targets = [
    { id: 'copy', icon: 'link', label: 'Copy Link' },
    { id: 'message', icon: 'message-circle', label: 'Messages' },
    { id: 'mail', icon: 'mail', label: 'Mail' },
    { id: 'more', icon: 'share-2', label: 'More' },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Share Recipe">
      {recipe && (
        <React.Fragment>
          <div className="bp-share-card">
            <div className="bp-share-tile">
              {recipe.photo
                ? <img src={recipe.photo} alt="" />
                : <BowlMark size={26} color="var(--accent-deep)" />}
            </div>
            <div className="bp-share-info">
              <div className="bp-share-title">{recipe.title}</div>
              <div className="bp-share-url">{recipe.source}</div>
            </div>
          </div>
          <div className="bp-share-note">
            <Icon name="shield" size={15} strokeWidth={2} color="var(--accent-deep)" />
            Shares a clean link to the original source - no ads, no clutter.
          </div>
          <div className="bp-share-targets">
            {targets.map(t => (
              <button key={t.id} className="bp-share-target" onClick={() => onAction(t)}>
                <span className="bp-share-target-icon"><Icon name={t.icon} size={24} strokeWidth={1.9} color="var(--fg1)" /></span>
                <span className="bp-share-target-label">{t.label}</span>
              </button>
            ))}
          </div>
        </React.Fragment>
      )}
    </Sheet>
  );
}

// ---------- Edit Recipe (full screen) ----------
function EditRecipe({ recipe, isNew, onCancel, onSave }) {
  const [title, setTitle] = useState(recipe.title);
  const [titleErr, setTitleErr] = useState(false);
  const [source, setSource] = useState(recipe.source || '');
  const [hrs, setHrs] = useState(() => {
    const m = (recipe.time || '').match(/(\d+)\s*h/); return m ? m[1] : '';
  });
  const [mins, setMins] = useState(() => {
    const m = (recipe.time || '').match(/(\d+)\s*m/); return m ? m[1] : '';
  });
  const [serves, setServes] = useState(recipe.serves);
  const [photo, setPhoto] = useState(recipe.photo || '');
  const [rating, setRating] = useState(recipe.rating || 0);
  const [sections, setSections] = useState(() => clone(recipe.sections && recipe.sections.length ? recipe.sections : [{ label: 'Main', items: [{ name: '', amt: '', unit: 'none' }] }]));
  const [steps, setSteps] = useState(() => clone(recipe.steps && recipe.steps.length ? recipe.steps : [{ text: '', pills: [], timer: null }]));
  const photoRef = useRef(null);
  const onPhotoFile = (e) => { const f = e.target.files && e.target.files[0]; if (f) setPhoto(URL.createObjectURL(f)); e.target.value = ''; };

  const buildTime = () => { const h = parseInt(hrs)||0; const m = parseInt(mins)||0; if (!h && !m) return ''; return [h && h + ' hr', m && m + ' min'].filter(Boolean).join(' '); };

  const setItem = (si, ii, key, val) => setSections(s => s.map((sec, i) => i !== si ? sec
    : { ...sec, items: sec.items.map((it, j) => j !== ii ? it : { ...it, [key]: val }) }));
  const addItem = (si) => setSections(s => s.map((sec, i) => i !== si ? sec : { ...sec, items: [...sec.items, { name: '', amt: '', unit: 'none' }] }));
  const removeItem = (si, ii) => setSections(s => s.map((sec, i) => i !== si ? sec : { ...sec, items: sec.items.filter((_, j) => j !== ii) }));
  const setLabel = (si, val) => setSections(s => s.map((sec, i) => i !== si ? sec : { ...sec, label: val }));
  const addSection = () => setSections(s => [...s, { label: 'New Section', items: [{ name: '', amt: '', unit: 'none' }] }]);
  const removeSection = (si) => setSections(s => s.filter((_, i) => i !== si));

  const setStep = (i, val) => setSteps(st => st.map((s, j) => j !== i ? s : { ...s, text: val }));
  const removeStep = (i) => setSteps(st => st.filter((_, j) => j !== i));
  const addStep = () => setSteps(st => [...st, { text: '', pills: [], timer: null }]);

  const save = () => {
    if (!title.trim()) { setTitleErr(true); return; }
    const saved = sections.map(sec => ({
      ...sec,
      items: sec.items.map(it => {
        const u = (it.unit && it.unit !== 'none') ? it.unit : '';
        return { ...it, amt: [it.amt, u].filter(Boolean).join(' ') };
      })
    }));
    onSave({ ...recipe, title: title.trim(), source, time: buildTime(), serves, sections: saved, steps, photo, rating });
  };

  return (
    <div className="bp-screen-inner" data-screen-label={isNew ? 'New Recipe' : 'Edit Recipe'}>
      <NavBar
        left={<button className="bp-link" onClick={onCancel}>Cancel</button>}
        title={isNew ? 'New Recipe' : 'Edit Recipe'}
        right={<button className="bp-link" onClick={save} style={{ opacity: title.trim() ? 1 : 0.4 }}>Save</button>} />
      <div className="bp-screen-pad bp-edit">
        <div className="bp-edit-photo">
          {photo
            ? <img src={photo} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
            : <div className="bp-edit-photo-ph"><BowlMark size={54} color="var(--accent)" /></div>}
          <input ref={photoRef} type="file" accept="image/*" hidden onChange={onPhotoFile} />
          <button className="bp-edit-photo-btn" onClick={() => photoRef.current && photoRef.current.click()}>
            <Icon name="camera" size={17} strokeWidth={2} />Change photo
          </button>
        </div>

        <div className="bp-field">
          <label className="bp-field-label">Title {titleErr && <span style={{color:'var(--danger)',fontWeight:700,marginLeft:6}}>Required</span>}</label>
          <input
            className={'bp-field-input' + (titleErr ? ' bp-field-error' : '')}
            value={title}
            placeholder="Required"
            onChange={e => { setTitle(e.target.value); if (e.target.value.trim()) setTitleErr(false); }}
          />
        </div>

        <div className="bp-field-row">
          <div className="bp-field">
            <label className="bp-field-label">Cook Time</label>
            <div className="bp-time-row">
              <input className="bp-field-input bp-time-part" type="number" min="0" max="23" placeholder="0" value={hrs} onChange={e => setHrs(e.target.value)} />
              <span className="bp-time-unit">hr</span>
              <input className="bp-field-input bp-time-part" type="number" min="0" max="59" placeholder="0" value={mins} onChange={e => setMins(e.target.value)} />
              <span className="bp-time-unit">min</span>
            </div>
          </div>
          <div className="bp-field serves">
            <label className="bp-field-label">Serves</label>
            <div className="bp-meta-scaler edit">
              <button onClick={() => setServes(Math.max(1, serves - 1))}><Icon name="minus" size={16} strokeWidth={2.4} /></button>
              <span>{serves}</span>
              <button onClick={() => setServes(serves + 1)}><Icon name="plus" size={16} strokeWidth={2.4} /></button>
            </div>
          </div>
        </div>

        <div className="bp-field">
          <label className="bp-field-label">Source</label>
          <input className="bp-field-input" value={source} placeholder="Website, book, or person" onChange={e => setSource(e.target.value)} />
        </div>

        <div className="bp-field">
          <label className="bp-field-label">Rating</label>
          <div className="bp-edit-stars">
            {[1,2,3,4,5].map(n => (
              <button key={n} className="bp-edit-star-btn" onClick={() => setRating(rating === n ? 0 : n)} aria-label={n + ' stars'}>
                <Icon name="star" size={28} strokeWidth={1.8}
                  color={n <= rating ? 'var(--accent-deep)' : 'var(--border-2)'}
                  data-fill={n <= rating ? '1' : undefined} />
              </button>
            ))}
          </div>
        </div>

        <div className="bp-edit-section-head">Ingredients</div>
        {sections.map((sec, si) => (
          <div key={si} className="bp-edit-ing-group">
            <div className="bp-edit-section-label-row">
              <input className="bp-edit-label-input" value={sec.label} onChange={e => setLabel(si, e.target.value)} placeholder="Section name" />
              <button className="bp-edit-section-pencil" onClick={e => e.currentTarget.previousSibling.focus()} aria-label="Rename section">
                <Icon name="pencil" size={13} strokeWidth={2.2} color="var(--accent-deep)" />
              </button>
              {sections.length > 1 &&
                <button className="bp-edit-del" onClick={() => removeSection(si)} aria-label="Remove section" style={{marginLeft: 4}}>
                  <Icon name="minus" size={14} strokeWidth={3} color="var(--on-accent)" />
                </button>}
            </div>
            {sec.items.map((it, ii) => (
              <div key={ii} className="bp-edit-ing-row">
                <button className="bp-edit-del" onClick={() => removeItem(si, ii)} aria-label="Remove ingredient">
                  <Icon name="minus" size={14} strokeWidth={3} color="var(--on-accent)" />
                </button>
                <input className="bp-field-input flex" value={it.name} onChange={e => setItem(si, ii, 'name', e.target.value)} placeholder="Ingredient" />
                <input className="bp-field-input bp-ing-amt-num" value={it.amt} onChange={e => setItem(si, ii, 'amt', e.target.value)} placeholder="Qty" />
                <div className="bp-ing-unit-wrap">
                  <select value={it.unit || 'none'} onChange={e => setItem(si, ii, 'unit', e.target.value)}>
                    {GROC_UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                  <Icon name="chevron-down" size={13} strokeWidth={2} color="var(--fg3)" />
                </div>
              </div>
            ))}
            <button className="bp-edit-add-block" onClick={() => addItem(si)}>
              <Icon name="plus" size={17} strokeWidth={2.2} />Add an Ingredient
            </button>
          </div>
        ))}
        <button className="bp-edit-add-block" onClick={addSection}>
          <Icon name="plus" size={17} strokeWidth={2.2} />Add a Section
        </button>

        <div className="bp-edit-section-head">Steps</div>
        {steps.map((s, i) => (
          <div key={i} className="bp-edit-step">
            <div className="bp-step-num">{i + 1}</div>
            <textarea className="bp-field-input area" value={s.text} onChange={e => setStep(i, e.target.value)} placeholder="Describe this step" rows={2} />
            <button className="bp-edit-del top" onClick={() => removeStep(i)} aria-label="Remove step">
              <Icon name="minus" size={14} strokeWidth={3} color="var(--on-accent)" />
            </button>
          </div>
        ))}
        <button className="bp-edit-add-block" onClick={addStep}>
          <Icon name="plus" size={17} strokeWidth={2.2} />Add a Step
        </button>
      </div>
    </div>
  );
}

// ---------- AI Voice Assistant (Cook Mode) ----------
const VOICE_QA = [
  { q: 'How much garlic?', a: '4 cloves, minced - it goes in with the butter in step 3.' },
  { q: 'What is the next step?', a: 'Drain the pasta, saving a splash of the water, then toss it into the garlic butter.' },
  { q: 'Set a 5 minute timer', a: 'Done - a 5 minute timer is running. I\'ll let you know when it\'s up.' },
  { q: 'Can I swap the parmesan?', a: 'Pecorino works nicely here, or nutritional yeast to keep it dairy-free.' },
];

function VoiceAssistantSheet({ open, onClose }) {
  const [active, setActive] = useState(null);
  useEffect(() => { if (!open) setActive(null); }, [open]);
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="bp-voice">
        <div className={'bp-voice-orb' + (active ? ' answering' : '')}>
          <Icon name="mic" size={30} strokeWidth={2.1} color="var(--on-accent)" />
        </div>
        <div className="bp-voice-status">{active ? '"' + active.q + '"' : 'Listening - ask me anything about this recipe'}</div>
        {active && <div className="bp-voice-answer">{active.a}</div>}
        <div className="bp-label-row sheet">Try asking</div>
        <div className="bp-voice-chips">
          {VOICE_QA.map((x, i) => (
            <button key={i} className={'bp-voice-chip' + (active === x ? ' on' : '')} onClick={() => setActive(x)}>{x.q}</button>
          ))}
        </div>
        <div className="bp-voice-note">
          <Icon name="info" size={14} strokeWidth={2} color="var(--fg2)" />
          Answers come only from this recipe - hands-free, no tapping needed.
        </div>
        <button className="bp-done-back" onClick={onClose}>Done</button>
      </div>
    </Sheet>
  );
}

// ---------- Grocery target (Done Cooking -> grocery) ----------
function GroceryTargetSheet({ open, onClose, recipe, lists = [], onAddExisting, onStartNew }) {
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (open) setShowPicker(false);
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} title="Add to Grocery List">
      {!showPicker ? (
        <React.Fragment>
          <div className="bp-target-sub">
            {'You have ' + lists.length + ' ' + (lists.length === 1 ? 'list' : 'lists') + '. Add the ingredients from ' + (recipe ? recipe.title : 'this recipe') + ' to an existing list, or start fresh.'}
          </div>
          {lists.length > 0 && (
            <button className="bp-cta bp-sheet-cta tight" onClick={() => setShowPicker(true)}>
              <Icon name="plus" size={20} strokeWidth={2.2} />Add to existing list
            </button>
          )}
          <button className={lists.length > 0 ? "bp-target-secondary" : "bp-cta bp-sheet-cta tight"} onClick={() => onStartNew(recipe.title)}>
            <Icon name="rotate-ccw" size={19} strokeWidth={1.9} />Start a new list
          </button>
        </React.Fragment>
      ) : (
        <div className="bp-collections">
          {lists.map(l => (
            <button key={l.id} className="bp-coll-row" onClick={() => onAddExisting(l.id)}>
              <span className="bp-coll-row-tile"><Icon name="shopping-basket" size={19} strokeWidth={1.9} color="var(--accent-deep)" /></span>
              <span className="bp-coll-row-text">
                <span className="bp-coll-row-name">{l.name}</span>
                <span className="bp-coll-row-count">{l.groups.reduce((n, g) => n + g.items.length, 0)} items</span>
              </span>
              <Icon name="plus" size={18} strokeWidth={2.2} color="var(--fg3)" />
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}

// ---------- Generic single-choice picker (Units, Language) ----------
function ChoiceSheet({ open, onClose, title, options, value, onPick }) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className="bp-choice-list flush">
        {options.map(o => (
          <ChoiceRow key={o.id} label={o.label} on={value === o.id} onClick={() => { onPick(o.id); onClose(); }} />
        ))}
      </div>
    </Sheet>
  );
}

// ---------- Center confirmation dialog ----------
function ConfirmDialog({ open, title, message, confirmLabel, danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="bp-scrim center" onClick={onCancel}>
      <div className="bp-dialog" onClick={e => e.stopPropagation()}>
        <div className="bp-dialog-title">{title}</div>
        {message && <div className="bp-dialog-msg">{message}</div>}
        <div className="bp-dialog-actions">
          <button className="bp-dialog-btn" onClick={onCancel}>Cancel</button>
          <button className={'bp-dialog-btn primary' + (danger ? ' danger' : '')} onClick={onConfirm}>{confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SortFilterSheet, ShareSheet, EditRecipe, VoiceAssistantSheet,
  GroceryTargetSheet, ChoiceSheet, ConfirmDialog,
});
