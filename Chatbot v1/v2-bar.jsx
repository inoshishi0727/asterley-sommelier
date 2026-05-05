// Variation 2: "Behind the Bar" — cream + claret full-screen takeover
// A warm bar, not a dark one. Jarvis's words dominate the top.

function V2BehindTheBar() {
  const A = window.ASTERLEY;
  const [stage, setStage] = React.useState('intro');
  const [chosen, setChosen] = React.useState(null);
  const [mood, setMood] = React.useState(null);

  const line = {
    intro:   "Evening. Pull up a stool — I'm Jarvis. What shape of glass feels right tonight?",
    inquire: `${chosen?.name}. An excellent instinct. Tell me your mood.`,
    pouring: `A ${cocktailFor(chosen, mood)?.name || 'serve'}, coming up. Watch the ice.`,
    card:    "There. Yours to keep — or I'll print it for the fridge.",
  }[stage];
  const [streamed, done] = window.useTypewriter(line, 22, 100);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: `radial-gradient(ellipse at 50% 0%, ${A.parchment} 0%, ${A.cream} 50%, ${A.creamSoft} 100%)`,
      fontFamily: A.sans, color: A.ink,
    }} className="a-paper">
      {/* top chrome */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <window.AMonogram size={26} col={A.claret} bg={A.cream}/>
          <div>
            <div style={{ fontFamily: A.mono, fontSize: 8, color: A.goldSoft, letterSpacing: 0.3, textTransform: 'uppercase' }}>behind the bar</div>
            <div style={{ fontFamily: A.serif, fontSize: 14, color: A.claret, fontStyle: 'italic', lineHeight: 1 }}>Jarvis</div>
          </div>
        </div>
        <button style={{ width: 28, height: 28, borderRadius: 99, border: `1px solid ${A.ink}55`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {window.AIcons.close(A.ink, 11)}
        </button>
      </div>

      {/* Jarvis line */}
      <div style={{
        position: 'absolute', top: 60, left: 20, right: 20,
        fontFamily: A.serif, fontSize: 26, lineHeight: 1.15,
        color: A.ink, letterSpacing: 0.1, minHeight: 100, zIndex: 10,
      }}>
        <span className={done ? '' : 'a-caret'}>{streamed}</span>
      </div>

      {stage === 'intro' && <BackBar onSelect={(p) => { setChosen(p); setStage('inquire'); }} A={A} />}
      {stage === 'inquire' && <MoodWheel onSelect={(m) => { setMood(m); setStage('pouring'); setTimeout(() => setStage('card'), 2500); }} A={A} />}
      {(stage === 'pouring' || stage === 'card') && <PourStage A={A} chosen={chosen} mood={mood} showCard={stage === 'card'} />}

      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        textAlign: 'center', fontFamily: A.mono, fontSize: 8,
        color: A.claret, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.7,
      }}>asterley bros · dalmain rd, SE23 · est. MMXV</div>
    </div>
  );
}

const GLASS_CATEGORIES = [
  { id: 'martini',    name: 'Martini',     note: 'stirred, stemmed, clear',  shape: 'coupe' },
  { id: 'rocks',      name: 'Old Fashioned', note: 'spirit-forward, on ice', shape: 'rocks' },
  { id: 'highball',   name: 'Highball',    note: 'long, effervescent',       shape: 'highball' },
  { id: 'negroni',    name: 'Negroni',     note: 'bitter, balanced',         shape: 'negroni' },
  { id: 'flute',      name: 'Fizz',        note: 'sparkling, celebratory',   shape: 'flute' },
  { id: 'snifter',    name: 'Digestif',    note: 'warming, contemplative',   shape: 'snifter' },
];

function BackBar({ onSelect, A }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, top: 180 }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 46,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 22, columnGap: 8,
        padding: '0 18px', alignItems: 'end',
      }}>
        {GLASS_CATEGORIES.map((g, i) => (
          <button key={g.id} onClick={() => onSelect(g)} className="a-rise" style={{
            background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            animationDelay: `${i * 70}ms`,
          }}>
            <Glass shape={g.shape} A={A} />
            <div style={{ fontFamily: A.serif, fontSize: 13, color: A.ink, letterSpacing: 0.2, fontWeight: 500, fontStyle: 'italic', lineHeight: 1 }}>{g.name}</div>
            <div style={{ fontFamily: A.mono, fontSize: 8, color: A.goldSoft, letterSpacing: 0.3, textTransform: 'uppercase' }}>{g.note}</div>
          </button>
        ))}
      </div>

      {/* shelf */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 40, height: 6,
        background: `linear-gradient(180deg, ${A.claret} 0%, ${A.inkSoft} 100%)`,
        boxShadow: `0 3px 10px ${A.claret}55`,
      }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: `linear-gradient(180deg, ${A.claret}12, transparent)` }} />

      <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center',
        fontFamily: A.mono, fontSize: 8.5, color: A.claret, letterSpacing: 0.4, opacity: 0.7 }}>
        tap a glass &middot; or speak up ↓
      </div>

      {/* voice dock */}
      <div style={{
        position: 'absolute', left: 20, right: 20, top: -60,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', background: A.ink, color: A.cream,
        borderRadius: 99,
      }}>
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 16 }}>
          {[4, 10, 6, 14, 8].map((h, i) => (
            <div key={i} style={{ width: 2, height: h, background: A.cream, opacity: 0.7, borderRadius: 1 }} />
          ))}
        </div>
        <div style={{ flex: 1, fontFamily: A.serif, fontStyle: 'italic', fontSize: 13, color: A.creamSoft }}>
          or just tell me what you fancy…
        </div>
        <div style={{ width: 22, height: 22, borderRadius: 99, background: A.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="13" viewBox="0 0 10 13"><rect x="3" y="1" width="4" height="7" rx="2" fill={A.ink}/><path d="M1 7 Q1 10 5 10 Q9 10 9 7 M5 10 L5 12" stroke={A.ink} strokeWidth="1.2" fill="none"/></svg>
        </div>
      </div>
    </div>
  );
}

function Bottle({ p, A, h = 140 }) {
  const w = 30;
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: h - 26, background: p.col,
        borderRadius: '3px 3px 1px 1px',
        boxShadow: `inset -3px 0 4px rgba(0,0,0,0.3), inset 3px 0 3px rgba(255,255,255,0.08), 0 3px 8px rgba(0,0,0,0.2)`,
        border: `0.5px solid ${A.ink}55`,
      }} />
      <div style={{
        position: 'absolute', left: w/2 - 4.5, top: 4, width: 9, height: 24, background: p.col,
        borderRadius: '1px 1px 2px 2px',
        boxShadow: 'inset -2px 0 2px rgba(0,0,0,0.35)',
      }} />
      <div style={{ position: 'absolute', left: w/2 - 5.5, top: 0, width: 11, height: 6, background: A.goldSoft, borderRadius: 1 }} />
      <div style={{
        position: 'absolute', left: 2, right: 2, top: 44, height: 36,
        background: A.parchment,
        borderTop: `0.5px solid ${A.goldSoft}`,
        borderBottom: `0.5px solid ${A.goldSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: A.serif, fontSize: 6.5, color: A.ink, fontWeight: 600, letterSpacing: 0.3,
      }}>{p.name.replace('.','')}</div>
    </div>
  );
}

function Glass({ shape, A }) {
  const stroke = A.ink;
  const liquid = A.claret;
  const common = { stroke, strokeWidth: 1.2, fill: 'rgba(255,255,255,0.2)', strokeLinejoin: 'round', strokeLinecap: 'round' };
  const liquidFill = { fill: liquid, opacity: 0.75 };

  if (shape === 'coupe') return (
    <svg width="64" height="90" viewBox="0 0 64 90">
      <defs><clipPath id="g-coupe"><path d="M6 16 Q32 46 58 16 Z"/></clipPath></defs>
      <rect x="6" y="16" width="52" height="30" fill={liquid} opacity="0.75" clipPath="url(#g-coupe)"/>
      <path d="M6 14 L58 14 Q58 18 32 46 Q6 18 6 14 Z" {...common}/>
      <line x1="32" y1="46" x2="32" y2="78" stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="32" cy="80" rx="14" ry="3" fill="none" stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="26" cy="22" rx="3" ry="1" fill="#fff" opacity="0.5"/>
    </svg>
  );
  if (shape === 'rocks') return (
    <svg width="52" height="72" viewBox="0 0 52 72">
      <rect x="8" y="18" width="36" height="40" {...liquidFill}/>
      <path d="M8 16 L44 16 L42 60 Q42 62 40 62 L12 62 Q10 62 10 60 Z" {...common}/>
      <rect x="16" y="42" width="10" height="10" fill="#fff" opacity="0.4" transform="rotate(8 21 47)"/>
      <rect x="26" y="38" width="8" height="8" fill="#fff" opacity="0.4" transform="rotate(-5 30 42)"/>
    </svg>
  );
  if (shape === 'highball') return (
    <svg width="44" height="96" viewBox="0 0 44 96">
      <rect x="10" y="20" width="24" height="58" {...liquidFill}/>
      <path d="M10 14 L34 14 L33 78 Q33 80 31 80 L13 80 Q11 80 11 78 Z" {...common}/>
      <ellipse cx="17" cy="24" rx="1.5" ry="2.5" fill="#fff" opacity="0.6"/>
      <ellipse cx="24" cy="40" rx="1" ry="2" fill="#fff" opacity="0.5"/>
      <ellipse cx="20" cy="58" rx="1.2" ry="2" fill="#fff" opacity="0.5"/>
    </svg>
  );
  if (shape === 'negroni') return (
    <svg width="48" height="78" viewBox="0 0 48 78">
      <rect x="8" y="22" width="32" height="38" {...liquidFill}/>
      <path d="M8 18 L40 18 L38 62 Q38 64 36 64 L12 64 Q10 64 10 62 Z" {...common}/>
      <circle cx="30" cy="24" r="6" fill="#F4A340" stroke={stroke} strokeWidth="0.8"/>
      <rect x="18" y="40" width="8" height="8" fill="#fff" opacity="0.35" transform="rotate(15 22 44)"/>
    </svg>
  );
  if (shape === 'flute') return (
    <svg width="36" height="100" viewBox="0 0 36 100">
      <defs><clipPath id="g-flute"><path d="M11 10 L25 10 L22 64 L14 64 Z"/></clipPath></defs>
      <rect x="11" y="20" width="14" height="44" fill={liquid} opacity="0.7" clipPath="url(#g-flute)"/>
      <path d="M11 8 L25 8 L22 64 Q22 68 18 68 Q14 68 14 64 Z" {...common}/>
      <line x1="18" y1="68" x2="18" y2="88" stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="18" cy="90" rx="9" ry="2.5" fill="none" stroke={stroke} strokeWidth="1.2"/>
      {[28, 38, 50].map(y => <circle key={y} cx={16 + (y%7)} cy={y} r="1" fill="#fff" opacity="0.7"/>)}
    </svg>
  );
  if (shape === 'snifter') return (
    <svg width="60" height="76" viewBox="0 0 60 76">
      <defs><clipPath id="g-snif"><path d="M12 22 Q12 44 30 44 Q48 44 48 22 Z"/></clipPath></defs>
      <rect x="12" y="30" width="36" height="14" fill={liquid} opacity="0.75" clipPath="url(#g-snif)"/>
      <path d="M14 16 L46 16 Q48 16 48 20 Q48 44 30 44 Q12 44 12 20 Q12 16 14 16 Z" {...common}/>
      <line x1="30" y1="44" x2="30" y2="60" stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="30" cy="62" rx="10" ry="2.5" fill="none" stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="20" cy="26" rx="2" ry="1" fill="#fff" opacity="0.5"/>
    </svg>
  );
  return null;
}

function MoodWheel({ onSelect, A }) {
  const moods = [
    { id: 'bright', label: 'Bright & Crisp', note: 'martini territory' },
    { id: 'dark',   label: 'Dark & Brooding', note: 'a stirred affair' },
    { id: 'easy',   label: 'Easy & Long',     note: 'highball, slow' },
    { id: 'strong', label: 'Strong & Bitter', note: 'negroni country' },
    { id: 'fizzy',  label: 'Fizzy & Social',  note: 'spritz, for two' },
    { id: 'spice',  label: 'Warm & Spiced',   note: 'a rainy day drink' },
  ];
  return (
    <div style={{ position: 'absolute', left: 18, right: 18, bottom: 26, top: 190, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7 }}>
      {moods.map((m, i) => (
        <button key={m.id} onClick={() => onSelect(m)} className="a-rise" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 14px', background: 'transparent',
          border: `0.8px solid ${A.claret}55`, cursor: 'pointer',
          textAlign: 'left', animationDelay: `${i * 40}ms`,
        }}>
          <div>
            <div style={{ fontFamily: A.serif, fontSize: 18, color: A.ink, fontStyle: 'italic', letterSpacing: 0.2 }}>{m.label}</div>
            <div style={{ fontFamily: A.mono, fontSize: 9, color: A.goldSoft, letterSpacing: 0.3, textTransform: 'uppercase', marginTop: 2 }}>{m.note}</div>
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 22, color: A.claret }}>→</div>
        </button>
      ))}
    </div>
  );
}

function cocktailFor(chosen, mood) {
  const A = window.ASTERLEY;
  // map (glass × mood) → cocktail
  const byGlass = { martini: 'mart', rocks: 'neg', highball: 'high', negroni: 'neg', flute: 'spritz', snifter: 'fern' };
  const byMood = { bright: 'mart', dark: 'neg', easy: 'high', strong: 'neg', fizzy: 'spritz', spice: 'fern' };
  const id = byMood[mood?.id] || byGlass[chosen?.id] || 'neg';
  return A.cocktails.find(c => c.id === id);
}

function PourStage({ A, chosen, mood, showCard }) {
  const cocktail = cocktailFor(chosen, mood);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
      {!showCard && (
        <div style={{ position: 'relative', width: 110, height: 160 }}>
          <svg viewBox="0 0 110 160" width="110" height="160">
            <path d="M18 20 L92 20 L84 110 Q84 130 55 130 Q26 130 26 110 Z" stroke={A.ink} strokeWidth="1.2" fill="rgba(255,255,255,0.25)"/>
            <path d="M55 130 L55 152 M40 152 L70 152" stroke={A.ink} strokeWidth="1.2" strokeLinecap="round"/>
            <defs><clipPath id="gc2"><path d="M20 22 L90 22 L82 110 Q82 128 55 128 Q28 128 28 110 Z"/></clipPath></defs>
            <rect x="0" y="130" width="110" height="0" fill={A.claret} clipPath="url(#gc2)">
              <animate attributeName="height" from="0" to="115" dur="2.2s" fill="freeze"/>
              <animate attributeName="y" from="130" to="15" dur="2.2s" fill="freeze"/>
            </rect>
          </svg>
          <div style={{
            position: 'absolute', top: -16, left: 54, width: 2, height: 36,
            background: A.claret, borderRadius: 99,
          }} />
        </div>
      )}

      {showCard && cocktail && (
        <div className="a-rise" style={{ width: '100%', padding: '0 16px' }}>
          <div style={{
            background: A.parchment, padding: '14px 16px',
            position: 'relative', fontFamily: A.serif, color: A.ink,
            boxShadow: `0 10px 24px rgba(0,0,0,0.18), 2px 3px 0 ${A.claret}22`,
          }}>
            <div style={{ position: 'absolute', inset: 5, border: `0.5px solid ${A.goldSoft}55`, pointerEvents: 'none' }} />
            <div style={{ fontFamily: A.mono, fontSize: 9, color: A.claret, letterSpacing: 0.3, textTransform: 'uppercase' }}>Serve №{Math.floor(Math.random()*80+10)} · for the {mood?.id}</div>
            <div style={{ fontFamily: A.serif, fontSize: 26, fontStyle: 'italic', marginTop: 2, lineHeight: 1 }}>{cocktail.name}</div>
            <div style={{ height: 1, background: `${A.claret}55`, margin: '8px 0' }} />
            {cocktail.spec.map(([n, v], i) => (
              <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, marginBottom: 2 }}>
                <span style={{ fontFamily: A.mono, fontSize: 10, color: A.claret, minWidth: 40 }}>{v}</span>
                <span style={{ flex: 1, borderBottom: `1px dotted ${A.claret}55`, marginBottom: 3 }} />
                <span style={{ fontStyle: 'italic' }}>{n}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 11, fontStyle: 'italic', color: A.inkSoft }}>
              {cocktail.method}. {cocktail.glass}, garnish with {cocktail.garnish.toLowerCase()}.
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
              {['Save', 'Share', 'Shop'].map(l => (
                <button key={l} style={{
                  fontFamily: A.mono, fontSize: 9, border: `0.5px solid ${A.ink}`,
                  background: 'transparent', padding: '3px 7px', borderRadius: 1,
                  letterSpacing: 0.3, textTransform: 'uppercase', cursor: 'pointer', color: A.ink,
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.V2BehindTheBar = V2BehindTheBar;
