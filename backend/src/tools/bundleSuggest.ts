import { Type } from "@google/genai";
import { suggestBundle, getProductsByCategory, getAllProducts } from "../services/product";

export interface BundleSuggestArgs {
  currentProductIds?: string[];
  occasion?: string;
  budget?: number;
}

export function executeBundleSuggest(args: BundleSuggestArgs): string {
  const bundles = getProductsByCategory("bundle");
  const subscriptions = getProductsByCategory("subscription");
  const experiences = getProductsByCategory("experience");

  let suggestions: typeof bundles = [];

  // If customer already has products in mind/cart, suggest relevant bundle
  if (args.currentProductIds && args.currentProductIds.length > 0) {
    suggestions = suggestBundle(args.currentProductIds);
  }

  // If looking for a specific occasion
  if (args.occasion) {
    const occ = args.occasion.toLowerCase();
    if (occ.includes("gift") || occ.includes("present") || occ.includes("birthday")) {
      suggestions = [...bundles, ...experiences];
    } else if (occ.includes("subscription") || occ.includes("monthly") || occ.includes("club")) {
      suggestions = subscriptions;
    } else if (occ.includes("party") || occ.includes("gathering") || occ.includes("dinner")) {
      // Suggest bundles and the ready-to-drink Negroni
      const allProducts = getAllProducts();
      const partyPick = allProducts.find((p) => p.id === "rhubarb-negroni");
      suggestions = [...bundles, ...(partyPick ? [partyPick] : [])];
    } else if (occ.includes("learn") || occ.includes("experience") || occ.includes("masterclass")) {
      suggestions = experiences;
    } else {
      suggestions = bundles;
    }
  }

  // Budget filtering
  if (args.budget && suggestions.length > 0) {
    suggestions = suggestions.filter((s) => s.price <= args.budget!);
  }

  // Fallback: show all bundles
  if (suggestions.length === 0) {
    suggestions = bundles;
  }

  return JSON.stringify({
    found: true,
    count: suggestions.length,
    suggestions: suggestions.map((s) => ({
      id: s.id,
      name: s.name,
      price: `£${s.price.toFixed(2)}`,
      originalPrice: (s as any).originalPrice
        ? `£${(s as any).originalPrice.toFixed(2)}`
        : null,
      description: s.description,
      volume: s.volume,
      shopifyVariantId: s.shopifyVariantId,
      imageUrl: s.imageUrl,
    })),
    freeShippingNote: "Orders over £60 qualify for free UK shipping!",
  });
}

export const bundleSuggestDeclaration = {
  name: "bundle_suggest",
  description:
    "Suggest bundles, subscriptions, or gift options based on the customer's current selections, occasion, or budget. Use this to upsell and increase order value.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      currentProductIds: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Product IDs the customer is currently considering or has in cart",
      },
      occasion: {
        type: Type.STRING,
        description:
          "The occasion or purpose (e.g. 'gift', 'dinner party', 'subscription', 'experience', 'birthday')",
      },
      budget: {
        type: Type.NUMBER,
        description: "Maximum budget in GBP",
      },
    },
  },
};
