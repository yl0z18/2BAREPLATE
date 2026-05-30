// ============================================================
// BarePlate UI Kit — Sort/Filter, Share, Edit, Voice, pickers, dialogs
// ============================================================

const clone = (x) => JSON.parse(JSON.stringify(x));

// ---------- Sort & Filter (My Recipes) ----------
const SORTS = [
  { id: 'recent', label: 'Recently added' },
  { id: 'alpha', label: 'Alphabetical (A–Z)' },
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
            Shares a clean link to the original source — no ads, no clutter.
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
function EditRecipe({ recipe, onCancel, onSave }) {
  const [title, setTitle] = useState(recipe.title);
  const [source, setSource] = useState(recipe.source);
  const [time, setTime] = useState(recipe.time);
  const [serves, setServes] = useState(recipe.serves);
  const [sections, setSections] = useState(() => clone(recipe.sections && recipe.sections.length ? recipe.sections : [{ label: 'Main', items: [{ name: '', amt: '' }] }]));
  const [steps, setSteps] = useState(() => clone(recipe.steps && recipe.steps.length ? recipe.steps : [{ text: '', pills: [], timer: null }]));

  const setItem = (si, ii, key, val) => setSections(s => s.map((sec, i) => i !== si ? sec
    : { ...sec, items: sec.items.map((it, j) => j !== ii ? it : { ...it, [key]: val }) }));
  const addItem = (si) => setSections(s => s.map((sec, i) => i !== si ? sec : { ...sec, items: [...sec.items, { name: '', amt: '' }] }));
  const removeItem = (si, ii) => setSections(s => s.map((sec, i) => i !== si ? sec : { ...sec, items: sec.items.filter((_, j) => j !== ii) }));
  const setLabel = (si, val) => setSections(s => s.map((sec, i) => i !== si ? sec : { ...sec, label: val }));
  const addSection = () => setSections(s => [...s, { label: 'New section', items: [{ name: '', amt: '' }] }]);

  const setStep = (i, val) => setSteps(st => st.map((s, j) => j !== i ? s : { ...s, text: val }));
  const removeStep = (i) => setSteps(st => st.filter((_, j) => j !== i));
  const addStep = () => setSteps(st => [...st, { text: '', pills: [], timer: null }]);

  const save = () => onSave({ ...recipe, title, source, time, serves, sections, steps });

  return (
    <div className="bp-screen-inner" data-screen-label="Edit Recipe">
      <NavBar
        left={<button className="bp-link" onClick={onCancel}>Cancel</button>}
        title="Edit Recipe"
        right={<button className="bp-link" onClick={save}>Save</button>} />
      <div className="bp-screen-pad bp-edit">
        <div className="bp-edit-photo">
          {recipe.photo
            ? <img src={recipe.photo} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
            : <div className="bp-edit-photo-ph"><BowlMark size={54} color="var(--accent)" /></div>}
          <button className="bp-edit-photo-btn"><Icon name="camera" size={17} strokeWidth={2} />Change photo</button>
        </div>

        <div className="bp-field">
          <label className="bp-field-label">Title</label>
          <input className="bp-field-input" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="bp-field-row">
          <div className="bp-field">
            <label className="bp-field-label">Cook time</label>
            <input className="bp-field-input" value={time} onChange={e => setTime(e.target.value)} />
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
          <input className="bp-field-input" value={source} onChange={e => setSource(e.target.value)} />
        </div>

        <div className="bp-edit-section-head">Ingredients</div>
        {sections.map((sec, si) => (
          <div key={si} className="bp-edit-ing-group">
            <input className="bp-edit-label-input" value={sec.label} onChange={e => setLabel(si, e.target.value)} placeholder="Section name" />
            {sec.items.map((it, ii) => (
              <div key={ii} className="bp-edit-ing-row">
                <button className="bp-edit-del" onClick={() => removeItem(si, ii)} aria-label="Remove ingredient">
                  <Icon name="minus" size={14} strokeWidth={3} color="var(--on-accent)" />
                </button>
                <input className="bp-field-input flex" value={it.name} onChange={e => setItem(si, ii, 'name', e.target.value)} placeholder="Ingredient" />
                <input className="bp-field-input amt" value={it.amt} onChange={e => setItem(si, ii, 'amt', e.target.value)} placeholder="Amount" />
              </div>
            ))}
            <button className="bp-link bp-add-item" onClick={() => addItem(si)}><Icon name="plus" size={16} strokeWidth={2.2} />Add ingredient</button>
          </div>
        ))}
        <button className="bp-edit-add-block" onClick={addSection}><Icon name="plus" size={17} strokeWidth={2.2} />Add a section</button>

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
        <button className="bp-edit-add-block" onClick={addStep}><Icon name="plus" size={17} strokeWidth={2.2} />Add a step</button>
      </div>
    </div>
  );
}

// ---------- AI Voice Assistant (Cook Mode) ----------
const VOICE_QA = [
  { q: 'How much garlic?', a: '4 cloves, minced — it goes in with the butter in step 3.' },
  { q: 'What’s the next step?', a: 'Drain the pasta, saving a splash of the water, then toss it into the garlic butter.' },
  { q: 'Set a 5 minute timer', a: 'Done — a 5 minute timer is running. I’ll let you know when it’s up.' },
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
        <div className="bp-voice-status">{active ? `“${active.q}”` : 'Listening — ask me anything about this recipe'}</div>
        {active && <div className="bp-voice-answer">{active.a}</div>}
        <div className="bp-label-row sheet">Try asking</div>
        <div className="bp-voice-chips">
          {VOICE_QA.map((x, i) => (
            <button key={i} className={'bp-voice-chip' + (active === x ? ' on' : '')} onClick={() => setActive(x)}>{x.q}</button>
          ))}
        </div>
        <div className="bp-voice-note">
          <Icon name="info" size={14} strokeWidth={2} color="var(--fg2)" />
          Answers come only from this recipe — hands-free, no tapping needed.
        </div>
        <button className="bp-done-back" onClick={onClose}>Done</button>
      </div>
    </Sheet>
  );
}

// ---------- Grocery target (Done Cooking → grocery) ----------
function GroceryTargetSheet({ open, onClose, recipe, count, onAddExisting, onStartNew }) {
  return (
    <Sheet open={open} onClose={onClose} title="Add to Grocery List">
      <div className="bp-target-sub">
        You already have a list with {count} {count === 1 ? 'item' : 'items'}. Add the ingredients from {recipe ? recipe.title : 'this recipe'} to it, or start fresh.
      </div>
      <button className="bp-cta bp-sheet-cta tight" onClick={onAddExisting}>
        <Icon name="plus" size={20} strokeWidth={2.2} />Add to existing list
      </button>
      <button className="bp-target-secondary" onClick={onStartNew}>
        <Icon name="rotate-ccw" size={19} strokeWidth={1.9} />Start a new list
      </button>
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
