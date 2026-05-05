// Variation 4: "The Menu Unfurls" — cream editorial bar menu

function V4Menu() {
  const A = window.ASTERLEY;
  const [open, setOpen] = React.useState('stirred');
  const [chosen, setChosen] = React.useState(null);

  const sections = [
    { id: 'aperitivo', title: 'Aperitivo', sub: 'to begin the evening', note: "Start light — bitter's the key that unlocks the appetite.",
      items: [
        { k: 'Original Spritz', v: 'Our Aperitivo, prosecco, soda.', t: '£11' },
        { k: 'Estate & Tonic',  v: 'Sweet vermouth, citrus tonic.',   t: '£9' },
        { k: 'Dispense Americano', v: 'Dispense, Estate, soda.',       t: '£10' },
      ],
    },
    { id: 'stirred', title: 'Stirred', sub: 'quiet, considered', note: "For the contemplative. Stirred thirty seconds, never shaken.",
      items: [
        { k: 'The Asterley Negroni', v: 'Estate, Dispense, gin.', t: '£12', star: true },
        { k: 'Schofield\u2019s Martini', v: 'Gin, Schofield\u2019s, frozen.', t: '£13' },
        { k: 'White Negroni Society', v: 'Schofield\u2019s, Suze, gin.',   t: '£12' },
      ],
    },
    { id: 'long', title: 'Long Serves', sub: 'for a warm afternoon', note: "Drinks that last a conversation.",
      items: [
        { k: 'Estate Highball', v: 'Sweet vermouth, citrus tonic.', t: '£9' },
        { k: 'Fernet & Tonic',  v: 'Britannica Fernet, Indian tonic.', t: '£10' },
      ],
    },
    { id: 'digestif', title: 'Digestif', sub: 'to close the evening', note: "A bitter, reflective end. Neat, or one rock.",
      items: [
        { k: 'Dispense, neat', v: '35ml, room temperature.', t: '£8' },
        { k: 'Britannica, rocks', v: '35ml, one cube.', t: '£8' },
      ],
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.cream, fontFamily: A.serif, color: A.ink, overflow: 'hidden' }} className="a-paper">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px 8px', borderBottom: `0.5px solid ${A.claret}44` }}>
        <window.AMonogram size={26} col={A.claret} bg={A.cream}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: A.mono, fontSize: 8, color: A.goldSoft, letterSpacing: 0.3, textTransform: 'uppercase' }}>maître d'</div>
          <div style={{ fontFamily: A.serif, fontStyle: 'italic', color: A.claret, fontSize: 14, lineHeight: 1 }}>Jarvis</div>
        </div>
        <button style={{ width: 26, height: 26, borderRadius: 99, border: `1px solid ${A.ink}55`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {window.AIcons.close(A.ink, 10)}
        </button>
      </div>

      <div style={{ position: 'absolute', top: 54, left: 0, right: 0, bottom: 0, overflowY: 'auto' }}>
        <div style={{ padding: '26px 22px 22px', position: 'relative', textAlign: 'center', borderBottom: `0.5px solid ${A.claret}44` }}>
          <div style={{ fontFamily: A.mono, fontSize: 9, color: A.claret, letterSpacing: 0.5, textTransform: 'uppercase' }}>No. XII · Spring MMXXVI</div>
          <div style={{ fontFamily: A.serif, fontSize: 38, lineHeight: 0.95, color: A.ink, fontStyle: 'italic', marginTop: 8, fontWeight: 500 }}>The Asterley<br/><span style={{ fontSize: 30 }}>Aperitivo Hour.</span></div>
          <div style={{ margin: '10px auto 0', width: 40, height: 1, background: A.claret }} />
          <div style={{ fontFamily: A.serif, fontSize: 13, fontStyle: 'italic', color: A.inkSoft, marginTop: 10, lineHeight: 1.3 }}>
            — curated by Jarvis, for the drinker who knows what they like but is open to being surprised.
          </div>
        </div>

        <div style={{ padding: '14px 16px 60px' }}>
          {sections.map((s, i) => {
            const isOpen = open === s.id;
            return (
              <div key={s.id} style={{ marginBottom: 6 }}>
                {isOpen && (
                  <div style={{
                    fontFamily: A.serif, fontSize: 13, fontStyle: 'italic',
                    color: A.claret, padding: '4px 4px 8px', lineHeight: 1.3,
                  }}>&nbsp;&nbsp;&ldquo;{s.note}&rdquo; &nbsp;&mdash;&thinsp;j.</div>
                )}

                <button onClick={() => setOpen(isOpen ? null : s.id)} style={{
                  width: '100%', textAlign: 'left', background: 'transparent',
                  border: 0, padding: '10px 4px 8px', cursor: 'pointer',
                  borderTop: `0.5px solid ${A.claret}77`,
                  borderBottom: isOpen ? 'none' : `0.5px dotted ${A.claret}33`,
                  display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: A.mono, fontSize: 10, color: A.goldSoft }}>{String(i+1).padStart(2,'0')}</span>
                    <span style={{ fontFamily: A.serif, fontSize: 24, color: A.ink, fontStyle: 'italic', letterSpacing: 0.3, lineHeight: 1 }}>{s.title}</span>
                    <span style={{ fontFamily: A.serif, fontStyle: 'italic', fontSize: 11, color: A.inkSoft }}>— {s.sub}</span>
                  </div>
                  <span style={{ fontFamily: A.mono, fontSize: 14, color: A.claret, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }}>›</span>
                </button>

                {isOpen && (
                  <div className="a-rise" style={{ padding: '6px 0 14px' }}>
                    {s.items.map((it, j) => {
                      const isChosen = chosen === `${s.id}-${j}`;
                      return (
                        <button key={j} onClick={() => setChosen(isChosen ? null : `${s.id}-${j}`)} style={{
                          width: '100%', textAlign: 'left', background: 'transparent', border: 0,
                          padding: '8px 4px', cursor: 'pointer',
                          borderBottom: `0.5px dotted ${A.claret}33`,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <div style={{ fontFamily: A.serif, fontSize: 17, color: A.ink, fontWeight: 500, letterSpacing: 0.2 }}>
                              {it.k} {it.star && <span style={{ color: A.claret, fontSize: 11 }}>★</span>}
                            </div>
                            <div style={{ flex: 1, borderBottom: `0.5px dotted ${A.claret}55`, marginBottom: 4, alignSelf: 'stretch', position: 'relative', top: -6 }} />
                            <div style={{ fontFamily: A.mono, fontSize: 11, color: A.claret, letterSpacing: 0.3 }}>{it.t}</div>
                          </div>
                          <div style={{ fontFamily: A.serif, fontSize: 12, color: A.inkSoft, fontStyle: 'italic', marginTop: 2 }}>{it.v}</div>

                          {isChosen && (
                            <div className="a-rise" style={{
                              marginTop: 10, padding: '10px 12px',
                              background: A.parchment, border: `0.5px solid ${A.claret}77`,
                            }}>
                              <div style={{ fontFamily: A.mono, fontSize: 8.5, color: A.claret, letterSpacing: 0.3, textTransform: 'uppercase' }}>Jarvis suggests →</div>
                              <div style={{ fontFamily: A.serif, fontStyle: 'italic', fontSize: 13, color: A.ink, marginTop: 4, lineHeight: 1.35 }}>
                                &ldquo;Try it with our <span style={{ color: A.claret, fontWeight: 500 }}>Estate</span> — the 31 botanicals give depth you\u2019d miss otherwise. Or if you\u2019re feeling bold, swap half the gin for <span style={{ color: A.claret, fontWeight: 500 }}>Dispense</span>.&rdquo;
                              </div>
                              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                {['Recipe card', 'Shop bottles', 'Save'].map(l => (
                                  <button key={l} style={{
                                    fontFamily: A.mono, fontSize: 9, color: A.ink,
                                    background: 'transparent', border: `0.5px solid ${A.ink}`,
                                    padding: '5px 8px', cursor: 'pointer',
                                    letterSpacing: 0.3, textTransform: 'uppercase',
                                  }}>{l}</button>
                                ))}
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: 18, padding: '14px 16px', border: `0.5px solid ${A.claret}77`, background: A.parchment }}>
            <div style={{ fontFamily: A.mono, fontSize: 9, color: A.claret, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 6 }}>Can\u2019t see what you fancy?</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: A.serif, fontSize: 18, fontStyle: 'italic', color: A.claret }}>℞</span>
              <input placeholder="whisper to jarvis..." style={{
                flex: 1, background: 'transparent', border: 0, borderBottom: `0.5px solid ${A.claret}77`, outline: 0,
                fontFamily: A.serif, fontStyle: 'italic', fontSize: 15, color: A.ink, padding: '3px 0',
              }} />
              <button style={{ width: 24, height: 24, borderRadius: 99, background: A.claret, border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {window.AIcons.send(A.cream, 11)}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 22, fontFamily: A.mono, fontSize: 8, color: A.claret, letterSpacing: 0.4, opacity: 0.7 }}>
            — fin —<br/>handmade with integrity in south london
          </div>
        </div>
      </div>
    </div>
  );
}

window.V4Menu = V4Menu;
