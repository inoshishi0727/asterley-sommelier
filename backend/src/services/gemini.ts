import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam, ToolUseBlock, TextBlock } from "@anthropic-ai/sdk/resources/messages";
import fs from "fs";
import path from "path";
import { config } from "../config";
import type { ChatResponse, Message, PageContext, ProductCard, RecipeCard, SuggestedAction } from "../types";
import { executeProductLookup, productLookupDeclaration } from "../tools/productLookup";
import { executeRecipeLookup, recipeLookupDeclaration } from "../tools/recipeLookup";
import { executeBundleSuggest, bundleSuggestDeclaration } from "../tools/bundleSuggest";
import { executeShippingInfo, shippingInfoDeclaration } from "../tools/shippingInfo";
import { executeEmailCapture, emailCaptureDeclaration } from "../tools/emailCapture";
import { logClaudeUsage } from "./usage";

const brandVoice = fs.readFileSync(
  path.resolve(__dirname, "../data/brandVoice.md"),
  "utf-8"
);

const client = new Anthropic({ apiKey: config.anthropicApiKey });

const MODEL = "claude-haiku-4-5-20251001";

// ── System Instruction ──

const SYSTEM_INSTRUCTION = `You are Jarvis, the Asterley Bros online sommelier — a warm, knowledgeable guide helping customers discover and enjoy Asterley Bros botanical spirits.

${brandVoice}

## Your Role
- You are an AI assistant. If asked whether you are a human, a real person, a bot, or an AI — answer plainly: "I'm an AI chatbot, built by Asterley Bros to help you find the right serve." Never claim to be a real person.
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
- HARD RULE — product names: if you are about to mention any Asterley product by name (Estate, Dispense, Britannica, Cunard, Schofield's, Asterley Original, etc.) in your reply, you MUST have called product_lookup in this turn first. No exceptions. This includes food pairings ("what goes with fish?"), gift suggestions, comparisons, "what should I try", or any recommendation. If you haven't called the tool, call it now before answering — query with the food/occasion/preference terms.
- When directing a customer to a specific page (masterclass, gift vouchers, subscription etc.), include the full URL from the Key URLs list in your response text.
- Use conversation history. If the customer has already stated a taste preference, occasion, or constraint earlier in this session (e.g. "I like bitter things", "I'm gluten intolerant", "it's for a gift"), carry that forward — do not ask for it again. Refer back to it naturally when relevant.

## Conversation Context
The customer is browsing the Asterley Bros online shop. Help them find the perfect product, suggest cocktails, answer questions about ingredients/allergens/shipping, and guide them toward a purchase. Be conversational and helpful, not pushy.`;

// ── Tools ──

const tools: Anthropic.Tool[] = [
  productLookupDeclaration,
  recipeLookupDeclaration,
  bundleSuggestDeclaration,
  shippingInfoDeclaration,
  emailCaptureDeclaration,
];

// ── Tool Executor ──

interface ToolResult {
  name: string;
  resultString: string;
  parsed: any;
}

async function executeTool(name: string, args: Record<string, any>): Promise<ToolResult> {
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
    case "email_capture":
      resultString = await executeEmailCapture(args);
      break;
    default:
      resultString = JSON.stringify({ error: `Unknown tool: ${name}` });
  }
  return { name, resultString, parsed: JSON.parse(resultString) };
}

// ── Build History ──

function buildHistory(messages: Message[]): MessageParam[] {
  return messages.map((m) => {
    let text = m.content;
    if (m.role === "assistant") {
      try { const p = JSON.parse(m.content); if (p.message) text = p.message; } catch {}
    }
    return { role: m.role === "user" ? "user" : "assistant", content: text } as MessageParam;
  });
}

// ── Card Builders ──

function buildProductCards(toolResults: ToolResult[], flaggedAllergens?: Set<string>): ProductCard[] {
  const cards: ProductCard[] = [];

  for (const result of toolResults) {
    if (result.name === "product_lookup" && result.parsed.found) {
      for (const p of result.parsed.products || []) {
        if (flaggedAllergens?.size && (p.allergens as string[] | undefined)?.some(a => flaggedAllergens.has(a))) {
          continue;
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
          allergens: p.allergens ?? [],
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
          allergens: s.allergens ?? [],
        });
      }
    }
  }

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
  if (toolResults.length === 0) return buildConversationalChips(messageText.toLowerCase());

  const actions: SuggestedAction[] = [];

  if (productCards.length > 0) {
    actions.push({
      label: `Add ${productCards[0].name} to cart`,
      type: "add_to_cart",
      value: productCards[0].shopifyVariantId,
    });
  }

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

// ── Main Chat Function ──

export async function chat(
  userMessage: string,
  history: Message[],
  pageContext?: PageContext,
  sessionId: string = ""
): Promise<ChatResponse> {
  let enhancedMessage = userMessage;
  if (pageContext) {
    const contextParts: string[] = [];
    if (pageContext.currentUrl) contextParts.push(`[Customer is viewing: ${pageContext.currentUrl}]`);
    if (pageContext.currentProductId) contextParts.push(`[Currently viewing product: ${pageContext.currentProductId}]`);
    if (pageContext.cartItems && pageContext.cartItems.length > 0) {
      const cartSummary = pageContext.cartItems.map((i) => `${i.title} (x${i.quantity})`).join(", ");
      contextParts.push(`[Cart contains: ${cartSummary}, total: £${pageContext.cartTotal?.toFixed(2)}]`);
    }
    if (contextParts.length > 0) enhancedMessage = `${contextParts.join(" ")}\n\nCustomer message: ${userMessage}`;
  }

  // ── Allergen guard ──
  const ALLERGY_KEYWORDS = ['allerg', 'nut', 'hazelnut', 'gluten', 'sulphit', 'lactose', 'dairy', 'safe for'];
  const isAllergyQuery = ALLERGY_KEYWORDS.some(k => userMessage.toLowerCase().includes(k));

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

  // Build messages array for Claude
  const messages: MessageParam[] = [
    ...buildHistory(history),
    { role: "user", content: enhancedMessage },
  ];

  const allToolResults: ToolResult[] = [];
  let finalText = '';

  const systemPrompt = SYSTEM_INSTRUCTION + allergenInstruction;

  // ── Tool loop — up to 5 rounds ──
  let round = 0;
  const MAX_ROUNDS = 5;

  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    tools,
    messages,
  });
  logClaudeUsage(sessionId, MODEL, response.usage, { round: 0, toolUse: false });

  while (round < MAX_ROUNDS) {
    // Collect any text from this turn
    const textBlocks = response.content.filter((b): b is TextBlock => b.type === "text");
    if (textBlocks.length) finalText = textBlocks.map(b => b.text).join("");

    // Find tool calls
    const toolUseBlocks = response.content.filter((b): b is ToolUseBlock => b.type === "tool_use");
    if (toolUseBlocks.length === 0 || response.stop_reason === "end_turn") break;

    // Execute all tool calls in this round
    const toolResults = await Promise.all(
      toolUseBlocks.map(async (block) => {
        const result = await executeTool(block.name, block.input as Record<string, any>);
        allToolResults.push(result);
        return { id: block.id, result };
      })
    );

    // Append assistant turn + tool results to messages
    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: toolResults.map(({ id, result }) => ({
        type: "tool_result" as const,
        tool_use_id: id,
        content: result.resultString,
      })),
    });

    response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    });
    logClaudeUsage(sessionId, MODEL, response.usage, { round: round + 1, toolUse: true });

    round++;
  }

  // Capture final text if not already set
  const lastTextBlocks = response.content.filter((b): b is TextBlock => b.type === "text");
  if (lastTextBlocks.length) finalText = lastTextBlocks.map(b => b.text).join("");

  const messageText = finalText || "Could you tell me a bit more about what you're looking for?";

  function stripMarkdown(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/gs, '$1')
      .replace(/\*(.+?)\*/gs, '$1')
      .replace(/`(.+?)`/gs, '$1');
  }

  const ALLERGEN_FOOTER = '\n\nNote: all Asterley Bros products contain sulphites. Always check the product label before purchasing. For serious allergies, contact info@asterleybros.com before ordering.';
  const finalMessage = stripMarkdown(isAllergyQuery ? messageText + ALLERGEN_FOOTER : messageText);

  const productCards = buildProductCards(allToolResults, flaggedAllergens);
  const recipeCards = buildRecipeCards(allToolResults);
  const suggestedActions = buildSuggestedActions(allToolResults, productCards, finalMessage);

  return {
    sessionId: "",
    message: finalMessage,
    productCards,
    recipeCards,
    suggestedActions,
  };
}
