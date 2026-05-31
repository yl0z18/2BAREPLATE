// ============================================================
// BarePlate UI Kit — Collections list, detail & sheets
// ============================================================

// --- Collections list (folder of collections) ---
function Collections({ collections, recipes, onBack, onOpen, onNew, onDeleteCollections }) {
  const count = (c) => recipes.filter(r => c.recipeIds.includes(r.id)).length;
  const [selectMode, setSelectMode] = useState(false);
  const [picked, setPicked] = useState(() => new Set());

  const exitSelect = () => { setSelectMode(false); setPicked(new Set()); };
  const togglePick = (id) => setPicked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allPicked = collections.length > 0 && picked.size === collections.length;
  const toggleAll = () => setPicked(allPicked ? new Set() : new Set(collections.map(c => c.id)));
  const runDelete = () => { onDeleteCollections && onDeleteCollections([...picked]); exitSelect(); };

  return (
    <div className="bp-screen-inner" data-screen-label="Collections">
      <NavBar large
        left={selectMode
          ? <button className="bp-link bp-nav-modebtn" onClick={exitSelect}>Cancel</button>
          : <IconButton name="arrow-left" onClick={onBack} />}
        right={selectMode
          ? <button className="bp-link bp-nav-modebtn" onClick={toggleAll}>{allPicked ? 'Deselect All' : 'Select All'}</button>
          : <div className="bp-nav-actions">
              {collections.length > 0 && <IconButton name="list-checks" onClick={() => setSelectMode(true)} />}
              <IconButton name="plus" onClick={onNew} />
            </div>} />
      <div className="bp-screen-pad">
        <h1 className="bp-h1 bp-screen-title">Collections</h1>
        <div className="bp-subrow">
          <span className="bp-subrow-count">
            {selectMode
              ? (picked.size > 0 ? `${picked.size} selected` : 'Select collections')
              : `${collections.length} collections`}
          </span>
        </div>

        {collections.length === 0
          ? <div className="bp-coll-empty">
              <div className="bp-coll-tile big"><Icon name="folder" size={30} strokeWidth={1.8} color="var(--accent-deep)" /></div>
              <div className="bp-empty-title">No collections yet</div>
              <div className="bp-empty-sub">Group recipes into collections like “Weeknight Dinners” or “To Try.”</div>
            </div>
          : <div className="bp-coll-grid">
              {collections.map(c => (
                <button key={c.id}
                  className={'bp-coll-card' + (selectMode && picked.has(c.id) ? ' picked' : '')}
                  onClick={() => selectMode ? togglePick(c.id) : onOpen(c)}>
                  {selectMode &&
                    <span className={'bp-pick-box coll' + (picked.has(c.id) ? ' on' : '')}>
                      {picked.has(c.id) && <Icon name="check" size={14} strokeWidth={3} color="var(--on-accent)" />}
                    </span>}
                  <div className={'bp-coll-tile' + (c.photo ? ' photo' : '')}>
                    {c.photo
                      ? <img className="bp-coll-tile-img" src={c.photo} alt="" />
                      : <Icon name={c.icon || 'folder'} size={24} strokeWidth={1.9} color="var(--accent-deep)" />}
                  </div>
                  <div className="bp-coll-card-text">
                    <div className="bp-coll-name">{c.name}</div>
                    <div className="bp-coll-count">{count(c)} {count(c) === 1 ? 'recipe' : 'recipes'}</div>
                  </div>
                </button>
              ))}
              {!selectMode &&
                <button className="bp-coll-card new" onClick={onNew}>
                  <div className="bp-coll-tile dashed"><Icon name="plus" size={24} strokeWidth={2.2} color="var(--accent-deep)" /></div>
                  <div className="bp-coll-card-text">
                    <div className="bp-coll-name">New Collection</div>
                    <div className="bp-coll-count">Group your recipes</div>
                  </div>
                </button>}
            </div>}
      </div>
      {selectMode &&
        <div className="bp-bulk-bar">
          <button className="bp-bulk-btn danger" disabled={picked.size === 0} onClick={runDelete}>
            <Icon name="trash-2" size={20} strokeWidth={2} />
            Delete{picked.size > 0 ? ` (${picked.size})` : ''}
          </button>
        </div>}
    </div>
  );
}

// --- A single collection's recipes ---
function CollectionDetail({ collection, recipes, onBack, onOpen, onAddRecipes, onRemove, onRename }) {
  const [manage, setManage] = useState(false);
  const inCol = recipes.filter(r => collection.recipeIds.includes(r.id));
  const empty = inCol.length === 0;

  return (
    <div className="bp-screen-inner" data-screen-label={'Collection: ' + collection.name}>
      <NavBar large
        left={<button className="bp-link bp-back-link" onClick={onBack}><Icon name="chevron-left" size={20} strokeWidth={2.4} />Collections</button>}
        right={!empty
          ? <button className="bp-link" onClick={() => setManage(m => !m)}>{manage ? 'Done' : 'Manage'}</button>
          : null} />
      <div className="bp-screen-pad">
      <div className="bp-coll-head" style={{ marginTop: 8 }}>
          <div className={'bp-coll-tile lg' + (collection.photo ? ' photo' : '')}>
            {collection.photo
              ? <img className="bp-coll-tile-img" src={collection.photo} alt="" />
              : <Icon name={collection.icon || 'folder'} size={26} strokeWidth={1.9} color="var(--accent-deep)" />}
          </div>
          <div className="bp-coll-title-row">
            <h1 className="bp-h1 bp-coll-title">{collection.name}</h1>
            {onRename &&
              <button className="bp-coll-rename-btn" onClick={() => onRename(collection)} aria-label="Rename collection">
                <Icon name="pencil" size={15} strokeWidth={2.2} color="var(--fg2)" />
              </button>}
          </div>
        </div>
        <div className="bp-subrow">
          <span className="bp-subrow-count">{inCol.length} {inCol.length === 1 ? 'recipe' : 'recipes'}</span>
          {!manage && <button className="bp-link" onClick={onAddRecipes}><Icon name="plus" size={15} strokeWidth={2.4} />Add Recipes</button>}
        </div>

        {empty
          ? <div className="bp-coll-empty">
              <BowlMark size={64} />
              <div className="bp-empty-title">Nothing here yet</div>
              <div className="bp-empty-sub">Add recipes from your cookbook to build this collection.</div>
            </div>
          : <div className="bp-recipe-list">
              {inCol.map(r => (
                <div key={r.id} className={'bp-recipe-card' + (manage ? ' managing' : '')}>
                  {manage &&
                    <button className="bp-remove-btn" onClick={() => onRemove(collection.id, r.id)} aria-label={'Remove ' + r.title}>
                      <Icon name="minus" size={16} strokeWidth={3} color="var(--on-accent)" />
                    </button>}
                  <button className="bp-recipe-tap" onClick={() => !manage && onOpen(r)} disabled={manage}>
                    <div className="bp-recipe-body">
                      <div className="bp-recipe-title">{r.title}</div>
                      <div className="bp-recipe-meta">{r.time}</div>
                    </div>
                    {!manage && (r.cooked > 0
                      ? <span className="bp-cooked"><Icon name="chef-hat" size={17} strokeWidth={2} />{r.cooked}×</span>
                      : <span className="bp-cooked-dash">—</span>)}
                  </button>
                  {manage &&
                    <button className="bp-manage-edit-btn" onClick={() => onOpen(r)} aria-label={'Edit ' + r.title}>
                      <Icon name="pencil" size={15} strokeWidth={2.2} color="var(--fg2)" />
                    </button>}
                </div>
              ))}
            </div>}
      </div>
      {empty
        ? <PinnedCTA icon="plus" onClick={onAddRecipes}>Add Recipes</PinnedCTA>
        : (manage && <PinnedCTA icon="plus" onClick={onAddRecipes}>Add Recipes</PinnedCTA>)}
    </div>
  );
}

// --- Create a new collection ---
const COLL_ICONS = ['folder', 'utensils', 'heart', 'bookmark', 'cookie', 'soup', 'salad', 'cake', 'pizza', 'fish', 'coffee', 'leaf', 'flame', 'star'];

function NewCollectionSheet({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('folder');
  const [photo, setPhoto] = useState(null);
  const photoRef = useRef(null);
  useEffect(() => { if (open) { setName(''); setIcon('folder'); setPhoto(null); } }, [open]);
  const onPhotoFile = (e) => { const f = e.target.files && e.target.files[0]; if (f) setPhoto(URL.createObjectURL(f)); e.target.value = ''; };
  const create = () => { const n = name.trim(); if (n) { onCreate(n, icon, photo); } };
  return (
    <Sheet open={open} onClose={onClose} title="New Collection">
      <div className="bp-newcoll-head">
        <button className="bp-newcoll-preview" onClick={() => photoRef.current && photoRef.current.click()} aria-label="Set cover photo">
          {photo
            ? <img className="bp-newcoll-photo" src={photo} alt="" />
            : <Icon name={icon} size={26} strokeWidth={1.9} color="var(--accent-deep)" />}
          <span className="bp-newcoll-cam"><Icon name="camera" size={12} strokeWidth={2.2} color="var(--on-accent)" /></span>
        </button>
        <input ref={photoRef} type="file" accept="image/*" hidden onChange={onPhotoFile} />
        <input className="bp-add-input" placeholder="Collection name" value={name}
          autoFocus onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && create()} />
      </div>

      <div className="bp-suggest-label">Choose an icon</div>
      <div className="bp-icon-grid">
        {COLL_ICONS.map(ic => (
          <button key={ic} className={'bp-icon-opt' + (icon === ic ? ' sel' : '')} onClick={() => setIcon(ic)} aria-label={ic}>
            <Icon name={ic} size={22} strokeWidth={1.9} color={icon === ic ? 'var(--accent-deep)' : 'var(--fg2)'} />
          </button>
        ))}
      </div>
      <button className="bp-cta bp-newcoll-cta" disabled={!name.trim()} onClick={create}>Create Collection</button>
    </Sheet>
  );
}

// --- Add / remove recipes from a collection ---
function AddToCollectionSheet({ open, onClose, collection, recipes, onToggle }) {
  if (!collection) return null;
  const set = new Set(collection.recipeIds);
  return (
    <Sheet open={open} onClose={onClose} title={'Add to ' + collection.name}>
      <div className="bp-pick-list">
        {recipes.map(r => {
          const on = set.has(r.id);
          return (
            <button key={r.id} className={'bp-pick-row' + (on ? ' on' : '')} onClick={() => onToggle(collection.id, r.id)}>
              <span className="bp-pick-info">
                <span className="bp-pick-title">{r.title}</span>
                <span className="bp-pick-meta">{r.time}</span>
              </span>
              <span className={'bp-pick-add' + (on ? ' on' : '')}>
                <Icon name={on ? 'check' : 'plus'} size={16} strokeWidth={2.6} color={on ? 'var(--on-accent)' : 'var(--accent-deep)'} />
              </span>
            </button>
          );
        })}
      </div>
      <button className="bp-cta bp-pick-done" onClick={onClose}>Done</button>
    </Sheet>
  );
}

// --- Choose a collection (used by bulk "Add to Collection") ---
function PickCollectionSheet({ open, onClose, collections, recipes, count, onPick, onNew }) {
  return (
    <Sheet open={open} onClose={onClose} title={count ? `Add ${count} ${count === 1 ? 'recipe' : 'recipes'} to…` : 'Add to Collection'}>
      <div className="bp-collections">
        {collections.map(c => {
          const n = recipes.filter(r => c.recipeIds.includes(r.id)).length;
          return (
            <button key={c.id} className="bp-coll-row" onClick={() => onPick(c)}>
              <span className="bp-coll-row-tile"><Icon name={c.icon || 'folder'} size={19} strokeWidth={1.9} color="var(--accent-deep)" /></span>
              <span className="bp-coll-row-text">
                <span className="bp-coll-row-name">{c.name}</span>
                <span className="bp-coll-row-count">{n} {n === 1 ? 'recipe' : 'recipes'}</span>
              </span>
              <Icon name="plus" size={18} strokeWidth={2.2} color="var(--fg3)" />
            </button>
          );
        })}
        <button className="bp-link bp-add-item" onClick={onNew}><Icon name="plus" size={16} strokeWidth={2.2} />New Collection</button>
      </div>
    </Sheet>
  );
}

// --- Lightweight confirmation toast ---
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="bp-toast"><Icon name="check" size={16} strokeWidth={2.6} color="var(--on-accent)" />{message}</div>
  );
}

function RenameCollectionSheet({ open, onClose, collection, onRename }) {
  const [name, setName] = useState('');
  useEffect(() => { if (open && collection) setName(collection.name); }, [open]);
  const save = () => { if (name.trim()) { onRename(collection.id, name.trim()); onClose(); } };
  return (
    <Sheet open={open} onClose={onClose} title="Rename Collection">
      <input className="bp-add-input" value={name} autoFocus
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && save()} />
      <button className="bp-cta bp-sheet-cta" disabled={!name.trim()} onClick={save}>Save</button>
    </Sheet>
  );
}

Object.assign(window, { Collections, CollectionDetail, NewCollectionSheet, AddToCollectionSheet, PickCollectionSheet, Toast, RenameCollectionSheet });
