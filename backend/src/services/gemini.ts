import { GoogleGenAI } from "@google/genai";
import type { Content, Tool } from "@google/genai";
import fs from "fs";
import path from "path";
import { config } from "../config";
import type { ChatResponse, Message, PageContext, ProductCard, RecipeCard, SuggestedAction } from "../types";
import { executeProductLookup, productLookupDeclaration } from "../tools/productLookup";
import { executeRecipeLookup, recipeLookupDeclaration } from "../tools/recipeLookup";
import { executeBundleSuggest, bundleSuggestDeclaration } from "../tools/bundleSuggest";
import { executeShippingInfo, shippingInfoDeclaration } from "../tools/shippingInfo";

const brandVoice = fs.readFileSync(
  path.resolve(__dirname, "../data/brandVoice.md"),
  "utf-8"
);

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

// ── System Instruction ──
// Gemini's only job: produce natural conversational text.
// Product cards, recipe cards, and suggestion chips are assembled
// by the backend from the tool call results.

const SYSTEM_INSTRUCTION = `You are Jarvis, the Asterley Bros online sommelier — a warm, knowledgeable guide helping customers discover and enjoy Asterley Bros botanical spirits.

${brandVoice}

## Your Role
- Respond in plain, conversational English text. No JSON. No markdown code blocks. Just natural language.
- Keep responses concise: 2-4 sentences. The UI will display product and recipe cards alongside your text automatically — you do not need to reproduce full product details or recipe steps in your message.
- When tools return product or recipe data, reference them naturally (e.g. "Our Estate vermouth would be perfect for that") but don't list out prices, ABV, or ingredients — the cards handle that.
- ALWAYS use tools to look up product data before recommending. Never guess or rely on memory.
- For ANY question about the Negroni Society (pricing, cancel, benefits, membership, subscription): you MUST call product_lookup with the exact argument productId="negroni-society". Do not use query or category — use productId only.
- If a tool returns no results, say so honestly.
- Never open with: "We certainly do", "Absolutely", "Of course", "Great question", "Oh if you're looking", "Happy to help", "I'd be happy to help", "Certainly", "My apologies", "I'm sorry", "Apologies". Start with the fact.
- Never describe products as "wonderful", "fantastic", "delightful", "lovely", "amazing", "great" — let the product cards speak.
- Never introduce yourself mid-conversation ("Jarvis here!"). Only state your name if directly asked.
- When asked what cocktails someone can make with a product (e.g. "what can I make with Britannica?"), ALWAYS call recipe_lookup immediately with that product name as the query. Do not ask a clarifying question.
- When someone describes a flavour preference, mood, or occasion (e.g. "something bitter", "something sweet and complex", "something for after dinner", "I like smoky spirits"), ALWAYS call product_lookup immediately with those terms as the query. Never ask a clarifying question when you have a flavour cue to work with.
- When directing a customer to a specific page (masterclass, gift vouchers, subscription etc.), include the full URL from the Key URLs list in your response text.

## Conversation Context
The customer is browsing the Asterley Bros online shop. Help them find the perfect product, suggest cocktails, answer questions about ingredients/allergens/shipping, and guide them toward a purchase. Be conversational and helpful, not pushy.`;

// ── Tool Declarations ──

const tools: Tool[] = [
  {
    functionDeclarations: [
      productLookupDeclaration,
      recipeLookupDeclaration,
      bundleSuggestDeclaration,
      shippingInfoDeclaration,
    ],
  } as Tool,
];

// ── Tool Executor ──
// Returns the raw result string AND the parsed data for card assembly.

interface ToolResult {
  name: string;
  resultString: string;
  parsed: any;
}

function executeTool(name: string, args: Record<string, any>): ToolResult {
  let resultString: string;
  switch (name) {
    case "product_lookup":
      resultString = executeProductLookup(args);
      break;
    case "recipe_lookup":
      resultString = executeRecipeLookup(args);
      break;
    case "bundle_suggest":
      resultString = executeBundleSuggest(args);
      break;
    case "shipping_info":
      resultString = executeShippingInfo(args);
      break;
    default:
      resultString = JSON.stringify({ error: `Unknown tool: ${name}` });
  }
  return { name, resultString, parsed: JSON.parse(resultString) };
}

// ── Build History ──

function buildHistory(messages: Message[]): Content[] {
  return messages.map((m) => {
    let text = m.content;
    if (m.role === "assistant") {
      try { const p = JSON.parse(m.content); if (p.message) text = p.message; } catch {}
    }
    return { role: m.role === "user" ? "user" : "model", parts: [{ text }] } as Content;
  });
}

// ── Card Builders ──
// Extract product/recipe cards from accumulated tool results.

function buildProductCards(toolResults: ToolResult[], flaggedAllergens?: Set<string>): ProductCard[] {
  const cards: ProductCard[] = [];

  for (const result of toolResults) {
    if (result.name === "product_lookup" && result.parsed.found) {
      for (const p of result.parsed.products || []) {
        if (flaggedAllergens?.size && (p.allergens as string[] | undefined)?.some(a => flaggedAllergens.has(a))) {
          continue; // don't show cards for products containing the flagged allergen
        }
        cards.push({
          productId: p.id,
          name: p.name,
          price: typeof p.price === "string" ? parseFloat(p.price.replace("£", "")) : p.price,
          abv: p.abv ? parseFloat(String(p.abv).replace("%", "")) : null,
          volume: p.volume,
          description: p.tastingNotes || p.description,
          imageUrl: p.imageUrl,
          shopifyVariantId: p.shopifyVariantId,
          url: p.productUrl,
        });
      }
    }

    if (result.name === "bundle_suggest" && result.parsed.found && !flaggedAllergens?.size) {
      for (const s of result.parsed.suggestions || []) {
        cards.push({
          productId: s.id,
          name: s.name,
          price: typeof s.price === "string" ? parseFloat(s.price.replace("£", "")) : s.price,
          abv: null,
          volume: s.volume,
          description: s.description,
          imageUrl: s.imageUrl,
          shopifyVariantId: s.shopifyVariantId,
          url: s.productUrl,
        });
      }
    }
  }

  // Dedupe by productId, limit to 3
  const seen = new Set<string>();
  return cards.filter((c) => {
    if (seen.has(c.productId)) return false;
    seen.add(c.productId);
    return true;
  }).slice(0, 3);
}

function buildRecipeCards(toolResults: ToolResult[]): RecipeCard[] {
  const cards: RecipeCard[] = [];

  for (const result of toolResults) {
    if (result.name === "recipe_lookup" && result.parsed.found) {
      for (const r of result.parsed.recipes || []) {
        cards.push({
          recipeId: r.id,
          name: r.name,
          description: r.description,
          ingredients: r.ingredients,
          method: r.method,
          glassware: r.glassware,
          garnish: r.garnish,
        });
      }
    }
  }

  return cards.slice(0, 2);
}

function buildSuggestedActions(toolResults: ToolResult[], productCards: ProductCard[], messageText: string): SuggestedAction[] {
  // No tools called = pure conversation. Generate chips from Jarvis's message content.
  if (toolResults.length === 0) return buildConversationalChips(messageText.toLowerCase());

  const actions: SuggestedAction[] = [];

  // If products were returned, offer "Add to Cart" for the first one
  if (productCards.length > 0) {
    actions.push({
      label: `Add ${productCards[0].name} to cart`,
      type: "add_to_cart",
      value: productCards[0].shopifyVariantId,
    });
  }

  // Context-aware follow-ups based on which tools were called
  const toolNames = new Set(toolResults.map((r) => r.name));

  if (toolNames.has("product_lookup") && !toolNames.has("recipe_lookup")) {
    actions.push({ label: "Cocktail ideas", type: "question", value: "What cocktails can I make with these?" });
  }
  if (toolNames.has("recipe_lookup") && !toolNames.has("product_lookup")) {
    actions.push({ label: "Show me the products", type: "question", value: "Can you show me the products used in these recipes?" });
  }
  if (!toolNames.has("bundle_suggest")) {
    actions.push({ label: "Any bundles or gifts?", type: "question", value: "Do you have any bundles or gift options?" });
  }

  // Always offer a general follow-up if we have room
  if (actions.length < 3) {
    actions.push({ label: "Help me choose", type: "question", value: "I'm not sure what to pick. Can you help me choose?" });
  }

  return actions.slice(0, 3);
}

function buildConversationalChips(lower: string): SuggestedAction[] {
  if ((lower.includes("sweet") || lower.includes("dry") || lower.includes("bitter")) && lower.includes("?"))
    return [
      { label: "Something sweet",  type: "question", value: "I like something rich and sweet" },
      { label: "Dry & crisp",      type: "question", value: "I prefer something dry and crisp" },
      { label: "Bitter & complex", type: "question", value: "I enjoy bitter, complex flavours" },
    ];
  if (lower.includes("occasion") || lower.includes("dinner") || lower.includes("meal"))
    return [
      { label: "Aperitivo hour", type: "question", value: "For aperitivo hour before dinner" },
      { label: "After dinner",   type: "question", value: "Something for after dinner" },
      { label: "Dinner pairing", type: "question", value: "I'm planning a dinner — what would pair well?" },
    ];
  if (lower.includes("cocktail") || lower.includes("serve") || lower.includes("glass"))
    return [
      { label: "Something stirred", type: "question", value: "I like stirred, spirit-forward cocktails" },
      { label: "Something long",    type: "question", value: "I want something long and refreshing" },
      { label: "A spritz",          type: "question", value: "Give me a spritz or aperitivo serve" },
    ];
  return [
    { label: "Show me what you make", type: "question", value: "What products do you offer?" },
    { label: "Help me choose",        type: "question", value: "I'm not sure what to pick. Can you help me choose?" },
  ];
}

// ── Gemini call with retry for transient capacity errors ──

async function generateWithRetry(params: Parameters<typeof ai.models.generateContent>[0], maxRetries = 3): Promise<ReturnType<typeof ai.models.generateContent>> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRetryable = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
      if (!isRetryable) throw err;
      lastErr = err;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

// ── Main Chat Function ──

export async function chat(
  userMessage: string,
  history: Message[],
  pageContext?: PageContext
): Promise<ChatResponse> {
  // Build context-enhanced user message
  let enhancedMessage = userMessage;
  if (pageContext) {
    const contextParts: string[] = [];
    if (pageContext.currentUrl) {
      contextParts.push(`[Customer is viewing: ${pageContext.currentUrl}]`);
    }
    if (pageContext.currentProductId) {
      contextParts.push(`[Currently viewing product: ${pageContext.currentProductId}]`);
    }
    if (pageContext.cartItems && pageContext.cartItems.length > 0) {
      const cartSummary = pageContext.cartItems
        .map((i) => `${i.title} (x${i.quantity})`)
        .join(", ");
      contextParts.push(`[Cart contains: ${cartSummary}, total: £${pageContext.cartTotal?.toFixed(2)}]`);
    }
    if (contextParts.length > 0) {
      enhancedMessage = `${contextParts.join(" ")}\n\nCustomer message: ${userMessage}`;
    }
  }

  // ── Allergen guard ──
  const ALLERGY_KEYWORDS = ['allerg', 'nut', 'hazelnut', 'gluten', 'sulphit', 'lactose', 'dairy', 'safe for'];
  const isAllergyQuery = ALLERGY_KEYWORDS.some(k => userMessage.toLowerCase().includes(k));

  // Map query keywords → catalog allergen names for card filtering
  const ALLERGEN_KEYWORD_MAP: Record<string, string[]> = {
    'nut':      ['TreeNuts'],
    'hazelnut': ['TreeNuts'],
    'gluten':   ['Gluten'],
    'sulphit':  ['Sulphites'],
    'lactose':  ['Dairy'],
    'dairy':    ['Dairy'],
  };
  const flaggedAllergens = new Set<string>();
  Object.entries(ALLERGEN_KEYWORD_MAP).forEach(([k, allergens]) => {
    if (userMessage.toLowerCase().includes(k)) allergens.forEach(a => flaggedAllergens.add(a));
  });

  const allergenInstruction = isAllergyQuery
    ? `\n\n## ALLERGEN SAFETY — active for this query\nState allergen facts directly — no opener, no filler. 2 sentences max. If the product contains the allergen: confirm it, then say "If you need something without [allergen], [Product] is a great alternative — [one-line reason]." Then call product_lookup for that alternative so its product card is shown. Do NOT include any label or email disclaimer in your response — it is appended automatically.`
    : '';

  // Build conversation history
  const conversationHistory = buildHistory(history);

  // Add current user message
  const contents: Content[] = [
    ...conversationHistory,
    { role: "user", parts: [{ text: enhancedMessage }] } as Content,
  ];

  // Accumulate all tool results across rounds
  const allToolResults: ToolResult[] = [];
  // Accumulate text seen in any model turn (model may produce text alongside tool calls)
  let collectedText = '';

  const geminiConfig = { systemInstruction: SYSTEM_INSTRUCTION + allergenInstruction, tools, temperature: 0.7, maxOutputTokens: 1024 };

  // ── Reusable tool executor loop ──
  async function runToolLoop(maxRounds: number) {
    let r = 0;
    while (r < maxRounds) {
      const candidate = response.candidates?.[0];
      if (!candidate?.content?.parts) break;

      // Capture any text produced in this turn
      const textInTurn = candidate.content.parts.filter((p: any) => p.text).map((p: any) => p.text).join('');
      if (textInTurn) collectedText = textInTurn;

      const functionCalls = candidate.content.parts.filter((part: any) => part.functionCall);
      if (functionCalls.length === 0) break;

      contents.push({ role: "model", parts: candidate.content.parts } as Content);

      const functionResponses = functionCalls.map((part: any) => {
        const result = executeTool(part.functionCall.name, part.functionCall.args);
        allToolResults.push(result);
        return { functionResponse: { name: part.functionCall.name, response: result.parsed } };
      });

      contents.push({ role: "user", parts: functionResponses } as Content);

      response = await generateWithRetry({ model: "gemini-2.5-flash", contents, config: geminiConfig });
      r++;
    }
  }

  // Initial Gemini request
  let response = await generateWithRetry({ model: "gemini-2.5-flash", contents, config: geminiConfig });

  // Main tool call loop — up to 5 rounds
  await runToolLoop(5);

  // ── Hallucination guard ──
  // Only fire if ALL product_lookups returned empty.
  const productLookups = allToolResults.filter(r => r.name === 'product_lookup');
  const productLookupRanEmpty = productLookups.length > 0 &&
    productLookups.every(r => !r.parsed.found);
  if (productLookupRanEmpty) {
    contents.push({
      role: 'user',
      parts: [{ text: "[INTERNAL: The product lookup returned no results. Try again with a simpler or broader query (e.g. use just the product type like 'sweet vermouth' or 'amaro'). If you find a matching product this time, present it naturally as if it were a normal recommendation — do NOT deny it or say you don't carry it. Only if genuinely nothing is found: briefly say you don't carry that exact one and suggest the closest real alternative.]" }],
    } as Content);
    response = await generateWithRetry({ model: 'gemini-2.5-flash', contents, config: geminiConfig });
    collectedText = '';
    await runToolLoop(3);
  }

  // Extract final text — prefer last collectedText from any turn, fall back to final response parts
  const messageText =
    collectedText ||
    response.candidates?.[0]?.content?.parts
      ?.filter((part: any) => part.text)
      .map((part: any) => part.text)
      .join("") ||
    "Could you tell me a bit more about what you're looking for?";

  // Strip markdown artifacts (LLM sometimes emits **bold** despite instructions)
  function stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/gs, '$1')
      .replace(/\*(.+?)\*/gs, '$1')
      .replace(/`(.+?)`/gs, '$1');
  }

  // ── Allergen post-processing footer ──
  const ALLERGEN_FOOTER = '\n\nAllergen note: always check the product label before purchasing. For serious allergies, contact info@asterleybros.com before ordering.';
  const finalMessage = stripMarkdown(isAllergyQuery ? messageText + ALLERGEN_FOOTER : messageText);

  // Backend assembles structured response from tool results
  const productCards = buildProductCards(allToolResults, flaggedAllergens);
  const recipeCards = buildRecipeCards(allToolResults);
  const suggestedActions = buildSuggestedActions(allToolResults, productCards, finalMessage);

  return {
    sessionId: "", // Set by the route
    message: finalMessage,
    productCards,
    recipeCards,
    suggestedActions,
  };
}

