// shared.jsx — reusable bits across concepts
const { useState, useEffect, useRef, useMemo } = React;

// Inline SVG — small botanical / typographic marks
const Mark = {
  // Orange AB roundel (used on dark)
  roundelOrange: "./assets/logo-roundel-orange.svg",
  roundelWhite: "./assets/logo-roundel-white.svg",
  wordBlack: "./assets/logo-text-black.svg",
  wordWhite: "./assets/logo-text-white.svg",
};

// Mini site skeleton — used by ambient / floating concepts to show Jarvis in context
const SiteSkeleton = ({ compact = false, children, dimmed = false }) => (
  <div className="skeleton" style={{ filter: dimmed ? "brightness(0.92)" : "none" }}>
    <div className="skeleton__nav">
      <div className="skeleton__nav-left">
        <span>SHOP</span><span>SOCIETY</span><span>MASTERCLASSES</span>
      </div>
      <div className="skeleton__brand">
        <img src={Mark.roundelOrange} alt="" />
        <div>
          <span className="skeleton__brand-name">ASTERLEY BROS</span>
          <span className="skeleton__brand-sub">London</span>
        </div>
      </div>
      <div className="skeleton__nav-right">
        <span>STORY</span><span>BASKET · 2</span>
      </div>
    </div>
    {!compact && (<>
      <div className="skeleton__hero">
        <div className="skeleton__hero-eye">● EST. 2017 · SOUTH LONDON</div>
        <div className="skeleton__hero-h">ENGLISH VERMOUTH,<br/><span className="caslon">Amaro</span> &amp; APERITIVO.</div>
        <p className="skeleton__hero-sub">Handmade with integrity in South London.</p>
      </div>
      <div className="skeleton__prods">
        {[
          { tag: "AMARO", name: "DISPENSE", price: "£30.95", bg: "#1a1a1a" },
          { tag: "VERMOUTH", name: "ESTATE", price: "£25.95", bg: "#2E3A2A" },
          { tag: "DRY", name: "SCHOFIELDS", price: "£25.25", bg: "#1F2A3C" },
          { tag: "FERNET", name: "BRITANNICA", price: "£36.75", bg: "#0f0f0f" },
        ].map(p => (
          <div key={p.name} className="skeleton__prod">
            <div className="skeleton__prod-tag">{p.tag}</div>
            <div className="skeleton__prod-bot" style={{ "--pb": p.bg }} />
            <div>
              <div className="skeleton__prod-name">{p.name}</div>
              <div className="skeleton__prod-price">{p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </>)}
    {children}
  </div>
);

// A single pill button used across concepts
const PillBtn = ({ children, onClick, variant = "ghost", style }) => {
  const base = {
    border: 0, cursor: "pointer", fontFamily: "inherit",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
    padding: "10px 16px", borderRadius: 0, transition: "all 220ms var(--ease)",
  };
  const variants = {
    ghost: { background: "transparent", color: "var(--ab-off-white)", border: "1px solid rgba(243,238,228,0.25)" },
    solid: { background: "var(--ab-orange)", color: "var(--ab-off-black)" },
    dark: { background: "var(--ab-black)", color: "var(--ab-off-white)" },
    orange: { background: "transparent", color: "var(--ab-orange)", border: "1px solid var(--ab-orange)" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

// An analysis block that sits below each concept's frames
const Analysis = ({ subversion, surfaces, tradeoffs, complexity, aging, ratings }) => (
  <div className="analysis">
    <div>
      <h4>How it subverts the form</h4>
      <p>{subversion}</p>
      <h4 style={{marginTop:24}}>Functional surfaces</h4>
      <ul>
        {surfaces.map((s, i) => (
          <li key={i}><b>{s.k}</b><span>{s.v}</span></li>
        ))}
      </ul>
    </div>
    <div>
      <h4>Trade-offs</h4>
      <ul>
        {tradeoffs.map((t, i) => (
          <li key={i} style={{gridTemplateColumns: "1fr"}}><span style={{fontSize:14}}>— {t}</span></li>
        ))}
      </ul>
      <h4 style={{marginTop:24}}>Build complexity</h4>
      <p style={{fontSize:14}}><b style={{color:"var(--ab-orange)",letterSpacing:"0.2em"}}>{complexity.level.toUpperCase()}</b> — {complexity.note}</p>
      <h4 style={{marginTop:20}}>Risk of aging badly</h4>
      <p style={{fontSize:14}}><b style={{color:"var(--ab-orange)",letterSpacing:"0.2em"}}>{aging.level.toUpperCase()}</b> — {aging.note}</p>
    </div>
    <div>
      <h4>Ratings</h4>
      <div className="ratings">
        {ratings.map((r, i) => (
          <React.Fragment key={i}>
            <b>{r.k}</b>
            <span className="r-val">{r.v}/5</span>
            <div className="r-bar" style={{ "--v": `${(r.v/5)*100}%` }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

// Small "state strip" (used beneath frames to switch demos)
const StateStrip = ({ states, active, onChange }) => (
  <div className="states">
    {states.map((s, i) => (
      <button
        key={i}
        className="states__btn"
        aria-pressed={active === i}
        onClick={() => onChange(i)}
      >
        <small>Act {String(i+1).padStart(2,"0")}</small>
        <span>{s}</span>
      </button>
    ))}
  </div>
);

// Typewriter hook — reveals `text` char by char while `run` is true.
const useTypewriter = (text, { speed = 22, delay = 0, run = true } = {}) => {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!run) { setOut(""); setDone(false); return; }
    setOut(""); setDone(false);
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
    }, delay);
    return () => { clearTimeout(start); };
  }, [text, speed, delay, run]);
  return [out, done];
};

Object.assign(window, { Mark, SiteSkeleton, PillBtn, Analysis, StateStrip, useTypewriter });
