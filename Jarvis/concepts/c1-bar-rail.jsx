// c1-bar-rail.jsx — Concept 1: The Bar Rail (safe-but-elevated)
// The best version of an inline chat. No floating bubble, no paper plane,
// no three-dot "typing". An editorial strip along the foot of the page.

const { useState: useS1, useEffect: useE1, useRef: useR1 } = React;

const BarRail = () => {
  const STATES = [
    "Resting (first contact)",
    "Opening line",
    "Mid-conversation",
    "Palate profiler",
    "Serve card",
    "Mobile",
  ];
  const [state, setState] = useS1(0);

  return (
    <div>
      <div className="frames">
        {/* DESKTOP */}
        <div className="frame">
          <div className="frame__cap">
            <span><span className="dot"/>DESKTOP · 1440</span>
            <em>asterleybros.com / home</em>
          </div>
          <div className="viewport-desk viewport-desk--tall">
            <SiteSkeleton />
            <BarRailDesk state={state} />
          </div>
        </div>
        {/* MOBILE */}
        <div className="frame">
          <div className="frame__cap">
            <span><span className="dot"/>MOBILE · 390</span>
            <em>iPhone</em>
          </div>
          <div className="viewport-mob">
            <SiteSkeleton compact />
            <BarRailMobile state={state} />
          </div>
        </div>
      </div>

      <StateStrip states={STATES} active={state} onChange={setState}/>

      <Analysis
        subversion="It keeps the familiar footprint but strips every chatbot cliché. No circle in the corner, no paper-plane icon, no three-bouncing-dots. It uses a thin editorial rail pinned to the bottom of the viewport — closer to a masthead than a chat window. Messages render as typeset paragraphs with hairline-ruled attribution (‘J.’ and ‘You.’) not speech bubbles. A single orange rule animates during thought. The input has no border and no send button — you press return, like a letter."
        surfaces={[
          { k: "First contact", v: "Collapsed rail reads ‘Evening. Drinking or thinking?’ as a one-line masthead. Dismissable." },
          { k: "Profiler", v: "Inline prompt → typed reply. Looks like conversation, not a form." },
          { k: "Free chat", v: "Native to this surface; the design’s home state." },
          { k: "Photo upload", v: "Attach icon inline in the composer; uploaded thumbnail renders as attribution line." },
          { k: "Serve card", v: "Recipe appears as a bordered cream insert inside the scroll — screenshot-ready." },
          { k: "Shop", v: "Product cards render inline with price + add; taps use existing PDP." },
          { k: "Trade", v: "Same rail; header swaps to ‘Trade Desk’ in orange caps." },
          { k: "Age gate", v: "One full-width takeover on first load, outside this surface." },
          { k: "Escalation", v: "‘Pass to the team →’ link in the rail header; always visible." },
          { k: "Returning", v: "Opening line shifts: ‘Welcome back. Still leaning dry?’" },
        ]}
        tradeoffs={[
          "Familiar footprint risks pattern-matching to support chat despite the typography. Its quality depends on execution.",
          "The thin rail crowds mobile — one-hand thumb zone fights with product content.",
          "Low ‘surprise & delight’ ceiling. This is good, not memorable.",
        ]}
        complexity={{ level: "Low", note: "A fortnight of build. Fits comfortably inside phase 1; no novel interactions beyond what the Claude API ships." }}
        aging={{ level: "Low", note: "This is the restrained option. It won’t look foolish in 2028. It also won’t be remembered." }}
        ratings={[
          { k: "Subversion", v: 2 },
          { k: "On-brand", v: 4 },
          { k: "Functional completeness", v: 5 },
          { k: "Mobile integrity", v: 3 },
          { k: "Conversion pressure", v: 4 },
          { k: "Build realism", v: 5 },
          { k: "Shareable serve card", v: 3 },
        ]}
      />
    </div>
  );
};

/* ---- DESKTOP surface ---- */
const BarRailDesk = ({ state }) => {
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      background: "var(--ab-off-black)", color: "var(--ab-off-white)",
      borderTop: "1px solid var(--ab-orange)",
      padding: "14px 24px",
      minHeight: state === 0 ? 54 : state === 4 ? 260 : 170,
      maxHeight: "72%",
      transition: "min-height 420ms var(--ease)",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Rail masthead */}
      <div style={{display:"grid", gridTemplateColumns:"auto 1fr auto", alignItems:"center", gap:18, paddingBottom: 8, borderBottom: "1px solid rgba(243,238,228,0.12)"}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <img src={Mark.roundelOrange} alt="" style={{width:22}}/>
          <div style={{fontSize:11, letterSpacing:"0.22em", fontWeight:700}}>JARVIS <span style={{color:"rgba(243,238,228,0.4)"}}>·</span> <span className="caslon" style={{fontWeight:400, letterSpacing:0, color:"var(--ab-orange)"}}>the third brother</span></div>
        </div>
        <div style={{fontSize:10, letterSpacing:"0.28em", fontWeight:700, color:"rgba(243,238,228,0.55)", textAlign:"center"}}>ASTERLEY BROS · <span className="caslon" style={{letterSpacing:0, fontWeight:400}}>South London</span></div>
        <div style={{display:"flex", gap:18, fontSize:10, letterSpacing:"0.24em", fontWeight:700, color:"rgba(243,238,228,0.55)"}}>
          <span style={{cursor:"pointer"}}>PASS TO THE TEAM →</span>
          <span style={{cursor:"pointer"}}>✕</span>
        </div>
      </div>

      {/* Body */}
      {state === 0 && (
        <div style={{fontFamily:"var(--font-italic)", fontStyle:"italic", fontSize:17, color:"rgba(243,238,228,0.85)"}}>
          Evening. Drinking or thinking? Either way, I can help.
          <span style={{fontFamily:"var(--font-sans)", fontStyle:"normal", fontSize:10, letterSpacing:"0.24em", color:"rgba(243,238,228,0.4)", marginLeft:18, verticalAlign:"middle"}}>TAP TO BEGIN</span>
        </div>
      )}

      {state === 1 && (
        <MsgBlock lines={[
          { who: "J.", text: "Evening. Drinking or thinking? Either way, I can help." },
        ]} showComposer placeholder="Type a reply, or press return to take my lead."/>
      )}

      {state === 2 && (
        <MsgBlock lines={[
          { who: "J.", text: "Evening. Drinking or thinking?" },
          { who: "You.", text: "Drinking. Something bitter." },
          { who: "J.", text: "DISPENSE, then. Modern British Amaro — 24 botanicals, three months to make. Bitter, but not a lecture about it. Do you have tonic in the house?" },
          { who: "You.", text: "Yes. And a lemon." },
          { who: "J.", text: "Long glass, cubed ice, 50ml DISPENSE, top with tonic, twist of lemon skin — oils first, then drop it in. That’s your evening." },
        ]} showComposer/>
      )}

      {state === 3 && <ProfilerInline/> }

      {state === 4 && <ServeCardInline/> }

      {state === 5 && (
        <div style={{textAlign:"center", padding:"20px", fontFamily:"var(--font-italic)", fontStyle:"italic", color:"rgba(243,238,228,0.6)"}}>
          See mobile frame →
        </div>
      )}
    </div>
  );
};

/* ---- Messages (no bubbles — typographic attribution) ---- */
const MsgBlock = ({ lines, showComposer = false, placeholder = "Say something." }) => (
  <div style={{display:"flex", flexDirection:"column", gap:6, overflow:"hidden"}}>
    <div style={{overflowY:"auto", maxHeight: showComposer ? 170 : 220, paddingRight: 8, display:"flex", flexDirection:"column", gap:10}}>
      {lines.map((l, i) => (
        <div key={i} style={{
          display:"grid", gridTemplateColumns:"50px 1fr", gap:14, alignItems:"baseline",
          animation: "fadeUp 420ms var(--ease) both",
          animationDelay: `${i*80}ms`,
        }}>
          <div style={{
            fontSize:10, letterSpacing:"0.22em", fontWeight:700,
            color: l.who === "J." ? "var(--ab-orange)" : "rgba(243,238,228,0.5)",
            paddingTop: 4, borderTop: `1px solid ${l.who === "J." ? "var(--ab-orange)" : "rgba(243,238,228,0.25)"}`,
          }}>{l.who.toUpperCase()}</div>
          <div style={{
            fontSize:15, lineHeight:1.5, color:"rgba(243,238,228,0.92)",
            fontFamily: l.who === "J." ? "var(--font-sans)" : "var(--font-italic)",
            fontStyle: l.who === "J." ? "normal" : "italic",
          }}>{l.text}</div>
        </div>
      ))}
    </div>
    {showComposer && (
      <div style={{display:"grid", gridTemplateColumns:"50px 1fr auto", gap:14, alignItems:"center", paddingTop:10, borderTop:"1px solid rgba(243,238,228,0.12)"}}>
        <div style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.5)"}}>YOU.</div>
        <input placeholder={placeholder} style={{background:"transparent", border:0, outline:"none", color:"var(--ab-off-white)", fontFamily:"var(--font-italic)", fontStyle:"italic", fontSize:15, padding:"4px 0"}}/>
        <div style={{display:"flex", gap:14, fontSize:10, letterSpacing:"0.24em", fontWeight:700, color:"rgba(243,238,228,0.45)"}}>
          <span style={{cursor:"pointer"}}>📎 ATTACH</span>
          <span style={{cursor:"pointer", color:"var(--ab-orange)"}}>↵ RETURN</span>
        </div>
      </div>
    )}
  </div>
);

/* ---- Inline profiler on the rail ---- */
const ProfilerInline = () => (
  <div style={{display:"flex", flexDirection:"column", gap:10, overflow:"auto", paddingRight:8}}>
    <div style={{display:"grid", gridTemplateColumns:"50px 1fr", gap:14, alignItems:"baseline"}}>
      <div style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-orange)", paddingTop: 4, borderTop: `1px solid var(--ab-orange)`}}>J.</div>
      <div style={{fontSize:15, lineHeight:1.5, color:"rgba(243,238,228,0.92)"}}>
        Three questions and I’ll pick something for you. First — <span className="caslon" style={{color:"var(--ab-orange)", fontSize:17}}>bitter or sweet?</span>
      </div>
    </div>
    <div style={{display:"grid", gridTemplateColumns:"50px 1fr", gap:14, alignItems:"center", paddingLeft:0}}>
      <div/>
      <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
        {["Bitter — the drier the better", "Somewhere in the middle", "Sweeter side, please", "I don’t know yet"].map((o,i) => (
          <button key={i} style={{
            background:"transparent", border:"1px solid rgba(243,238,228,0.25)",
            color:"rgba(243,238,228,0.85)", padding:"8px 14px", fontFamily:"var(--font-italic)",
            fontStyle:"italic", fontSize:14, cursor:"pointer", borderRadius:0,
            ...(i === 0 ? {borderColor:"var(--ab-orange)", color:"var(--ab-orange)"} : {})
          }}>{o}</button>
        ))}
      </div>
    </div>
    <div style={{display:"grid", gridTemplateColumns:"50px 1fr", gap:14, alignItems:"center"}}>
      <div style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.5)", paddingTop: 4, borderTop: "1px solid rgba(243,238,228,0.25)"}}>YOU.</div>
      <div style={{fontSize:14, fontFamily:"var(--font-italic)", fontStyle:"italic", color:"var(--ab-orange)"}}>Bitter — the drier the better.</div>
    </div>
    <div style={{display:"flex", gap:10, fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.5)", marginTop: 4}}>
      <span>QUESTION 1 / 3</span>
      <span style={{flex:1, height:2, background:"rgba(243,238,228,0.15)", alignSelf:"center", position:"relative"}}>
        <span style={{position:"absolute", left:0, top:0, bottom:0, width:"33%", background:"var(--ab-orange)"}}/>
      </span>
    </div>
  </div>
);

/* ---- Serve card inline in the rail ---- */
const ServeCardInline = () => (
  <div style={{display:"flex", gap:20, overflow:"hidden"}}>
    <div style={{flex:"0 0 40%", display:"flex", flexDirection:"column", gap:8, paddingTop:6}}>
      <div style={{display:"grid", gridTemplateColumns:"50px 1fr", gap:14}}>
        <div style={{fontSize:10, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-orange)", borderTop:"1px solid var(--ab-orange)", paddingTop:4}}>J.</div>
        <div style={{fontSize:14, lineHeight:1.5, color:"rgba(243,238,228,0.92)"}}>
          Try this. A <span className="caslon" style={{color:"var(--ab-orange)"}}>Dispensed &amp; Tonic.</span> Screenshot if you want — it’ll remember.
        </div>
      </div>
    </div>
    {/* The card — cream, bordered, label-like */}
    <div style={{flex:1, background:"var(--ab-parchment)", color:"var(--ab-black)", border:"1px solid var(--ab-black)", padding:"14px 18px", position:"relative"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:"1px solid var(--ab-black)", paddingBottom:6, marginBottom:8}}>
        <div>
          <div style={{fontSize:9, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SERVE №  047</div>
          <div style={{fontSize:22, fontWeight:700, letterSpacing:"0.02em", textTransform:"uppercase", lineHeight:1, marginTop:4}}>DISPENSED &amp; TONIC</div>
          <div className="caslon" style={{fontSize:13, color:"var(--ab-slate)"}}>for the bitter-inclined</div>
        </div>
        <img src={Mark.roundelOrange} alt="" style={{width:38}}/>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, fontSize:12}}>
        <div>
          <div style={{fontSize:9, letterSpacing:"0.24em", fontWeight:700, marginBottom:4}}>POUR</div>
          <div style={{lineHeight:1.45}}>50ml DISPENSE<br/>150ml Indian tonic<br/>Lemon — skin only</div>
        </div>
        <div>
          <div style={{fontSize:9, letterSpacing:"0.24em", fontWeight:700, marginBottom:4}}>GLASS</div>
          <div style={{lineHeight:1.45}}>Highball, over cubed ice. Express oils, drop peel in.</div>
        </div>
      </div>
    </div>
  </div>
);

/* ---- MOBILE surface ---- */
const BarRailMobile = ({ state }) => (
  <div style={{
    position:"absolute", left:0, right:0, bottom:0,
    background:"var(--ab-off-black)", color:"var(--ab-off-white)",
    borderTop: "1px solid var(--ab-orange)",
    padding: "10px 14px 14px",
    maxHeight: "72%",
    display: "flex", flexDirection: "column", gap: 8,
  }}>
    {/* Drag handle + masthead */}
    <div style={{display:"flex", justifyContent:"center"}}>
      <span style={{width:36, height:3, background:"rgba(243,238,228,0.35)", borderRadius:2}}/>
    </div>
    <div style={{display:"grid", gridTemplateColumns:"auto 1fr auto", alignItems:"center", gap:8, paddingBottom:6, borderBottom:"1px solid rgba(243,238,228,0.12)"}}>
      <img src={Mark.roundelOrange} alt="" style={{width:18}}/>
      <div style={{fontSize:9, letterSpacing:"0.22em", fontWeight:700}}>JARVIS</div>
      <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, color:"rgba(243,238,228,0.5)"}}>PASS →</div>
    </div>

    {state <= 1 && (
      <div style={{fontFamily:"var(--font-italic)", fontStyle:"italic", fontSize:14, color:"rgba(243,238,228,0.9)", lineHeight:1.4, padding:"6px 0"}}>
        Evening. Drinking or thinking? Either way, I can help.
      </div>
    )}
    {state === 2 && (
      <div style={{display:"flex", flexDirection:"column", gap:10, overflow:"auto", maxHeight:200}}>
        {[
          { w:"J.", t:"Drinking or thinking?" },
          { w:"YOU.", t:"Something bitter." },
          { w:"J.", t:"DISPENSE. 50ml, tonic, lemon peel. Bitter but kind." },
        ].map((l,i) => (
          <div key={i} style={{borderTop:`1px solid ${l.w==="J."?"var(--ab-orange)":"rgba(243,238,228,0.2)"}`, paddingTop:6}}>
            <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, color: l.w==="J."?"var(--ab-orange)":"rgba(243,238,228,0.5)", marginBottom:2}}>{l.w}</div>
            <div style={{fontSize:13, lineHeight:1.4, fontFamily: l.w==="J."?"var(--font-sans)":"var(--font-italic)", fontStyle: l.w==="J."?"normal":"italic"}}>{l.t}</div>
          </div>
        ))}
      </div>
    )}
    {state === 3 && (
      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        <div style={{borderTop:"1px solid var(--ab-orange)", paddingTop:6}}>
          <div style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, color:"var(--ab-orange)"}}>J.</div>
          <div style={{fontSize:13, lineHeight:1.4}}>Bitter or sweet?</div>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:6}}>
          {["The drier the better","Middle","Sweeter side"].map((o,i)=>(
            <button key={i} style={{background:"transparent", border:`1px solid ${i===0?"var(--ab-orange)":"rgba(243,238,228,0.25)"}`, color:i===0?"var(--ab-orange)":"rgba(243,238,228,0.85)", padding:"8px 12px", fontFamily:"var(--font-italic)", fontStyle:"italic", fontSize:12, cursor:"pointer", borderRadius:0, textAlign:"left"}}>{o}</button>
          ))}
        </div>
        <div style={{fontSize:8, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.5)", marginTop:4}}>1 / 3</div>
      </div>
    )}
    {state === 4 && (
      <div style={{background:"var(--ab-parchment)", color:"var(--ab-black)", padding:10, border:"1px solid var(--ab-black)"}}>
        <div style={{fontSize:7, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SERVE №  047</div>
        <div style={{fontSize:14, fontWeight:700, letterSpacing:"0.02em", textTransform:"uppercase", marginTop:2}}>DISPENSED &amp; TONIC</div>
        <div style={{fontSize:10, lineHeight:1.4, marginTop:6, borderTop:"1px solid var(--ab-black)", paddingTop:6}}>50ml DISPENSE · 150ml tonic · lemon peel · cubed ice.</div>
      </div>
    )}
    {state === 5 && (
      <div style={{padding:"10px 0", fontSize:13, fontFamily:"var(--font-italic)", fontStyle:"italic", color:"rgba(243,238,228,0.7)", lineHeight:1.4}}>
        Drag the handle to expand. Tap ✕ to dismiss. The rail is <span style={{color:"var(--ab-orange)"}}>remembered</span> — it shrinks to a single line while you browse.
      </div>
    )}

    {state > 0 && state < 3 && (
      <div style={{borderTop:"1px solid rgba(243,238,228,0.12)", paddingTop:6, display:"flex", alignItems:"center", gap:8}}>
        <span style={{fontSize:8, letterSpacing:"0.24em", fontWeight:700, color:"rgba(243,238,228,0.5)"}}>YOU.</span>
        <span style={{flex:1, fontSize:12, fontFamily:"var(--font-italic)", fontStyle:"italic", color:"rgba(243,238,228,0.45)"}}>Say something, or press return.</span>
        <span style={{fontSize:8, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-orange)"}}>↵</span>
      </div>
    )}
  </div>
);

window.BarRail = BarRail;
