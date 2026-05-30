// ============================================================
// BarePlate UI Kit — Cook Mode & Done Cooking
// ============================================================

function CookMode({ recipe, startStep, onExit, onDone, onVoice, textSize, setTextSize }) {
  const steps = recipe.steps;
  const [i, setI] = useState(startStep || 0);
  const [timerAdj, setTimerAdj] = useState(0);
  const step = steps[i];
  const start = useRef(null);

  useEffect(() => { setTimerAdj(0); }, [i]);

  const SIZES = ['s', 'm', 'l'];
  const ci = Math.max(0, SIZES.indexOf(textSize));

  // Single function to cycle through sizes
  const cycleTextSize = () => {
    const nextIndex = (ci + 1) % SIZES.length;
    setTextSize(SIZES[nextIndex]);
  };

  // Pure structural rule: if this step has a timer, preview the next step's text
  // under it. No text parsing, no keywords — just steps[i].timer → steps[i+1].text.
  const nextStep = (step.timer && steps[i + 1]) ? steps[i + 1] : null;

  const isLast = i >= steps.length - 1;
  const next = () => { if (!isLast) setI(i + 1); else onDone(); };
  const prev = () => { if (i > 0) setI(i - 1); };

  const onTouchStart = e => { start.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (start.current == null) return;
    const dx = e.changedTouches[0].clientX - start.current;
    if (dx < -50) next(); else if (dx > 50) prev();
    start.current = null;
  };

  const baseSecs = (step.timer ? step.timer.mins : 0) * 60;
  const totalSecs = Math.max(0, baseSecs + timerAdj);
  const displayM = Math.floor(totalSecs / 60);
  const displayS = totalSecs % 60;

  const readScale = ci === 0 ? 0.9 : ci === 1 ? 1 : 1.15;

  return (
    <div className="bp-cook" style={{ '--read-scale': readScale }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="bp-cook-top">
        <button className="bp-cook-x" onClick={onExit}><Icon name="x" size={24} strokeWidth={2.2} /></button>
        <span className="bp-cook-name">{recipe.title}</span>
        <div className="bp-cook-top-actions">
          {/* New single-tap text size cycler */}
          <button onClick={cycleTextSize} style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg1)' }}>
            <span style={{ fontSize: '18px', fontWeight: '700' }}>Aa</span>
          </button>
        </div>
      </div>

      <div className="bp-cook-dots">
        {steps.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={'bp-dot' + (idx < i ? ' done' : idx === i ? ' active' : '')} style={{ flexShrink: 0 }}>
            {idx < i ? <Icon name="check" size={12} strokeWidth={3} /> : idx + 1}
          </button>
        ))}
      </div>

      <div className="bp-cook-body">
        {step.pills && step.pills.length > 0 &&
          <div className="bp-cook-ings">
            {step.pills.map((p, j) => (
              <div key={j} className="bp-cook-ing"><span>{p.name}</span><span className="amt">{p.amt}</span></div>
            ))}
          </div>}
        <p className="bp-cook-text">{step.text}</p>

        {step.timer &&
          <div className="bp-cook-timer" style={{ padding: '24px' }}>
            <div style={{ flex: 1 }}>
              <div className="bp-cook-timer-label">{step.timer.label}</div>
              <div className="bp-cook-timer-time">
                {String(displayM).padStart(2, '0')}:{String(displayS).padStart(2, '0')}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setTimerAdj(a => Math.max(-baseSecs, a - 30))} style={{ padding: '6px 14px', background: 'var(--surface-2)', borderRadius: '999px', fontSize: '14px', fontWeight: 'bold' }}>- 30s</button>
                <button onClick={() => setTimerAdj(a => a + 30)} style={{ padding: '6px 14px', background: 'var(--surface-2)', borderRadius: '999px', fontSize: '14px', fontWeight: 'bold' }}>+ 30s</button>
              </div>
            </div>

            <button className="bp-cook-timer-play" style={{ width: '64px', height: '64px' }}><Icon name="play" size={26} strokeWidth={2.4} /></button>
          </div>}

        {/* If this step has a timer, preview the next step so the cook can get a
            head start during the countdown. Pure structural rule. */}
        {nextStep &&
          <div className="bp-meanwhile">
            <div className="bp-meanwhile-label">
              <Icon name="corner-down-right" size={15} strokeWidth={2.4} />
              While you wait, check out the next step
            </div>
            <div className="bp-meanwhile-card">
              <span className="bp-meanwhile-text">{nextStep.text}</span>
            </div>
          </div>}
      </div>

      <div className="bp-cook-nav">
        <button className="bp-cook-side-btn" onClick={prev} disabled={i === 0}>
          <Icon name="chevron-left" size={18} strokeWidth={2.4} /> Back
        </button>

        <button className="bp-cook-mic-center" onClick={onVoice} aria-label="Voice Assistant">
          <Icon name="mic" size={28} strokeWidth={2.2} />
        </button>

        <button className="bp-cook-side-btn" onClick={next}>
          {isLast ? 'Finish' : 'Next'} <Icon name="chevron-right" size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function DoneCooking({ recipe, onMarkCooked, onGrocery, onShare, onBack, onBackToSteps }) {
  const [milestone] = useState(() => (recipe.cooked || 0) + 1);
  const [marked, setMarked] = useState(false);
  const doMark = () => { if (marked) return; setMarked(true); onMarkCooked(); };
  return (
    <div className="bp-done">
      <button className="bp-done-topback" onClick={onBackToSteps || onBack} aria-label="Back to last step">
        <Icon name="arrow-left" size={20} strokeWidth={2.2} />
      </button>
      <div className="bp-done-inner">
        <div className="bp-done-spark"><Icon name="sparkles" size={48} strokeWidth={1.75} color="var(--accent)" /></div>
        <h1 className="bp-display bp-done-title">Enjoy your meal</h1>
        <div className="bp-done-sub">{recipe.title} · {recipe.steps.length} steps done</div>
        <div className="bp-done-chip">{ordinal(milestone)} time cooking this</div>

        <div className="bp-done-actions">
          <button className={'bp-cta bp-done-primary' + (marked ? ' marked' : '')} onClick={doMark} disabled={marked}>
            <Icon name={marked ? 'check' : 'chef-hat'} size={20} strokeWidth={2} />{marked ? 'Marked as Cooked' : 'Mark as Cooked'}
          </button>
          <button className="bp-done-secondary" onClick={onGrocery}><Icon name="shopping-basket" size={19} strokeWidth={1.9} />Add to Grocery</button>
          <button className="bp-done-secondary" onClick={onShare}><Icon name="share" size={19} strokeWidth={1.9} />Share Recipe</button>
          <button className="bp-done-back" onClick={onBack}>Back to Recipe</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CookMode, DoneCooking });
