import { Router } from "express";
import type { Recipe } from "../types";
import recipesData from "../data/recipes.json";

const recipes: Recipe[] = recipesData as Recipe[];

export const menuRouter = Router();

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  occasion: string[];
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

  const isDigestif = tags.some((t) =>
    ["digestif", "after-dinner", "spirit-forward", "slow sipper"].includes(t)
  );
  const isLong = tags.some((t) =>
    ["long drink", "garden party", "casual", "punch", "tropical"].includes(t)
  ) && !tags.some((t) => ["stirred", "negroni-week"].includes(t));
  const isStirred =
    tags.some((t) => ["stirred", "dinner party", "negroni-week"].includes(t)) &&
    !isDigestif;

  if (isDigestif) return "digestif";
  if (isStirred) return "stirred";
  if (isLong) return "long";
  return "aperitivo";
}

menuRouter.get("/", (_req, res) => {
  const sections: MenuSection[] = [
    {
      id: "aperitivo",
      title: "Aperitivo",
      sub: "to begin the evening",
      note: "Start light — bitter's the key that unlocks the appetite.",
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
      id: "digestif",
      title: "Digestif",
      sub: "to close the evening",
      note: "A bitter, reflective end. Neat, on ice, or long.",
      items: [],
    },
  ];

  const sectionMap = Object.fromEntries(sections.map((s) => [s.id, s]));

  for (const recipe of recipes) {
    const sectionId = classifyRecipe(recipe);
    const section = sectionMap[sectionId];
    if (section && section.items.length < 6) {
      section.items.push({
        id: recipe.id,
        name: recipe.name,
        desc: recipe.description,
        occasion: recipe.occasion,
      });
    }
  }

  res.json({ sections });
});
