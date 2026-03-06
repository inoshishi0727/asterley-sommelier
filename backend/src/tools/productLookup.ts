import { Type } from "@google/genai";
import {
  searchProducts,
  getProductsByCategory,
  getProductsByPreference,
  getProductById,
} from "../services/product";
import type { Product } from "../types";

export interface ProductLookupArgs {
  query?: string;
  category?: string;
  preference?: string;
  productId?: string;
}

export function executeProductLookup(args: ProductLookupArgs): string {
  let results: Product[];

  if (args.productId) {
    const product = getProductById(args.productId);
    results = product ? [product] : [];
  } else if (args.preference) {
    results = getProductsByPreference(args.preference);
  } else if (args.category) {
    results = getProductsByCategory(args.category);
  } else if (args.query) {
    results = searchProducts(args.query);
  } else {
    results = [];
  }

  if (results.length === 0) {
    return JSON.stringify({
      found: false,
      message: "No matching products found in our catalog.",
    });
  }

  return JSON.stringify({
    found: true,
    count: results.length,
    products: results.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: `£${p.price.toFixed(2)}`,
      abv: p.abv ? `${p.abv}%` : null,
      volume: p.volume,
      description: p.description,
      tastingNotes: p.tastingNotes,
      servingSuggestions: p.servingSuggestions,
      allergens: p.allergens,
      isVegan: p.isVegan,
      isGlutenFree: p.isGlutenFree,
      shopifyVariantId: p.shopifyVariantId,
      imageUrl: p.imageUrl,
    })),
  });
}

export const productLookupDeclaration = {
  name: "product_lookup",
  description:
    "Search the Asterley Bros product catalog by name, category, taste preference, or product ID. Use this whenever a customer asks about products, recommendations, pricing, ABV, allergens, or ingredients.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description:
          "Free-text search query matching product names, descriptions, botanicals, or tasting notes",
      },
      category: {
        type: Type.STRING,
        enum: [
          "vermouth",
          "bitters",
          "aperitif",
          "bundle",
          "subscription",
          "experience",
        ],
        description: "Filter by product category",
      },
      preference: {
        type: Type.STRING,
        description:
          "Taste/occasion preference like 'sweet', 'dry', 'bitter', 'negroni', 'martini', 'spritz', 'gift', 'party', 'gluten-free', 'digestif'",
      },
      productId: {
        type: Type.STRING,
        description: "Look up a specific product by its ID",
      },
    },
  },
};
