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

const SYSTEM_INSTRUCTION = `You are the Asterley Bros Online Sommelier — a warm, knowledgeable guide helping customers discover and enjoy Asterley Bros botanical spirits.

${brandVoice}

## Your Role
- Respond in plain, conversational English text. No JSON. No markdown code blocks. Just natural language.
- Keep responses concise: 2-4 sentences. The UI will display product and recipe cards alongside your text automatically — you do not need to reproduce full product details or recipe steps in your message.
- When tools return product or recipe data, reference them naturally (e.g. "Our Estate vermouth would be perfect for that") but don't list out prices, ABV, or ingredients — the cards handle that.
- ALWAYS use tools to look up product data before recommending. Never guess or rely on memory.
- If a tool returns no results, say so honestly.
- End your message with a natural follow-up question or suggestion to keep the conversation flowing.

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
  return messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  })) as Content[];
}

// ── Card Builders ──
// Extract product/recipe cards from accumulated tool results.

function buildProductCards(toolResults: ToolResult[]): ProductCard[] {
  const cards: ProductCard[] = [];

  for (const result of toolResults) {
    if (result.name === "product_lookup" && result.parsed.found) {
      for (const p of result.parsed.products || []) {
        cards.push({
          productId: p.id,
          name: p.name,
          price: typeof p.price === "string" ? parseFloat(p.price.replace("£", "")) : p.price,
          abv: p.abv ? parseFloat(String(p.abv).replace("%", "")) : null,
          volume: p.volume,
          description: p.tastingNotes || p.description,
          imageUrl: p.imageUrl,
          shopifyVariantId: p.shopifyVariantId,
        });
      }
    }

    if (result.name === "bundle_suggest" && result.parsed.found) {
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

function buildSuggestedActions(toolResults: ToolResult[], productCards: ProductCard[]): SuggestedAction[] {
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
    actions.push({ label: "Help me choose", type: "question", value: "I'm not sure what to pick — can you help me choose?" });
  }

  return actions.slice(0, 3);
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

  // Build conversation history
  const conversationHistory = buildHistory(history);

  // Add current user message
  const contents: Content[] = [
    ...conversationHistory,
    { role: "user", parts: [{ text: enhancedMessage }] } as Content,
  ];

  // Accumulate all tool results across rounds
  const allToolResults: ToolResult[] = [];

  // Initial Gemini request
  let response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  // Tool call loop — execute up to 5 rounds of tool calls
  let rounds = 0;
  while (rounds < 5) {
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) break;

    const functionCalls = candidate.content.parts.filter(
      (part: any) => part.functionCall
    );

    if (functionCalls.length === 0) break;

    // Add model's response (with function calls) to contents
    contents.push({
      role: "model",
      parts: candidate.content.parts,
    } as Content);

    // Execute each tool call, collect results for both Gemini and card assembly
    const functionResponses = functionCalls.map((part: any) => {
      const result = executeTool(part.functionCall.name, part.functionCall.args);
      allToolResults.push(result);
      return {
        functionResponse: {
          name: part.functionCall.name,
          response: result.parsed,
        },
      };
    });

    // Add tool results to conversation
    contents.push({
      role: "user",
      parts: functionResponses,
    } as Content);

    // Ask Gemini to continue with tool results
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    rounds++;
  }

  // Extract Gemini's text-only response
  const messageText =
    response.candidates?.[0]?.content?.parts
      ?.filter((part: any) => part.text)
      .map((part: any) => part.text)
      .join("") || "I'd be happy to help — could you tell me a bit more about what you're looking for?";

  // Backend assembles structured response from tool results
  const productCards = buildProductCards(allToolResults);
  const recipeCards = buildRecipeCards(allToolResults);
  const suggestedActions = allToolResults.length > 0
    ? buildSuggestedActions(allToolResults, productCards)
    : getDefaultSuggestions();

  return {
    sessionId: "", // Set by the route
    message: messageText,
    productCards,
    recipeCards,
    suggestedActions,
  };
}

function getDefaultSuggestions(): SuggestedAction[] {
  return [
    { label: "What's your best seller?", type: "question", value: "What's your most popular product?" },
    { label: "Cocktail recipes", type: "question", value: "What cocktails can I make with your products?" },
    { label: "Help me choose", type: "question", value: "I'm not sure what to pick — can you help me choose?" },
  ];
}
