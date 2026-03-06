# Asterley Bros Online Sommelier — Assessment Write-Up

## 1. Understanding the SME Workflow

Asterley Bros is a 2–3 person craft spirits brand. Rob and Jim handle everything — production, fulfilment, wholesale, marketing, and customer engagement. Their DTC channel runs on Shopify, processing fewer than 100 orders per day, with no dedicated customer service team.

This creates a set of compounding pain points:

- **No evening or weekend coverage.** A customer browsing at 9 PM on a Friday — peak browsing time for spirits — has no one to ask "Which vermouth works for a Negroni?" The product pages describe what each bottle *is*, but can't guide someone toward what they actually *need*.
- **Repetitive questions eating into founder time.** A huge portion of inbound enquiries are variations on the same themes: "What's the difference between Estate and Schofield's?", "Is this gluten-free?", "How much is shipping?", "What cocktails can I make?" Every minute spent answering these is a minute not spent on production or brand development.
- **Static pages can't personalise.** A visitor coming from a Hawksmoor cocktail menu has completely different intent than someone shopping for a birthday gift. The current storefront treats them identically — no way to ask clarifying questions or steer someone through the catalogue based on taste, occasion, or dietary needs.
- **Missed upsell opportunities.** A customer adding a single bottle of Estate doesn't see that the Vermouth Bundle saves them money and qualifies for free shipping. Someone buying for a dinner party isn't shown the ready-to-drink Rhubarb Negroni. These are recommendations a good shop assistant would naturally make, but they need a conversational interface to land well.

What Asterley Bros needs is something closer to a knowledgeable bartender than a FAQ page — a system that can chat about flavour preferences, suggest recipes, handle logistics questions, and gently guide customers toward a larger basket, without Rob or Jim needing to be online.

---

## 2. AI Workflow Design

### Architecture Overview

I built the system around **Gemini 2.5 Flash** as the conversational engine, with a grounding layer that keeps every recommendation factually accurate and brand-safe. The architecture separates into three mechanisms.

> See `diagrams/system-architecture.svg` for the full diagram.

### Mechanism 1: System Instruction — Brand Voice

The System Instruction defines who the sommelier is before any conversation begins. It embeds the full brand voice — tone (knowledgeable but not pretentious, warm, conversational), behavioural rules (never mention competitors, always call tools before recommending, empathise with complaints and redirect to email), and safety guardrails (18+ reminders, no politics, responsible drinking).

This isn't a generic chatbot prompt. It encodes Asterley Bros' specific personality: the Sicilian-British heritage, the craft ethos, the venues that stock the products.

### Mechanism 2: Function Calling — Grounded Data

The model never relies on its own knowledge for product facts. Instead, it calls four tools I built:

| Tool | What it does | Example trigger |
|------|-------------|----------------|
| `product_lookup` | Search by name, category, taste preference, or ID. Returns price, ABV, allergens, tasting notes, Shopify variant ID. | "What's your driest vermouth?" |
| `recipe_lookup` | Find cocktail recipes by name, product, occasion, or difficulty. Returns full ingredients, method, glassware. | "How do I make a Negroni?" |
| `bundle_suggest` | Recommend bundles, subscriptions, or experiences based on cart, occasion, or budget. | "I'm looking for a gift." |
| `shipping_info` | Shipping rates, allergen/dietary info, returns policy, storage advice, age policy, contact details. | "Is Britannica gluten-free?" |

Each tool is a typed function declaration registered with the Gemini API. When the model needs factual data, it emits a function call; the backend executes it against the local product catalogue (JSON, no external API dependency) and returns the result. Gemini then writes a natural-language response based on that data. Up to 5 rounds of tool calls are supported per turn, so it can chain lookups (find a product → find recipes using it → suggest a bundle).

The key point: **the model cannot hallucinate product data.** If a product doesn't exist in the catalogue, the tool returns "no results" and the model says so honestly.

### Mechanism 3: Backend-Assembled Structured Output

Gemini only outputs conversational text. The structured parts of the response — product cards, recipe cards, suggestion chips — are assembled by the backend from the raw tool call results that flow through during the function calling loop. This avoids the fragility of asking an LLM to produce valid JSON, and means:

- Product cards contain only real data (price, ABV, variant ID) from the tool results
- Recipe cards come directly from the recipe catalogue
- Suggestion chips are context-aware (based on which tools were called)

The widget receives a clean response: text message + product cards + recipe cards + suggested actions.

### Inputs and Outputs

**Inputs** from the widget:
- **Customer message** — free-text query
- **Page context** — current URL, product being viewed, cart contents/total. Prepended as metadata so the model can tailor responses.
- **Session history** — stored in SQLite, passed as multi-turn context

**Outputs** rendered by the widget:
- **Text** — the sommelier's reply
- **Product cards** — up to 3, with real product images, price, ABV, and an "Add to Cart" button wired to Shopify's `/cart/add.js`
- **Recipe cards** — up to 2, with ingredients (Asterley Bros products highlighted), method, glassware, garnish
- **Suggestion chips** — 2–3 contextual follow-ups

### Session Management

Sessions persist across page navigations via a session ID in `localStorage`, backed by SQLite on the server. Sessions expire after 30 minutes of inactivity. The database uses WAL mode for concurrent reads and stores all messages for admin review.

---

## 3. Implementation Plan

### Week 1 — Foundation

- **Product data.** Build a comprehensive JSON catalogue from the Asterley Bros site: every product with price, ABV, volume, tasting notes, botanicals, allergens, dietary flags, serving suggestions, Shopify variant IDs. Create a matching recipes dataset.
- **Prompt engineering.** Draft the System Instruction with the brand voice guide. Define function declarations for all four tools with schemas and enum constraints. Iterate until the model consistently produces good tone and calls the right tools.
- **Chat API.** Stand up Node.js + Express + TypeScript backend with Gemini integration, tool execution loop, session management, and structured response assembly.
- **Testing.** Manually test 50+ scenarios: recommendations by taste, recipe requests, allergen queries, shipping questions, edge cases. Verify no hallucinated products or prices.

### Week 2 — Widget and Shopify

- **Chat widget.** Build the `<asterley-sommelier>` Web Component in vanilla JS (~15 KB, no framework dependency). Shadow DOM for CSS isolation, branded dark/gold theme, product cards with real images, recipe cards, suggestion chips, typing indicator.
- **Cart integration.** Wire "Add to Cart" buttons to Shopify's Ajax Cart API. Detect page context. Graceful fallback when not on Shopify.
- **Embed testing.** Test across Shopify themes. Verify Shadow DOM prevents CSS conflicts.
- **Mobile.** Ensure it works down to 320px. Test touch, virtual keyboard, scroll on iOS Safari and Chrome Android.

### Week 3 — Admin and Production

- **Admin API.** Conversation listing, individual viewing, analytics (total conversations, messages per conversation, top questions).
- **Monitoring.** Structured logging for Gemini calls: latency, tool calls, token counts, error rates.
- **Deploy.** Containerise and deploy to Cloud Run. Custom domain, HTTPS, concurrency limits.
- **Shopify integration.** Register as a theme extension or document the embed snippet.

### Week 4 — Iteration

- **Review conversations.** Identify common intents, failure modes, drop-off points.
- **Quick-reply shortcuts.** Pre-populate suggestion chips for top openers.
- **Prompt refinement.** Version the system instruction, track improvements.
- **Fine-tuning prep.** If volume warrants it, begin preparing supervised fine-tuning on Vertex AI using curated conversation pairs.

---

## 4. Risks, Limits, and Iteration

### Hallucination Mitigation

The primary defence is **function calling as grounding**. The system instruction forbids the model from citing facts not returned by tools, and requires tool calls before every recommendation.

Additional safeguards:
- Product cards only contain data from tool results, not model-generated values
- Backend validates response structure and falls back gracefully if anything breaks
- Max 5 tool-call rounds prevents loops

### Brand Voice Drift

Over time the model's tone may shift. Mitigation:
- **Weekly review** — sample 20–30 conversations from the admin dashboard
- **Flagging** — track where customers disengaged or repeated questions (signals of bad responses)
- **Prompt versioning** — every system instruction change is version-controlled

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Competitor mention | Redirect gracefully: "I'm best placed to help with our own range — let me find the right Asterley Bros bottle for you." |
| Underage | "Our products are for those 18+. Age verification at checkout and delivery." |
| Complaint | "I'm sorry to hear that — please email hello@asterleybros.com with your order number." |
| API downtime | Graceful fallback: friendly apology, retry button, email link, browse products link. No technical errors exposed. |
| Off-topic | "I'm a specialist in Asterley Bros spirits and cocktails — happy to help with anything in that world!" |
| Vague opinion ("Is this good?") | Treat as a recommendation request. Ask a clarifying question: "It depends on what you're after — do you prefer something dry and crisp, or richer and more aromatic?" Then call `product_lookup` with their preference. |
| Food pairing ("What pairs with steak?") | Map food types to product characteristics via the system prompt. Rich/red meat → Estate (sweet vermouth), seafood/light dishes → Schofield's (dry vermouth), dessert/cheese → Britannica (fernet). Call `product_lookup` + `recipe_lookup` to ground the suggestion. |
| Misspellings / casual input ("can i pair wit this", "whats good w fish") | Gemini handles typos and informal language natively. The system prompt instructs the model to interpret intent, not match exact keywords. Tool queries use the cleaned-up intent, not raw input. |

### Cost

Gemini 2.5 Flash pricing (~$0.15/1M input, ~$0.60/1M output). Average conversation ~2,000 tokens ≈ **$0.006**.

| Daily volume | Monthly cost |
|-------------|-------------|
| 50 | ~$9 |
| 100 | ~$18 |
| 200 | ~$36 |
| 500 | ~$90 |

Remarkably cost-effective compared to even a part-time CS hire.

### Iteration Strategy

- Track conversation patterns via admin analytics
- Cluster top questions, build pre-populated suggestion chips
- Measure conversion: how many chats lead to Add to Cart events
- For deterministic answers (shipping cost, allergens), consider short-circuiting the LLM entirely with cached responses
- After 500+ curated conversation pairs, evaluate fine-tuning on Vertex AI

---

## 5. Use of AI Tools

I want to be upfront about how I used AI in this project:

- **Claude Code** was my main implementation partner. I used it for scaffolding the Express backend, writing TypeScript types, building the Gemini integration, and iterating on the tool declarations and widget. It's fast for boilerplate and great for catching things I'd miss — but I drove the architecture decisions and reviewed everything it produced.

- **Gemini 2.5 Flash** is the production AI backbone. I developed the prompt engineering — system instruction, function calling schemas, behavioural rules — through iterative testing against real conversation scenarios. I chose Flash specifically for its strong function calling support, low latency, and pricing that makes sense for a small brand.

- **Product research** came directly from the Asterley Bros website. All product names, prices, ABV figures, tasting notes, botanicals, allergens, and shipping policies are sourced from the live site.

My goal wasn't to show that AI can write code — it's to show how AI tools can be used effectively as accelerators within a deliberate, architecture-first process.
