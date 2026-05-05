// Variation 3: "The Flavour Compass" — cream + claret
// A dial instead of a text box. Drag ingredients from a shelf.

function V3Compass() {
  const A = window.ASTERLEY;
  const [angle, setAngle] = React.useState(45);
  const [dragging, setDragging] = React.useState(false);
  const [added, setAdded] = React.useState([]);
  const [stage, setStage] = React.useState('compass');
  const svgRef = React.useRef(null);

  const region = angle < 90 ? 'bitter' : angle < 180 ? 'sweet' : angle < 270 ? 'bright' : 'spiced';
  const label = { bitter: 'Bitter', sweet: 'Rich & Sweet', bright: 'Bright & Dry', spiced: 'Warm & Spiced' }[region];
  const jLine = {
    bitter: 'A Negroni-leaning serve. I\u2019ll pull the Dispense.',
    sweet:  'Something stirred, with the Estate at its heart.',
    bright: 'A Schofield\u2019s Martini, then. Clean, floral, knife-edge.',
    spiced: 'Dispense and warm citrus. A fireside drink.',
  }[region];

  const onMove = (e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const point = e.touches ? e.touches[0] : e;
    let a = Math.atan2(point.clientY - cy, point.clientX - cx) * 180 / Math.PI + 90;
    if (a < 0) a += 360;
    setAngle(a);
  };

  const cocktail = A.cocktails.find(c => ({ bitter: 'neg', sweet: 'neg', bright: 'mart', spiced: 'fern' })[region] === c.id);
  const toggleIng = (id) => setAdded(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  if (stage === 'card') return <CompassCard A={A} cocktail={cocktail} region={region} label={label} onBack={() => setStage('compass')} extras={added} />;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: A.cream,
      fontFamily: A.sans, color: A.ink, overflow: 'hidden',
    }}
      className="a-paper"
      onMouseMove={onMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
      onTouchMove={onMove} onTouchEnd={() => setDragging(false)}>

      <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <window.AMonogram size={26} col={A.claret} bg={A.cream}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: A.mono, fontSize: 8, color: A.goldSoft, letterSpacing: 0.3, textTransform: 'uppercase' }}>the flavour compass</div>
          <div style={{ fontFamily: A.serif, fontStyle: 'italic', color: A.claret, fontSize: 14, lineHeight: 1 }}>Jarvis</div>
        </div>
        <button style={{ width: 26, height: 26, borderRadius: 99, border: `1px solid ${A.ink}55`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {window.AIcons.close(A.ink, 10)}
        </button>
      </div>

      <div style={{ padding: '10px 18px 0', fontFamily: A.serif, fontSize: 18, color: A.ink, lineHeight: 1.3, fontStyle: 'italic', minHeight: 48 }}>
        &ldquo;{jLine}&rdquo;
      </div>

      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} width={280} height={280} viewBox="-150 -150 300 300" style={{ touchAction: 'none' }}>
          <circle r="130" fill="none" stroke={A.claret} strokeWidth="0.6" opacity="0.7"/>
          <circle r="118" fill="rgba(92,31,27,0.04)" stroke={A.claret} strokeWidth="0.4" opacity="0.5"/>
          <circle r="90" fill="none" stroke={A.claret} strokeWidth="0.3" opacity="0.4"/>
          <circle r="50" fill="none" stroke={A.claret} strokeWidth="0.3" opacity="0.4"/>

          {[
            ['BITTER', 0, -105], ['SWEET', 105, 0], ['BRIGHT', 0, 105], ['SPICED', -105, 0],
          ].map(([l, x, y]) => (
            <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              fontFamily={A.mono} fontSize="10" fill={A.claret}
              letterSpacing="3" opacity={region === l.toLowerCase() ? 1 : 0.4}
              style={{ transition: 'opacity 0.3s', fontWeight: 500 }}>{l}</text>
          ))}

          {Array.from({ length: 60 }).map((_, i) => {
            const a = i * 6 * Math.PI / 180;
            const r1 = i % 5 === 0 ? 122 : 126, r2 = 130;
            return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
              x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
              stroke={A.claret} strokeWidth={i % 5 === 0 ? 0.8 : 0.3} opacity="0.6"/>;
          })}

          <circle r="3" fill={A.claret}/>
          <path d={arcPath(angle - 8, angle + 8, 118)} stroke={A.claret} strokeWidth="8" fill="none" opacity="0.85"/>

          <g transform={`rotate(${angle - 90})`} style={{ transition: dragging ? 'none' : 'transform 0.2s' }}>
            <line x1="0" y1="0" x2="118" y2="0" stroke={A.claret} strokeWidth="1.6"/>
            <polygon points="112,-5 120,0 112,5" fill={A.claret}/>
            <circle cx="118" cy="0" r="10" fill="transparent" stroke={A.claret} strokeWidth="1" opacity="0.5"/>
          </g>

          <circle r="140" fill="transparent"
            onMouseDown={(e) => { setDragging(true); onMove(e); }}
            onTouchStart={(e) => { setDragging(true); onMove(e); }}
            style={{ cursor: 'grab' }}/>

          <text x="0" y="-8" textAnchor="middle" fontFamily={A.serif} fontStyle="italic" fontSize="20" fill={A.ink}>
            {label.split(' ').slice(0, 2).join(' ')}
          </text>
          <text x="0" y="14" textAnchor="middle" fontFamily={A.mono} fontSize="9" fill={A.claret} letterSpacing="2">
            {Math.round(angle)}°
          </text>
        </svg>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 14px', background: A.parchment,
        borderTop: `1px solid ${A.claret}33`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontFamily: A.mono, fontSize: 8.5, color: A.claret, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            The Shelf · tap to add {added.length > 0 && `(${added.length})`}
          </div>
          <button onClick={() => setStage('card')} style={{
            fontFamily: A.mono, fontSize: 9, color: A.cream, background: A.claret,
            border: 0, padding: '5px 10px', cursor: 'pointer',
            letterSpacing: 0.3, textTransform: 'uppercase', borderRadius: 1, fontWeight: 600,
          }}>mix it →</button>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {A.shelf.map(s => {
            const on = added.includes(s.id);
            return (
              <button key={s.id} onClick={() => toggleIng(s.id)} style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 10px 6px', minWidth: 64,
                background: on ? A.claret : 'transparent',
                border: `1px solid ${on ? A.claret : A.claret+'55'}`,
                borderRadius: 1, cursor: 'pointer',
              }}>
                <div style={{
                  width: 22, height: 28, background: s.col,
                  borderRadius: '2px 2px 1px 1px', boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.3)',
                }} />
                <div style={{ fontFamily: A.serif, fontSize: 10, color: on ? A.cream : A.ink, fontStyle: 'italic' }}>{s.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function arcPath(a1, a2, r) {
  const rad1 = (a1 - 90) * Math.PI / 180, rad2 = (a2 - 90) * Math.PI / 180;
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${Math.cos(rad1)*r} ${Math.sin(rad1)*r} A ${r} ${r} 0 ${large} 1 ${Math.cos(rad2)*r} ${Math.sin(rad2)*r}`;
}

function CompassCard({ A, cocktail, region, label, onBack, extras }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: A.cream, padding: '14px 16px', display: 'flex', flexDirection: 'column' }} className="a-paper">
      <button onClick={onBack} style={{
        alignSelf: 'flex-start', background: 'transparent', border: 0, cursor: 'pointer',
        fontFamily: A.mono, fontSize: 9, color: A.claret, letterSpacing: 0.3, textTransform: 'uppercase', padding: 0,
      }}>← recalibrate</button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
        <div className="a-rise" style={{
          background: A.parchment, padding: '20px 20px 16px', width: '100%',
          position: 'relative', fontFamily: A.serif, color: A.ink,
          boxShadow: `0 18px 36px rgba(0,0,0,0.25), 3px 3px 0 ${A.claret}22`,
        }}>
          <div style={{ position: 'absolute', inset: 7, border: `1px solid ${A.goldSoft}55`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: A.mono, fontSize: 9, color: A.claret, letterSpacing: 0.3, textTransform: 'uppercase' }}>Compass reading</div>
            <div style={{ fontFamily: A.mono, fontSize: 9, color: A.inkSoft, letterSpacing: 0.3 }}>{label.toUpperCase()}</div>
          </div>
          <div style={{ fontFamily: A.serif, fontSize: 32, fontStyle: 'italic', lineHeight: 1, marginTop: 4 }}>{cocktail.name}</div>
          <div style={{ fontSize: 11, fontStyle: 'italic', color: A.inkSoft, marginTop: 4 }}>plotted to the {region} quadrant</div>

          <div style={{ height: 1, background: `${A.claret}55`, margin: '12px 0' }} />

          {cocktail.spec.map(([n, v], i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 14, marginBottom: 3 }}>
              <span style={{ fontFamily: A.mono, fontSize: 11, color: A.claret, minWidth: 42 }}>{v}</span>
              <span style={{ flex: 1, borderBottom: `1px dotted ${A.claret}55`, marginBottom: 3 }} />
              <span style={{ fontStyle: 'italic' }}>{n}</span>
            </div>
          ))}

          {extras.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 10.5, fontStyle: 'italic', color: A.inkSoft }}>
              + your additions: {extras.join(', ')}
            </div>
          )}

          <div style={{ marginTop: 12, fontSize: 12, fontStyle: 'italic', color: A.inkSoft, lineHeight: 1.35 }}>
            {cocktail.method}. Strain into a {cocktail.glass.toLowerCase()}, garnish with {cocktail.garnish.toLowerCase()}.
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {['Save to journal', 'Print card', 'Buy the bottles'].map(l => (
              <button key={l} style={{
                flex: 1, fontFamily: A.mono, fontSize: 9, color: A.ink,
                background: 'transparent', border: `0.5px solid ${A.ink}`,
                padding: '6px 4px', cursor: 'pointer',
                letterSpacing: 0.3, textTransform: 'uppercase',
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.V3Compass = V3Compass;
