// ── Product Types ──

export interface Product {
  id: string;
  name: string;
  shortName: string;
  category: "vermouth" | "bitters" | "aperitif" | "bundle" | "subscription" | "experience";
  price: number;
  currency: string;
  abv: number | null;
  volume: string;
  description: string;
  tastingNotes: string;
  botanicals: string[];
  servingSuggestions: string[];
  allergens: string[];
  isVegan: boolean;
  isGlutenFree: boolean;
  shopifyVariantId: string;
  imageUrl: string;
  productUrl: string;
  inStock: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  ingredients: Ingredient[];
  method: string[];
  glassware: string;
  garnish: string;
  occasion: string[];
  difficulty: "easy" | "medium" | "advanced";
  imageUrl?: string;
}

export interface Ingredient {
  item: string;
  amount: string;
  unit: string;
  isAsterleyProduct: boolean;
}

// ── Chat Types ──

export interface ChatRequest {
  sessionId?: string;
  message: string;
  pageContext?: PageContext;
}

export interface PageContext {
  currentUrl?: string;
  currentProductId?: string;
  cartItems?: CartItem[];
  cartTotal?: number;
}

export interface CartItem {
  variantId: string;
  quantity: number;
  title: string;
  price: number;
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  productCards: ProductCard[];
  recipeCards: RecipeCard[];
  suggestedActions: SuggestedAction[];
}

export interface ProductCard {
  productId: string;
  name: string;
  price: number;
  abv: number | null;
  volume: string;
  description: string;
  imageUrl: string;
  shopifyVariantId: string;
}

export interface RecipeCard {
  recipeId: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  method: string[];
  glassware: string;
  garnish: string;
}

export interface SuggestedAction {
  label: string;
  type: "question" | "link" | "add_to_cart";
  value: string;
}

// ── Session Types ──

export interface Session {
  id: string;
  createdAt: string;
  lastActive: string;
  pageUrl: string | null;
  messagesCount: number;
}

export interface Message {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  metadata?: string;
  createdAt: string;
}

// ── Admin Types ──

export interface ConversationSummary {
  sessionId: string;
  createdAt: string;
  lastActive: string;
  messagesCount: number;
  firstMessage: string | null;
}

export interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  avgMessagesPerConversation: number;
  conversationsToday: number;
  topQuestions: { question: string; count: number }[];
}
