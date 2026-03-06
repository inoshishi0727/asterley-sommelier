import type { Product, Recipe } from "../types";
import productCatalog from "../data/productCatalog.json";
import recipesData from "../data/recipes.json";

const products: Product[] = productCatalog as Product[];
const recipes: Recipe[] = recipesData as Recipe[];

// ── Product Lookups ──

export function getAllProducts(): Product[] {
  return products.filter((p) => p.inStock);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tastingNotes.toLowerCase().includes(q) ||
      p.botanicals.some((b) => b.toLowerCase().includes(q)) ||
      p.servingSuggestions.some((s) => s.toLowerCase().includes(q))
    );
  });
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (p) => p.category === category.toLowerCase() && p.inStock
  );
}

export function getProductsByPreference(preference: string): Product[] {
  const pref = preference.toLowerCase();

  // Map common preference terms to product characteristics
  const preferenceMap: Record<string, (p: Product) => boolean> = {
    sweet: (p) => p.id === "estate" || p.category === "bundle",
    dry: (p) => p.id === "schofields" || p.id === "cunard",
    bitter: (p) =>
      p.id === "britannica" ||
      p.id === "dispense" ||
      p.id === "asterley-original",
    light: (p) => p.id === "asterley-original" || p.id === "schofields",
    bold: (p) => p.id === "britannica" || p.id === "dispense",
    herbal: (p) =>
      p.id === "dispense" || p.id === "estate" || p.id === "schofields",
    "gluten-free": (p) => p.isGlutenFree,
    vegan: (p) => p.isVegan,
    vermouth: (p) => p.category === "vermouth",
    negroni: (p) =>
      p.id === "estate" ||
      p.id === "asterley-original" ||
      p.id === "rhubarb-negroni",
    martini: (p) => p.id === "schofields" || p.id === "cunard",
    spritz: (p) => p.id === "asterley-original",
    digestif: (p) => p.id === "britannica" || p.id === "dispense",
    gift: (p) =>
      p.category === "bundle" ||
      p.category === "experience" ||
      p.category === "subscription",
    party: (p) =>
      p.id === "rhubarb-negroni" ||
      p.category === "bundle" ||
      p.id === "asterley-original",
    subscription: (p) => p.category === "subscription",
    experience: (p) => p.category === "experience",
  };

  // Check if there's a direct preference match
  for (const [key, filter] of Object.entries(preferenceMap)) {
    if (pref.includes(key)) {
      return products.filter(filter);
    }
  }

  // Fall back to general search
  return searchProducts(preference);
}

// ── Recipe Lookups ──

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.toLowerCase();
  return recipes.filter((r) => {
    return (
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.occasion.some((o) => o.toLowerCase().includes(q)) ||
      r.ingredients.some((i) => i.item.toLowerCase().includes(q)) ||
      r.difficulty.toLowerCase().includes(q)
    );
  });
}

export function getRecipesByProduct(productId: string): Recipe[] {
  return recipes.filter((r) => r.productIds.includes(productId));
}

export function getRecipesByOccasion(occasion: string): Recipe[] {
  const occ = occasion.toLowerCase();
  return recipes.filter((r) =>
    r.occasion.some((o) => o.toLowerCase().includes(occ))
  );
}

export function getEasyRecipes(): Recipe[] {
  return recipes.filter((r) => r.difficulty === "easy");
}

// ── Bundle / Upsell Logic ──

export function suggestBundle(productIds: string[]): Product[] {
  const bundles = products.filter((p) => p.category === "bundle");

  // If buying vermouths, suggest vermouth bundle
  const hasSweetVermouth = productIds.includes("estate");
  const hasDryVermouth =
    productIds.includes("schofields") || productIds.includes("cunard");
  if (hasSweetVermouth || hasDryVermouth) {
    return bundles.filter((b) => b.id === "vermouth-bundle");
  }

  // If buying amaro/bitters/aperitif, suggest amaro bundle
  const hasAmaro = productIds.some((id) =>
    ["dispense", "britannica", "asterley-original"].includes(id)
  );
  if (hasAmaro) {
    return bundles.filter((b) => b.id === "amaro-bundle");
  }

  return bundles;
}

export function getShippingInfo(): {
  standard: string;
  freeThreshold: string;
  delivery: string;
  international: string;
} {
  return {
    standard: "£4.50 via DPD",
    freeThreshold: "Free shipping on orders over £60",
    delivery: "Next working day UK delivery",
    international:
      "Please contact hello@asterleybros.com for international shipping enquiries",
  };
}
