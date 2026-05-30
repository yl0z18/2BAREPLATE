// ============================================================
// BarePlate UI Kit — App root & navigation
// ============================================================

function useStored(key, init) {
  const [v, setV] = useState(() => {
    try {
      return localStorage.getItem(key) || init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, v);
    } catch {}
  }, [v]);
  return [v, setV];
}

const PAYWALL = ['nyt', 'paywall', 'cooking.nytimes'];

const UNIT_OPTS = [
  { id: 'metric', label: 'Metric (g, ml, °C)' },
  { id: 'us', label: 'US (oz, cups, °F)' },
];
const LANG_OPTS = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'ja', label: '日本語' },
];

function App() {
  const [theme, setTheme] = useStored('bp-theme', 'saffron');
  const [mode, setMode] = useStored('bp-mode', 'light');
  const [textSize, setTextSize] = useStored('bp-textsize', 'm'); // s | m | l
  const [units, setUnits] = useStored('bp-units', 'metric'); // metric | us
  const [language, setLanguage] = useStored('bp-lang', 'en');
  const [sort, setSort] = useStored('bp-sort', 'recent');
  const [filter, setFilter] = useStored('bp-filter', 'all');
  const [tab, setTab] = useState('recipes');
  const [view, setView] = useState('list'); // list | detail | cook | done | edit
  const [cookAtEnd, setCookAtEnd] = useState(false); // resume cook mode on its last step
  const [selected, setSelected] = useState(null);
  const [overlay, setOverlay] = useState(null); // add | signin | collections | sortfilter | share | voice | grocerytarget | units | language | ...
  const [modal, setModal] = useState(null); // {type:'loading'|'fail', url}
  const [groceryLists, setGroceryLists] = useState(() => [
    { id: 'g0', name: 'My List', groups: JSON.parse(JSON.stringify(GROCERY)) }
  ]);
  const [groceryListId, setGroceryListId] = useState(null); // null = home
  const [recipes, setRecipes] = useState(RECIPES);
  const [collections, setCollections] = useState(COLLECTIONS);
  const [colId, setColId] = useState(null); // active collection id
  const [detailFrom, setDetailFrom] = useState('list'); // where recipe-detail back returns
  const [pendingPick, setPendingPick] = useState([]); // recipe ids awaiting a collection
  const [toast, setToast] = useState(null);
  const [recipesNonce, setRecipesNonce] = useState(0);
  const [confirm, setConfirm] = useState(null); // {title, message, confirmLabel, danger, action}
  const [editingNew, setEditingNew] = useState(false); // true while writing a brand-new recipe
  const [renamingCol, setRenamingCol] = useState(null);

  const collection = collections.find((c) => c.id === colId) || null;
  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1900);
  };
  const askConfirm = (cfg) => setConfirm(cfg);
  const runConfirm = () => {
    if (confirm && confirm.action) confirm.action();
    setConfirm(null);
  };

  const openRecipe = (r, from = 'list') => {
    setSelected(r);
    setDetailFrom(from);
    setView('detail');
  };

  const openCollections = () => {
    setOverlay(null);
    setView('collections');
  };
  const openCollection = (c) => {
    setColId(c.id);
    setView('collection');
  };
  const createCollection = (name, icon = 'folder', photo = null) => {
    const id = 'c' + Date.now();
    const ids = pendingPick.length ? [...pendingPick] : [];
    setCollections((cs) => [...cs, { id, name, icon, photo, recipeIds: ids }]);
    setOverlay(null);
    if (pendingPick.length) {
      flashToast(`Created “${name}”`);
      setPendingPick([]);
    } else {
      setColId(id);
      setView('collection');
    }
  };
  const toggleInCollection = (cid, rid) =>
    setCollections((cs) =>
      cs.map((c) =>
        c.id !== cid
          ? c
          : {
              ...c,
              recipeIds: c.recipeIds.includes(rid)
                ? c.recipeIds.filter((x) => x !== rid)
                : [...c.recipeIds, rid],
            }
      )
    );
  const removeFromCollection = (cid, rid) =>
    setCollections((cs) =>
      cs.map((c) =>
        c.id !== cid
          ? c
          : { ...c, recipeIds: c.recipeIds.filter((x) => x !== rid) }
      )
    );
  const deleteCollections = (ids) =>
    askConfirm({
      title:
        ids.length === 1
          ? 'Delete collection?'
          : `Delete ${ids.length} collections?`,
      message:
        'Your recipes stay in your cookbook — only the ' +
        (ids.length === 1 ? 'collection is' : 'collections are') +
        ' removed.',
      confirmLabel: 'Delete',
      danger: true,
      action: () => {
        setCollections((cs) => cs.filter((c) => !ids.includes(c.id)));
        flashToast(
          ids.length === 1
            ? 'Collection deleted'
            : `${ids.length} collections deleted`
        );
      },
    });
  const pickCollection = (c) => {
    setCollections((cs) =>
      cs.map((x) =>
        x.id !== c.id
          ? x
          : { ...x, recipeIds: [...new Set([...x.recipeIds, ...pendingPick])] }
      )
    );
    const n = pendingPick.length;
    setOverlay(null);
    setPendingPick([]);
    flashToast(`Added ${n} to ${c.name}`);
  };

  const handlePaste = (url) => {
    setOverlay(null);
    setModal({ type: 'loading', url });
  };
  const completeExtraction = () => {
    const url = (modal && modal.url) || '';
    if (PAYWALL.some((p) => url.toLowerCase().includes(p))) {
      setModal({ type: 'fail', url });
    } else {
      // video sources land on the Review-flagged recipe
      const isVideo = /youtube|tiktok|instagram/.test(url.toLowerCase());
      const r = isVideo
        ? recipes.find((x) => x.id === 'salmon')
        : recipes.find((x) => x.id === 'noodles');
      setModal(null);
      setTab('recipes');
      setSelected(r);
      setView('detail');
      setTimeout(() => setOverlay('signin'), 600);
    }
  };

  const markCooked = () => {
    setRecipes((rs) =>
      rs.map((r) =>
        r.id === selected.id ? { ...r, cooked: (r.cooked || 0) + 1 } : r
      )
    );
    setSelected((s) => ({ ...s, cooked: (s.cooked || 0) + 1 }));
  };
  const adjustCooked = (delta) => {
    setRecipes((rs) =>
      rs.map((r) =>
        r.id === selected.id
          ? { ...r, cooked: Math.max(0, (r.cooked || 0) + delta) }
          : r
      )
    );
    setSelected((s) => ({
      ...s,
      cooked: Math.max(0, (s.cooked || 0) + delta),
    }));
  };
  const saveEdit = (updated) => {
    setRecipes((rs) =>
      rs.some((r) => r.id === updated.id)
        ? rs.map((r) => (r.id === updated.id ? updated : r))
        : [updated, ...rs]
    );
    setSelected(updated);
    setEditingNew(false);
    setView('detail');
    flashToast('Recipe saved');
  };

  // "Write it myself" — open the editor on a fresh, blank recipe.
  const writeNewRecipe = () => {
    const blank = {
      id: 'r' + Date.now(),
      title: '',
      source: 'Written by you',
      creator: 'You',
      time: '',
      cooked: 0,
      rating: 0,
      serves: 2,
      photo: '',
      flags: [],
      sections: [{ label: 'Main', items: [{ name: '', amt: '' }] }],
      steps: [{ text: '', pills: [], timer: null }],
    };
    setModal(null);
    setOverlay(null);
    setTab('recipes');
    setSelected(blank);
    setEditingNew(true);
    setView('edit');
  };

  const toggleGroc = (gi, ii) =>
    setGrocery((g) =>
      g.map((grp, x) =>
        x !== gi
          ? grp
          : {
              ...grp,
              items: grp.items.map((it, y) =>
                y !== ii ? it : { ...it, checked: !it.checked }
              ),
            }
      )
    );
  const addGroceryItem = (name, amt) =>
    setGrocery((g) => {
      const base = g.length
        ? g.map((x) => ({ ...x, items: [...x.items] }))
        : [];
      let a = base.find((x) => x.aisle === 'Added by you');
      if (!a) {
        a = { aisle: 'Added by you', items: [] };
        base.push(a);
      }
      a.items.push({
        name,
        amt: amt || '',
        src: 'Added manually',
        checked: false,
      });
      return base;
    });
  const clearChecked = () =>
    setGrocery((g) =>
      g
        .map((a) => ({ ...a, items: a.items.filter((i) => !i.checked) }))
        .filter((a) => a.items.length)
    );
  const setAllGroc = (val) =>
    setGrocery((g) =>
      g.map((a) => ({
        ...a,
        items: a.items.map((i) => ({ ...i, checked: val })),
      }))
    );
  const deleteGroceryItem = (gi, ii) =>
    setGrocery((g) =>
      g
        .map((grp, x) =>
          x !== gi
            ? grp
            : { ...grp, items: grp.items.filter((_, y) => y !== ii) }
        )
        .filter((grp) => grp.items.length)
    );
  const deleteGroceryList = () =>
    askConfirm({
      title: 'Delete grocery list?',
      message: 'This clears every item from your list. This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
      action: () => {
        setGrocery([]);
        flashToast('List cleared');
      },
    });

  const recipeToItems = (r) =>
    ((r && r.sections) || []).flatMap((s) =>
      s.items.map((it) => ({
        name: it.name,
        amt: it.amt,
        src: r.title,
        checked: false,
      }))
    );
  const addRecipeToGrocery = (fresh) => {
    const items = recipeToItems(selected);
    setGrocery((g) => {
      const base = fresh ? [] : g.map((x) => ({ ...x, items: [...x.items] }));
      let a = base.find((x) => x.aisle === 'From recipes');
      if (!a) {
        a = { aisle: 'From recipes', items: [] };
        base.push(a);
      }
      a.items.push(...items);
      return base;
    });
    setOverlay(null);
    setView('detail');
    setTab('grocery');
    flashToast(fresh ? 'Started a new list' : 'Added to your list');
  };

  const deleteAllData = () =>
    askConfirm({
      title: 'Delete all data?',
      message:
        'Permanently removes every recipe, collection, and grocery list from this device. This can’t be undone.',
      confirmLabel: 'Delete All',
      danger: true,
      action: () => {
        setRecipes([]);
        setGrocery([]);
        setCollections([]);
        setTab('recipes');
        setView('list');
        flashToast('All data deleted');
      },
    });

  const bulkDelete = (ids) =>
    setRecipes((rs) => rs.filter((r) => !ids.includes(r.id)));
  const bulkCollection = (ids) => {
    setPendingPick(ids);
    setOverlay('pickcollection');
  };

  // sorted + filtered list for My Recipes
  const displayRecipes = (() => {
    let list = recipes.slice();
    if (filter === 'uncooked') list = list.filter((r) => !(r.cooked > 0));
    if (sort === 'cooked')
      list.sort((a, b) => (b.cooked || 0) - (a.cooked || 0));
    else if (sort === 'alpha')
      list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  })();

  const readScale = { s: 0.9, m: 1, l: 1.15 }[textSize] || 1;
  const faded = view === 'cook' || view === 'done' || view === 'edit';
  const groceryCount = grocery.reduce((n, g) => n + g.items.length, 0);

  let content;
  if (tab === 'recipes') {
    if (view === 'edit' && selected)
      content = (
        <EditRecipe
          recipe={selected}
          onCancel={() => {
            setEditingNew(false);
            setView(editingNew ? 'list' : 'detail');
          }}
          onSave={saveEdit}
        />
      );
    else if (view === 'detail' && selected)
      content = (
        <RecipeDetail
          recipe={selected}
          onBack={() => setView(detailFrom)}
          onEdit={() => setView('edit')}
          onShare={() => setOverlay('share')}
          onCook={() => {
            setCookMilestone((selected.cooked || 0) + 1);
            setCookAtEnd(false);
            setView('cook');
          }}
          onAdjustCooked={adjustCooked}
        />
      );
    else if (view === 'cook' && selected)
      content = (
        <CookMode
          recipe={selected}
          startStep={cookAtEnd ? Math.max(0, selected.steps.length - 1) : 0}
          onExit={() => setView('detail')}
          onDone={() => setView('done')}
          onVoice={() => setOverlay('voice')}
          textSize={textSize}
          setTextSize={setTextSize}
        />
      );
    else if (view === 'done' && selected)
      content = (
        <DoneCooking
          recipe={selected}
          milestone={cookMilestone}
          onMarkCooked={markCooked}
          onGrocery={() => setOverlay('grocerytarget')}
          onShare={() => setOverlay('share')}
          onBack={() => setView('detail')}
          onBackToSteps={() => {
            setCookAtEnd(true);
            setView('cook');
          }}
        />
      );
    else if (view === 'collections')
      content = (
        <Collections
          collections={collections}
          recipes={recipes}
          onBack={() => setView('list')}
          onOpen={openCollection}
          onNew={() => setOverlay('newcollection')}
          onDeleteCollections={deleteCollections}
        />
      );
    else if (view === 'collection' && collection)
      content = (
        <CollectionDetail
          collection={collection}
          recipes={recipes}
          onBack={() => setView('collections')}
          onOpen={(r) => openRecipe(r, 'collection')}
          onAddRecipes={() => setOverlay('addtocollection')}
          onRemove={removeFromCollection}
          onRename={(c) => setRenamingCol(c)}
        />
      );
    else if (view === 'search')
      content = (
        <SearchScreen
          recipes={recipes}
          onBack={() => setView('list')}
          onOpen={(r) => openRecipe(r, 'search')}
        />
      );
    else
      content = (
        <MyRecipes
          key={recipesNonce}
          recipes={displayRecipes}
          totalCount={recipes.length}
          onOpen={openRecipe}
          onAdd={() => setOverlay('add')}
          onSearch={() => setView('search')}
          onCollections={openCollections}
          onSortFilter={() => setOverlay('sortfilter')}
          onBulkDelete={bulkDelete}
          onBulkCollection={bulkCollection}
        />
      );
  } else if (tab === 'grocery') {
    content = (
      <GroceryList
        data={grocery}
        onToggle={toggleGroc}
        onAddItem={addGroceryItem}
        onClearChecked={clearChecked}
        onToggleAll={setAllGroc}
        onDeleteList={deleteGroceryList}
        onDeleteItem={deleteGroceryItem}
      />
    );
  } else {
    content = (
      <Profile
        theme={theme}
        setTheme={setTheme}
        mode={mode}
        setMode={setMode}
        textSize={textSize}
        setTextSize={setTextSize}
        units={units}
        language={language}
        langLabel={(LANG_OPTS.find((l) => l.id === language) || {}).label}
              onLanguage={() => setOverlay('language')}
        onDeleteAll={deleteAllData}
        onSignIn={() => setOverlay('signin')}
        onBackup={() => flashToast('Coming soon')}
        onPrivacy={() => flashToast('Coming soon')}
      />
    );
  }

  return (
    <PhoneFrame theme={theme} mode={mode} readScale={readScale}>
      <StatusBar dark={mode === 'dark'} />
      <div className="bp-app">
        {content}
        <TabBar
          active={tab}
          onChange={(t) => {
            if (t === 'recipes') setRecipesNonce((n) => n + 1);
            setTab(t);
            setView('list');
          }}
          faded={faded}
        />
      </div>

      <AddRecipeSheet
        open={overlay === 'add'}
        onClose={() => setOverlay(null)}
        onPaste={handlePaste}
        onScan={() => handlePaste('camera scan')}
        onWrite={writeNewRecipe}
      />
      <SignInSheet
        open={overlay === 'signin'}
        onClose={() => setOverlay(null)}
        count={recipes.length}
      />
      <NewCollectionSheet
        open={overlay === 'newcollection'}
        onClose={() => {
          setOverlay(null);
          setPendingPick([]);
        }}
        onCreate={createCollection}
      />
      <PickCollectionSheet
        open={overlay === 'pickcollection'}
        onClose={() => {
          setOverlay(null);
          setPendingPick([]);
        }}
        collections={collections}
        recipes={recipes}
        count={pendingPick.length}
        onPick={pickCollection}
        onNew={() => setOverlay('newcollection')}
      />
      <AddToCollectionSheet
        open={overlay === 'addtocollection'}
        onClose={() => setOverlay(null)}
        collection={collection}
        recipes={recipes}
        onToggle={toggleInCollection}
      />

      <SortFilterSheet
        open={overlay === 'sortfilter'}
        onClose={() => setOverlay(null)}
        sort={sort}
        setSort={setSort}
        filter={filter}
        setFilter={setFilter}
      />
      <ShareSheet
        open={overlay === 'share'}
        onClose={() => setOverlay(null)}
        recipe={selected}
        onAction={(t) => {
          setOverlay(null);
          flashToast(t.id === 'copy' ? 'Link copied' : 'Shared via ' + t.label);
        }}
      />
      <VoiceAssistantSheet
        open={overlay === 'voice'}
        onClose={() => setOverlay(null)}
      />
      <GroceryTargetSheet
        open={overlay === 'grocerytarget'}
        onClose={() => setOverlay(null)}
        recipe={selected}
        count={groceryCount}
        onAddExisting={() => addRecipeToGrocery(false)}
        onStartNew={() => addRecipeToGrocery(true)}
      />
      <ChoiceSheet
        open={overlay === 'language'}
        onClose={() => setOverlay(null)}
        title="Language"
        options={LANG_OPTS}
        value={language}
        onPick={setLanguage}
      />
      <RenameCollectionSheet
        open={!!renamingCol}
        onClose={() => setRenamingCol(null)}
        collection={renamingCol}
        onRename={(id, name) => setCollections(cs => cs.map(c => c.id === id ? { ...c, name } : c))}
      />

      <Toast message={toast} />
      <ConfirmDialog
        open={!!confirm}
        {...(confirm || {})}
        onConfirm={runConfirm}
        onCancel={() => setConfirm(null)}
      />

      {modal && modal.type === 'loading' && (
        <div className="bp-modal">
          <ExtractionLoading
            url={modal.url}
            onCancel={() => setModal(null)}
            onComplete={completeExtraction}
          />
        </div>
      )}
      {modal && modal.type === 'fail' && (
        <div className="bp-modal">
          <ExtractionFailure
            url={modal.url}
            onClose={() => setModal(null)}
            onRetry={() =>
              setModal({ type: 'loading', url: 'smittenkitchen.com' })
            }
            onScan={() => setModal({ type: 'loading', url: 'camera scan' })}
            onWrite={writeNewRecipe}
          />
        </div>
      )}
    </PhoneFrame>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
