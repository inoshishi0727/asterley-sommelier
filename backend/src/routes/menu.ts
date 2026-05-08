import { Router } from "express";
import type { Recipe } from "../types";
import { getAllRecipes, getProductById } from "../services/product";

export const menuRouter = Router();

interface MenuProduct {
  name: string;
  sub: string;
  price: string;
  img: string;
  url: string;
}

interface MenuRecipe {
  spec: [string, string][];
  method: string;
  glass: string;
  garnish: string;
}

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  occasion: string[];
  jarvisSuggests?: string;
  product?: MenuProduct;
  recipe?: MenuRecipe;
}

interface MenuSection {
  id: string;
  title: string;
  sub: string;
  note: string;
  items: MenuItem[];
}

function classifyRecipe(r: Recipe): string {
  const tags = r.occasion ?? [];

  // spirit-forward removed — it's a style tag, not a section classifier; stirred drinks like Boulevardier share it
  if (tags.some(t => ["digestif", "after-dinner", "slow sipper"].includes(t))) {
    return "digestivo";
  }
  // negroni-week removed — sparkling Negroni riffs (Sbagliato) were incorrectly landing here
  if (tags.some(t => ["stirred", "dinner party"].includes(t))) {
    return "stirred";
  }
  // casual removed — too broad; sparkling aperitivo drinks were landing in Long
  if (tags.some(t => ["long drink", "garden party", "punch", "tropical"].includes(t))) {
    return "long";
  }
  return "aperitivo";
}

menuRouter.get("/", (_req, res) => {
  const sections: MenuSection[] = [
    {
      id: "aperitivo",
      title: "Aperitivo",
      sub: "to begin the evening",
      note: "Start light. Bitter is the key that unlocks the appetite.",
      items: [],
    },
    {
      id: "stirred",
      title: "Stirred",
      sub: "quiet, considered",
      note: "For the contemplative. Thirty seconds of stirring, never rushed.",
      items: [],
    },
    {
      id: "long",
      title: "Long Serves",
      sub: "for a warm afternoon",
      note: "Drinks that last a conversation.",
      items: [],
    },
    {
      id: "digestivo",
      title: "Digestivo",
      sub: "to close the evening",
      note: "A bitter, reflective end. Neat, on ice, or long.",
      items: [],
    },
  ];

  const sectionMap = Object.fromEntries(sections.map((s) => [s.id, s]));

  for (const recipe of getAllRecipes()) {
    const sectionId = classifyRecipe(recipe);
    const section = sectionMap[sectionId];
    if (section && section.items.length < 6) {
      const p = recipe.productIds?.[0] ? getProductById(recipe.productIds[0]) : undefined;
      const generated = p
        ? `${p.shortName}: ${p.tastingNotes.split('.')[0].charAt(0).toLowerCase() + p.tastingNotes.split('.')[0].slice(1)}.`
        : undefined;
      const jarvisSuggests = recipe.jarvisSuggests ?? generated;
      const spec: [string, string][] = recipe.ingredients.map((ing) => [
        ing.item,
        `${ing.amount}${ing.unit ?? ""}`.trim(),
      ]);
      section.items.push({
        id: recipe.id,
        name: recipe.name,
        desc: recipe.description,
        occasion: recipe.occasion,
        jarvisSuggests,
        product: p ? {
          name: p.name,
          sub: p.shortName ?? p.name,
          price: `£${p.price.toFixed(2)}`,
          img: p.imageUrl ?? "",
          url: p.productUrl ?? "",
        } : undefined,
        recipe: {
          spec,
          method: (recipe.method ?? []).join(" "),
          glass: recipe.glassware ?? "",
          garnish: recipe.garnish ?? "",
        },
      });
    }
  }

  res.json({ sections: sections.filter((s) => s.items.length > 0) });
});
