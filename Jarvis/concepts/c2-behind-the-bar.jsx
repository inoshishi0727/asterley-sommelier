// c2-behind-the-bar.jsx — Spatial concept
// Jarvis is a room. Full-viewport takeover, dusk-lit. The site slides down into a thin strip you can recover.

const { useState: useS2 } = React;

const BehindTheBar = () => {
  const STATES = [
    "Resting (invitation)",
    "Stepping up",
    "In conversation",
    "Profiler (bar mat)",
    "Serve card (coaster)",
    "Mobile",
  ];
  const [s, setS] = useS2(0);

  return (
    <div>
      <div className="frames">
        <div className="frame">
          <div className="frame__cap"><span><span className="dot"/>DESKTOP · 1440</span><em>room · dusk</em></div>
          <div className="viewport-desk viewport-desk--tall"><BTBDesk s={s}/></div>
        </div>
        <div className="frame">
          <div className="frame__cap"><span><span className="dot"/>MOBILE · 390</span><em>portrait room</em></div>
          <div className="viewport-mob"><BTBMobile s={s}/></div>
        </div>
      </div>
      <StateStrip states={STATES} active={s} onChange={setS}/>
      <Analysis
        subversion="It refuses the panel entirely. Instead of opening a container over the site, engaging Jarvis pulls the viewport into a dark, low-lit room with a bar top across the bottom two-thirds. The site doesn't disappear — it becomes a thin lit strip at the very top that you can tap to recover. Conversation is a soft column of type on the back wall; Jarvis's words appear as if carved into matt-black paint, orange hairlines drawing under them as he thinks. No input box; you type directly onto the bar with a cursor that behaves like chalk on slate. Time-of-day actually governs the light."
        surfaces={[
          { k: "First contact", v: "A single line: ‘Pull up a stool. Evening.’ appears at the bottom of the homepage, orange rule above. Click or scroll, the room rises." },
          { k: "Profiler", v: "Three objects on the bar mat (a lemon peel, a sugar cube, an ice pick). You drag one toward you per question." },
          { k: "Free chat", v: "Native. The room is the chat." },
          { k: "Photo upload", v: "Slide a photo across the bar. Jarvis ‘picks it up’ with a small animation and names what he sees." },
          { k: "Serve card", v: "Rendered as a letterpress coaster with a ring-stain. Drag it off the bar to save." },
          { k: "Shop", v: "‘I’ll put one aside for you’ — the bottle appears on a back shelf with a chit. Click the chit, buy." },
          { k: "Trade", v: "Back-of-house version: the room is lit working-lights, not dusk. Stock lists on the wall." },
          { k: "Age gate", v: "You must accept to enter the room. Fits the metaphor." },
          { k: "Escalation", v: "A brass bell at the end of the bar. Ring it, hand off." },
          { k: "Returning", v: "Your stool has a coat on it and your previous drink is on the coaster." },
        ]}
        tradeoffs={[
          "Heavier to build: staged asset load, time-of-day state, optional ambient audio. Phase 1 is a stretch.",
          "Takeover-like in feel. Mobile users who wanted to look at a product page mid-session will resent it.",
          "The metaphor is load-bearing — if any element (light, type, pacing) is off, it tips into gimmick.",
        ]}
        complexity={{ level: "High", note: "Set design, lighting states, draggable objects, and careful motion. Needs a strong design-engineer on the build." }}
        aging={{ level: "Medium", note: "Atmospheric UIs do age. Restrained type and flat light help. Avoid any 3D." }}
        ratings={[{k:"Subversion",v:4},{k:"On-brand",v:5},{k:"Functional completeness",v:4},{k:"Mobile integrity",v:3},{k:"Conversion pressure",v:4},{k:"Build realism",v:3},{k:"Shareable serve card",v:4}]}
      />
    </div>
  );
};

const BTBDesk = ({ s }) => (
  <div style={{position:"absolute", inset:0, background:"#0a0a0a", color:"var(--ab-off-white)", overflow:"hidden", display:"flex", flexDirection:"column"}}>
    {/* Thin site strip */}
    <div style={{height:24, background:"var(--ab-bone)", color:"var(--ab-black)", display:"flex", alignItems:"center", padding:"0 16px", fontSize:9, letterSpacing:"0.22em", fontWeight:700, borderBottom:"1px solid var(--ab-orange)", justifyContent:"space-between"}}>
      <span>ASTERLEY BROS · LONDON</span>
      <span style={{color:"var(--ab-orange)"}}>↑ RETURN TO SITE</span>
    </div>
    {/* Room */}
    <div style={{flex:1, position:"relative", background:"radial-gradient(ellipse at 50% 40%, #1a1512 0%, #090706 60%, #050403 100%)"}}>
      {/* back wall with typography */}
      <div style={{position:"absolute", left:"6%", right:"6%", top:"6%", bottom:"44%", display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:10}}>
        <img src={Mark.roundelOrange} alt="" style={{width:44, opacity:0.6, position:"absolute", top:0, right:0}}/>
        <div style={{fontSize:9, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>★ THURSDAY · DUSK · 19:04</div>
        {s === 0 && <div className="caslon" style={{fontSize:36, lineHeight:1.15, color:"rgba(243,238,228,0.85)", maxWidth:"70%"}}>Pull up a stool.<br/>Evening.</div>}
        {s === 1 && <>
          <div style={{fontSize:22, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.02em", lineHeight:1.1, color:"rgba(243,238,228,0.92)"}}>EVENING. <span className="caslon" style={{textTransform:"none", fontWeight:400, color:"var(--ab-orange)"}}>Drinking or thinking?</span> Either way, I can help.</div>
        </>}
        {s === 2 && <div style={{display:"flex", flexDirection:"column", gap:8, maxHeight:"100%", overflow:"hidden"}}>
          {[
            {w:"J.", t:"Evening. Drinking or thinking?"},
            {w:"YOU.", t:"Drinking. Something bitter."},
            {w:"J.", t:"DISPENSE. Twenty-four botanicals, three months to make. Have you tonic?"},
            {w:"YOU.", t:"Yes. And a lemon."},
            {w:"J.", t:"Highball, ice, 50ml, top with tonic, lemon peel — oils first."},
          ].map((l,i)=>(
            <div key={i} style={{display:"grid", gridTemplateColumns:"40px 1fr", gap:12, fontSize:15, lineHeight:1.4, color:"rgba(243,238,228,0.9)"}}>
              <span style={{fontSize:9, letterSpacing:"0.22em", fontWeight:700, color: l.w==="J."?"var(--ab-orange)":"rgba(243,238,228,0.5)", paddingTop:2, borderTop:"1px solid rgba(243,238,228,0.2)"}}>{l.w}</span>
              <span style={{fontFamily: l.w==="J."?"var(--font-sans)":"var(--font-italic)", fontStyle: l.w==="J."?"normal":"italic"}}>{l.t}</span>
            </div>
          ))}
        </div>}
        {s === 3 && <div className="caslon" style={{fontSize:26, color:"rgba(243,238,228,0.85)", maxWidth:"70%", lineHeight:1.3}}>
          Pick one. I’m watching.<br/><span style={{color:"var(--ab-orange)"}}>Bitter, middle, or sweet.</span>
        </div>}
        {s === 4 && <div style={{fontSize:20, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.03em", color:"rgba(243,238,228,0.9)"}}>For you. <span className="caslon" style={{textTransform:"none", fontWeight:400, color:"var(--ab-orange)"}}>Take the coaster.</span></div>}
        {s === 5 && <div style={{fontFamily:"var(--font-italic)", fontStyle:"italic", color:"rgba(243,238,228,0.6)"}}>See mobile frame →</div>}
      </div>

      {/* Bar top */}
      <div style={{position:"absolute", left:0, right:0, bottom:0, height:"44%", background:"linear-gradient(180deg, #16100c 0%, #0a0705 100%)", borderTop:"1px solid rgba(237,107,59,0.35)"}}>
        {/* Lamp glow */}
        <div style={{position:"absolute", left:"50%", top:-40, transform:"translateX(-50%)", width:"55%", height:80, background:"radial-gradient(ellipse, rgba(237,107,59,0.22), transparent 70%)"}}/>

        {/* Bar-mat objects for profiler */}
        {s === 3 && (
          <div style={{position:"absolute", left:"50%", transform:"translateX(-50%)", top:"22%", display:"flex", gap:26, alignItems:"center"}}>
            <BarObj label="LEMON" caption="bitter & dry" active/>
            <BarObj label="CUBE" caption="somewhere in the middle"/>
            <BarObj label="CHERRY" caption="sweeter side"/>
          </div>
        )}

        {/* Coaster serve card */}
        {s === 4 && (
          <div style={{position:"absolute", left:"50%", top:"30%", transform:"translateX(-50%)", width:300, aspectRatio:"1/1", borderRadius:"50%", background:"var(--ab-parchment)", color:"var(--ab-black)", border:"2px solid var(--ab-black)", display:"grid", placeItems:"center", boxShadow:"0 20px 50px rgba(0,0,0,0.6)", textAlign:"center"}}>
            <div>
              <div style={{fontSize:9, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SERVE № 047</div>
              <div style={{fontSize:22, fontWeight:700, textTransform:"uppercase", letterSpacing:"-0.005em", marginTop:4, lineHeight:1}}>DISPENSED<br/>&amp; <span className="caslon" style={{color:"var(--ab-orange)", textTransform:"none", fontWeight:400}}>Tonic</span></div>
              <div style={{fontSize:11, marginTop:8, lineHeight:1.4, padding:"0 30px"}}>50ml · tonic · lemon peel · cubed ice</div>
              <div className="caslon" style={{fontSize:11, color:"var(--ab-slate)", marginTop:6}}>drag to save</div>
            </div>
          </div>
        )}

        {/* Cursor prompt */}
        {s !== 4 && s !== 3 && s !== 5 && (
          <div style={{position:"absolute", left:40, bottom:24, right:40, display:"flex", alignItems:"center", gap:12}}>
            <span style={{fontSize:10, letterSpacing:"0.24em", fontWeight:700, color:"var(--ab-orange)"}}>YOU ·</span>
            <span className="caret caslon" style={{fontSize:18, fontStyle:"italic", color:"rgba(243,238,228,0.75)"}}>Say something.</span>
          </div>
        )}
        {/* Bell */}
        <div style={{position:"absolute", right:22, bottom:18, display:"flex", alignItems:"center", gap:8, fontSize:9, letterSpacing:"0.24em", fontWeight:700, color:"rgba(243,238,228,0.55)"}}>
          <span style={{width:16, height:16, borderRadius:"50% 50% 20% 20%", background:"var(--ab-orange)", opacity:0.8}}/>
          RING FOR ROB
        </div>
      </div>
    </div>
  </div>
);

const BarObj = ({ label, caption, active }) => (
  <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer", opacity: active?1:0.7}}>
    <div style={{width:64, height:64, borderRadius:"50%", border:`1.5px solid ${active?"var(--ab-orange)":"rgba(243,238,228,0.35)"}`, background: active?"radial-gradient(circle, #ED6B3B 0%, #8a3a1a 90%)":"#1a1a18", display:"grid", placeItems:"center", fontSize:8, letterSpacing:"0.22em", fontWeight:700, color: active?"#0a0a0a":"rgba(243,238,228,0.5)"}}>{label}</div>
    <div className="caslon" style={{fontSize:12, fontStyle:"italic", color: active?"var(--ab-orange)":"rgba(243,238,228,0.55)"}}>{caption}</div>
  </div>
);

const BTBMobile = ({ s }) => (
  <div style={{position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 30%, #1a1512, #050403)", color:"var(--ab-off-white)", display:"flex", flexDirection:"column"}}>
    <div style={{height:20, background:"var(--ab-bone)", color:"var(--ab-black)", display:"flex", alignItems:"center", padding:"0 10px", fontSize:7, letterSpacing:"0.22em", fontWeight:700, justifyContent:"space-between", borderBottom:"1px solid var(--ab-orange)"}}>
      <span>ASTERLEY</span><span style={{color:"var(--ab-orange)"}}>↑ SITE</span>
    </div>
    <div style={{flex:1, padding:"14px 14px 100px", position:"relative", overflow:"hidden"}}>
      {s===0 && <div style={{paddingTop:40}}><div style={{fontSize:8, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>★ THURSDAY · DUSK</div><div className="caslon" style={{fontSize:24, marginTop:10, lineHeight:1.2}}>Pull up a stool.<br/>Evening.</div></div>}
      {s===1 && <div style={{paddingTop:20, fontSize:15, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.02em", lineHeight:1.2}}>EVENING. <span className="caslon" style={{textTransform:"none", fontWeight:400, color:"var(--ab-orange)"}}>Drinking or thinking?</span></div>}
      {s===2 && <div style={{display:"flex", flexDirection:"column", gap:8, paddingTop:10}}>
        {[{w:"J.", t:"Drinking or thinking?"},{w:"YOU.",t:"Something bitter."},{w:"J.",t:"DISPENSE. 50ml + tonic + lemon peel."}].map((l,i)=>(
          <div key={i}><div style={{fontSize:7, letterSpacing:"0.22em", fontWeight:700, color: l.w==="J."?"var(--ab-orange)":"rgba(243,238,228,0.5)"}}>{l.w}</div><div style={{fontSize:13, fontFamily: l.w==="J."?"var(--font-sans)":"var(--font-italic)", fontStyle: l.w==="J."?"normal":"italic", lineHeight:1.4}}>{l.t}</div></div>
        ))}
      </div>}
      {s===3 && <div style={{paddingTop:12, display:"flex", flexDirection:"column", gap:14}}><div className="caslon" style={{fontSize:17}}>Pick one.</div><div style={{display:"flex", gap:10}}><BarObj label="LEMON" caption="bitter" active/><BarObj label="CUBE" caption="middle"/><BarObj label="CHERRY" caption="sweet"/></div><div style={{fontSize:8, letterSpacing:"0.22em", fontWeight:700, color:"rgba(243,238,228,0.5)"}}>1 / 3</div></div>}
      {s===4 && <div style={{paddingTop:20, display:"grid", placeItems:"center"}}><div style={{width:180, height:180, borderRadius:"50%", background:"var(--ab-parchment)", color:"var(--ab-black)", border:"2px solid var(--ab-black)", display:"grid", placeItems:"center", textAlign:"center"}}><div><div style={{fontSize:7, letterSpacing:"0.3em", fontWeight:700, color:"var(--ab-orange)"}}>SERVE № 047</div><div style={{fontSize:15, fontWeight:700, textTransform:"uppercase", marginTop:4, lineHeight:1}}>DISPENSED<br/>&amp; <span className="caslon" style={{color:"var(--ab-orange)", textTransform:"none", fontWeight:400}}>Tonic</span></div></div></div></div>}
      {s===5 && <div className="caslon" style={{fontSize:15, color:"rgba(243,238,228,0.8)", paddingTop:16, lineHeight:1.4}}>The room stays upright on mobile. Bar top becomes a bottom sheet. You scroll up to the back wall; the site is a single tap at the top.</div>}
      <div style={{position:"absolute", left:14, right:14, bottom:14, paddingTop:10, borderTop:"1px solid rgba(237,107,59,0.35)", display:"flex", alignItems:"center", gap:10}}>
        <span style={{fontSize:8, letterSpacing:"0.22em", fontWeight:700, color:"var(--ab-orange)"}}>YOU ·</span>
        <span className="caret caslon" style={{fontSize:13, fontStyle:"italic", color:"rgba(243,238,228,0.7)"}}>Say something.</span>
      </div>
    </div>
  </div>
);

window.BehindTheBar = BehindTheBar;
