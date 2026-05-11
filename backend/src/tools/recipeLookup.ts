import {
  searchRecipes,
  getRecipesByProduct,
  getRecipesByOccasion,
  getEasyRecipes,
  getRecipeById,
  getProductById,
} from "../services/product";
import type { Recipe } from "../types";

export interface RecipeLookupArgs {
  query?: string;
  productId?: string;
  occasion?: string;
  difficulty?: string;
  recipeId?: string;
}

export function executeRecipeLookup(args: RecipeLookupArgs): string {
  let results: Recipe[];

  if (args.recipeId) {
    const recipe = getRecipeById(args.recipeId);
    results = recipe ? [recipe] : [];
  } else if (args.productId) {
    results = getRecipesByProduct(args.productId);
  } else if (args.occasion) {
    results = getRecipesByOccasion(args.occasion);
  } else if (args.difficulty === "easy") {
    results = getEasyRecipes();
  } else if (args.query) {
    results = searchRecipes(args.query);
  } else {
    results = [];
  }

  if (results.length === 0) {
    return JSON.stringify({
      found: false,
      message: "No matching recipes found. Try asking about a specific cocktail or occasion.",
    });
  }

  // Surface linked products so cards can fall back to product imagery.
  const productIdsAcross = Array.from(
    new Set(results.flatMap((r) => r.productIds ?? []))
  );
  const products = productIdsAcross
    .map((pid) => getProductById(pid))
    .filter((p): p is NonNullable<ReturnType<typeof getProductById>> => Boolean(p))
    .map((p) => ({ id: p.id, imageUrl: p.imageUrl, name: p.name }));

  return JSON.stringify({
    found: true,
    count: results.length,
    recipes: results.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      jarvisSuggests: r.jarvisSuggests,
      ingredients: r.ingredients,
      method: r.method,
      glassware: r.glassware,
      garnish: r.garnish,
      occasion: r.occasion,
      difficulty: r.difficulty,
      productIds: r.productIds,
      imageUrl: r.imageUrl,
    })),
    products,
  });
}

export const recipeLookupDeclaration = {
  name: "recipe_lookup",
  description:
    "Find cocktail recipes that use Asterley Bros products. Search by cocktail name, product, occasion (e.g. 'dinner party', 'summer', 'date night'), or difficulty level.",
  input_schema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Free-text search for recipe names, ingredients, or styles (e.g. 'negroni', 'martini', 'spritz')",
      },
      productId: {
        type: "string",
        description: "Find recipes that use a specific Asterley Bros product by ID",
      },
      occasion: {
        type: "string",
        description: "Find recipes for a specific occasion (e.g. 'dinner party', 'summer', 'date night', 'casual')",
      },
      difficulty: {
        type: "string",
        enum: ["easy", "medium", "advanced"],
        description: "Filter by recipe difficulty level",
      },
      recipeId: {
        type: "string",
        description: "Look up a specific recipe by its ID",
      },
    },
  },
};
