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

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  occasion: string[];
  product?: MenuProduct;
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

  for (const recipe of getAllRecipes()) {
    const sectionId = classifyRecipe(recipe);
    const section = sectionMap[sectionId];
    if (section && section.items.length < 6) {
      const p = recipe.productIds?.[0] ? getProductById(recipe.productIds[0]) : undefined;
      section.items.push({
        id: recipe.id,
        name: recipe.name,
        desc: recipe.description,
        occasion: recipe.occasion,
        product: p ? {
          name: p.name,
          sub: p.shortName ?? p.name,
          price: `£${p.price.toFixed(2)}`,
          img: p.imageUrl ?? "",
          url: p.productUrl ?? "",
        } : undefined,
      });
    }
  }

  res.json({ sections: sections.filter((s) => s.items.length > 0) });
});
