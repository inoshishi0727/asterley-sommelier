// c4-last-orders.jsx — Radical broadcast concept
// One sentence at a time. Full viewport. Replies replace, not accumulate.

const { useState: useS4 } = React;

const LastOrders = () => {
  const STATES = ["Resting","Opening","Reply exchanged","Profiler (one question visible)","Serve (single card)","Mobile"];
  const [s, setS] = useS4(0);
  return (
    <div>
      <div className="frames">
        <div className="frame"><div className="frame__cap"><span><span className="dot"/>DESKTOP · 1440</span><em>one sentence at a time</em></div>
          <div className="viewport-desk viewport-desk--tall"><LODesk s={s}/></div></div>
        <div className="frame"><div className="frame__cap"><span><span className="dot"/>MOBILE · 390</span><em>portrait broadcast</em></div>
          <div className="viewport-mob"><LOMobile s={s}/></div></div>
      </div>
      <StateStrip states={STATES} active={s} onChange={setS}/>
      <Analysis
        subversion="There is no chat log. There is no scroll. There is exactly one sentence on the viewport at any time — Jarvis's, or yours, fading cleanly to the next. It's the broadcast grammar of BBC Radio 4 idents, not the web. You can still review earlier lines, but you do it by pulling a ‘log’ tab — a conscious act, not the default. This alone strips 90% of what users expect from chat. It's also a gamble."
        surfaces={[
          { k: "First contact", v: "A single typed line replaces the hero. No panel, no launcher." },
          { k: "Profiler", v: "Three questions, one at a time, each a full-viewport moment. Like flashcards." },
          { k: "Free chat", v: "Native; every reply replaces." },
          { k: "Photo upload", v: "Upload, Jarvis narrates what he sees; the photo replaces the sentence, briefly." },
          { k: "Serve card", v: "One final card holds. The recipe is the last thing on screen. Screenshot-as-share is explicit." },
          { k: "Shop", v: "Hard fit. Product browse wants multiplicity; this concept punishes it. Jarvis picks one — shop stays off-surface." },
          { k: "Trade", v: "Trade inventory asks for tables; broadcast grammar resists. Flag." },
          { k: "Age gate", v: "Fits cleanly — single question, single answer." },
          { k: "Escalation", v: "A single line: ‘Pass to the team?’ Press to confirm." },
          { k: "Returning", v: "Opening sentence is personalised: ‘Back on the dry side?’" },
        ]}
        tradeoffs={[
          "Users who want to review a scroll will feel trapped. The ‘log’ tab helps but costs a discovery.",
          "Structurally hostile to shop browsing and trade tables — this concept doesn't want to list.",
          "A 6-week build is tight on the motion work; the grammar only reads if the transitions are impeccable.",
        ]}
        complexity={{ level: "Medium", note: "Simple surface, but every transition is load-bearing. The whole thing lives or dies in 200ms of easing." }}
        aging={{ level: "High", note: "Radical grammars date fastest. In 2028 this may read as a 2026 moment." }}
        ratings={[{k:"Subversion",v:5},{k:"On-brand",v:4},{k:"Functional completeness",v:2},{k:"Mobile integrity",v:4},{k:"Conversion pressure",v:2},{k:"Build realism",v:3},{k:"Shareable serve card",v:3}]}
      />
    </div>
  );
};

const LODesk = ({ s }) => (
  <div style={{position:"absolute", inset:0, background:"var(--ab-off-black)", color:"var(--ab-off-white)", display:"flex", flexDirection:"column", padding:"20px 32px"}}>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:12, borderBottom:"1px solid rgba(237,107,59,0.3)"}}>
      <div style={{display:"flex", alignItems:"center", gap:10}}>
        <img src={Mark.roundelWhite} alt="" style={{width:28}}/>
        <div style={{fontSize:10, letterSpacing:"0.28em", fontWeight:700}}>BROADCASTING · <span style={{color:"var(--ab-orange)"}}>LIVE</span></div>
      </div>
      <div style={{display:"flex", gap:22, fontSize:10, letterSpacing:"0.24em", fontWeight:700, color:"rgba(243,238,228,0.55)"}}>
        <span>↓ LOG</span><span>PASS →</span><span>✕</span>
      </div>
    </div>
    <div style={{flex:1, display:"grid", placeItems:"center", position:"relative", textAlign:"center"}}>
      {s===0 && <div>
        <div style={{fontSize:10, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>NOW ON AIR · 19:04 · DUSK</div>
        <div className="caslon" style={{fontSize:64, lineHeight:1.05, color:"rgba(243,238,228,0.92)", marginTop:14, maxWidth:820}}>Evening.</div>
        <div style={{fontSize:12, letterSpacing:"0.26em", fontWeight:700, color:"rgba(243,238,228,0.4)", marginTop:26}}>PRESS ANY KEY TO RESPOND</div>
      </div>}
      {s===1 && <div>
        <div style={{fontSize:10, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>J. — NOW SPEAKING</div>
        <div style={{fontSize:40, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.01em", lineHeight:1.1, marginTop:14, maxWidth:900}}>Drinking or thinking? <span className="caslon" style={{fontWeight:400, textTransform:"none", color:"var(--ab-orange)"}}>Either way, I can help.</span></div>
      </div>}
      {s===2 && <div>
        <div style={{fontSize:10, letterSpacing:"0.3em", fontWeight:700, color:"rgba(243,238,228,0.55)"}}>J. — IN REPLY</div>
        <div style={{fontSize:34, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.01em", lineHeight:1.15, marginTop:14, maxWidth:900}}>
          <span className="caslon" style={{fontWeight:400, textTransform:"none", color:"var(--ab-orange)"}}>DISPENSE.</span><br/>50ml, tonic, lemon peel.<br/>That’s the evening.
        </div>
        <div style={{marginTop:18, fontSize:11, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.35)"}}>← PREVIOUS · NEXT →</div>
      </div>}
      {s===3 && <div>
        <div style={{fontSize:10, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>QUESTION 01 OF 03</div>
        <div className="caslon" style={{fontSize:56, lineHeight:1.05, color:"rgba(243,238,228,0.92)", marginTop:14}}>Bitter or sweet?</div>
        <div style={{display:"flex", gap:14, justifyContent:"center", marginTop:26}}>
          {["Bitter","Middle","Sweeter"].map((o,i)=>(<button key={i} style={{background:i===0?"var(--ab-orange)":"transparent", color:i===0?"var(--ab-off-black)":"var(--ab-off-white)", border:"1px solid rgba(243,238,228,0.35)", padding:"12px 22px", fontSize:11, fontWeight:700, letterSpacing:"0.24em", textTransform:"uppercase", fontFamily:"inherit", cursor:"pointer"}}>{o}</button>))}
        </div>
      </div>}
      {s===4 && <div style={{background:"var(--ab-parchment)", color:"var(--ab-black)", padding:"24px 32px", border:"1px solid var(--ab-black)", maxWidth:560}}>
        <div style={{fontSize:10, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SIGN-OFF · SERVE № 047</div>
        <div style={{fontSize:38, fontWeight:700, textTransform:"uppercase", letterSpacing:"-0.005em", marginTop:6, lineHeight:0.95}}>DISPENSED &amp; <span className="caslon" style={{color:"var(--ab-orange)", textTransform:"none", fontWeight:400}}>Tonic.</span></div>
        <div style={{fontSize:14, lineHeight:1.5, marginTop:12, borderTop:"1px solid var(--ab-black)", paddingTop:10}}>50ml DISPENSE · 150ml tonic · lemon peel · cubed ice.</div>
        <div className="caslon" style={{fontSize:13, color:"var(--ab-slate)", marginTop:8}}>That’s last orders.</div>
      </div>}
      {s===5 && <div className="caslon" style={{fontStyle:"italic", color:"rgba(243,238,228,0.5)"}}>See mobile frame →</div>}
    </div>
    <div style={{paddingTop:10, borderTop:"1px solid rgba(243,238,228,0.15)", display:"flex", alignItems:"center", gap:14}}>
      <span style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.45)"}}>YOU ·</span>
      <span className="caret caslon" style={{fontSize:17, fontStyle:"italic", color:"rgba(243,238,228,0.75)"}}>speak plainly</span>
    </div>
  </div>
);

const LOMobile = ({ s }) => (
  <div style={{position:"absolute", inset:0, background:"var(--ab-off-black)", color:"var(--ab-off-white)", display:"flex", flexDirection:"column", padding:"12px 14px"}}>
    <div style={{fontSize:7, letterSpacing:"0.28em", fontWeight:700, color:"var(--ab-orange)"}}>● LIVE · 19:04</div>
    <div style={{flex:1, display:"grid", placeItems:"center", textAlign:"center"}}>
      {s<=1 && <div className="caslon" style={{fontSize:30, lineHeight:1.1}}>Drinking or thinking?</div>}
      {s===2 && <div style={{fontSize:22, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.01em", lineHeight:1.15}}>DISPENSE.<br/>50ml · tonic · peel.</div>}
      {s===3 && <div><div style={{fontSize:8, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>Q 01 / 03</div><div className="caslon" style={{fontSize:28, marginTop:6}}>Bitter or sweet?</div><div style={{display:"flex", flexDirection:"column", gap:6, marginTop:12}}>{["Bitter","Middle","Sweeter"].map((o,i)=>(<button key={i} style={{background:i===0?"var(--ab-orange)":"transparent", color:i===0?"var(--ab-off-black)":"var(--ab-off-white)", border:"1px solid rgba(243,238,228,0.35)", padding:"10px", fontSize:10, fontWeight:700, letterSpacing:"0.24em", fontFamily:"inherit", cursor:"pointer"}}>{o}</button>))}</div></div>}
      {s===4 && <div style={{background:"var(--ab-parchment)", color:"var(--ab-black)", padding:"14px 16px", border:"1px solid var(--ab-black)"}}>
        <div style={{fontSize:7, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SIGN-OFF · № 047</div>
        <div style={{fontSize:20, fontWeight:700, textTransform:"uppercase", marginTop:4, lineHeight:1}}>DISPENSED &amp; <span className="caslon" style={{color:"var(--ab-orange)", textTransform:"none", fontWeight:400}}>Tonic.</span></div>
        <div style={{fontSize:10, marginTop:8, borderTop:"1px solid var(--ab-black)", paddingTop:6, lineHeight:1.4}}>50ml · 150ml tonic · peel.</div>
      </div>}
      {s===5 && <div className="caslon" style={{fontSize:14, color:"rgba(243,238,228,0.7)", padding:"0 6px"}}>On mobile the grammar is unchanged. Tap left/right to travel the log; pull down for the broadcast index.</div>}
    </div>
    <div style={{borderTop:"1px solid rgba(243,238,228,0.15)", paddingTop:8, display:"flex", gap:8, alignItems:"center"}}>
      <span style={{fontSize:7, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.45)"}}>YOU ·</span>
      <span className="caret caslon" style={{fontSize:12, fontStyle:"italic", color:"rgba(243,238,228,0.7)"}}>speak plainly</span>
    </div>
  </div>
);

window.LastOrders = LastOrders;
