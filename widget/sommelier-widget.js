/**
 * Asterley Bros Online Sommelier — Jarvis Widget
 * Standalone Web Component (<asterley-sommelier>)
 * Design: V1 Dispensatory + V2 Behind the Bar + V4 Menu Unfurls
 */

// ─── Helpers ──────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 18) return 'Afternoon';
  return 'Evening';
}

// ─── Data ─────────────────────────────────────────────────────────────────

const MENU_SECTIONS = [
  {
    id: 'aperitivo', title: 'Aperitivo', sub: 'to begin the evening',
    note: "Start light — bitter's the key that unlocks the appetite.",
    items: [
      { name: 'Original Spritz', desc: 'Our Aperitivo, prosecco, soda.', price: '£11',
        jarvisSuggests: "Built around our Original Aperitivo — lighter than Campari, rhubarb and citrus forward. The easiest drink on the menu.",
        product: { name: 'ASTERLEY ORIGINAL.', sub: 'British Aperitivo', price: '£20.95',
          img: 'https://asterleybros.com/cdn/shop/files/Asterley_Original_-_Product_Shot_SML.png?v=1771155944',
          url: 'https://asterleybros.com/products/asterley-original-british-aperitivo' } },
      { name: 'Estate & Tonic', desc: 'Sweet vermouth, citrus tonic.', price: '£9',
        jarvisSuggests: "Estate sweet vermouth over citrus tonic — 31 botanicals do the heavy lifting. Just add ice.",
        product: { name: 'ESTATE.', sub: 'English Sweet Vermouth', price: '£26.95',
          img: 'https://asterleybros.com/cdn/shop/products/ESTATESQsml.jpg?v=1718448159',
          url: 'https://asterleybros.com/products/estate-english-sweet-vermouth' } },
      { name: 'Dispense Americano', desc: 'Dispense, Estate, soda.', price: '£10',
        jarvisSuggests: "Dispense in place of Campari. More depth, more bitterness — more worth your time.",
        product: { name: 'DISPENSE.', sub: 'Modern British Amaro', price: '£31.95',
          img: 'https://asterleybros.com/cdn/shop/products/DispenseSQsml.jpg?v=1718448169',
          url: 'https://asterleybros.com/products/dispense-modern-british-amaro' } },
    ],
  },
  {
    id: 'stirred', title: 'Stirred', sub: 'quiet, considered',
    note: 'For the contemplative. Stirred thirty seconds, never shaken.',
    items: [
      { name: 'The Asterley Negroni', desc: 'Estate, Dispense, gin.', price: '£12', star: true,
        jarvisSuggests: "Equal parts Estate, Dispense, gin. Our house Negroni. Buy both bottles and you'll never run out.",
        product: { name: 'DISPENSE.', sub: 'Modern British Amaro', price: '£31.95',
          img: 'https://asterleybros.com/cdn/shop/products/DispenseSQsml.jpg?v=1718448169',
          url: 'https://asterleybros.com/products/dispense-modern-british-amaro' } },
      { name: "Schofield's Martini", desc: "Gin, Schofield's, frozen.", price: '£13',
        jarvisSuggests: "Schofield's is built for this. Freeze the coupe 45 minutes before you pour. Don't rush it.",
        product: { name: "SCHOFIELD'S.", sub: 'English Dry Vermouth', price: '£26.95',
          img: 'https://asterleybros.com/cdn/shop/products/SDVSQsml.png?v=1770025132',
          url: 'https://asterleybros.com/products/schofields-english-dry-vermouth' } },
      { name: 'White Negroni Society', desc: "Schofield's, Suze, gin.", price: '£12',
        jarvisSuggests: "Schofield's dry instead of sweet vermouth, Suze for the gentian. Lighter, more spring-forward than a classic Negroni.",
        product: { name: "SCHOFIELD'S.", sub: 'English Dry Vermouth', price: '£26.95',
          img: 'https://asterleybros.com/cdn/shop/products/SDVSQsml.png?v=1770025132',
          url: 'https://asterleybros.com/products/schofields-english-dry-vermouth' } },
    ],
  },
  {
    id: 'long', title: 'Long Serves', sub: 'for a warm afternoon',
    note: 'Drinks that last a conversation.',
    items: [
      { name: 'Estate Highball', desc: 'Sweet vermouth, citrus tonic.', price: '£9',
        jarvisSuggests: "50ml Estate, 75ml citrus tonic over ice. The simplest drink on the list — and often the best one.",
        product: { name: 'ESTATE.', sub: 'English Sweet Vermouth', price: '£26.95',
          img: 'https://asterleybros.com/cdn/shop/products/ESTATESQsml.jpg?v=1718448159',
          url: 'https://asterleybros.com/products/estate-english-sweet-vermouth' } },
      { name: 'Fernet & Tonic', desc: 'Britannica Fernet, Indian tonic.', price: '£10',
        jarvisSuggests: "Britannica is bracing — menthol, bitter, aromatic. Indian tonic cuts through it just enough. A late-afternoon drink.",
        product: { name: 'BRITANNICA.', sub: 'London Fernet', price: '£38.95',
          img: 'https://asterleybros.com/cdn/shop/files/Britannica_SQ_sml.png?v=1771155944',
          url: 'https://asterleybros.com/products/britannica-london-fernet' } },
    ],
  },
  {
    id: 'digestivo', title: 'Digestivo', sub: 'to close the evening',
    note: 'A bitter, reflective end. Neat, or one rock.',
    items: [
      { name: 'Dispense, neat', desc: '35ml, room temperature.', price: '£8',
        jarvisSuggests: "35ml at room temperature. No ice. Let the gentian and hops speak — they've earned it.",
        product: { name: 'DISPENSE.', sub: 'Modern British Amaro', price: '£31.95',
          img: 'https://asterleybros.com/cdn/shop/products/DispenseSQsml.jpg?v=1718448169',
          url: 'https://asterleybros.com/products/dispense-modern-british-amaro' } },
      { name: 'Britannica, rocks', desc: '35ml, one cube.', price: '£8',
        jarvisSuggests: "One large ice cube. That's all. The cold opens up the menthol and softens the edge — just enough.",
        product: { name: 'BRITANNICA.', sub: 'London Fernet', price: '£38.95',
          img: 'https://asterleybros.com/cdn/shop/files/Britannica_SQ_sml.png?v=1771155944',
          url: 'https://asterleybros.com/products/britannica-london-fernet' } },
    ],
  },
];

const GLASSES = [
  { id: 'martini',  name: 'Martini',       note: 'stirred, stemmed, clear',  shape: 'coupe'   },
  { id: 'rocks',    name: 'Old Fashioned', note: 'spirit-forward, on ice',   shape: 'rocks'   },
  { id: 'highball', name: 'Highball',      note: 'long, effervescent',       shape: 'highball'},
  { id: 'negroni',  name: 'Negroni',       note: 'bitter, balanced',         shape: 'negroni' },
  { id: 'flute',    name: 'Fizz',          note: 'sparkling, celebratory',   shape: 'flute'   },
  { id: 'snifter',  name: 'Digestivo',     note: 'warming, contemplative',   shape: 'snifter' },
];

const MOODS = [
  { id: 'bright', label: 'Bright & Crisp',  note: 'martini territory'  },
  { id: 'dark',   label: 'Dark & Brooding', note: 'a stirred affair'   },
  { id: 'easy',   label: 'Easy & Long',     note: 'highball, slow'     },
  { id: 'strong', label: 'Strong & Bitter', note: 'negroni country'    },
  { id: 'fizzy',  label: 'Fizzy & Social',  note: 'spritz, for two'    },
  { id: 'spice',  label: 'Warm & Spiced',   note: 'a rainy day drink'  },
];

const COCKTAILS = [
  { id: 'white-neg',  name: 'Estate White Negroni',
    spec: [['Estate Sweet Vermouth','30ml'],['London dry gin','30ml'],['Suze gentian','20ml']],
    garnish: 'Lemon twist', method: 'Stir 20s', glass: 'Coupe or rocks glass', mood: 'elegant',
    products: [{ name: 'ESTATE.', sub: 'English Sweet Vermouth', price: '£26.95',
      img: 'https://asterleybros.com/cdn/shop/products/ESTATESQsml.jpg?v=1718448159',
      url: 'https://asterleybros.com/products/estate-english-sweet-vermouth' }] },
  { id: 'boul',       name: 'Dispense Boulevardier',
    spec: [['Dispense Amaro','30ml'],['Bourbon whiskey','30ml'],['Sweet vermouth','20ml']],
    garnish: 'Orange peel', method: 'Stir 25–30s', glass: 'Rocks glass', mood: 'contemplative',
    products: [{ name: 'DISPENSE.', sub: 'Modern British Amaro', price: '£31.95',
      img: 'https://asterleybros.com/cdn/shop/products/DispenseSQsml.jpg?v=1718448169',
      url: 'https://asterleybros.com/products/dispense-modern-british-amaro' }] },
  { id: 'fern-gin',   name: 'Britannica Fernet & Ginger',
    spec: [['Britannica London Fernet','40ml'],['Ginger ale','120ml']],
    garnish: 'Lime wedge', method: 'Build over ice', glass: 'Highball glass', mood: 'easy',
    products: [{ name: 'BRITANNICA.', sub: 'London Fernet', price: '£38.95',
      img: 'https://asterleybros.com/cdn/shop/files/Britannica_SQ_sml.png?v=1771155944',
      url: 'https://asterleybros.com/products/britannica-london-fernet' }] },
  { id: 'neg-scuro',  name: 'Dispense Negroni Scuro',
    spec: [['Dispense Amaro','30ml'],['London dry gin','30ml'],['Sweet vermouth','30ml']],
    garnish: 'Orange twist', method: 'Stir 30s', glass: 'Rocks glass', mood: 'bitter',
    products: [{ name: 'DISPENSE.', sub: 'Modern British Amaro', price: '£31.95',
      img: 'https://asterleybros.com/cdn/shop/products/DispenseSQsml.jpg?v=1718448169',
      url: 'https://asterleybros.com/products/dispense-modern-british-amaro' }] },
  { id: 'spritz',     name: 'Asterley Grapefruit Spritz',
    spec: [['Asterley Original Aperitivo','45ml'],['Pink grapefruit juice','30ml'],['Prosecco','75ml']],
    garnish: 'Grapefruit half-wheel', method: 'Shake then top with prosecco', glass: 'Large wine glass', mood: 'celebratory',
    products: [{ name: 'ASTERLEY ORIGINAL.', sub: 'British Aperitivo', price: '£20.95',
      img: 'https://asterleybros.com/cdn/shop/files/Asterley_Original_-_Product_Shot_SML.png?v=1771155944',
      url: 'https://asterleybros.com/products/asterley-original-british-aperitivo' }] },
  { id: 'toronto',    name: 'Britannica Toronto',
    spec: [['Rye whiskey','50ml'],['Britannica London Fernet','15ml'],['Simple syrup','10ml'],['Bitters','2 dashes']],
    garnish: 'Orange peel', method: 'Stir until velvety', glass: 'Coupe or rocks glass', mood: 'warming',
    products: [{ name: 'BRITANNICA.', sub: 'London Fernet', price: '£38.95',
      img: 'https://asterleybros.com/cdn/shop/files/Britannica_SQ_sml.png?v=1771155944',
      url: 'https://asterleybros.com/products/britannica-london-fernet' }] },
];

function cocktailFor(glassId, moodId) {
  const matrix = {
    martini:  { bright:'white-neg', dark:'boul',     easy:'white-neg', strong:'neg-scuro', fizzy:'white-neg', spice:'boul'      },
    rocks:    { bright:'white-neg', dark:'boul',     easy:'boul',      strong:'neg-scuro', fizzy:'neg-scuro', spice:'boul'      },
    highball: { bright:'spritz',   dark:'fern-gin',  easy:'fern-gin',  strong:'fern-gin',  fizzy:'spritz',    spice:'fern-gin'  },
    negroni:  { bright:'white-neg', dark:'boul',     easy:'neg-scuro', strong:'neg-scuro', fizzy:'white-neg', spice:'neg-scuro' },
    flute:    { bright:'spritz',   dark:'spritz',    easy:'spritz',    strong:'spritz',    fizzy:'spritz',    spice:'spritz'    },
    snifter:  { bright:'toronto',  dark:'toronto',   easy:'toronto',   strong:'toronto',   fizzy:'toronto',   spice:'toronto'   },
  };
  const id = (matrix[glassId] || {})[moodId] || 'neg-scuro';
  return COCKTAILS.find(c => c.id === id);
}

// ─── SVG helpers ──────────────────────────────────────────────────────────

const INK    = '#1E1A14';
const CLARET = '#B85C2A';
const CREAM  = '#F4EBD7';

function monogramSVG(size = 32) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="23" fill="${CREAM}" stroke="#8E5A2A" stroke-width="1"/>
    <text x="24" y="29" text-anchor="middle" fill="#8E5A2A"
      font-family="Cormorant Garamond,serif" font-size="20" font-style="italic" font-weight="500">A</text>
    <text x="33" y="22" text-anchor="middle" fill="#8E5A2A"
      font-family="Cormorant Garamond,serif" font-size="10">·</text>
    <text x="38" y="22" text-anchor="middle" fill="#8E5A2A"
      font-family="Cormorant Garamond,serif" font-size="14" font-style="italic">b</text>
  </svg>`;
}

function sendSVG(col = CREAM) {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12 L20 12 M14 6 L20 12 L14 18" stroke="${col}" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function closeSVG(col = INK) {
  return `<svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 4 L16 16 M16 4 L4 16" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

function glassSVG(shape) {
  const s = INK, liq = CLARET, lf = { fill: liq, opacity: '0.75' };
  const c = { stroke: s, 'stroke-width': '1.2', fill: 'rgba(255,255,255,0.15)',
               'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  const ca = Object.entries(c).map(([k,v]) => `${k}="${v}"`).join(' ');
  switch (shape) {
    case 'coupe': return `<svg width="56" height="80" viewBox="0 0 64 90">
      <defs><clipPath id="g-coupe"><path d="M6 16 Q32 46 58 16 Z"/></clipPath></defs>
      <rect x="6" y="16" width="52" height="30" fill="${liq}" opacity=".75" clip-path="url(#g-coupe)"/>
      <path d="M6 14 L58 14 Q58 18 32 46 Q6 18 6 14 Z" ${ca}/>
      <line x1="32" y1="46" x2="32" y2="78" stroke="${s}" stroke-width="1.2"/>
      <ellipse cx="32" cy="80" rx="14" ry="3" fill="none" stroke="${s}" stroke-width="1.2"/>
    </svg>`;
    case 'rocks': return `<svg width="48" height="64" viewBox="0 0 52 72">
      <rect x="8" y="18" width="36" height="40" ${Object.entries(lf).map(([k,v])=>`${k}="${v}"`).join(' ')}/>
      <path d="M8 16 L44 16 L42 60 Q42 62 40 62 L12 62 Q10 62 10 60 Z" ${ca}/>
      <rect x="16" y="42" width="10" height="10" fill="#fff" opacity=".4" transform="rotate(8 21 47)"/>
    </svg>`;
    case 'highball': return `<svg width="38" height="84" viewBox="0 0 44 96">
      <rect x="10" y="20" width="24" height="58" ${Object.entries(lf).map(([k,v])=>`${k}="${v}"`).join(' ')}/>
      <path d="M10 14 L34 14 L33 78 Q33 80 31 80 L13 80 Q11 80 11 78 Z" ${ca}/>
    </svg>`;
    case 'negroni': return `<svg width="44" height="70" viewBox="0 0 48 78">
      <rect x="8" y="22" width="32" height="38" ${Object.entries(lf).map(([k,v])=>`${k}="${v}"`).join(' ')}/>
      <path d="M8 18 L40 18 L38 62 Q38 64 36 64 L12 64 Q10 64 10 62 Z" ${ca}/>
      <circle cx="30" cy="24" r="6" fill="#F4A340" stroke="${s}" stroke-width=".8"/>
    </svg>`;
    case 'flute': return `<svg width="30" height="88" viewBox="0 0 36 100">
      <defs><clipPath id="g-flute"><path d="M11 10 L25 10 L22 64 L14 64 Z"/></clipPath></defs>
      <rect x="11" y="20" width="14" height="44" fill="${liq}" opacity=".7" clip-path="url(#g-flute)"/>
      <path d="M11 8 L25 8 L22 64 Q22 68 18 68 Q14 68 14 64 Z" ${ca}/>
      <line x1="18" y1="68" x2="18" y2="88" stroke="${s}" stroke-width="1.2"/>
      <ellipse cx="18" cy="90" rx="9" ry="2.5" fill="none" stroke="${s}" stroke-width="1.2"/>
    </svg>`;
    case 'snifter': return `<svg width="52" height="66" viewBox="0 0 60 76">
      <defs><clipPath id="g-snif"><path d="M12 22 Q12 44 30 44 Q48 44 48 22 Z"/></clipPath></defs>
      <rect x="12" y="30" width="36" height="14" fill="${liq}" opacity=".75" clip-path="url(#g-snif)"/>
      <path d="M14 16 L46 16 Q48 16 48 20 Q48 44 30 44 Q12 44 12 20 Q12 16 14 16 Z" ${ca}/>
      <line x1="30" y1="44" x2="30" y2="60" stroke="${s}" stroke-width="1.2"/>
      <ellipse cx="30" cy="62" rx="10" ry="2.5" fill="none" stroke="${s}" stroke-width="1.2"/>
    </svg>`;
    default: return '';
  }
}

// ─── Web Component ────────────────────────────────────────────────────────

class AsterleySommelier extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isOpen           = false;
    this._sessionId        = localStorage.getItem('ab-session-id') || null;
    this._isLoading        = false;
    this._tab              = 'chat';
    this._barStage         = 'intro';
    this._barGlass         = null;
    this._barMood          = null;
    this._menuOpenId       = 'aperitivo';
    this._menuChosenId     = null;
    this._menuData         = null;
    this._noteIdx          = 0;
  }

  static get observedAttributes() { return ['api-url']; }
  get apiUrl() { return this.getAttribute('api-url') || ''; }

  connectedCallback() {
    this._render();
    this._bindEvents();
    this._renderAccordion();
    this._renderBarContent();
    this._fetchMenu();
    // Welcome message lives in the chat view
    this._addBotMessage({
      message: `${getGreeting()}. Jarvis here — use Recipes to browse our cocktails, Make a Drink to find your perfect serve, or just ask me anything.`,
      productCards: [], recipeCards: [],
      suggestedActions: [],
    });
    this._startNoteRotation();
  }

  // ── Note rotation ───────────────────────────────────────────────────────

  _startNoteRotation() {
    const LONGER_MSGS = [
      "I've a Negroni spec with your name on it when you're ready.",
      "What shall we make tonight?",
      "Ask me about our botanicals — there are rather a lot of them.",
      "Looking for a gift? I can help narrow it down.",
      "Tell me your glass and mood. I'll find the serve.",
      "Something bitter, something bright — I know the difference.",
    ];
    const el = this.shadowRoot.getElementById('note-text');
    if (!el) return;
    setInterval(() => {
      if (this._isOpen) return;
      el.classList.add('ab-note-fade');
      setTimeout(() => {
        this._noteIdx = (this._noteIdx + 1) % LONGER_MSGS.length;
        el.textContent = LONGER_MSGS[this._noteIdx];
        el.classList.remove('ab-note-fade');
      }, 300);
    }, 5000);
  }

  // ── Menu fetch ──────────────────────────────────────────────────────────

  async _fetchMenu() {
    if (!this.apiUrl) return;
    try {
      const res = await fetch(`${this.apiUrl}/api/menu`);
      if (!res.ok) return;
      this._menuData = await res.json();
      this._renderAccordion();
    } catch (_) {}
  }

  // ── Render shell ────────────────────────────────────────────────────────

  _render() {
    const cssUrl = new URL('sommelier-widget.css?v=9', import.meta.url).href;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssUrl}">

      <!-- Post-it note launcher -->
      <button class="ab-note-launcher" id="bubble" aria-label="Open Jarvis">
        <div class="ab-note-eyebrow">a note from the bar</div>
        <div class="ab-note-text" id="note-text">I've a Negroni spec with your name on it when you're ready.</div>
        <div class="ab-note-sig">— J.</div>
      </button>

      <!-- Panel -->
      <div class="ab-panel" id="panel" role="dialog" aria-label="Jarvis — Asterley Sommelier">

        <!-- Masthead (V1 Dispensatory header) -->
        <div class="ab-masthead">
          <div class="ab-masthead-main">
            ${monogramSVG(32)}
            <div class="ab-masthead-text">
              <div class="ab-eyebrow">The Asterley Dispensatory</div>
              <div class="ab-masthead-name">Jarvis, at your service.</div>
            </div>
            <button class="ab-panel-close" id="panel-close" aria-label="Close">${closeSVG()}</button>
          </div>
          <div class="ab-subrule">
            <div class="ab-subrule-line"></div>
            <span class="ab-subrule-text">№ MMXXVI · SE23 · OPEN</span>
            <div class="ab-subrule-line"></div>
          </div>
          <nav class="ab-tabs" aria-label="Views">
            <button class="ab-tab ab-tab-active" data-tab="chat">Ask Jarvis</button>
            <button class="ab-tab" data-tab="menu">Recipes</button>
            <button class="ab-tab" data-tab="bar">Make a Drink</button>
          </nav>
        </div>

        <!-- ── View: Menu (V4) ── -->
        <div class="ab-view ab-view-hidden" id="view-menu">
          <div class="ab-menu-hero">
            <div class="ab-menu-edition">No. XII · Spring MMXXVI</div>
            <div class="ab-menu-heading">The Asterley<br><em>Aperitivo Hour.</em></div>
            <div class="ab-menu-rule-line"></div>
            <div class="ab-menu-sub">— curated by Jarvis, for the drinker who knows what they like but is open to being surprised.</div>
          </div>
          <div class="ab-view-intro">Browse cocktails made with our bottles — tap any to ask Jarvis for the full recipe.</div>
          <div id="accordion"></div>
          <div class="ab-whisper">
            <span class="ab-rx">℞</span>
            <input class="ab-whisper-input" id="whisper" placeholder="whisper to jarvis…" autocomplete="off">
            <button class="ab-whisper-btn" id="whisper-send" aria-label="Send">${sendSVG(CLARET)}</button>
          </div>
          <div class="ab-menu-footer">— fin —<br>handmade with integrity in south london</div>
        </div>

        <!-- ── View: Bar (V2) ── -->
        <div class="ab-view ab-view-hidden" id="view-bar">
          <div class="ab-jarvis-line" id="jarvis-line"></div>
          <div id="bar-content"></div>
          <div class="ab-bar-footer">asterley bros · dalmain rd, SE23 · est. MMXIV</div>
        </div>

        <!-- ── View: Chat (V1) ── -->
        <div class="ab-view" id="view-chat">
          <div class="ab-messages" id="messages"></div>
          <div class="ab-chips" id="chips"></div>
        </div>

        <!-- Persistent input (Chat tab only) -->
        <div class="ab-input-area ab-input-hidden" id="input-area">
          <span class="ab-rx-label">℞</span>
          <textarea class="ab-input" id="input" placeholder="ask Jarvis anything…" rows="1"></textarea>
          <button class="ab-send-btn" id="send" aria-label="Send">${sendSVG(CREAM)}</button>
        </div>

      </div>
    `;
  }

  // ── Events ──────────────────────────────────────────────────────────────

  _bindEvents() {
    const sr = this.shadowRoot;

    sr.getElementById('bubble').onclick = () => this._toggle();
    sr.getElementById('panel-close').onclick = () => this._toggle();

    sr.querySelectorAll('.ab-tab').forEach(btn => {
      btn.onclick = () => this._switchTab(btn.dataset.tab);
    });

    const input   = sr.getElementById('input');
    const sendBtn = sr.getElementById('send');
    sendBtn.onclick = () => this._sendMessage();
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._sendMessage(); }
    };
    input.oninput = () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    };

    const whisper     = sr.getElementById('whisper');
    const whisperSend = sr.getElementById('whisper-send');
    const doWhisper = () => {
      const text = whisper.value.trim();
      if (!text) return;
      whisper.value = '';
      this._switchTab('chat');
      this._sendMessage(text);
    };
    whisperSend.onclick = doWhisper;
    whisper.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); doWhisper(); } };
  }

  _toggle() {
    this._isOpen = !this._isOpen;
    this.shadowRoot.getElementById('bubble').classList.toggle('ab-open', this._isOpen);
    this.shadowRoot.getElementById('panel').classList.toggle('ab-visible', this._isOpen);
    if (this._isOpen) {
      // Force layout init — input-area visibility, scroll position, correct view shown
      this._switchTab(this._tab);
    }
  }

  _switchTab(tab) {
    this._tab = tab;
    const sr = this.shadowRoot;
    sr.querySelectorAll('.ab-tab').forEach(b => b.classList.toggle('ab-tab-active', b.dataset.tab === tab));
    sr.querySelectorAll('.ab-view').forEach(v => v.classList.add('ab-view-hidden'));
    sr.getElementById(`view-${tab}`)?.classList.remove('ab-view-hidden');
    const ia = sr.getElementById('input-area');
    if (ia) ia.classList.toggle('ab-input-hidden', tab !== 'chat');
    if (tab === 'chat') {
      this._scrollToBottom();
      setTimeout(() => sr.getElementById('input')?.focus(), 100);
    }
    if (tab === 'bar') this._renderBarContent();
  }

  // ── V4 Menu ─────────────────────────────────────────────────────────────

  _renderAccordion() {
    const container = this.shadowRoot.getElementById('accordion');
    if (!container) return;
    container.innerHTML = '';

    const sections = this._menuData?.sections ?? MENU_SECTIONS;

    sections.forEach((s, idx) => {
      const isOpen   = this._menuOpenId === s.id;
      const section  = document.createElement('div');
      section.className = 'ab-section';

      let noteHTML  = isOpen ? `<div class="ab-section-note">&ldquo;${this._esc(s.note)}&rdquo; &thinsp;&mdash;j.</div>` : '';
      let itemsHTML = '';
      if (isOpen) {
        itemsHTML = s.items.map((it, j) => {
          const chosen  = this._menuChosenId === `${s.id}-${j}`;
          const name    = it.name || it.k || '';
          const desc    = it.desc || it.v || '';
          const suggest = it.jarvisSuggests || 'Ask me for the full recipe or to find the right bottle.';
          return `
            <button class="ab-item" data-section="${s.id}" data-idx="${j}">
              <div class="ab-item-row">
                <div class="ab-item-name">${this._esc(name)}${it.star ? ' <span class="ab-star">★</span>' : ''}</div>
                <div class="ab-item-dots"></div>
                <div class="ab-item-price">${this._esc(it.price || it.t || '')}</div>
              </div>
              <div class="ab-item-desc">${this._esc(desc)}</div>
              ${chosen ? `
                <div class="ab-jarvis-aside a-rise">
                  <div class="ab-aside-label">Jarvis suggests →</div>
                  <div class="ab-aside-text">&ldquo;${this._esc(suggest)}&rdquo;</div>
                  ${it.product ? `
                  <div class="ab-bcard-shop-label" style="margin-top:10px">Get the bottle</div>
                  <a class="ab-product-card" href="${it.product.url}" target="_blank">
                    <img class="ab-product-img" src="${it.product.img}" alt="${this._esc(it.product.name)}" loading="lazy"/>
                    <div class="ab-product-info">
                      <div class="ab-product-name">${this._esc(it.product.name)}</div>
                      <div class="ab-product-sub">${this._esc(it.product.sub)}</div>
                      <div class="ab-product-price">${this._esc(it.product.price)}</div>
                    </div>
                    <div class="ab-product-cta">Shop →</div>
                  </a>` : ''}
                  <div class="ab-aside-actions">
                    <button class="ab-aside-btn" data-action="recipe" data-name="${this._esc(name)}">Recipe card</button>
                    <button class="ab-aside-btn" data-action="chat" data-name="${this._esc(name)}">Ask Jarvis</button>
                  </div>
                </div>` : ''}
            </button>`;
        }).join('');
      }

      section.innerHTML = `
        ${noteHTML}
        <button class="ab-section-hdr" data-id="${s.id}">
          <div class="ab-section-left">
            <span class="ab-section-num">${String(idx+1).padStart(2,'0')}</span>
            <span class="ab-section-title">${this._esc(s.title)}</span>
            <span class="ab-section-sub">— ${this._esc(s.sub)}</span>
          </div>
          <span class="ab-chevron" style="transform:${isOpen?'rotate(90deg)':'none'}">›</span>
        </button>
        ${isOpen ? `<div class="ab-items a-rise">${itemsHTML}</div>` : ''}`;

      container.appendChild(section);
    });

    // Section toggles
    container.querySelectorAll('.ab-section-hdr').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        this._menuOpenId   = this._menuOpenId === id ? null : id;
        this._menuChosenId = null;
        this._renderAccordion();
      };
    });

    // Item selection
    container.querySelectorAll('.ab-item').forEach(btn => {
      btn.onclick = (e) => {
        if (e.target.closest('.ab-aside-btn') || e.target.closest('.ab-product-card')) return;
        const key = `${btn.dataset.section}-${btn.dataset.idx}`;
        this._menuChosenId = this._menuChosenId === key ? null : key;
        this._renderAccordion();
      };
    });

    // Aside action buttons
    container.querySelectorAll('.ab-aside-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const { action, name } = btn.dataset;
        if (action === 'recipe') {
          this._switchTab('chat');
          this._sendMessage(`Give me the recipe for ${name}`);
        } else if (action === 'chat') {
          this._switchTab('chat');
          this._sendMessage(`Tell me about ${name}`);
        }
      };
    });
  }

  // ── V2 Bar ──────────────────────────────────────────────────────────────

  _renderBarContent() {
    const lineEl  = this.shadowRoot.getElementById('jarvis-line');
    const content = this.shadowRoot.getElementById('bar-content');
    if (!lineEl || !content) return;

    const cocktail = cocktailFor(this._barGlass?.id, this._barMood?.id);
    const lines = {
      intro:   `${getGreeting()}. Pull up a stool — I'm Jarvis. What shape of glass feels right tonight?`,
      inquire: `${this._barGlass?.name || 'That glass'}. An excellent instinct. Tell me your mood.`,
      pouring: `A ${cocktail?.name || 'serve'}, coming up. Watch the ice.`,
      card:    "There. Yours to keep — or I'll print it for the fridge.",
    };
    lineEl.textContent = lines[this._barStage];

    switch (this._barStage) {
      case 'intro':
        content.innerHTML = `
          <div class="ab-view-intro">Pick a glass and tell me your mood — I'll find your serve.</div>
          <div class="ab-voice-dock">
            <div class="ab-voice-bars">${[4,10,6,14,8].map(h=>`<div class="ab-vbar" style="height:${h}px"></div>`).join('')}</div>
            <div class="ab-voice-text">or just tell me what you fancy…</div>
          </div>
          <div class="ab-glass-grid">
            ${GLASSES.map((g,i) => `
              <button class="ab-glass-btn a-rise" data-id="${g.id}" style="animation-delay:${i*70}ms">
                <div class="ab-glass-icon">${glassSVG(g.shape)}</div>
                <div class="ab-glass-name">${this._esc(g.name)}</div>
                <div class="ab-glass-note">${this._esc(g.note)}</div>
              </button>`).join('')}
          </div>
          <div class="ab-shelf-line"></div>
          <div class="ab-shelf-hint">tap a glass · or speak up ↑</div>`;
        content.querySelectorAll('.ab-glass-btn').forEach(btn => {
          btn.onclick = () => {
            this._barGlass = GLASSES.find(g => g.id === btn.dataset.id);
            this._barStage = 'inquire';
            this._renderBarContent();
          };
        });
        break;

      case 'inquire':
        content.innerHTML = `
          <button class="ab-back-btn" id="bar-back">← Back</button>
          <div class="ab-mood-list">
            ${MOODS.map((m,i) => `
              <button class="ab-mood-btn a-rise" data-id="${m.id}" style="animation-delay:${i*40}ms">
                <div>
                  <div class="ab-mood-label">${this._esc(m.label)}</div>
                  <div class="ab-mood-note">${this._esc(m.note)}</div>
                </div>
                <div class="ab-mood-arrow">→</div>
              </button>`).join('')}
          </div>`;
        content.querySelector('#bar-back').onclick = () => {
          this._barStage = 'intro';
          this._barGlass = null;
          this._renderBarContent();
        };
        content.querySelectorAll('.ab-mood-btn').forEach(btn => {
          btn.onclick = () => {
            this._barMood  = MOODS.find(m => m.id === btn.dataset.id);
            this._barStage = 'pouring';
            this._renderBarContent();
            setTimeout(() => { this._barStage = 'card'; this._renderBarContent(); }, 2400);
          };
        });
        break;

      case 'pouring':
        content.innerHTML = `
          <div class="ab-pour-stage">
            <svg viewBox="0 0 110 160" width="110" height="160">
              <path d="M18 20 L92 20 L84 110 Q84 130 55 130 Q26 130 26 110 Z"
                stroke="${INK}" stroke-width="1.2" fill="rgba(247,239,220,0.3)"/>
              <path d="M55 130 L55 152 M40 152 L70 152" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>
              <defs><clipPath id="gc"><path d="M20 22 L90 22 L82 110 Q82 128 55 128 Q28 128 28 110 Z"/></clipPath></defs>
              <rect x="0" y="130" width="110" height="0" fill="${CLARET}" clip-path="url(#gc)" opacity=".75">
                <animate attributeName="height" from="0" to="115" dur="2.2s" fill="freeze"/>
                <animate attributeName="y" from="130" to="15" dur="2.2s" fill="freeze"/>
              </rect>
            </svg>
            <div class="ab-pour-drip"></div>
          </div>`;
        break;

      case 'card':
        if (!cocktail) break;
        const num = Math.floor(Math.random() * 80 + 10);
        content.innerHTML = `
          <div class="ab-bar-card a-rise">
            <div class="ab-bcard-frame">
              <div class="ab-bcard-eyebrow">Serve №${num} · for the ${this._esc(this._barMood?.id || '')}</div>
              <div class="ab-bcard-name">${this._esc(cocktail.name)}</div>
              <div class="ab-bcard-rule"></div>
              ${cocktail.spec.map(([n,v]) => `
                <div class="ab-spec-row">
                  <span class="ab-spec-vol">${this._esc(v)}</span>
                  <span class="ab-spec-dots"></span>
                  <span class="ab-spec-name">${this._esc(n)}</span>
                </div>`).join('')}
              <div class="ab-bcard-method">${this._esc(cocktail.method)}. ${this._esc(cocktail.glass)}, garnish with ${this._esc(cocktail.garnish.toLowerCase())}.</div>
              ${cocktail.products?.length ? `
              <div class="ab-bcard-shop">
                <div class="ab-bcard-shop-label">Get the bottle</div>
                ${cocktail.products.map(p => `
                <a class="ab-product-card" href="${p.url}" target="_blank">
                  <img class="ab-product-img" src="${p.img}" alt="${this._esc(p.name)}" loading="lazy"/>
                  <div class="ab-product-info">
                    <div class="ab-product-name">${this._esc(p.name)}</div>
                    <div class="ab-product-sub">${this._esc(p.sub)}</div>
                    <div class="ab-product-price">${this._esc(p.price)}</div>
                  </div>
                  <div class="ab-product-cta">Shop →</div>
                </a>`).join('')}
              </div>` : ''}
              <div class="ab-bcard-actions">
                <button class="ab-bcard-btn" id="bar-chat">Ask Jarvis →</button>
                <button class="ab-bcard-btn ab-bcard-again" id="bar-again">↩ Again</button>
              </div>
            </div>
          </div>`;
        content.querySelector('#bar-chat').onclick = () => {
          this._switchTab('chat');
          this._sendMessage(`Tell me more about the ${cocktail.name}`);
        };
        content.querySelector('#bar-again').onclick = () => {
          this._barStage = 'intro';
          this._barGlass = null;
          this._barMood  = null;
          this._renderBarContent();
        };
        break;
    }
  }

  // ── V1 Chat ─────────────────────────────────────────────────────────────

  _initChips() {
    // Static chips removed — dynamic suggestedActions chips drive this area
  }

  _addUserMessage(text) {
    const container = this.shadowRoot.getElementById('messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'ab-msg-u';
    div.innerHTML = `<div class="ab-msg-meta ab-meta-u">YOU →</div>
      <div class="ab-msg-text ab-msg-text-u">${this._esc(text)}</div>`;
    container.appendChild(div);
    this._scrollToBottom();
  }

  _addBotMessage(data) {
    const container = this.shadowRoot.getElementById('messages');
    if (!container) return;

    if (data.message) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const div = document.createElement('div');
      div.className = 'ab-msg-j a-rise';
      div.innerHTML = `<div class="ab-msg-meta ab-meta-j">← JARVIS · ${now}</div>
        <div class="ab-msg-text ab-msg-text-j"></div>`;
      container.appendChild(div);
      this._typewrite(div.querySelector('.ab-msg-text-j'), data.message);
    }

    if (data.productCards?.length) {
      const wrap = document.createElement('div');
      wrap.className = 'ab-product-cards';
      data.productCards.forEach(c => wrap.appendChild(this._createProductCard(c)));
      container.appendChild(wrap);
    }

    if (data.recipeCards?.length) {
      const wrap = document.createElement('div');
      wrap.className = 'ab-recipe-cards';
      data.recipeCards.forEach(c => wrap.appendChild(this._createRecipeCard(c)));
      container.appendChild(wrap);
    }

    if (data.suggestedActions?.length) {
      const wrap = document.createElement('div');
      wrap.className = 'ab-suggestions';
      data.suggestedActions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'ab-chip';
        btn.textContent = a.label;
        btn.onclick = () => { wrap.remove(); this._handleAction(a); };
        wrap.appendChild(btn);
      });
      container.appendChild(wrap);
    }

    this._scrollToBottom();
  }

  _typewrite(el, text, speed = 16) {
    el.textContent = '';
    el.classList.add('ab-caret');
    let i = 0;
    const t = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      this._scrollToBottom();
      if (i >= text.length) {
        clearInterval(t);
        el.classList.remove('ab-caret');
        this._linkifyMessage(el);
      }
    }, speed);
  }

  _linkifyMessage(el) {
    const LINKS = [
      { re: /\bOriginal Aperitivo\b/g, url: 'https://asterleybros.com/products/asterley-original-british-aperitivo' },
      { re: /\bAsterley Original\b/g,  url: 'https://asterleybros.com/products/asterley-original-british-aperitivo' },
      { re: /\bSchofield['']?s\b/g, url: 'https://asterleybros.com/products/schofields-english-dry-vermouth' },
      { re: /\bSchofields?\b/g,        url: 'https://asterleybros.com/products/schofields-english-dry-vermouth' },
      { re: /\bCunard\b/g,             url: 'https://asterleybros.com/products/cunard-limited-edition-english-dry-vermouth' },
      { re: /\bBritannica\b/g,         url: 'https://asterleybros.com/products/britannica-london-fernet' },
      { re: /\bDispense\b/g,           url: 'https://asterleybros.com/products/dispense-modern-british-amaro' },
      { re: /\bEstate\b/g,             url: 'https://asterleybros.com/products/estate-english-sweet-vermouth' },
    ];
    const text = el.textContent;
    const spans = [];

    // Named product links
    LINKS.forEach(({ re, url }) => {
      const rex = new RegExp(re.source, re.flags);
      let m;
      while ((m = rex.exec(text)) !== null) {
        spans.push({ start: m.index, end: m.index + m[0].length, url, matched: m[0] });
      }
    });

    // "here: URL" pattern — link the word "here", drop raw URL from display
    let m;
    const hereRe = /\bhere\b[:\s]+(https?:\/\/[^\s,;]+)/gi;
    while ((m = hereRe.exec(text)) !== null) {
      spans.push({ start: m.index, end: m.index + m[0].length, url: m[1], matched: 'here' });
    }

    // Bare URLs not already inside a "here: URL" span — domain-only label
    const urlRe = /https?:\/\/[^\s,;]+/g;
    while ((m = urlRe.exec(text)) !== null) {
      if (spans.some(s => s.start <= m.index && m.index < s.end)) continue;
      try {
        const u = new URL(m[0]);
        spans.push({ start: m.index, end: m.index + m[0].length, url: m[0], matched: u.hostname.replace('www.', '') });
      } catch (_) {}
    }

    if (spans.length === 0) return;
    spans.sort((a, b) => a.start - b.start);
    const deduped = [];
    let lastEnd = 0;
    for (const s of spans) {
      if (s.start >= lastEnd) { deduped.push(s); lastEnd = s.end; }
    }
    let html = '', pos = 0;
    for (const s of deduped) {
      if (s.start > pos) html += this._esc(text.slice(pos, s.start));
      html += `<a href="${s.url}" target="_blank" class="ab-text-link">${this._esc(s.matched)}</a>`;
      pos = s.end;
    }
    if (pos < text.length) html += this._esc(text.slice(pos));
    el.innerHTML = html;
  }

  _createProductCard(card) {
    const div = document.createElement('div');
    div.className = 'ab-product-card a-rise';
    const meta = [card.abv ? `${card.abv}% ABV` : null, card.volume,
      `£${typeof card.price === 'number' ? card.price.toFixed(2) : card.price}`]
      .filter(Boolean).join(' · ');
    const imgHtml = card.imageUrl?.startsWith('http')
      ? `<img class="ab-pcard-img" src="${this._esc(card.imageUrl)}" alt="${this._esc(card.name)}">`
      : `<div class="ab-pcard-img ab-pcard-placeholder">${(card.name||'A')[0]}</div>`;
    div.innerHTML = `
      ${imgHtml}
      <div class="ab-pcard-info">
        <div class="ab-pcard-meta">${this._esc(meta)}</div>
        <div class="ab-pcard-name">${this._esc(card.name)}</div>
        <div class="ab-pcard-desc">${this._esc(card.description || '')}</div>
        <button class="ab-btn-add">Add to Cart</button>
      </div>`;
    div.querySelector('.ab-btn-add').onclick = () => this._addToCart(card);
    return div;
  }

  _createRecipeCard(card) {
    const div = document.createElement('div');
    div.className = 'ab-recipe-card a-rise';
    const num = Math.floor(Math.random() * 80 + 10);
    const ings = (card.ingredients || []).map(i =>
      `<div class="ab-ing-row${i.isAsterleyProduct ? ' ab-ing-hl' : ''}">
        <span class="ab-ing-vol">${this._esc(i.amount)}${this._esc(i.unit)}</span>
        <span class="ab-ing-dots"></span>
        <span class="ab-ing-name">${this._esc(i.item)}</span>
      </div>`).join('');
    const steps = (card.method || []).map((s,i) =>
      `<div class="ab-step">${i+1}. ${this._esc(s)}</div>`).join('');
    // Match recipe to a known cocktail to get a product image
    const cardNameLower = (card.name || '').toLowerCase();
    const matchedCocktail = COCKTAILS.find(c => {
      const cNameLower = c.name.toLowerCase();
      return cNameLower === cardNameLower ||
        cardNameLower.includes(cNameLower.split(' ').slice(0, 2).join(' '));
    });
    const imgUrl = card.imageUrl || matchedCocktail?.products?.[0]?.img;
    div.innerHTML = `
      <div class="ab-recipe-top">
        <div class="ab-recipe-top-text">
          <div class="ab-recipe-eyebrow">Prescription №${num} · serves one</div>
          <div class="ab-recipe-name">${this._esc(card.name)}</div>
          ${card.description ? `<div class="ab-recipe-desc">${this._esc(card.description)}</div>` : ''}
        </div>
        ${imgUrl ? `<img class="ab-recipe-img" src="${this._esc(imgUrl)}" alt="" loading="lazy">` : ''}
      </div>
      <div class="ab-recipe-rule"></div>
      ${ings}
      ${steps ? `<div class="ab-recipe-rule" style="margin:10px 0 8px"></div>${steps}` : ''}
      <div class="ab-recipe-footer">${this._esc(card.glassware||'')} · Garnish: ${this._esc(card.garnish||'none')}</div>
      <div class="ab-recipe-sig">— Jarvis</div>`;
    return div;
  }

  _handleAction(action) {
    switch (action.type) {
      case 'question':
        this._switchTab('chat');
        this._sendMessage(action.value);
        break;
      case 'link':
        window.open(action.value, '_blank');
        break;
      case 'add_to_cart':
        this._addToCart({ shopifyVariantId: action.value });
        break;
      case 'bar':
        this._switchTab('bar');
        break;
    }
  }

  // ── API ─────────────────────────────────────────────────────────────────

  async _sendMessage(textOverride) {
    const input = this.shadowRoot.getElementById('input');
    const text  = textOverride ?? input?.value.trim();
    if (!text || this._isLoading) return;

    if (input && !textOverride) {
      input.value = '';
      input.style.height = 'auto';
    }
    if (this._tab !== 'chat') this._switchTab('chat');

    this._addUserMessage(text);
    this._showTyping();

    try {
      const pageContext = this._getPageContext();
      const cart = await this._getCartContext();
      if (cart) Object.assign(pageContext, cart);

      const res = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this._sessionId, message: text, pageContext }),
      });
      this._hideTyping();
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      this._sessionId = data.sessionId;
      localStorage.setItem('ab-session-id', data.sessionId);
      this._addBotMessage(data);
    } catch {
      this._hideTyping();
      this._addBotMessage({
        message: "My apologies — lost the connection briefly. Try again in a moment, or reach us at hello@asterleybros.com.",
        productCards: [], recipeCards: [],
        suggestedActions: [{ label: '§ Try again', type: 'question', value: text }],
      });
    }
  }

  _getPageContext() {
    try {
      const ctx = { currentUrl: window.location.href };
      if (typeof window.Shopify === 'undefined') return ctx;

      // Current product — Shopify exposes this on product pages
      const meta = window.ShopifyAnalytics?.meta?.product || window.meta?.product;
      if (meta?.id) ctx.currentProductId = String(meta.id);

      // Customer state
      if (window.Shopify?.customer?.id) {
        ctx.customerLoggedIn = true;
        ctx.customerOrdersCount = window.Shopify.customer.orders_count;
      }

      return ctx;
    } catch { return {}; }
  }

  async _getCartContext() {
    try {
      const res = await fetch('/cart.js');
      if (!res.ok) return null;
      const cart = await res.json();
      return {
        cartItems: cart.items.map(i => ({
          variantId: String(i.variant_id),
          quantity:  i.quantity,
          title:     i.title,
          price:     i.price / 100,
        })),
        cartTotal: cart.total_price / 100,
      };
    } catch { return null; }
  }

  async _addToCart(product) {
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.shopifyVariantId, quantity: 1 }),
      });
      if (!res.ok) throw new Error();
      this._addBotMessage({
        message: `Added ${product.name || 'that'} to your cart. Shall I suggest a pairing?`,
        productCards: [], recipeCards: [],
        suggestedActions: [
          { label: 'View cart',           type: 'link',     value: '/cart' },
          { label: '§ Suggest a pairing', type: 'question', value: 'What pairs well with what I just added?' },
        ],
      });
    } catch {
      this._addBotMessage({
        message: "Good choice. Visit the product page directly to add to your cart.",
        productCards: [], recipeCards: [],
        suggestedActions: [{ label: 'View on site', type: 'link', value: product.productUrl || 'https://asterleybros.com/collections/all' }],
      });
    }
  }

  _showTyping() {
    this._isLoading = true;
    const container = this.shadowRoot.getElementById('messages');
    const send = this.shadowRoot.getElementById('send');
    if (send) send.disabled = true;
    const el = document.createElement('div');
    el.id = 'typing';
    el.className = 'ab-typing';
    el.innerHTML = `<div class="ab-typing-rule"></div>`;
    container?.appendChild(el);
    this._scrollToBottom();
  }

  _hideTyping() {
    this._isLoading = false;
    this.shadowRoot.getElementById('typing')?.remove();
    const send = this.shadowRoot.getElementById('send');
    if (send) send.disabled = false;
  }

  _scrollToBottom() {
    const el = this.shadowRoot.getElementById('messages');
    setTimeout(() => { if (el) el.scrollTop = el.scrollHeight; }, 50);
  }

  _esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  }
}

customElements.define('asterley-sommelier', AsterleySommelier);
