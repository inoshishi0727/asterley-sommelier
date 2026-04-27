import type { Recipe, Ingredient } from "../types";
import recipesData from "../data/recipes.json";

const BLOG_URL = "https://asterleybros.com/blogs/cocktail-recipes";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface RecipeCache {
  recipes: Recipe[];
  fetchedAt: number;
}

let cache: RecipeCache = {
  recipes: recipesData as Recipe[],
  fetchedAt: 0,
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractText(html: string, selector: RegExp): string {
  const m = html.match(selector);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
}

function parseIngredients(html: string): Ingredient[] {
  // Find "Ingredients" h2 section
  const ingSection = html.match(
    /<h2[^>]*>[^<]*[Ii]ngredients[^<]*<\/h2>([\s\S]*?)(?=<h[23]|$)/
  );
  if (!ingSection) return [];

  const listItems = ingSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
  const amountRe =
    /^(\d+(?:\.\d+)?\s*(?:ml|cl|dashes?|dash|tsp|tbsp|oz|g|sprig|slice|wedge|wheel|peel|twist|cube|half|whole|large|small|fresh|piece|strip)?(?:\s+of)?)\s*/i;

  return listItems
    .map((li) => {
      const text = li.replace(/<[^>]+>/g, "").trim();
      const isGarnish =
        text.toLowerCase().includes("garnish") ||
        text.toLowerCase().includes("(to serve)");
      const amountMatch = text.match(amountRe);
      const amount = amountMatch ? amountMatch[1].trim() : "";
      const item = text.replace(amountRe, "").trim();

      const asterleyKeywords = [
        "estate",
        "schofield",
        "cunard",
        "asterley original",
        "dispense",
        "britannica",
      ];
      const isAsterleyProduct = asterleyKeywords.some((k) =>
        item.toLowerCase().includes(k)
      );

      // Split amount into value + unit
      const valMatch = amount.match(/^([\d.]+)\s*(.*)$/);
      const amountVal = valMatch ? valMatch[1] : amount;
      const unit = valMatch ? valMatch[2].trim() : "ml";

      return {
        item: item || text,
        amount: amountVal || "1",
        unit: unit || "ml",
        isAsterleyProduct,
        _isGarnish: isGarnish,
      };
    })
    .filter((i) => i.item)
    .map(({ _isGarnish: _g, ...rest }) => rest) as Ingredient[];
}

function parseMethod(html: string): string[] {
  const steps: string[] = [];

  // Try h3 Step pattern first
  const stepRe = /<h3[^>]*>[^<]*[Ss]tep[^<]*<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = stepRe.exec(html)) !== null) {
    steps.push(m[1].replace(/<[^>]+>/g, "").trim());
  }
  if (steps.length) return steps;

  // Fallback: ol/li method list
  const methodSection = html.match(
    /<h2[^>]*>[^<]*[Mm]ethod[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/
  );
  if (methodSection) {
    const items = methodSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
    items.forEach((li) => {
      const t = li.replace(/<[^>]+>/g, "").trim();
      if (t) steps.push(t);
    });
  }
  return steps;
}

function parseOccasion(html: string): string[] {
  // JSON-LD keywords
  const ldMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  if (ldMatch) {
    try {
      const ld = JSON.parse(ldMatch[1]);
      const kw: string = ld.keywords || "";
      if (kw) return kw.split(",").map((k: string) => k.trim().toLowerCase()).filter(Boolean);
    } catch (_) {}
  }
  return [];
}

function parseGlassware(method: string[]): string {
  const text = method.join(" ").toLowerCase();
  const patterns = [
    /(\w[\w\s]+glass)/i,
    /\b(coupe)\b/i,
    /\b(highball)\b/i,
    /\b(tumbler)\b/i,
    /\b(copper mug)\b/i,
    /\b(wine glass)\b/i,
    /\b(collins glass)\b/i,
    /\b(snifter)\b/i,
    /\b(martini glass)\b/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1);
  }
  return "Glass";
}

function parseGarnish(ingredients: Ingredient[], method: string[]): string {
  // Find garnish in ingredients
  const rawHtml = ingredients.map((i) => i.item).join(" ");
  const garnishIng = rawHtml.match(/([^,]+(?:twist|peel|wheel|slice|wedge|sprig|ribbon|flower|strip)[^,]*)/i);
  if (garnishIng) return garnishIng[1].trim();

  // Last method step often mentions garnish
  const last = method[method.length - 1] || "";
  const m = last.match(/garnish with ([^.]+)/i);
  if (m) return m[1].trim();
  return "None";
}

function deriveProductIds(ingredients: Ingredient[]): string[] {
  const map: Record<string, string> = {
    estate: "estate",
    "schofield": "schofields",
    cunard: "cunard",
    "asterley original": "asterley-original",
    dispense: "dispense",
    britannica: "britannica",
  };
  const ids: string[] = [];
  for (const ing of ingredients) {
    if (!ing.isAsterleyProduct) continue;
    const lower = ing.item.toLowerCase();
    for (const [key, id] of Object.entries(map)) {
      if (lower.includes(key) && !ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}

async function fetchRecipeFromPage(slug: string): Promise<Recipe | null> {
  try {
    const res = await fetch(`${BLOG_URL}/${slug}`);
    if (!res.ok) return null;
    const html = await res.text();

    const name = extractText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (!name) return null;

    // Description: first <p> after main content area
    const descMatch = html.match(
      /class="[^"]*rte[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/
    );
    const description = descMatch
      ? descMatch[1].replace(/<[^>]+>/g, "").trim()
      : "";

    const ingredients = parseIngredients(html);
    const method = parseMethod(html);
    const occasion = parseOccasion(html);
    const glassware = parseGlassware(method);
    const garnish = parseGarnish(ingredients, method);
    const productIds = deriveProductIds(ingredients);

    // difficulty heuristic
    const difficulty =
      method.length > 4 || ingredients.length > 5
        ? "medium"
        : ("easy" as Recipe["difficulty"]);

    return {
      id: slugify(name),
      name,
      description,
      productIds,
      ingredients,
      method,
      glassware,
      garnish,
      occasion,
      difficulty,
    };
  } catch (_) {
    return null;
  }
}

async function fetchAllSlugs(): Promise<string[]> {
  const slugs = new Set<string>();
  const linkRe = /href="\/blogs\/cocktail-recipes\/([^"?#]+)"/g;
  const nextRe = /<link[^>]+rel="next"[^>]+href="([^"]+)"/;

  let url: string | null = BLOG_URL;
  while (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Listing page returned ${res.status}`);
    const html = await res.text();

    let m: RegExpExecArray | null;
    linkRe.lastIndex = 0;
    while ((m = linkRe.exec(html)) !== null) {
      const slug = m[1];
      if (slug && slug !== "cocktail-recipes") slugs.add(slug);
    }

    const nextMatch = nextRe.exec(html);
    url = nextMatch ? `https://asterleybros.com${nextMatch[1]}` : null;
  }

  return [...slugs];
}

export async function refreshRecipeCache(): Promise<void> {
  try {
    const slugs = await fetchAllSlugs();
    if (!slugs.length) {
      console.warn("[recipeScraper] No recipe slugs found — keeping existing cache");
      return;
    }

    const results = await Promise.allSettled(slugs.map(fetchRecipeFromPage));
    const recipes = results
      .filter(
        (r): r is PromiseFulfilledResult<Recipe> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);

    if (recipes.length === 0) {
      console.warn("[recipeScraper] Scraper returned 0 recipes — keeping existing cache");
      return;
    }

    cache = { recipes, fetchedAt: Date.now() };
    console.log(`[recipeScraper] Cache refreshed — ${recipes.length} recipes`);
  } catch (err) {
    console.warn("[recipeScraper] Refresh failed:", (err as Error).message);
  }
}

export function getScrapedRecipes(): Recipe[] {
  return cache.recipes;
}

export function startRecipeScraper(): void {
  // Initial fetch (non-blocking)
  refreshRecipeCache().catch(() => {});
  // Refresh every hour
  setInterval(() => {
    refreshRecipeCache().catch(() => {});
  }, CACHE_TTL_MS);
}
