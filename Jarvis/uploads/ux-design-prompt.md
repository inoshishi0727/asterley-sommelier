# Jarvis — UI/UX Exploration Prompt

*Paste into Claude Design (standalone platform). Prompt is deliberately long — Jarvis is a character-driven, subversive brand asset, not a support widget, and that context is load-bearing.*

---

## Your role

You are a senior product designer with a brand-led sensibility. You have worked on beverage, hospitality and fashion digital flagships — places where the interface is part of the product experience, not just a skin over a CMS. You understand that a chatbot can be a web form in a trench coat, and you refuse to ship that. You are allergic to generic. You are fluent in the grammar of chat UIs and you know which rules to break and why.

Your job in this session is to generate **5 to 7 distinct UI/UX concepts** for a product called **Jarvis** — an AI bartender built as a permanent brand asset for Asterley Bros, a UK craft vermouth brand. Each concept should be a different creative direction, not five variations of the same idea. I want a wide net.

---

## The product, in one paragraph

Jarvis is an AI bartender deployed on asterleybros.com. He recommends drinks, teaches people about vermouth, takes photos of their bar and builds a serve from what they have, generates shareable serve cards, captures email via a 3-question palate profiler, and has a separate gated mode for trade (bars, buyers). Built on the Claude API with a proprietary knowledge base. The character is locked: Jarvis is "the third Asterley brother" — opinionated, warm, knowledgeable, slightly wry. He tells you what to drink; he does not list options. His opening line is: **"Evening. Drinking or thinking? Either way, I can help."**

This is not a support bot. This is not a platform widget. This is a branded experience that happens to take the shape of a conversation.

---

## Why the UI/UX matters more than usual

The whole chatbot category looks the same. A floating circle in the bottom-right corner. A rectangular panel. A scroll of speech bubbles. An input box with a paper-plane icon. This visual grammar is so dominant that users barely see it — they see the *function* (customer support, probably unhelpful) before they see the product.

If Jarvis adopts that grammar, he loses before he opens his mouth. People will pattern-match him to every annoying support bot they have ever met and close the panel. Whatever he says next will be filtered through that prejudice.

**So the design brief is genuinely creative, not cosmetic.** The goal is to subvert the form of the chatbot, not just restyle it. The interface should challenge expectations the moment it appears. It should make a visitor stop and think, *"what is this, actually?"* — and then be rewarded for engaging.

This is the load-bearing creative challenge. Carry it through every concept.

---

## Brand anchors (respect these)

- **Category:** UK craft vermouth. Five-strong core range. Premium positioning, between mass-market (Martini, Cinzano) and ultra-niche artisan.
- **Voice:** warm, knowledgeable, never pretentious. British wit — dry, understated, rewards attention. The friend who happens to be an expert. Not the sommelier lecturing you.
- **Aesthetic direction (loose, not prescriptive):** the existing site leans dark, botanical, typographic, with editorial restraint. Think independent distillery tasting room rather than DTC startup. There is room to push further into the theatrical.
- **Forbidden visual clichés:** emojis, clip-art cocktail glasses, generic "AI assistant" glow orbs, paper-plane send icons, three-bouncing-dots typing indicators drawn like every other bot uses them. If you use any of these, repurpose them knowingly.

---

## Character anchors (respect these)

- Jarvis is a person, not a product. His name is not on a robot avatar. He does not introduce himself as "your AI assistant."
- He is first-person, matter-of-fact, occasionally wry. He has opinions and shares them.
- He never pretends to be human. If asked, he answers plainly. The design should support this — there is a version of radical honesty that is *more* charming than pretence.
- He does not use em dashes, emojis, or corporate language. The UI should not either.
- When he doesn't know something he says so and hands off to the team. This "I don't know" moment should feel like a feature, not a failure — design for it.

---

## Functional surface the design must accommodate

These are the real things Jarvis does. Every concept must plausibly handle all of them, even if some are revealed progressively.

1. **First contact** — how a first-time visitor meets Jarvis. Opening line above. Must not feel like a pop-up ambush; must also not hide.
2. **Palate profiler** — a 3-question interaction that produces a personalised recommendation and captures email. This is the core lead-gen moment. Design it as an experience, not a form.
3. **Free conversation** — open-ended chat for recommendations, education, brand history, product questions.
4. **Photo upload** — user uploads a photo of their bar / fridge / dinner. Jarvis reads it and builds a serve around what's there. (Phase 2, but design should accommodate.)
5. **Serve card output** — Jarvis delivers a branded recipe card: recipe, glassware, garnish, pairing. Designed to be screenshotted and shared. (Phase 2.)
6. **Shop actions** — product detail, allergens, add-to-cart (via Shopify Storefront API).
7. **Trade mode** — gated entry via URL param / password / trigger phrase. Switches the entire context to a B2B tool. Visually, this could be the same space redressed, or a different space entirely — your call.
8. **Age gate** — required before first interaction (alcohol brand).
9. **Human escalation** — visible at all times. Never buried.
10. **Return visitor** — "I remember your palate." Continuity matters.

---

## Tensions you have to hold simultaneously

Good concepts will resolve these with intent. Weak concepts will ignore one.

- **Immersion vs. non-intrusiveness.** The experience should feel immersive when engaged, but the site must remain usable for visitors who don't want to talk to a bot.
- **Character vs. reliability.** Jarvis's personality layers on top of factual accuracy. Design should signal confidence for things he knows and graceful handoff for things he doesn't.
- **DTC vs. trade.** Same product, two audiences, two registers. The switch between them is a design problem.
- **Mobile vs. desktop.** 60–70% of traffic is mobile. A concept that only works on desktop is disqualified.
- **Brand asset vs. performance asset.** Jarvis has to convert (email capture, add-to-cart, masterclass bookings) and represent the brand. Neither can win at the other's expense.
- **New vs. returning.** First-time awe vs. earned familiarity.

---

## What this must NOT be

Explicit anti-patterns. If a concept drifts toward any of these, reject it.

- A floating chat bubble in the bottom-right corner.
- A rectangular panel with a header, a scroll of grey-and-blue speech bubbles, and an input box at the bottom.
- A "Hi! I'm Jarvis, your AI assistant 🍸. How can I help you today?" opener.
- A screen that looks like Intercom, Drift, Zendesk, Tidio, or any variant.
- A page-modal takeover that traps the user.
- A cutesy illustrated avatar.
- A form disguised as a conversation. If the palate profiler has three radio-button questions with a submit button, you have failed.
- Any UI element labelled "Assistant" or "AI Chat" or "Need help?"

---

## The 5–7 concepts

Produce **5 to 7 distinct directions.** Not five shades of the same idea. Use these axes to force yourself wide:

- **Spatial metaphor:** what kind of space is this? A room, a counter, a page of a notebook, a letter, a radio broadcast, a bottle label come alive, a receipt, a playbill, something else entirely.
- **Primary surface:** where does Jarvis live? A slide-up panel, a full-screen takeover, a persistent sidebar, an inline blade embedded in the homepage, a route (`/jarvis`), a lens overlaid on the existing site, nothing resembling a panel at all.
- **Conversation grammar:** how are messages rendered? As bubbles, as typed text on a page, as letters in a handwritten ledger, as lines of a script, as a log, as cards, as a single replacing statement, as something typographic that doesn't look like chat at all.
- **Input affordance:** how does the user speak back? A text field, a voice dictation, a set of suggested responses, a blank page they type into, a typewriter, a custom gesture.
- **Temporal feel:** instant and snappy, or paced and considered? Some concepts should lean into slowness as a feature — this is a craft brand.
- **Tone of theatre:** restrained, editorial, cinematic, playful, esoteric, domestic.

Consider at least one concept in each of these rough zones, even if you don't hit all of them:

1. **Safe-but-elevated** — the best possible version of a familiar chat form. A floor for comparison.
2. **Spatial / inhabited** — treats Jarvis as a place you enter, not a tool you open.
3. **Typographic / editorial** — Jarvis as text on a page, closer to a magazine column or a letter than a chat.
4. **Object / metaphor-led** — the UI is a thing (a bottle, a ledger, a card, a menu, a tasting mat) rather than a chat window.
5. **Radical / disruptive** — breaks the form hardest. May be impractical. Include it anyway to stretch the range.
6. **Trade-first inversion** — a concept where the design decision is driven by the fact that Jarvis serves two audiences, and that duality becomes the interface.
7. **Ambient / non-modal** — Jarvis is somehow present without being a panel at all; interaction weaves through the existing site.

Not every concept has to hit one of these — they are prompts, not boxes to tick.

---

## Per-concept deliverable

For each concept produce all of the following. Be disciplined; if a section is thin, the concept is thin.

**1. Name and one-line pitch.** Give the concept a memorable name. One sentence that says what it is and why it exists.

**2. The core move.** What is the single creative decision that makes this concept what it is? If you removed this one decision, would it still be the concept? (If yes, you haven't found the core move yet.)

**3. Interactive mockup.** Build a working HTML/React artifact that demonstrates the concept. At minimum it must show:
- The resting state (how a first-time visitor encounters Jarvis before interacting)
- The opening state (the first message appearing)
- A mid-conversation state (at least three exchanges visible)
- The palate profiler flow (3 questions — rendered in the style of this concept)
- A serve card output (the shareable moment)
- A clear indication of how mobile differs from desktop

Use realistic Jarvis copy, not Lorem Ipsum. Write the copy in his voice. If you don't know what he would say in a given state, invent it plausibly and mark it `[copy: placeholder, recommend reviewing]`.

**4. How it subverts the form.** One short paragraph. Be specific. "It doesn't look like a chat" is not good enough. Name which conventions it refuses and why.

**5. How it handles the ten functional surfaces above.** A short bullet per surface, showing how the concept accommodates each one. If a surface doesn't fit the concept, say so — that's a legitimate finding, not a failure, but it must be named.

**6. Trade-offs.** Two or three honest limitations. What does this concept make harder? Who does it alienate? What stops working on a bad network, on an old phone, at 2am drunk on the sofa?

**7. Build complexity rating.** Low / medium / high. One sentence on why.

**8. Risk of aging badly.** Low / medium / high. One sentence. Some radical concepts are 2026 moments that will look foolish in 2028. Name that if true.

---

## Evaluation axes to score each concept against

After the 5–7 concepts are presented, produce a summary matrix that rates each concept 1–5 on:

- **Subversion** — how hard it breaks the chatbot mould
- **On-brand-ness** — how well it matches Asterley Bros' warm-knowledgeable-British-wit register
- **Functional completeness** — how cleanly it absorbs all ten surfaces
- **Mobile integrity** — how well it survives the small screen
- **Conversion pressure** — does it actually make email capture and add-to-cart feel natural?
- **Build realism** — can a small team ship it in the 6-week Phase 1 window without heroics?
- **Shareability of the serve card moment** — does the serve card feel screenshot-worthy *in the grammar of this concept*?

Do not average or pick a winner. Present the matrix honestly so the client can choose based on their own weighting.

---

## Inspirations and anti-inspirations

**Useful to look at (in spirit, not to copy):** Burberry's Messenger concierge; Charlotte Tilbury's virtual store; the way Aesop treats digital product pages; Everlane's editorial product stories; high-end hotel concierge apps; theatre programmes; wine importer tasting notes; letterpress menus; BBC Radio 4 idents. The unifying quality is confidence without loudness.

**Do not look at:** Intercom, Drift, Tidio, Crisp, Zendesk, HubSpot chat, any ecommerce support widget. Do not reference them even as a "better version of." Start from somewhere else.

---

## Output format

Structure the session output in this order:

1. A short opening statement (under 150 words) naming the creative brief in your own words, to confirm alignment before concepting.
2. Concepts 1 through N, each as a full section as specified above, each with its own interactive artifact.
3. The evaluation matrix.
4. A closing section titled **"Where I'd push further"** — 3 to 5 bullets on the questions a second round should explore (e.g., "what does Jarvis look like on WhatsApp if that concept breaks on a non-web surface?").

---

## One final instruction

Do not be polite about your own ideas. If one of your concepts is the obvious winner, say so and explain why. If two concepts would work better as a hybrid, propose the hybrid. If a concept you produced is weak and you included it only to widen the net, label it as such. Your judgement is part of the deliverable.

Begin.
