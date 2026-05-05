// Variation 1: "The Dispensatory" — cream editorial widget
// Apothecary prescription pad, not a chat window.
// Proactive note card peeks from the bottom before open.

function V1Dispensatory() {
  const A = window.ASTERLEY;
  const [msgs, setMsgs] = React.useState([
    { role: 'j', kind: 'greet', text: 'Evening. Jarvis, here — behind the bar but a little quieter than usual. You\u2019ve drifted in from the ESTATE page. Chasing a Negroni tonight, or something more unusual?' },
  ]);
  const [input, setInput] = React.useState('');
  const [showProactive, setShowProactive] = React.useState(true);
  const scrollRef = React.useRef(null);
  const [streamText] = window.useTypewriter(msgs[msgs.length - 1]?.text || '', 16, 120);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, streamText]);

  const suggest = (label, kind) => {
    if (kind === 'recipe') {
      setMsgs(m => [...m, { role: 'u', text: 'Surprise me with a recipe' }]);
      setTimeout(() => setMsgs(m => [...m, { role: 'j', kind: 'recipe', cocktail: A.cocktails[0] }]), 300);
    } else if (kind === 'rec') {
      setMsgs(m => [...m, { role: 'u', text: 'Help me choose a bottle' },
        { role: 'j', text: 'Tell me this: are you after something bright & crisp, or dark & brooding tonight?' }]);
    } else {
      setMsgs(m => [...m, { role: 'u', text: label }, { role: 'j', text: 'One moment — checking the shelves.' }]);
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(170deg, ${A.claret} 0%, #2A1410 60%, #170A08 100%)`,
      overflow: 'hidden', fontFamily: A.sans,
    }}>
      {/* faux page content behind */}
      <div style={{ position: 'absolute', top: 40, left: 16, right: 16, opacity: 0.35, pointerEvents: 'none' }}>
        <div style={{ height: 170, background: `linear-gradient(135deg, ${A.claret}, ${A.inkWarm})`, borderRadius: 2, marginBottom: 10 }} />
        <div style={{ fontFamily: A.serif, fontSize: 24, color: A.cream, letterSpacing: 1, fontStyle: 'italic' }}>ESTATE.</div>
        <div style={{ fontFamily: A.serif, fontSize: 11, color: A.creamSoft, marginTop: 2 }}>English Sweet Vermouth · 70cl</div>
      </div>

      {/* widget */}
      <div style={{
        position: 'absolute', left: 10, right: 10, bottom: 10, top: 64,
        background: A.cream, borderRadius: 3, overflow: 'hidden',
        boxShadow: `0 20px 60px rgba(0,0,0,0.55), inset 0 0 0 1px ${A.claret}22`,
        display: 'flex', flexDirection: 'column',
      }} className="a-paper">

        {/* masthead */}
        <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${A.claret}22`, background: A.parchment, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, right: 10, top: 6, bottom: 6, border: `0.5px solid ${A.goldSoft}40`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <window.AMonogram size={34} col={A.claret} bg={A.cream}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: A.mono, fontSize: 8, color: A.goldSoft, letterSpacing: 0.3, textTransform: 'uppercase' }}>The Asterley Dispensatory</div>
              <div style={{ fontFamily: A.serif, fontSize: 18, color: A.ink, fontStyle: 'italic', lineHeight: 1.1, marginTop: 1 }}>Jarvis, at your service.</div>
            </div>
            <button style={{ width: 24, height: 24, borderRadius: 99, border: `0.8px solid ${A.ink}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {window.AIcons.close(A.ink, 10)}
            </button>
          </div>
          {/* sub-rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, position: 'relative' }}>
            <div style={{ flex: 1, borderBottom: `1px dotted ${A.claret}55`, marginBottom: 1 }} />
            <div style={{ fontFamily: A.mono, fontSize: 8, color: A.ink, letterSpacing: 0.4 }}>№ MMXXVI · SE26 · OPEN</div>
            <div style={{ flex: 1, borderBottom: `1px dotted ${A.claret}55`, marginBottom: 1 }} />
          </div>
        </div>

        {/* messages */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: 'auto', padding: '14px 16px 8px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {msgs.map((m, i) => {
            const isLast = i === msgs.length - 1;
            const liveText = isLast && m.role === 'j' && m.kind !== 'recipe' ? streamText : m.text;

            if (m.role === 'u') {
              return (
                <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '80%' }}>
                  <div style={{ fontFamily: A.mono, fontSize: 8, color: A.goldSoft, textAlign: 'right', marginBottom: 2, letterSpacing: 0.3 }}>YOU →</div>
                  <div style={{
                    fontFamily: A.serif, fontStyle: 'italic', fontSize: 14,
                    color: A.ink, padding: '6px 10px',
                    background: 'transparent', borderLeft: `2px solid ${A.claret}`,
                  }}>{m.text}</div>
                </div>
              );
            }
            if (m.kind === 'recipe') return <RecipeCard key={i} cocktail={m.cocktail} A={A} />;
            return (
              <div key={i} className="a-rise">
                <div style={{ fontFamily: A.mono, fontSize: 8, color: A.goldSoft, marginBottom: 3, letterSpacing: 0.3 }}>
                  ← JARVIS · {new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                </div>
                <div style={{
                  fontFamily: A.serif, fontSize: 17, lineHeight: 1.35,
                  color: A.ink, fontWeight: 400, letterSpacing: 0.1,
                }} className={isLast ? 'a-caret' : ''}>
                  {liveText}
                </div>
              </div>
            );
          })}
        </div>

        {/* suggestion chips */}
        <div style={{ padding: '6px 14px 8px', display: 'flex', gap: 5, flexWrap: 'wrap', borderTop: `1px dotted ${A.claret}33` }}>
          {[['What do you make?','make'],['Recipe, please','recipe'],['Help me choose','rec'],['Pair with dinner','pair']].map(([l,k]) => (
            <button key={l} onClick={() => suggest(l, k)} style={{
              fontFamily: A.mono, fontSize: 9.5, color: A.ink,
              background: 'transparent', border: `0.8px solid ${A.ink}88`,
              padding: '4px 8px', borderRadius: 1, cursor: 'pointer',
              letterSpacing: 0.2, textTransform: 'uppercase',
            }}>§ {l}</button>
          ))}
        </div>

        {/* input — prescription bottom */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', background: A.parchment,
          borderTop: `1.5px solid ${A.claret}66`,
        }}>
          <span style={{ fontFamily: A.serif, fontSize: 20, fontStyle: 'italic', color: A.claret, lineHeight: 1 }}>℞</span>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="ask Jarvis anything…"
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 0,
              fontFamily: A.serif, fontStyle: 'italic', fontSize: 15,
              color: A.ink, letterSpacing: 0.2,
            }} />
          <button style={{
            width: 30, height: 30, borderRadius: 99,
            background: A.claret, border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {window.AIcons.send(A.cream, 13)}
          </button>
        </div>
      </div>

      {/* proactive parchment note — appears before open */}
      {showProactive && (
        <div style={{
          position: 'absolute', bottom: 16, right: 16, width: 190,
          padding: '10px 12px 10px', background: A.parchment,
          borderLeft: `3px solid ${A.claret}`,
          boxShadow: '0 12px 26px rgba(0,0,0,0.4)',
          transform: 'rotate(-1.5deg)',
          fontFamily: A.serif, zIndex: 10,
        }} className="a-rise">
          <button onClick={() => setShowProactive(false)} style={{
            position: 'absolute', top: 4, right: 4, width: 14, height: 14,
            background: 'transparent', border: 0, cursor: 'pointer', opacity: 0.5,
          }}>{window.AIcons.close(A.ink, 10)}</button>
          <div style={{ fontFamily: A.mono, fontSize: 8, color: A.claret, letterSpacing: 0.4, textTransform: 'uppercase' }}>a note from the bar</div>
          <div style={{ fontSize: 13, color: A.ink, lineHeight: 1.3, fontStyle: 'italic', marginTop: 3 }}>
            I\u2019ve a Negroni spec with your name on it when you\u2019re ready.
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 11, fontStyle: 'italic', color: A.claret, marginTop: 4, textAlign: 'right' }}>\u2014 J.</div>
        </div>
      )}
    </div>
  );
}

// Recipe card
function RecipeCard({ cocktail, A }) {
  return (
    <div className="a-rise" style={{
      alignSelf: 'stretch', background: A.parchment, padding: '14px 16px 12px',
      position: 'relative', fontFamily: A.serif, color: A.ink,
      boxShadow: `inset 0 0 0 1px ${A.claret}22, 2px 3px 0 ${A.claret}18`,
    }}>
      <div style={{ position: 'absolute', inset: 5, border: `0.5px solid ${A.goldSoft}55`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: A.mono, fontSize: 9, color: A.claret, letterSpacing: 0.4, textTransform: 'uppercase' }}>Prescription №{Math.floor(Math.random()*80+10)}</div>
        <div style={{ fontFamily: A.mono, fontSize: 8.5, color: A.inkSoft }}>serves one</div>
      </div>

      <div style={{ fontFamily: A.serif, fontSize: 24, fontStyle: 'italic', letterSpacing: 0.2, marginTop: 2, lineHeight: 1 }}>
        {cocktail.name}
      </div>
      <div style={{ fontSize: 11, fontStyle: 'italic', color: A.inkSoft, marginTop: 3 }}>for the {cocktail.mood}, at {cocktail.time}</div>

      <div style={{ height: 1, background: `${A.claret}55`, margin: '10px 0 9px' }} />

      {cocktail.spec.map(([name, vol], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 13, marginBottom: 2 }}>
          <span style={{ fontFamily: A.mono, fontSize: 10, color: A.claret, minWidth: 40 }}>{vol}</span>
          <span style={{ flex: 1, borderBottom: `1px dotted ${A.claret}55`, marginBottom: 3 }} />
          <span style={{ fontStyle: 'italic' }}>{name}</span>
        </div>
      ))}

      <div style={{ marginTop: 10, fontSize: 11, color: A.inkSoft, lineHeight: 1.3, fontStyle: 'italic' }}>
        {cocktail.method}. Serve in a {cocktail.glass.toLowerCase()}, garnished with {cocktail.garnish.toLowerCase()}.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 8, borderTop: `1px dotted ${A.claret}44` }}>
        <div style={{ fontFamily: A.serif, fontStyle: 'italic', fontSize: 12, color: A.claret }}>— Jarvis</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {['Save', 'Print', 'Shop'].map(l => (
            <button key={l} style={{
              fontFamily: A.mono, fontSize: 9, color: A.ink,
              background: 'transparent', border: `0.5px solid ${A.ink}`, borderRadius: 1,
              padding: '3px 7px', cursor: 'pointer', letterSpacing: 0.3, textTransform: 'uppercase',
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', right: 16, top: 46,
        width: 54, height: 54, borderRadius: 99,
        border: `1.2px solid ${A.claret}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'rotate(-10deg)', opacity: 0.7,
      }}>
        <div style={{ textAlign: 'center', fontFamily: A.serif, fontSize: 8, fontStyle: 'italic', color: A.claret, lineHeight: 1.1, letterSpacing: 0.3 }}>
          ASTERLEY<br/>BROS<br/><span style={{ fontSize: 6 }}>SE26</span>
        </div>
      </div>
    </div>
  );
}

window.V1Dispensatory = V1Dispensatory;
