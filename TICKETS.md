# Asterley Bros Sommelier — Issue Tracker (v4 Audit)

Format matches existing board. FIXED = addressed in this session.

---

## P0

- [ ] **Alcohol dependency — bot recommends products instead of refusing**
  When a customer says they drink to cope or describes dependency, Jarvis upsells instead of refusing. UK alcohol marketing codes (Portman Group/ASA) risk. Must refuse and signpost Drinkaware. *(FIXED — rule 13 added to brandVoice)*

---

## P1

- [ ] **Postcode wrong — SE23 shown instead of SE26** *(FIXED — widget updated)*

- [ ] **Bot identity — calls itself "Asterley Sommelier" not Jarvis** *(FIXED — system prompt + brandVoice updated)*

- [ ] **Product not found phrase — fires on generic questions with no product name** *(FIXED — prompt rule rewritten, hardcoded phrase removed)*

- [ ] **Markdown symbols — \*\*asterisks\*\* show as raw text in chat** *(FIXED — stripMarkdown() added to response pipeline)*

- [ ] **Opening greeting — wrong copy shown on first message** *(FIXED — widget updated to "Drinking or thinking? Either way, I can help.")*

- [ ] **Responses too long — verbose corporate language, "Certainly!", "Hello there!"** *(FIXED — hard 3-sentence limit added, forbidden openers listed)*

- [ ] **Voice input button — shows on Make a Drink but does nothing** *(FIXED — dimmed, labelled "voice — coming soon")*

- [ ] **Masterclass card — wrong image (bottle photo) and wrong price (£49.50 not £59.50)** *(FIXED — image + price updated from live Shopify page)*

- [ ] **Negroni Society card — wrong image** *(FIXED — image updated from live Shopify page)*

- [ ] **Email address wrong — hello@ used throughout instead of info@** *(FIXED — all files updated)*

- [ ] **Recipe names — bot denies Estate White Negroni exists despite it being in Recipes tab**
  Asking about a recipe cocktail by name triggers the product-not-found response. Bot needs to distinguish recipe queries from product queries and look up the recipe instead.

- [ ] **Product cards — no "View on Site" button, only Add to Cart** *(FIXED — "View →" link added)*

---

## P2

- [ ] **Recipes tab — Spring season shown indefinitely, no update mechanism**
  No way to change the seasonal label or recipes without a code deploy. Needs a content-editable field or at minimum a documented manual process.

- [ ] **Chat text hard to read on desktop — font too small**
  The chat panel font size is too small at desktop viewport sizes. Needs CSS review for screens above ~1200px.

- [ ] **Product links — open new tab, some users lose chat state**
  All product/recipe links use target="_blank". Chat is preserved on the original tab but some users find this disorienting. Decision needed on preferred behaviour.
