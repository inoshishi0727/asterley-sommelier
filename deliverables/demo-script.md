# Demo Video Script (~7 min)

## Setup
- `cd backend && npm run dev`
- Open `http://localhost:3000/widget/demo.html`
- Clear chat: `localStorage.removeItem('ab-session-id')` in console, refresh

---

## INTRO (30s)

"Hey — so I built an AI-powered shopping assistant for Asterley Bros. Think of it as a knowledgeable bartender that lives on the website 24/7. Customers can ask it what to buy, get cocktail recipes, check allergens, and add products straight to their cart — all through a chat bubble on the store."

---

## DEMO — SHOW THE STORE (15s)

*Open demo.html, scroll the product grid briefly*

"Here's what the store looks like with the sommelier embedded. You can see the gold chat bubble in the corner. Let's open it."

---

## DEMO — DISCOVERY (45s)

*Click bubble, show welcome message*

"It greets the customer and gives them a few starting points. Let's say I'm browsing and I'm curious..."

*Type:* **"What's the difference between your vermouths?"**

"It pulls up the actual products — real images, real prices, real ABV — and explains the difference conversationally. This isn't canned text, it's generating a fresh answer every time, but grounded in the real product data so it never makes things up."

---

## DEMO — COCKTAILS (45s)

*Type:* **"How do I make a Negroni?"**

"Now it gives me a recipe card — ingredients, steps, glassware. Notice the Asterley Bros products are highlighted. And there's an Add to Cart button right on the product card. That's the conversion piece — we're not just answering questions, we're shortening the path to purchase."

---

## DEMO — FOOD PAIRING (30s)

*Type:* **"What goes well with steak?"**

"This is a common real-world question. It recommends Estate — their sweet vermouth — because the herbal depth works with red meat. It's not guessing, we taught it pairing rules based on the actual flavour profiles."

---

## DEMO — DIETARY (30s)

*Type:* **"Anything gluten-free?"**

"It flags that Britannica contains gluten — that's their fernet, it uses spelt malt — and recommends the rest of the range. For a small brand with no customer service team, this kind of precision at 10 PM on a Saturday is huge."

---

## DEMO — BOUNDARIES (20s)

*Type:* **"Do you sell whisky?"**

"It doesn't pretend. Says honestly we don't carry that, and redirects to what we do have. No hallucination, no making things up."

---

## HOW IT WORKS (60s)

*Switch to a diagram or just explain verbally*

"Under the hood, three things are happening:"

"**One** — the AI has a personality. We gave it Asterley Bros' brand voice — warm, knowledgeable, never pushy. It talks like a bartender, not a robot."

"**Two** — it never guesses about products. When a customer asks a question, the AI calls a lookup tool that searches the real product catalogue. If a product doesn't exist, it says so. That's how we prevent it from making things up."

"**Three** — the product cards, recipe cards, and suggestion buttons you saw? Those come from real data, not from the AI writing HTML. The AI just writes the conversational part. Everything else is assembled from the actual catalogue."

---

## BUSINESS VALUE (30s)

"Cost-wise, each conversation is about half a penny. At 50 chats a day — which is realistic for a brand this size — that's about nine dollars a month. Compare that to a part-time hire or the sales you lose when nobody's there to answer questions at 9 PM."

---

## CLOSE (15s)

"So that's the Online Sommelier — always on, brand-accurate, drives people to cart. Happy to take any questions."
