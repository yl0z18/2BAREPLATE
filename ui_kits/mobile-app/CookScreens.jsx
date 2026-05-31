// ============================================================
// BarePlate UI Kit — Cook Mode & Done Cooking
// ============================================================

// Module-level timer persistence: stores { endTime, stepIndex, recipeId } when running
const _timerState = { endTime: null, recipeId: null, stepIndex: null };

function beepDone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach(offset => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880;
      o.type = 'sine';
      g.gain.setValueAtTime(0.4, ctx.currentTime + offset);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.25);
      o.start(ctx.currentTime + offset);
      o.stop(ctx.currentTime + offset + 0.25);
    });
  } catch(e) {}
}

function CookMode({ recipe, startStep, onExit, onDone, onVoice, textSize, setTextSize, onTimerUpdate }) {
  const steps = recipe.steps;
  const [i, setI] = useState(startStep || 0);
  const [timerAdj, setTimerAdj] = useState(0);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef(null);
  const step = steps[i];

  const SIZES = ['s', 'm', 'l'];
  const ci = Math.max(0, SIZES.indexOf(textSize));
  const cycleTextSize = () => setTextSize(SIZES[(ci + 1) % SIZES.length]);

  const baseSecs = (step.timer ? step.timer.mins : 0) * 60;
  const totalSecs = Math.max(0, baseSecs + timerAdj);

  useEffect(() => {
    setTimerAdj(0); setRunning(false); setTimerDone(false);
    clearInterval(intervalRef.current);
    _timerState.endTime = null;
    setRemaining(0);
    if (onTimerUpdate) onTimerUpdate(null);
  }, [i]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!running) return;
    intervalRef.current = setInterval(() => {
      const r = Math.max(0, Math.round((_timerState.endTime - Date.now()) / 1000));
      setRemaining(r);
      if (onTimerUpdate) onTimerUpdate({ remaining: r, label: step.timer && step.timer.label, stepIndex: i });
      if (r === 0) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setTimerDone(true);
        beepDone();
        _timerState.endTime = null;
        if (onTimerUpdate) onTimerUpdate(null);
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const startTimer = () => {
    const secs = Math.max(0, totalSecs - remaining > 0 ? remaining : totalSecs);
    _timerState.endTime = Date.now() + (remaining > 0 && !timerDone ? remaining : totalSecs) * 1000;
    _timerState.recipeId = recipe.id;
    _timerState.stepIndex = i;
    setRemaining(remaining > 0 && !timerDone ? remaining : totalSecs);
    setRunning(true);
    setTimerDone(false);
  };

  const displaySecs = running || remaining > 0 ? remaining : totalSecs;
  const displayM = Math.floor(displaySecs / 60);
  const displayS = displaySecs % 60;

  const nextStep = (step.timer && steps[i + 1]) ? steps[i + 1] : null;
  const isLast = i >= steps.length - 1;
  const next = () => { if (!isLast) setI(i + 1); else onDone(); };
  const prev = () => { if (i > 0) setI(i - 1); };
  const start = useRef(null);
  const onTouchStart = e => { start.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (start.current == null) return;
    const dx = e.changedTouches[0].clientX - start.current;
    if (dx < -50) next(); else if (dx > 50) prev();
    start.current = null;
  };
  const readScale = ci === 0 ? 0.9 : ci === 1 ? 1 : 1.15;

  return (
    <div className="bp-cook" style={{ '--read-scale': readScale }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="bp-cook-top">
        <button className="bp-cook-x" onClick={onExit}><Icon name="x" size={24} strokeWidth={2.2} /></button>
        <span className="bp-cook-name">{recipe.title}</span>
        <button onClick={cycleTextSize} style={{ width:'42px',height:'42px',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--fg1)' }}>
          <span style={{ fontSize:'18px',fontWeight:'700' }}>Aa</span>
        </button>
      </div>

      <div className="bp-cook-dots">
        {steps.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)}
            className={'bp-dot' + (idx < i ? ' done' : idx === i ? ' active' : '')}
            style={{ flexShrink: 0 }}>
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

        {step.timer && (
          <div className="bp-cook-timer">
            <div className="bp-cook-timer-label">{step.timer.label}</div>
            <div className="bp-cook-timer-row">
              <button className="bp-cook-timer-adj" onClick={() => {
                const newR = Math.max(0, (running ? remaining : totalSecs) - 15);
                setTimerAdj(a => a - 15);
                if (running) { _timerState.endTime = Date.now() + newR * 1000; setRemaining(newR); }
              }}>−15s</button>
              <div className="bp-cook-timer-time">
                {String(displayM).padStart(2,'0')}:{String(displayS).padStart(2,'0')}
              </div>
              <button className="bp-cook-timer-adj" onClick={() => {
                setTimerAdj(a => a + 15);
                if (running) { const newR = remaining + 15; _timerState.endTime = Date.now() + newR * 1000; setRemaining(newR); }
              }}>+15s</button>
              <button className="bp-cook-timer-play" onClick={() => running ? setRunning(false) : startTimer()}>
                <Icon name={running ? 'pause' : 'play'} size={26} strokeWidth={2.4} />
              </button>
            </div>
            {timerDone && (
              <div className="bp-cook-timer-done">
                <span>⏰ Time's up!</span>
                <button className="bp-cook-timer-ack" onClick={() => setTimerDone(false)}>Got it</button>
              </div>
            )}
          </div>
        )}

        {nextStep && (
          <div className="bp-meanwhile">
            <div className="bp-meanwhile-label">
              <Icon name="corner-down-right" size={15} strokeWidth={2.4} />
              Up next
            </div>
            <div className="bp-meanwhile-card">
              <span className="bp-meanwhile-text">{nextStep.text}</span>
            </div>
          </div>
        )}
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

function DoneCooking({ recipe, milestone: milestoneProp, onMarkCooked, onGrocery, onShare, onBack, onBackToSteps }) {
  const milestone = milestoneProp != null ? milestoneProp : (recipe.cooked || 0) + 1;
  const [marked, setMarked] = useState(false);
  const doMark = () => { if (marked) return; setMarked(true); onMarkCooked(); };
  return (
    <div className="bp-done">
      <button className="bp-done-topback" onClick={onBackToSteps || onBack} aria-label="Back to last step">
        <Icon name="chevron-left" size={20} strokeWidth={2.2} />
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