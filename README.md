# Asterley Bros — Online Sommelier

An AI-powered chat assistant for [Asterley Bros](https://asterleybros.com), the South London craft producer of vermouths, amari, and aperitifs. Built with **Gemini 2.5 Flash**, **Node.js/Express**, and a standalone **Web Component** chat widget.

## What It Does

The Online Sommelier helps DTC customers:

- **Discover products** — browse the full range with rich product cards
- **Get recommendations** — taste-based, occasion-based, and dietary-aware suggestions
- **Learn cocktail recipes** — step-by-step recipes featuring Asterley Bros spirits
- **Find answers** — shipping, allergens, storage, dietary info
- **Add to cart** — product cards with Shopify-integrated "Add to Cart" buttons
- **Save money** — intelligent bundle and subscription recommendations

## Architecture

```
Shopify Store → Chat Widget (Web Component) → Express API → Gemini 2.5 Flash
                                                    ↕
                                              Function Calling (4 tools)
                                                    ↕
                                              Product Catalog + Recipes + SQLite
```

**Key design decisions:**
- **Function Calling** over RAG — catalog is small (11 products), discrete tool calls are more reliable than vector search
- **Structured Output** — Gemini returns JSON with text + product cards + recipe cards + suggested actions
- **Web Component** — framework-agnostic, <15KB, works on any Shopify theme
- **SQLite** — zero-config session persistence, perfect for prototype

## Quick Start

### Prerequisites

- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/apikey) (free tier works)

### Setup

```bash
# Clone and enter project
cd asterley-sommelier

# Install backend dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the dev server
npm run dev
```

### Try It

1. Open **http://localhost:3000/widget/demo.html** in your browser
2. Click the gold chat bubble (bottom-right)
3. Try these conversations:
   - "What's the difference between your vermouths?"
   - "I'm hosting a dinner party for 8 people"
   - "Do you have anything gluten-free?"
   - "How do I make a Negroni?"
   - "What's good for a Martini?"

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send a chat message, get AI response |
| `/api/admin/conversations` | GET | List recent conversations |
| `/api/admin/conversations/:id` | GET | View a full conversation |
| `/api/admin/analytics` | GET | Dashboard analytics data |
| `/api/health` | GET | Health check |

### Chat API Example

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What vermouth do you recommend for a Negroni?"}'
```

Response includes:
```json
{
  "sessionId": "uuid",
  "message": "For a classic Negroni, I'd recommend our ESTATE...",
  "productCards": [{ "name": "ESTATE.", "price": 26.95, ... }],
  "recipeCards": [{ "name": "Classic Asterley Negroni", ... }],
  "suggestedActions": [{ "label": "Add to cart", ... }]
}
```

## Project Structure

```
asterley-sommelier/
├── backend/
│   └── src/
│       ├── index.ts              # Express server
│       ├── config.ts             # Environment config
│       ├── routes/
│       │   ├── chat.ts           # POST /api/chat
│       │   └── admin.ts          # Admin dashboard API
│       ├── services/
│       │   ├── gemini.ts         # Gemini 2.5 Flash integration
│       │   ├── session.ts        # SQLite session management
│       │   └── product.ts        # Product catalog service
│       ├── tools/
│       │   ├── productLookup.ts  # Search products by name/category/preference
│       │   ├── recipeLookup.ts   # Find cocktail recipes
│       │   ├── bundleSuggest.ts  # Recommend bundles/subscriptions
│       │   └── shippingInfo.ts   # Shipping, allergens, policies
│       ├── data/
│       │   ├── productCatalog.json
│       │   ├── recipes.json
│       │   └── brandVoice.md
│       └── types/
│           └── index.ts
├── widget/
│   ├── sommelier-widget.js       # Web Component
│   ├── sommelier-widget.css      # Branded styles
│   └── demo.html                 # Local test page
├── diagrams/                     # Architecture diagrams
├── deliverables/
│   └── writeup.md                # Assessment write-up
└── README.md
```

## Embedding in Shopify

To add the sommelier to a live Shopify store, add this snippet to the theme's `layout/theme.liquid` before `</body>`:

```html
<script type="module" src="https://your-api-domain.com/widget/sommelier-widget.js"></script>
<link rel="stylesheet" href="https://your-api-domain.com/widget/sommelier-widget.css">
<asterley-sommelier api-url="https://your-api-domain.com"></asterley-sommelier>
```

## Gemini Function Calling

The sommelier uses 4 grounded tools to ensure accurate responses:

| Tool | Purpose |
|------|---------|
| `product_lookup` | Search products by name, category, taste preference, or dietary requirement |
| `recipe_lookup` | Find cocktail recipes by name, product, occasion, or difficulty |
| `bundle_suggest` | Recommend bundles, subscriptions, or gifts based on cart/occasion/budget |
| `shipping_info` | Shipping rates, allergens, dietary info, returns, storage advice |

This means the AI **never hallucinates** product data — it always calls a tool first and responds based on real catalog information.

## Cost Estimate

| Volume | Monthly Cost |
|--------|-------------|
| 50 conversations/day | ~$9/month |
| 200 conversations/day | ~$36/month |
| 500 conversations/day | ~$90/month |

Based on Gemini 2.5 Flash pricing (~$0.006 per conversation average).
