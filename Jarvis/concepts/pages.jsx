// pages.jsx — opening statement + matrix
const OpeningPage = () => (
  <div className="page">
    <div className="eyebrow">Brief in my words · before concepting</div>
    <h1>A bot that refuses<br/>to look like <span className="caslon">a bot.</span></h1>
    <p className="lede">Asterley Bros is not a SaaS platform. The product is the bottle, the room, the pour. The chat surface — the thing where a decade of Intercom has taught people to expect disappointment — has to dissolve.</p>
    <hr className="hr hr--orange"/>
    <p><b style={{letterSpacing:"0.12em"}}>WHAT JARVIS IS.</b> A permanent brand asset. Opinionated, warm, knowledgeable, slightly wry. The third Asterley brother. He tells you what to drink. He does not list options.</p>
    <p><b style={{letterSpacing:"0.12em"}}>WHAT HE IS NOT.</b> A support widget. A floating circle. A glow orb. A paper-plane icon. Three bouncing dots. Anything labelled "Assistant".</p>
    <p><b style={{letterSpacing:"0.12em"}}>THE LOAD-BEARING CHALLENGE.</b> The visual grammar of chat is so cooked into the web that a visitor pattern-matches it before they read a word. Whatever Jarvis says next gets filtered through that prejudice. So I can't restyle the form. I have to break it — in five different directions — and let you weight them against each other.</p>
    <p><b style={{letterSpacing:"0.12em"}}>HOW I'VE SPENT THIS ROUND.</b> One safe-but-elevated concept as a floor. Three concepts that break the form in specifically different ways (spatial, editorial, radical). One ambient concept that folds the trade-mode duality into the interface itself. Each one ships with the six required states — resting, opening, mid-conversation, palate profiler, serve card, mobile — framed side by side.</p>

    <h2>A word on voice</h2>
    <p>The copy throughout is mine, written in the register I hear in your existing site: first-person plural, sentence case, specific numbers, no exclamations, no em dashes, no emoji. Where I've invented a Jarvis line without direction, I've left it unmarked because every line is plausible — but treat the opening-ledger, the refusal language, and the trade-mode greetings as a copy pass that wants your eye.</p>

    <h2>One honest caveat</h2>
    <p>The Phase 2 features — photo upload, add-to-cart against Shopify, trade gating — are accommodated structurally but mocked statically. I've been explicit about which surfaces a concept absorbs cleanly and which ones it fights. That's a deliverable, not an omission.</p>
  </div>
);

const MatrixPage = () => {
  const rows = [
    { name: "The Bar Rail", sub: "safe-but-elevated", v: [2,4,5,3,4,5,3] },
    { name: "Behind the Bar", sub: "spatial / inhabited", v: [4,5,4,3,4,3,4] },
    { name: "The Ledger", sub: "editorial / object", v: [5,5,5,4,4,4,5] },
    { name: "Last Orders", sub: "radical broadcast", v: [5,4,2,4,2,3,3] },
    { name: "Corkscrew", sub: "ambient + trade", v: [5,4,3,2,3,2,3] },
  ];
  const axes = ["Subversion","On-brand","Functional","Mobile","Conversion","Build realism","Serve card"];
  return (
    <div className="page">
      <div className="eyebrow">Round 1 · Evaluation</div>
      <h1>The matrix.<br/><span className="caslon">My pick, my caveats.</span></h1>
      <p className="lede">Ratings are mine. They express how each concept performs on the axes in the brief — no average, no winner, no weighting. The weighting is yours.</p>

      <table className="matrix">
        <thead>
          <tr>
            <th>Concept</th>
            {axes.map(a => <th key={a} style={{textAlign:"center"}}>{a}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name}>
              <td className="name">{r.name}<em>{r.sub}</em></td>
              {r.v.map((n,i) => <td key={i} className="num" data-v={n}>{n}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>My read, unpolite as requested</h2>
      <p><b style={{letterSpacing:"0.12em", color:"var(--ab-orange)"}}>THE LEDGER IS THE ONE.</b> It is the only concept where the form itself is saying something on brand — that Asterley Bros is a maker, that craft is typographic, that the bottle labels are the product's face, and that the interface should extend that language rather than intrude on it. It also absorbs every functional surface (profiler, serve card, photo upload, shop actions, trade) without needing a second metaphor. Build complexity is medium, not high. This is the one I'd take to round 2.</p>

      <p><b style={{letterSpacing:"0.12em"}}>BEHIND THE BAR IS THE OTHER SERIOUS CONTENDER.</b> If the client leans theatrical — masterclass energy, not magazine energy — it wins. It's more viscerally memorable than Ledger. It also asks more of the build (time-of-day state, horizontal panning, audio if you go there) and alienates anyone who just wants the quick answer. Consider it if the deck-facing metric is "time spent" rather than "lead capture".</p>

      <p><b style={{letterSpacing:"0.12em"}}>LAST ORDERS IS A PROVOCATION, NOT A PRODUCT.</b> I included it to stretch the range. In a workshop it will start the most interesting conversation. In production it alienates the half of users who want a scroll-back. I wouldn't ship it. I would steal its opening transition for the Ledger.</p>

      <p><b style={{letterSpacing:"0.12em"}}>THE BAR RAIL IS THE SAFE OPTION AND THAT IS ITS PROBLEM.</b> Nothing in it is wrong. Nothing in it is memorable either. If you pick this, you've paid for a bottle of DISPENSE and been served a house tonic water. Avoid.</p>

      <p><b style={{letterSpacing:"0.12em"}}>CORKSCREW IS THE MOST INTERESTING IDEA AND THE HARDEST TO SHIP.</b> Annotating the existing site is brilliant in theory and fights every content update in practice. It also struggles on mobile, where margin notes have nowhere to go. The trade-mode inversion inside it is a gem I'd steal for Ledger. See below.</p>

      <h2>The hybrid I'd propose</h2>
      <p><b>LEDGER + CORKSCREW's TRADE KEY.</b> Keep Ledger as the primary Jarvis surface. Borrow Corkscrew's single idea: trade mode reuses the exact same Ledger grammar in a different key — Caslon italics become invoice serifs, hairline rules become ruled invoice columns, the serve card becomes a sell-sheet. Same design, two audiences, zero extra build. I'd hand this to you in round 2.</p>

      <h2>Where I'd push further</h2>
      <ul className="next">
        <li><b>01 · The handoff moment</b>The "I don't know" beat is underdesigned in all five. Round 2 needs a specific, on-brand refusal language and a visible human-team object (a named person, photographed, not a generic form).</li>
        <li><b>02 · Returning-visitor memory</b>Every concept nods to continuity ("I remember your palate") but none renders the memory as an object. Round 2: design the artefact the returning visitor meets before Jarvis speaks.</li>
        <li><b>03 · WhatsApp / offline</b>If Jarvis is a brand asset, he shouldn't be web-only. What does Ledger look like as a WhatsApp thread? As a printed card tucked into an order? Round 2 should propose at least one off-web surface.</li>
        <li><b>04 · The serve card as a shareable artefact</b>Current serve cards screenshot well; none of them are engineered to share. Round 2 should test the card as a native OG image, an Instagram story template, and an emailable PDF — three forms of one artefact.</li>
        <li><b>05 · The voice floor</b>I've written Jarvis in a plausible voice but the brief only locks one line. Round 2 needs 30–50 sample exchanges signed off by Rob &amp; Jim. Without that, we're designing a mask.</li>
      </ul>
    </div>
  );
};

window.OpeningPage = OpeningPage;
window.MatrixPage = MatrixPage;
