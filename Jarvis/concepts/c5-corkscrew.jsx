// c5-corkscrew.jsx — Ambient + trade-first inversion
// Jarvis has no panel. He annotates the existing site in the margins.
// Trade mode = same grammar, different key.

const { useState: useS5 } = React;

const Corkscrew = () => {
  const STATES = ["Resting","First aside","Annotated","Profiler (stickers)","Serve (receipt)","Trade mode"];
  const [s, setS] = useS5(0);
  return (
    <div>
      <div className="frames">
        <div className="frame"><div className="frame__cap"><span><span className="dot"/>DESKTOP · 1440</span><em>annotated site</em></div>
          <div className="viewport-desk viewport-desk--tall"><CorkDesk s={s}/></div></div>
        <div className="frame"><div className="frame__cap"><span><span className="dot"/>MOBILE · 390</span><em>inline asides</em></div>
          <div className="viewport-mob"><CorkMobile s={s}/></div></div>
      </div>
      <StateStrip states={STATES} active={s} onChange={setS}/>
      <Analysis
        subversion="There is no panel at all. Jarvis is a typographic overlay: a single hairline rule running the length of the right margin, with small Caslon italics hanging off it as notes. Products carry stickers — small red-pen circles with a hand-lettered aside. Clicking an aside expands it into a conversation in-place, still in the margin. Trade mode is the exact same grammar in a different key: margin becomes a ruled invoice column, stickers become stock marks, Caslon italics become invoice serifs. One design, two audiences."
        surfaces={[
          { k: "First contact", v: "A single italic line fades in at the right margin: ‘Evening. I’ve marked a few of these.’" },
          { k: "Profiler", v: "Three stickers appear on three product cards. Tap one — it becomes your first answer." },
          { k: "Free chat", v: "Margin expands to a column. The site remains visible." },
          { k: "Photo upload", v: "Drag onto the margin; Jarvis pins it and annotates from there." },
          { k: "Serve card", v: "A paper receipt printed down the margin, perforated at the bottom. Tear to save." },
          { k: "Shop", v: "Native — he lives next to the products already." },
          { k: "Trade", v: "Same margin, different key — invoice column, stock ticks, wholesale prices in blue pen." },
          { k: "Age gate", v: "One margin note: ‘By reading on, you confirm you’re 18+’. Lightest touch." },
          { k: "Escalation", v: "Margin ends in a signature: ‘Rob · Jim · pass the pen’." },
          { k: "Returning", v: "Your previous stickers remain — a wine-stained page." },
        ]}
        tradeoffs={[
          "Margin annotations fight every CMS update — every new product must ship with space for Jarvis.",
          "Mobile has no margin. Concept folds into inline asides but loses its best idea.",
          "Ambient presence risks invisibility. Conversion may suffer versus a louder surface.",
        ]}
        complexity={{ level: "High", note: "Layout coupling is the hard part — Jarvis's asides must attach to site elements that move. A positioning engine, not a widget." }}
        aging={{ level: "Low", note: "Typography and hairline rules age slowly. The concept survives trend cycles." }}
        ratings={[{k:"Subversion",v:5},{k:"On-brand",v:4},{k:"Functional completeness",v:3},{k:"Mobile integrity",v:2},{k:"Conversion pressure",v:3},{k:"Build realism",v:2},{k:"Shareable serve card",v:3}]}
      />
    </div>
  );
};

const CorkDesk = ({ s }) => (
  <div style={{position:"absolute", inset:0, background:"var(--ab-bone)", display:"flex", overflow:"hidden"}}>
    <div style={{flex:1, position:"relative"}}>
      <SiteSkeleton dimmed={s >= 2}/>
      {/* Stickers on products */}
      {s === 3 && (
        <>
          <Sticker top="74%" left="12%" tone="orange">bitter, for Thursdays</Sticker>
          <Sticker top="74%" left="36%" tone="ink">if cooking tonight</Sticker>
          <Sticker top="74%" left="60%" tone="orange">sweeter, but clever</Sticker>
        </>
      )}
      {s === 2 && (
        <>
          <Sticker top="72%" left="13%" tone="orange" small>Jim’s pick</Sticker>
        </>
      )}
    </div>

    {/* Right margin — the whole concept */}
    <div style={{
      width: s === 5 ? 280 : 240,
      borderLeft: `1px solid ${s===5?"var(--ab-ink-blue)":"var(--ab-black)"}`,
      background: s===5 ? "#F6F3EB" : "var(--ab-bone)",
      padding:"16px 16px 16px 20px",
      display:"flex", flexDirection:"column", gap:14,
      fontFamily:"var(--font-italic)", fontStyle:"italic",
      color: s===5 ? "var(--ab-ink-blue)" : "var(--ab-black)",
      position:"relative",
      transition:"all 420ms var(--ease)",
    }}>
      {/* Vertical running rule */}
      <div style={{position:"absolute", left:6, top:12, bottom:12, width:1, background: s===5?"var(--ab-ink-blue)":"var(--ab-black)"}}/>

      {s === 5 ? <TradeMargin/> : <>
        <div style={{fontSize:9, letterSpacing:"0.3em", fontWeight:700, fontStyle:"normal", color:"var(--ab-orange)", fontFamily:"var(--font-sans)"}}>— J.</div>
        {s === 0 && <div style={{fontSize:16, lineHeight:1.4}}>Evening. I’ve marked a few of these.</div>}
        {s === 1 && <>
          <div style={{fontSize:16, lineHeight:1.4}}>Evening. I’ve marked a few of these. <span style={{color:"var(--ab-orange)"}}>Drinking or thinking?</span></div>
          <div style={{fontSize:10, letterSpacing:"0.2em", fontWeight:700, fontFamily:"var(--font-sans)", fontStyle:"normal", color:"var(--ab-slate)"}}>TAP A STICKER · OR WRITE →</div>
        </>}
        {s === 2 && <>
          <div style={{fontSize:15, lineHeight:1.45}}>Evening. Something bitter, you said.</div>
          <div style={{fontSize:15, lineHeight:1.45, color:"var(--ab-orange)"}}>DISPENSE — the matt-black bottle on the left. Twenty-four botanicals, three months to make.</div>
          <div style={{fontSize:14, lineHeight:1.45}}>50ml, tonic, lemon peel. Oils over the glass first.</div>
          <div style={{fontSize:14, color:"var(--ab-slate)"}}>Shall I put one aside?</div>
        </>}
        {s === 3 && <>
          <div style={{fontSize:14, lineHeight:1.4}}>Three stickers. Choose one. Or don’t — I’m not selling you.</div>
          <div style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, fontFamily:"var(--font-sans)", fontStyle:"normal", color:"var(--ab-slate)"}}>QUESTION 1 / 3</div>
        </>}
        {s === 4 && <ServeReceipt/>}
      </>}

      <div style={{marginTop:"auto", paddingTop:10, borderTop:`1px solid ${s===5?"var(--ab-ink-blue)":"var(--ab-black)"}`, fontFamily:"var(--font-sans)", fontStyle:"normal", fontSize:9, letterSpacing:"0.22em", fontWeight:700, color: s===5 ? "var(--ab-ink-blue)" : "var(--ab-slate)"}}>
        {s===5 ? "TRADE DESK · R.B · J.B" : "PASS TO ROB OR JIM →"}
      </div>
    </div>
  </div>
);

const Sticker = ({ top, left, tone, small, children }) => (
  <div style={{
    position:"absolute", top, left,
    transform:"rotate(-6deg)",
    background: tone==="orange" ? "var(--ab-orange)" : "var(--ab-black)",
    color: tone==="orange" ? "var(--ab-off-black)" : "var(--ab-off-white)",
    padding: small ? "4px 8px" : "6px 10px",
    fontFamily:"var(--font-italic)", fontStyle:"italic",
    fontSize: small ? 10 : 12, lineHeight:1.1,
    border:"1px solid var(--ab-black)",
    maxWidth: 110,
    boxShadow:"2px 3px 0 rgba(17,17,17,0.4)",
  }}>{children}</div>
);

const ServeReceipt = () => (
  <div style={{background:"var(--ab-off-white)", border:"1px solid var(--ab-black)", padding:"10px 12px", fontFamily:"var(--font-sans)", fontStyle:"normal", color:"var(--ab-black)"}}>
    <div style={{fontSize:9, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>RECEIPT · № 047</div>
    <div style={{fontSize:18, fontWeight:700, textTransform:"uppercase", marginTop:4, lineHeight:1}}>DISPENSED<br/>&amp; <span className="caslon" style={{color:"var(--ab-orange)", textTransform:"none", fontWeight:400}}>Tonic.</span></div>
    <div style={{borderTop:"1px dashed var(--ab-black)", marginTop:8, paddingTop:6, fontSize:11, lineHeight:1.5}}>
      50ml DISPENSE<br/>150ml tonic<br/>Lemon — skin<br/>Cubed ice
    </div>
    <div className="caslon" style={{fontStyle:"italic", fontSize:11, color:"var(--ab-slate)", marginTop:6}}>tear to save</div>
    <div style={{marginTop:8, paddingTop:6, borderTop:"1px dashed var(--ab-black)", display:"flex", justifyContent:"space-between", fontSize:9, letterSpacing:"0.22em", fontWeight:700}}>
      <span>£30.95</span><span style={{color:"var(--ab-orange)"}}>ADD →</span>
    </div>
  </div>
);

const TradeMargin = () => (
  <>
    <div style={{fontSize:9, letterSpacing:"0.3em", fontWeight:700, fontStyle:"normal", color:"var(--ab-ink-blue)", fontFamily:"var(--font-sans)"}}>— TRADE · J.</div>
    <div style={{fontSize:14, lineHeight:1.4, fontStyle:"italic"}}>Morning, buyer. Stock is marked.</div>
    <div style={{display:"flex", flexDirection:"column", gap:5, fontFamily:"var(--font-sans)", fontStyle:"normal", fontSize:11, marginTop:4}}>
      {[
        {n:"DISPENSE · 50cl", q:"48 cs", w:"£15.47"},
        {n:"ESTATE · 50cl", q:"24 cs", w:"£12.98"},
        {n:"SCHOFIELDS", q:"18 cs", w:"£12.62"},
        {n:"BRITANNICA", q:"6 cs ⚠", w:"£18.37"},
      ].map((l,i)=>(
        <div key={i} style={{display:"grid", gridTemplateColumns:"1fr auto auto", gap:6, padding:"4px 0", borderBottom:"1px solid rgba(31,42,60,0.2)", fontWeight:700, letterSpacing:"0.04em"}}>
          <span>{l.n}</span><span style={{color:"var(--ab-slate)"}}>{l.q}</span><span style={{color:"var(--ab-ink-blue)"}}>{l.w}</span>
        </div>
      ))}
    </div>
    <div style={{fontSize:13, lineHeight:1.4, fontStyle:"italic", marginTop:6}}>Britannica is running low — three months to restock.</div>
  </>
);

const CorkMobile = ({ s }) => (
  <div style={{position:"absolute", inset:0, background: s===5?"#F6F3EB":"var(--ab-bone)", display:"flex", flexDirection:"column"}}>
    <SiteSkeleton compact/>
    {/* Inline aside — sits between nav and hero on mobile */}
    <div style={{
      padding:"10px 14px", borderTop:`1px solid ${s===5?"var(--ab-ink-blue)":"var(--ab-black)"}`, borderBottom:`1px solid ${s===5?"var(--ab-ink-blue)":"var(--ab-black)"}`,
      background: s===5 ? "#F6F3EB" : "var(--ab-bone)",
      color: s===5 ? "var(--ab-ink-blue)" : "var(--ab-black)",
      display:"flex", flexDirection:"column", gap:6,
      flex:1, overflow:"hidden",
    }}>
      <div style={{fontSize:8, letterSpacing:"0.3em", fontWeight:700, color: s===5 ? "var(--ab-ink-blue)" : "var(--ab-orange)"}}>{s===5?"— TRADE · J.":"— J."}</div>
      {s===5 ? <div style={{fontSize:11, fontFamily:"var(--font-italic)", fontStyle:"italic", lineHeight:1.4}}>Morning, buyer. Tap a product for stock &amp; wholesale. Britannica low.</div>
       : s<=1 ? <div className="caslon" style={{fontSize:14, fontStyle:"italic", lineHeight:1.4}}>Evening. I’ve marked a few of these. <span style={{color:"var(--ab-orange)"}}>Drinking or thinking?</span></div>
       : s===2 ? <div style={{fontSize:12, lineHeight:1.4}}><span className="caslon" style={{fontStyle:"italic"}}>Bitter, you said. </span><span style={{color:"var(--ab-orange)", fontWeight:700}}>DISPENSE</span> — 50ml, tonic, lemon peel.</div>
       : s===3 ? <><div className="caslon" style={{fontSize:13, fontStyle:"italic"}}>Three stickers below. Pick one.</div><div style={{fontSize:8, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-slate)"}}>Q 1 / 3</div></>
       : <ServeReceipt/>}
    </div>
  </div>
);

window.Corkscrew = Corkscrew;
