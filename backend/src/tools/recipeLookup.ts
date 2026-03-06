import { Type } from "@google/genai";
import {
  searchRecipes,
  getRecipesByProduct,
  getRecipesByOccasion,
  getEasyRecipes,
  getRecipeById,
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

  return JSON.stringify({
    found: true,
    count: results.length,
    recipes: results.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      ingredients: r.ingredients,
      method: r.method,
      glassware: r.glassware,
      garnish: r.garnish,
      occasion: r.occasion,
      difficulty: r.difficulty,
      productIds: r.productIds,
    })),
  });
}

export const recipeLookupDeclaration = {
  name: "recipe_lookup",
  description:
    "Find cocktail recipes that use Asterley Bros products. Search by cocktail name, product, occasion (e.g. 'dinner party', 'summer', 'date night'), or difficulty level.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description:
          "Free-text search for recipe names, ingredients, or styles (e.g. 'negroni', 'martini', 'spritz')",
      },
      productId: {
        type: Type.STRING,
        description:
          "Find recipes that use a specific Asterley Bros product by ID",
      },
      occasion: {
        type: Type.STRING,
        description:
          "Find recipes for a specific occasion (e.g. 'dinner party', 'summer', 'date night', 'casual')",
      },
      difficulty: {
        type: Type.STRING,
        enum: ["easy", "medium", "advanced"],
        description: "Filter by recipe difficulty level",
      },
      recipeId: {
        type: Type.STRING,
        description: "Look up a specific recipe by its ID",
      },
    },
  },
};
