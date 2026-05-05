// Shared Asterley Bros brand system — for all four variations

window.ASTERLEY = {
  // palette — editorial botanical, cream-forward
  ink: '#1E1A14',          // warm near-black (book ink, not pure black)
  inkSoft: '#2B251C',
  inkWarm: '#3A2E20',
  gold: '#8E5A2A',         // burnt sienna, not yellow-gold
  goldSoft: '#6B4320',
  goldBright: '#B07438',
  cream: '#F4EBD7',        // primary surface — warm paper
  creamSoft: '#E4D5B3',
  parchment: '#F7EFDC',
  parchmentDark: '#C9B887',
  claret: '#5C1F1B',       // accent — bottle red
  sage: '#4A5A3A',         // accent — botanical green
  rust: '#B85C2A',
  ivyDeep: '#2E3A28',
  rose: '#A8543E',

  // type
  serif: '"Cormorant Garamond", "EB Garamond", serif',
  sans: '"IBM Plex Sans", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  display: '"Cormorant Garamond", serif',

  // products (core range)
  products: [
    { id: 'estate',    name: "ESTATE.",     sub: 'English Sweet Vermouth',  abv: '17%', col: '#5C1F1B', desc: '31 botanicals, English pinot noir. Orange, cacao, rosemary, wormwood.', tags: ['sweet','rich','rosso'] },
    { id: 'schofields',name: "SCHOFIELD'S.",sub: 'English Dry Vermouth',    abv: '16%', col: '#C9B887', desc: '28 botanicals, English white wine. Rose petal, cardamom, citrus.', tags: ['dry','floral','crisp'] },
    { id: 'dispense',  name: 'DISPENSE.',   sub: 'Modern British Amaro',    abv: '26%', col: '#3A1F14', desc: 'From 1653\u2019s London Dispensatory. Gentian, hops, wormwood.', tags: ['bitter','dark','digestif'] },
    { id: 'original',  name: 'ORIGINAL.',   sub: 'Asterley Aperitivo',      abv: '15%', col: '#B4391B', desc: 'Rhubarb and citrus. A lighter, summer-ready aperitif.', tags: ['bittersweet','light','summer'] },
    { id: 'cunard',    name: 'CUNARD.',     sub: 'Limited Edition Dry',     abv: '18%', col: '#1C2940', desc: 'British maritime botanicals. Saline, mineral, made for Martinis.', tags: ['dry','saline','martini'] },
    { id: 'britannica',name: 'BRITANNICA.', sub: 'London Fernet',           abv: '28%', col: '#1A0F0A', desc: 'Sharp, bracing, aromatic. A British take on Fernet.', tags: ['bitter','menthol','fernet'] },
  ],

  // cocktails
  cocktails: [
    { id: 'neg',    name: 'The Asterley Negroni',   mood: 'contemplative', time: 'dusk',    spec: [['Estate Sweet Vermouth','30ml'],['Dispense Amaro','30ml'],['London Dry Gin','30ml']], garnish: 'Orange twist', method: 'Stir, 30s', glass: 'Tumbler / large cube' },
    { id: 'mart',   name: 'Schofield\u2019s Martini', mood: 'crisp',         time: 'aperitivo', spec: [['Gin','50ml'],['Schofield\u2019s Dry','25ml'],['Water','10ml'],['Orange bitters','2 dashes']], garnish: 'Lemon twist', method: 'Freeze 45m, frozen coupe', glass: 'Frozen coupe' },
    { id: 'white',  name: 'White Negroni Society',  mood: 'bright',        time: 'spring',  spec: [['Schofield\u2019s Dry','30ml'],['Suze','30ml'],['Gin','30ml']], garnish: 'Grapefruit peel', method: 'Stir over ice', glass: 'Rocks' },
    { id: 'spritz', name: 'Original Spritz',        mood: 'celebratory',   time: 'lunch',   spec: [['Original Aperitivo','50ml'],['Prosecco','75ml'],['Soda','25ml']], garnish: 'Orange wheel', method: 'Build in glass', glass: 'Large wine glass' },
    { id: 'high',   name: 'Estate Highball',        mood: 'easy',          time: 'anytime', spec: [['Estate','50ml'],['Citrus tonic','75ml']], garnish: 'Orange slice', method: 'Build over ice', glass: 'Highball' },
    { id: 'fern',   name: 'Fernet & Tonic',         mood: 'bracing',       time: 'night',   spec: [['Britannica Fernet','35ml'],['Indian tonic','100ml']], garnish: 'Mint sprig', method: 'Build over ice', glass: 'Collins' },
  ],

  // ingredients for the shelf
  shelf: [
    { id: 'gin', name: 'Gin', type: 'spirit', col: '#E8DFC8' },
    { id: 'campari', name: 'Campari', type: 'bitter', col: '#B4391B' },
    { id: 'soda', name: 'Soda', type: 'mixer', col: '#DDEEF4' },
    { id: 'tonic', name: 'Tonic', type: 'mixer', col: '#F0E4C9' },
    { id: 'orange', name: 'Orange', type: 'garnish', col: '#D97E2D' },
    { id: 'lemon', name: 'Lemon', type: 'garnish', col: '#E8D042' },
    { id: 'rosemary', name: 'Rosemary', type: 'garnish', col: '#556B4A' },
    { id: 'prosecco', name: 'Prosecco', type: 'mixer', col: '#F2E6B8' },
  ],
};

window.ASTERLEY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  .a-serif { font-family: ${JSON.stringify(window.ASTERLEY.serif || '')}, serif; }
  .a-sans  { font-family: ${JSON.stringify(window.ASTERLEY.sans  || '')}, sans-serif; }
  .a-mono  { font-family: ${JSON.stringify(window.ASTERLEY.mono  || '')}, monospace; }

  .a-small-caps { letter-spacing: 0.18em; text-transform: uppercase; font-family: ${JSON.stringify(window.ASTERLEY.sans)}; font-weight: 500; }

  /* typewriter caret */
  @keyframes a-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
  .a-caret::after { content: '|'; margin-left: 2px; animation: a-blink 1s steps(1) infinite; color: currentColor; }

  /* paper grain */
  .a-paper { background:
      radial-gradient(ellipse at 20% 10%, rgba(190,155,40,0.06), transparent 60%),
      radial-gradient(ellipse at 80% 90%, rgba(92,31,27,0.05), transparent 60%),
      #F0E4C9;
    position: relative;
  }
  .a-paper::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image:
      radial-gradient(circle at 10% 20%, rgba(0,0,0,0.04) 0, transparent 2px),
      radial-gradient(circle at 80% 70%, rgba(0,0,0,0.03) 0, transparent 1.5px),
      radial-gradient(circle at 40% 90%, rgba(0,0,0,0.03) 0, transparent 1.5px);
    background-size: 30px 30px, 40px 40px, 50px 50px;
    mix-blend-mode: multiply; opacity: 0.6;
  }

  /* subtle scan lines */
  .a-scan::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px);
  }

  /* deboss gold */
  .a-gold-stroke { color: #BE9B28; -webkit-text-stroke: 0.3px rgba(0,0,0,0.12); }

  /* seal */
  @keyframes a-spin { to { transform: rotate(360deg); } }
  .a-seal-spin { animation: a-spin 40s linear infinite; transform-origin: center; }

  /* pulse dot */
  @keyframes a-pulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.4); opacity: 0.7 } }
  .a-pulse { animation: a-pulse 1.6s ease-in-out infinite; }

  /* shelf slide */
  @keyframes a-rise { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }
  .a-rise { animation: a-rise 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
`;

// Typewriter hook — streams text char by char
window.useTypewriter = function(text, speed = 22, startDelay = 0) {
  const [out, setOut] = React.useState('');
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    setOut(''); setDone(false);
    let i = 0;
    const start = setTimeout(() => {
      const t = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) { clearInterval(t); setDone(true); }
      }, speed);
      return () => clearInterval(t);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, speed, startDelay]);
  return [out, done];
};

// Tiny icon helpers
window.AIcons = {
  bottle: (c = '#BE9B28', s = 16) => (
    <svg width={s} height={s*2.2} viewBox="0 0 16 36" fill="none">
      <rect x="6" y="1" width="4" height="7" stroke={c} strokeWidth="1"/>
      <path d="M5 8 L5 12 Q5 14 4 15 L4 33 Q4 35 6 35 L10 35 Q12 35 12 33 L12 15 Q11 14 11 12 L11 8 Z" stroke={c} strokeWidth="1" fill="none"/>
      <rect x="4.5" y="20" width="7" height="8" fill={c} opacity="0.15"/>
    </svg>
  ),
  glass: (c = '#BE9B28', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 4 L19 4 L17 14 Q17 17 12 17 Q7 17 7 14 Z" stroke={c} strokeWidth="1.2"/>
      <path d="M12 17 L12 21 M8 21 L16 21" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  leaf: (c = '#BE9B28', s = 14) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M3 17 Q3 6 17 3 Q14 15 3 17 Z" stroke={c} strokeWidth="1" fill="none"/>
      <path d="M3 17 Q8 12 17 3" stroke={c} strokeWidth="0.7"/>
    </svg>
  ),
  orbit: (c = '#BE9B28', s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1"/>
      <circle cx="12" cy="12" r="3" fill={c}/>
      <circle cx="22" cy="12" r="1.5" fill={c}/>
    </svg>
  ),
  send: (c = '#0A0A0A', s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 12 L20 12 M14 6 L20 12 L14 18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: (c = '#E8DFC8', s = 14) => (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M4 4 L16 16 M16 4 L4 16" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

// Asterley monogram — A* mark
window.AMonogram = function({ size = 40, col = '#8E5A2A', bg = '#F4EBD7' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="23" fill={bg} stroke={col} strokeWidth="1"/>
      <text x="24" y="29" textAnchor="middle" fill={col}
        fontFamily="Cormorant Garamond, serif" fontSize="20" fontStyle="italic" fontWeight="500">A</text>
      <text x="33" y="22" textAnchor="middle" fill={col}
        fontFamily="Cormorant Garamond, serif" fontSize="10">·</text>
      <text x="38" y="22" textAnchor="middle" fill={col}
        fontFamily="Cormorant Garamond, serif" fontSize="14" fontStyle="italic">b</text>
    </svg>
  );
};
