// c3-ledger.jsx — The Ledger (my pick)
// Jarvis as a hand-set letterpress column on a cream page.
// No bubbles. Hairline rules, Acumin + Caslon italic, red-pen annotations.

const { useState: useS3 } = React;

const Ledger = () => {
  const STATES = [
    "Resting · margin-only",
    "Opening ledger",
    "Mid-column",
    "Profiler (as admittance card)",
    "Serve card (printed)",
    "Mobile (single column)",
  ];
  const [s, setS] = useS3(0);

  return (
    <div>
      <div className="frames">
        <div className="frame">
          <div className="frame__cap">
            <span><span className="dot"/>DESKTOP · 1440</span>
            <em>ledger · bone paper, hairline rules</em>
          </div>
          <div className="viewport-desk viewport-desk--tall">
            <LedgerDesk s={s}/>
          </div>
        </div>
        <div className="frame">
          <div className="frame__cap">
            <span><span className="dot"/>MOBILE · 390</span>
            <em>single column, same grammar</em>
          </div>
          <div className="viewport-mob">
            <LedgerMobile s={s}/>
          </div>
        </div>
      </div>

      <StateStrip states={STATES} active={s} onChange={setS}/>

      <Analysis
        subversion="The chat frame is deleted. No panel, no bubbles, no composer affordance that reads as chat. The entire page becomes a single ledger column: Jarvis's words set upright in Acumin, the visitor's in Caslon italic, separated by hairline rules and small-caps attribution (‘J.’ · ‘You.’). A red pen annotates the margin with metadata and underlines the live serve. You type into the ledger itself — as if you're writing the next line. The three-dot typing indicator is replaced by a single orange ascender being drawn, left to right."
        surfaces={[
          { k: "First contact", v: "Ledger sits dormant as a thin cream margin on any page. An italic ‘J.’ breathes once to announce itself; ignore it and it stays." },
          { k: "Profiler", v: "Three questions render as an admittance card pasted into the ledger — signed and dated when complete. Email sits naturally on the signature line." },
          { k: "Free chat", v: "The home grammar. Every exchange is a new ruled row." },
          { k: "Photo upload", v: "Uploaded image pasted into the margin like a tipped-in plate; Jarvis captions it in italic." },
          { k: "Serve card", v: "Tears out of the ledger — perforation edge on the left, red serial number, ‘SCREENSHOT’ micro-note in the gutter. Built to be shared." },
          { k: "Shop", v: "Add-to-cart renders as an inline receipt line inside the ledger, then shrinks to a marginal tick." },
          { k: "Trade", v: "Same grammar; cream paper becomes ruled invoice paper; red pen becomes blue; Caslon italic stays. Same type family." },
          { k: "Age gate", v: "First mark on the ledger is a dated initial — as opinionated as the rest." },
          { k: "Escalation", v: "Margin note: ‘Pass to Rob or Jim →’ with a photograph and initials. Always visible." },
          { k: "Returning", v: "Ledger opens at your last entry. Previous serve number sits in the margin like a bookmark." },
        ]}
        tradeoffs={[
          "Relies on typography doing the heavy lifting. A weak CSS implementation reveals the metaphor and kills it.",
          "Typing ‘into the ledger’ risks confusion with form inputs. A single cursor-and-prompt animation solves it but must be designed with care.",
          "Less immediate visual theatre than a spatial concept. Its magic reveals itself slowly — not a demo-reel friendly move.",
        ]}
        complexity={{ level: "Medium", note: "Most of the build is a single well-considered typographic component and a ruled-grid system. No novel interactions; no 3D; no audio. Shippable in phase 1." }}
        aging={{ level: "Low", note: "Typography is the most durable design language we have. This will look as good in 2032 as it does now." }}
        ratings={[
          { k: "Subversion", v: 5 },
          { k: "On-brand", v: 5 },
          { k: "Functional completeness", v: 5 },
          { k: "Mobile integrity", v: 4 },
          { k: "Conversion pressure", v: 4 },
          { k: "Build realism", v: 4 },
          { k: "Shareable serve card", v: 5 },
        ]}
      />
    </div>
  );
};

/* ----------- DESKTOP ----------- */
const LedgerDesk = ({ s }) => (
  <div style={{
    position:"absolute", inset:0,
    background:"var(--ab-bone)", color:"var(--ab-black)",
    padding:"24px 28px 20px",
    fontFamily:"var(--font-sans)",
    display:"grid", gridTemplateColumns:"110px 1fr 110px", gap:20,
    overflow:"hidden",
  }}>
    {/* LEFT MARGIN — meta */}
    <div style={{borderRight:"1px solid var(--ab-black)", paddingRight:12, display:"flex", flexDirection:"column", gap:16}}>
      <div>
        <div style={{fontSize:9, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>LEDGER</div>
        <div style={{fontSize:14, fontWeight:700, letterSpacing:"0.04em", marginTop:2}}>№ 2117</div>
        <div className="caslon" style={{fontSize:13, color:"var(--ab-slate)"}}>Thursday, dusk</div>
      </div>
      <div>
        <div style={{fontSize:9, letterSpacing:"0.28em", fontWeight:700}}>KEPT BY</div>
        <div style={{fontSize:12, marginTop:3}}>J.</div>
        <div className="caslon" style={{fontSize:11, color:"var(--ab-slate)"}}>the third brother</div>
      </div>
      {s >= 2 && (
        <div style={{animation:"fadeIn 420ms var(--ease) both", animationDelay:"300ms"}}>
          <div style={{fontSize:9, letterSpacing:"0.28em", fontWeight:700}}>MARGINALIA</div>
          <div className="caslon" style={{fontSize:11, color:"var(--ab-slate)", lineHeight:1.4, marginTop:3}}>Bitter line opened at 19:04. Tonic in the house. No vermouth yet.</div>
        </div>
      )}
      <div style={{marginTop:"auto"}}>
        <div style={{fontSize:9, letterSpacing:"0.28em", fontWeight:700}}>PASS TO →</div>
        <div className="caslon" style={{fontSize:11, color:"var(--ab-slate)", marginTop:3}}>Rob or Jim</div>
        <div style={{width:40, height:40, border:"1px solid var(--ab-black)", marginTop:6, background:`linear-gradient(135deg, var(--ab-parchment), var(--ab-cream))`, position:"relative"}}>
          <span style={{position:"absolute", inset:0, display:"grid", placeItems:"center", fontSize:10, fontWeight:700, color:"var(--ab-slate)", letterSpacing:"0.1em"}}>R.J.</span>
        </div>
      </div>
    </div>

    {/* CENTER — the ledger column */}
    <div style={{position:"relative", display:"flex", flexDirection:"column", gap:14, paddingTop:4, overflow:"hidden"}}>
      {/* Masthead of the page */}
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"baseline", paddingBottom:10, borderBottom:"2px solid var(--ab-black)"}}>
        <div style={{fontSize:10, letterSpacing:"0.28em", fontWeight:700}}>ASTERLEY BROS · LONDON</div>
        <div className="caslon" style={{fontSize:22, color:"var(--ab-black)", textAlign:"center"}}>Jarvis</div>
        <div style={{fontSize:10, letterSpacing:"0.28em", fontWeight:700, textAlign:"right"}}>EST. 2017 · SE26</div>
      </div>

      {s === 0 && <LedgerResting/>}
      {s === 1 && <LedgerOpening/>}
      {s === 2 && <LedgerMid/>}
      {s === 3 && <LedgerProfiler/>}
      {s === 4 && <LedgerServe/>}
      {s === 5 && (
        <div style={{padding:"40px 20px", textAlign:"center", fontFamily:"var(--font-italic)", fontStyle:"italic", color:"var(--ab-slate)"}}>
          See mobile frame →
        </div>
      )}

      {/* Bottom hairline */}
      <div style={{position:"absolute", left:0, right:0, bottom:0, height:1, background:"var(--ab-black)"}}/>
    </div>

    {/* RIGHT MARGIN — actions */}
    <div style={{borderLeft:"1px solid var(--ab-black)", paddingLeft:12, display:"flex", flexDirection:"column", gap:14, fontSize:11}}>
      <div>
        <div style={{fontSize:9, letterSpacing:"0.28em", fontWeight:700}}>ACTIONS</div>
      </div>
      {["ATTACH PHOTO","BROWSE RANGE","BOOK MASTERCLASS","TRADE ENTRY"].map(a => (
        <div key={a} style={{
          fontSize:10, letterSpacing:"0.22em", fontWeight:700,
          paddingBottom:8, borderBottom:"1px solid var(--ab-rule-soft)",
          cursor:"pointer",
        }}>{a} →</div>
      ))}
      {s === 4 && (
        <div style={{marginTop:"auto", fontSize:9, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-orange)"}}>
          TEAR OUT →<br/>
          <span className="caslon" style={{letterSpacing:0, textTransform:"none", fontSize:11, color:"var(--ab-slate)"}}>perforated edge</span>
        </div>
      )}
    </div>
  </div>
);

/* ----- Ledger row primitive ----- */
const LedgerRow = ({ who, children, delay = 0, annotation }) => (
  <div style={{
    display:"grid", gridTemplateColumns:"40px 1fr",
    gap:14, alignItems:"baseline", paddingBottom:10,
    borderBottom: "1px solid var(--ab-rule-soft)",
    animation:"fadeUp 420ms var(--ease) both",
    animationDelay: `${delay}ms`,
    position:"relative",
  }}>
    <div style={{
      fontSize:10, letterSpacing:"0.22em", fontWeight:700,
      color: who==="J." ? "var(--ab-orange)" : "var(--ab-slate)",
    }}>{who}</div>
    <div style={{
      fontFamily: who==="J." ? "var(--font-sans)" : "var(--font-italic)",
      fontStyle: who==="J." ? "normal" : "italic",
      fontSize: who==="J." ? 17 : 18,
      lineHeight:1.45, color:"var(--ab-black)",
    }}>{children}</div>
    {annotation && (
      <div style={{position:"absolute", right:-6, top:0, transform:"translateX(100%)", width:100, fontFamily:"var(--font-italic)", fontStyle:"italic", fontSize:10, color:"var(--ab-orange)", textAlign:"left", paddingLeft:8}}>
        {annotation}
      </div>
    )}
  </div>
);

const LedgerResting = () => (
  <div style={{paddingTop:40, display:"flex", flexDirection:"column", gap:14, alignItems:"flex-start"}}>
    <div style={{fontSize:11, letterSpacing:"0.28em", fontWeight:700, color:"var(--ab-orange)"}}>ENTRY № 001</div>
    <div className="caslon" style={{fontSize:32, lineHeight:1.2, color:"var(--ab-black)", maxWidth:520}}>
      Drinking or thinking?
    </div>
    <div style={{fontSize:14, fontFamily:"var(--font-sans)", color:"var(--ab-slate)", display:"flex", gap:8, alignItems:"center"}}>
      <span style={{width:8, height:2, background:"var(--ab-orange)"}}/> Click anywhere on the page to begin writing.
    </div>
  </div>
);

const LedgerOpening = () => (
  <div style={{display:"flex", flexDirection:"column", gap:10, paddingTop:6}}>
    <LedgerRow who="J." delay={0}>
      Evening. <span className="caslon" style={{color:"var(--ab-orange)"}}>Drinking or thinking?</span> Either way, I can help.
    </LedgerRow>
    <div style={{display:"grid", gridTemplateColumns:"40px 1fr", gap:14, paddingTop:4}}>
      <div style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-slate)"}}>YOU.</div>
      <div style={{fontSize:18, fontFamily:"var(--font-italic)", fontStyle:"italic", color:"var(--ab-slate)", position:"relative"}}>
        <span className="caret" style={{color:"var(--ab-orange)"}}>Write here</span>
        <div style={{position:"absolute", left:0, right:0, bottom:-4, height:1, background:"var(--ab-black)"}}/>
      </div>
    </div>
  </div>
);

const LedgerMid = () => (
  <div style={{display:"flex", flexDirection:"column", gap:10, paddingTop:6}}>
    <LedgerRow who="J." delay={0}>Evening. Drinking or thinking?</LedgerRow>
    <LedgerRow who="YOU." delay={80}>Drinking. Something bitter. It’s pouring outside and I’m alone.</LedgerRow>
    <LedgerRow who="J." delay={160} annotation="— £30.95 · 50cl">
      DISPENSE, then. Our Modern British Amaro — twenty-four botanicals, and the recipe I married into in 2009. Bitter but not a lecture. Do you have tonic?
    </LedgerRow>
    <LedgerRow who="YOU." delay={240}>Tonic and a lemon.</LedgerRow>
    <LedgerRow who="J." delay={320}>
      <b style={{fontWeight:700}}>Highball, cubed ice. 50ml DISPENSE, top with tonic, lemon skin.</b> Express the oils over the glass before you drop the peel in — that’s the difference between pleasant and dangerous.
    </LedgerRow>
    <div style={{display:"grid", gridTemplateColumns:"40px 1fr", gap:14, paddingTop:4}}>
      <div style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-slate)"}}>YOU.</div>
      <div style={{fontSize:18, fontFamily:"var(--font-italic)", fontStyle:"italic", color:"var(--ab-slate)", position:"relative"}}>
        <span className="caret">Will it keep?</span>
        <div style={{position:"absolute", left:0, right:0, bottom:-4, height:1, background:"var(--ab-black)"}}/>
      </div>
    </div>
  </div>
);

const LedgerProfiler = () => (
  <div style={{display:"flex", flexDirection:"column", gap:12, paddingTop:6}}>
    <LedgerRow who="J." delay={0}>
      Three questions and I’ll pick for you. This isn’t a form — I’m writing them, not checking boxes.
    </LedgerRow>
    {/* Admittance card */}
    <div style={{
      background:"var(--ab-parchment)", border:"1px solid var(--ab-black)",
      padding:"16px 20px", marginLeft:40, marginTop:4,
      position:"relative",
    }}>
      {/* Stamp */}
      <div style={{position:"absolute", top:-10, right:-10, width:64, height:64, border:"2px solid var(--ab-orange)", borderRadius:"50%", display:"grid", placeItems:"center", background:"var(--ab-parchment)", transform:"rotate(-6deg)"}}>
        <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, color:"var(--ab-orange)", textAlign:"center", lineHeight:1.1}}>
          ADMIT<br/>ONE<br/>
          <span className="caslon" style={{letterSpacing:0, fontSize:9, color:"var(--ab-orange)"}}>palate</span>
        </div>
      </div>
      <div style={{fontSize:10, letterSpacing:"0.28em", fontWeight:700, color:"var(--ab-orange)"}}>ADMITTANCE · CARD № 047</div>
      <div className="caslon" style={{fontSize:22, color:"var(--ab-black)", marginTop:4}}>A palate, in three questions.</div>

      <div style={{marginTop:14, display:"flex", flexDirection:"column", gap:12}}>
        <div>
          <div style={{fontSize:11, letterSpacing:"0.18em", fontWeight:700}}>01 · BITTER OR SWEET?</div>
          <div style={{display:"flex", gap:6, marginTop:6, flexWrap:"wrap"}}>
            {[["Bitter","the drier, the better"],["Middle",""],["Sweeter",""]].map(([n,s],i)=>(
              <button key={i} style={{
                background: i===0?"var(--ab-black)":"transparent", color: i===0?"var(--ab-parchment)":"var(--ab-black)",
                border:"1px solid var(--ab-black)", padding:"8px 12px", fontFamily:"inherit",
                fontSize:12, fontWeight:700, letterSpacing:"0.1em", cursor:"pointer", borderRadius:0,
                display:"flex", flexDirection:"column", alignItems:"flex-start", gap:2,
              }}>
                <span style={{textTransform:"uppercase"}}>{n}</span>
                {s && <span className="caslon" style={{fontWeight:400, fontSize:10, letterSpacing:0, color:i===0?"rgba(243,238,228,0.7)":"var(--ab-slate)"}}>{s}</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{opacity:0.45}}>
          <div style={{fontSize:11, letterSpacing:"0.18em", fontWeight:700}}>02 · WHEN WILL YOU DRINK IT?</div>
          <div className="caslon" style={{fontSize:13, color:"var(--ab-slate)", marginTop:2}}>(answer 1 to reveal)</div>
        </div>
        <div style={{opacity:0.25}}>
          <div style={{fontSize:11, letterSpacing:"0.18em", fontWeight:700}}>03 · WHAT’S ALREADY IN THE HOUSE?</div>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:12, alignItems:"end", marginTop:16, paddingTop:12, borderTop:"1px solid var(--ab-black)"}}>
        <div>
          <div style={{fontSize:9, letterSpacing:"0.22em", fontWeight:700}}>SIGN (EMAIL)</div>
          <div className="caslon" style={{fontSize:15, color:"var(--ab-slate)", marginTop:3, borderBottom:"1px solid var(--ab-black)", paddingBottom:2, minHeight:20}}>
            &nbsp;your name goes here
          </div>
        </div>
        <div style={{fontSize:9, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-slate)"}}>1 / 3</div>
      </div>
    </div>
  </div>
);

const LedgerServe = () => (
  <div style={{display:"flex", flexDirection:"column", gap:12, paddingTop:6, position:"relative"}}>
    <LedgerRow who="J." delay={0}>
      Here. Tear this out.
    </LedgerRow>
    {/* Tear-out serve card */}
    <div style={{
      marginLeft:40, background:"var(--ab-off-white)", border:"1px solid var(--ab-black)",
      padding:"18px 22px", position:"relative", boxShadow:"var(--shadow-soft)",
    }}>
      {/* perforation edge */}
      <div style={{position:"absolute", left:-10, top:8, bottom:8, width:10, borderRight:"1px dashed var(--ab-black)", display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center"}}>
        {Array.from({length:14}).map((_,i)=>(<span key={i} style={{width:4, height:4, background:"var(--ab-bone)", border:"1px solid var(--ab-black)", borderRadius:"50%"}}/>))}
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"flex-start", paddingBottom:10, borderBottom:"2px solid var(--ab-black)"}}>
        <div>
          <div style={{fontSize:10, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SERVE №  047 · SCREENSHOT ME</div>
          <div className="caslon" style={{fontSize:16, color:"var(--ab-slate)", marginTop:2}}>for the bitter-inclined, Thursday dusk</div>
          <div style={{fontSize:38, fontWeight:700, letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:0.95, marginTop:8}}>DISPENSED &amp; <span className="caslon" style={{color:"var(--ab-orange)", fontWeight:400, textTransform:"none"}}>Tonic.</span></div>
        </div>
        <img src={Mark.roundelOrange} alt="" style={{width:56}}/>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, marginTop:14, fontSize:13, lineHeight:1.5}}>
        <div>
          <div style={{fontSize:10, letterSpacing:"0.24em", fontWeight:700, marginBottom:6}}>POUR</div>
          <div>50ml DISPENSE<br/>150ml Indian tonic<br/>Lemon — skin only</div>
        </div>
        <div>
          <div style={{fontSize:10, letterSpacing:"0.24em", fontWeight:700, marginBottom:6}}>METHOD</div>
          <div>Highball, cubed ice. Build. Express lemon oils over the glass; drop peel in.</div>
        </div>
        <div>
          <div style={{fontSize:10, letterSpacing:"0.24em", fontWeight:700, marginBottom:6}}>PAIRING</div>
          <div className="caslon" style={{fontStyle:"italic", color:"var(--ab-slate)", fontSize:14}}>A thunderstorm. Salted almonds. Nothing sweet.</div>
        </div>
      </div>

      <div style={{display:"flex", gap:12, marginTop:16, paddingTop:10, borderTop:"1px solid var(--ab-rule-soft)", alignItems:"center"}}>
        <span style={{fontSize:11, letterSpacing:"0.2em", fontWeight:700}}>£30.95 · 50cl</span>
        <span style={{flex:1}}/>
        <span style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-orange)"}}>ADD BOTTLE TO BASKET →</span>
        <span style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-slate)"}}>SHARE →</span>
      </div>
    </div>
  </div>
);

/* ----------- MOBILE ----------- */
const LedgerMobile = ({ s }) => (
  <div style={{position:"absolute", inset:0, background:"var(--ab-bone)", color:"var(--ab-black)", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10, overflow:"hidden"}}>
    {/* Masthead */}
    <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"baseline", paddingBottom:8, borderBottom:"2px solid var(--ab-black)"}}>
      <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700}}>ASTERLEY BROS</div>
      <div className="caslon" style={{fontSize:15, textAlign:"center"}}>Jarvis</div>
      <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, textAlign:"right", color:"var(--ab-orange)"}}>№ 2117</div>
    </div>

    {s === 0 && (
      <div style={{paddingTop:18, display:"flex", flexDirection:"column", gap:10}}>
        <div style={{fontSize:9, letterSpacing:"0.24em", fontWeight:700, color:"var(--ab-orange)"}}>ENTRY № 001</div>
        <div className="caslon" style={{fontSize:26, lineHeight:1.1}}>Drinking or thinking?</div>
        <div style={{fontSize:12, color:"var(--ab-slate)"}}>Tap to begin.</div>
      </div>
    )}
    {(s === 1 || s === 2) && (
      <div style={{display:"flex", flexDirection:"column", gap:8, overflow:"auto"}}>
        {[
          { w:"J.", t: <>Evening. <span className="caslon" style={{color:"var(--ab-orange)"}}>Drinking or thinking?</span></> },
          ...(s === 2 ? [
            { w:"YOU.", t:<i>Something bitter.</i> },
            { w:"J.", t:<>DISPENSE. 50ml, tonic, lemon peel. Bitter but kind.</> },
            { w:"YOU.", t:<i>Done.</i> },
          ] : []),
        ].map((l,i) => (
          <div key={i} style={{paddingBottom:6, borderBottom:"1px solid var(--ab-rule-soft)"}}>
            <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, color: l.w==="J."?"var(--ab-orange)":"var(--ab-slate)"}}>{l.w}</div>
            <div style={{fontSize:14, lineHeight:1.45, fontFamily: l.w==="J."?"var(--font-sans)":"var(--font-italic)", fontStyle: l.w==="J."?"normal":"italic", marginTop:2}}>{l.t}</div>
          </div>
        ))}
        <div style={{paddingTop:6}}>
          <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, color:"var(--ab-slate)"}}>YOU.</div>
          <div style={{fontSize:14, fontFamily:"var(--font-italic)", fontStyle:"italic", color:"var(--ab-slate)", borderBottom:"1px solid var(--ab-black)", paddingBottom:2}}>
            <span className="caret" style={{color:"var(--ab-orange)"}}>Write here</span>
          </div>
        </div>
      </div>
    )}
    {s === 3 && (
      <div style={{background:"var(--ab-parchment)", border:"1px solid var(--ab-black)", padding:"10px 12px", marginTop:4, position:"relative"}}>
        <div style={{position:"absolute", top:-8, right:-8, width:44, height:44, border:"2px solid var(--ab-orange)", borderRadius:"50%", display:"grid", placeItems:"center", background:"var(--ab-parchment)", transform:"rotate(-8deg)", fontSize:7, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-orange)", textAlign:"center", lineHeight:1.1}}>ADMIT<br/>ONE</div>
        <div style={{fontSize:8, letterSpacing:"0.28em", fontWeight:700, color:"var(--ab-orange)"}}>CARD № 047</div>
        <div className="caslon" style={{fontSize:16, marginTop:2}}>A palate, in three.</div>
        <div style={{marginTop:10, display:"flex", flexDirection:"column", gap:10}}>
          <div>
            <div style={{fontSize:9, letterSpacing:"0.18em", fontWeight:700}}>01 · BITTER OR SWEET?</div>
            <div style={{display:"flex", gap:6, marginTop:6, flexWrap:"wrap"}}>
              {["Bitter","Middle","Sweeter"].map((o,i)=>(
                <button key={i} style={{background: i===0?"var(--ab-black)":"transparent", color: i===0?"var(--ab-parchment)":"var(--ab-black)", border:"1px solid var(--ab-black)", padding:"6px 10px", fontSize:10, fontWeight:700, letterSpacing:"0.1em", cursor:"pointer", borderRadius:0}}>{o}</button>
              ))}
            </div>
          </div>
          <div style={{opacity:0.4}}>
            <div style={{fontSize:9, letterSpacing:"0.18em", fontWeight:700}}>02 · WHEN?</div>
          </div>
        </div>
        <div style={{marginTop:10, paddingTop:8, borderTop:"1px solid var(--ab-black)", display:"flex", justifyContent:"space-between", fontSize:8, letterSpacing:"0.22em", fontWeight:700}}>
          <span>SIGN (EMAIL) ___________</span>
          <span>1 / 3</span>
        </div>
      </div>
    )}
    {s === 4 && (
      <div style={{background:"var(--ab-off-white)", border:"1px solid var(--ab-black)", padding:"10px 12px", marginTop:4, boxShadow:"var(--shadow-soft)"}}>
        <div style={{fontSize:8, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SERVE № 047</div>
        <div style={{fontSize:22, fontWeight:700, letterSpacing:"-0.005em", textTransform:"uppercase", lineHeight:0.95, marginTop:4}}>DISPENSED &amp; <span className="caslon" style={{color:"var(--ab-orange)", fontWeight:400, textTransform:"none"}}>Tonic.</span></div>
        <div style={{marginTop:8, fontSize:11, lineHeight:1.4, borderTop:"1px solid var(--ab-black)", paddingTop:6}}>50ml DISPENSE · 150ml tonic · lemon peel · cubed ice.</div>
        <div className="caslon" style={{fontSize:12, color:"var(--ab-slate)", marginTop:6}}>for the bitter-inclined, Thursday dusk</div>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:8, borderTop:"1px solid var(--ab-rule-soft)", fontSize:9, letterSpacing:"0.2em", fontWeight:700}}>
          <span>£30.95</span><span style={{color:"var(--ab-orange)"}}>ADD →</span><span style={{color:"var(--ab-slate)"}}>SHARE →</span>
        </div>
      </div>
    )}
    {s === 5 && (
      <div style={{paddingTop:12}}>
        <div style={{fontSize:9, letterSpacing:"0.28em", fontWeight:700, color:"var(--ab-orange)"}}>ON MOBILE</div>
        <div className="caslon" style={{fontSize:18, marginTop:6, lineHeight:1.3}}>The ledger becomes a single column. Margin notes collapse into a small ‘J.’ mark you tap to expand.</div>
        <div style={{marginTop:14, fontSize:12, color:"var(--ab-slate)", lineHeight:1.5}}>The serve card remains one full viewport — screenshot is the share action. No modal traps; the back button returns you to the site underneath.</div>
      </div>
    )}
  </div>
);

window.Ledger = Ledger;
