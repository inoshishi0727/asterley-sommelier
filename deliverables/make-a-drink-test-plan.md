# Make a Drink — Test Plan

**Scope:** Widget restructure to 6 glasses × 3 moods × 18 specific recipes.
**Build:** master @ HEAD (deployed via Render)

---

## Setup

1. Open widget on staging (Shopify preview store or Render frontend URL)
2. Click chat bubble bottom-right
3. Click **"Make a Drink"** tab

---

## Page 1 — Glass Selection

- [ ] 6 glasses render in order: **Martini · Old Fashioned · Highball · Negroni · Fizz · Digestivo**
- [ ] Each glass card shows: icon, name, short note
- [ ] Tapping a glass advances to Page 2
- [ ] Voice dock visible at top
- [ ] Header line: *"Pull up a stool. I'm Jarvis. What shape of glass feels right tonight?"*

---

## Page 2 — Mood Selection

**Critical: only 3 moods show per glass. NO subheading under each mood label.**

| Glass | Expected moods (in order) |
|---|---|
| **Negroni** | Dark & Brooding · Strong & Bitter · Bright & Crisp |
| **Fizz** | Fizzy & Social · Warm & Spiced · Easy & Long |
| **Highball** | Bright & Crisp · Easy & Long · Strong & Bitter |
| **Old Fashioned** | Easy & Long · Strong & Bitter · Dark & Brooding |
| **Digestivo** | Dark & Brooding · Strong & Bitter · Warm & Spiced |
| **Martini** | Bright & Crisp · Easy & Long · Warm & Spiced |

- [ ] No subtitle/note text under any mood label (e.g. NOT "martini territory")
- [ ] Mood label only + arrow on right
- [ ] Back button returns to Page 1, clears selection
- [ ] Header line: *"{Glass}. An excellent instinct. Tell me your mood."*
- [ ] Stagger animation still applies

---

## Page 3 — Recipe Card

**18 mappings to verify — pick a glass + mood, confirm correct recipe loads.**

| # | Glass | Mood | Expected Recipe |
|---|---|---|---|
| 1 | Negroni | Dark & Brooding | Dispense Negroni Scuro |
| 2 | Negroni | Strong & Bitter | Britannica Negroni Amaro |
| 3 | Negroni | Bright & Crisp | Estate White Negroni |
| 4 | Fizz | Fizzy & Social | Cunard Passion Fruit Fizz |
| 5 | Fizz | Warm & Spiced | Estate Rhubarb Spritz |
| 6 | Fizz | Easy & Long | Asterley Spritz |
| 7 | Highball | Bright & Crisp | Cunard Elderflower Spritz |
| 8 | Highball | Easy & Long | Estate Strawberry Cobbler |
| 9 | Highball | Strong & Bitter | Britannica Fernet & Ginger |
| 10 | Old Fashioned | Easy & Long | South London Amaro Sour |
| 11 | Old Fashioned | Strong & Bitter | Dispense Boulevardier |
| 12 | Old Fashioned | Dark & Brooding | Estate Old Fashioned |
| 13 | Digestivo | Dark & Brooding | Britannica Toronto |
| 14 | Digestivo | Strong & Bitter | Dispense Nightcap |
| 15 | Digestivo | Warm & Spiced | Dispense Boulevardier |
| 16 | Martini | Bright & Crisp | Cunard Martini |
| 17 | Martini | Easy & Long | Schofield's Gibson |
| 18 | Martini | Warm & Spiced | Estate Manhattan |

---

## Recipe Card — Per-Recipe Checks

For each recipe loaded:

- [ ] **Pour animation** plays (~2.4s) before card appears
- [ ] Eyebrow line: *"Serve №X · for the {mood}"*
- [ ] Recipe **name** correct
- [ ] **Spec rows** render (volume · dotted line · ingredient)
- [ ] **Method line** reads cleanly (e.g. *"Stir 30s. Rocks glass, garnish with orange twist."*)
- [ ] **"Get the bottle"** product card visible
  - Shows correct Asterley product (Estate / Dispense / Britannica / Cunard / Schofield's / Asterley Original)
  - Image loads
  - Price visible
  - **"Shop →"** link opens correct product page on asterleybros.com
- [ ] **"Ask Jarvis →"** button switches to chat tab and sends "Tell me more about the {recipe name}"
- [ ] **"↩ Again"** button resets back to Page 1

---

## Product Card Mapping

| Recipe | Bottle shown |
|---|---|
| Estate White Negroni | ESTATE. |
| Britannica Negroni Amaro | BRITANNICA. |
| Dispense Negroni Scuro | DISPENSE. |
| Cunard Passion Fruit Fizz | CUNARD. |
| Estate Rhubarb Spritz | ESTATE. |
| Asterley Spritz | ASTERLEY ORIGINAL. |
| Cunard Elderflower Spritz | CUNARD. |
| Estate Strawberry Cobbler | ESTATE. |
| Britannica Fernet & Ginger | BRITANNICA. |
| South London Amaro Sour | DISPENSE. |
| Dispense Boulevardier | DISPENSE. |
| Estate Old Fashioned | ESTATE. |
| Britannica Toronto | BRITANNICA. |
| Dispense Nightcap | DISPENSE. |
| Cunard Martini | CUNARD. |
| Schofield's Gibson | SCHOFIELD'S. |
| Estate Manhattan | ESTATE. |

---

## Regression Checks

- [ ] **Recipes tab** still loads cocktail menu accordion
- [ ] **Chat tab** still works (send message, receive Gemini reply)
- [ ] **Voice input** on Make a Drink still triggers (mic icon → listening state)
- [ ] Widget closes/opens cleanly via chat bubble
- [ ] No console errors in browser DevTools
- [ ] Mobile viewport: cards stack, buttons tappable, no overflow

---

## Browsers / Devices

- [ ] Chrome desktop
- [ ] Safari desktop
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Failure Signals

- Mood subtitle text visible → CSS `.ab-mood-note` not removed from render
- Wrong recipe loads → check `cocktailFor()` matrix in `widget/sommelier-widget.js`
- All 6 moods showing on Page 2 → `GLASS_MOODS` filter not applied
- Product card wrong bottle → check `products` array on cocktail entry
- 404 on Shop link → product URL typo, verify against asterleybros.com
