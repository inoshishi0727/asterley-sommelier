import type { Product } from "../types";
import { config } from "../config";
import productCatalog from "../data/productCatalog.json";

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface ProductCache {
  products: Product[];
  fetchedAt: number;
}

let cache: ProductCache = {
  products: productCatalog as Product[],
  fetchedAt: 0,
};

const PRODUCTS_QUERY = `
  query Products {
    products(first: 50) {
      edges {
        node {
          id
          title
          description
          tags
          variants(first: 1) {
            edges {
              node {
                price { amount currencyCode }
                availableForSale
                id
              }
            }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
          onlineStoreUrl
        }
      }
    }
  }
`;

const TITLE_TO_ID: Record<string, string> = {
  "estate": "estate",
  "schofield": "schofields",
  "cunard": "cunard",
  "asterley original": "asterley-original",
  "dispense": "dispense",
  "britannica": "britannica",
  "rhubarb negroni": "rhubarb-negroni",
};

function titleToId(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, id] of Object.entries(TITLE_TO_ID)) {
    if (lower.includes(key)) return id;
  }
  return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function mapShopifyProduct(node: Record<string, unknown>): Product | null {
  try {
    const title = node.title as string;
    const variants = (node.variants as Record<string, unknown[]>).edges as { node: Record<string, unknown> }[];
    const variant = variants[0]?.node;
    if (!variant) return null;

    const price = variant.price as { amount: string; currencyCode: string };
    const images = (node.images as Record<string, unknown[]>).edges as { node: Record<string, string> }[];
    const image = images[0]?.node;

    // Find matching static product for non-Shopify fields (botanicals, tastingNotes, etc.)
    const id = titleToId(title);
    const staticProduct = (productCatalog as Product[]).find((p) => p.id === id);

    return {
      id,
      name: title,
      shortName: staticProduct?.shortName ?? title,
      category: staticProduct?.category ?? "aperitif",
      price: parseFloat(price.amount),
      currency: price.currencyCode,
      abv: staticProduct?.abv ?? null,
      volume: staticProduct?.volume ?? "",
      description: (node.description as string) || staticProduct?.description || "",
      tastingNotes: staticProduct?.tastingNotes ?? "",
      botanicals: staticProduct?.botanicals ?? [],
      servingSuggestions: staticProduct?.servingSuggestions ?? [],
      allergens: staticProduct?.allergens ?? [],
      isVegan: staticProduct?.isVegan ?? true,
      isGlutenFree: staticProduct?.isGlutenFree ?? true,
      shopifyVariantId: (variant.id as string) ?? staticProduct?.shopifyVariantId ?? "",
      imageUrl: image?.url ?? staticProduct?.imageUrl ?? "",
      productUrl: (node.onlineStoreUrl as string) ?? staticProduct?.productUrl ?? "",
      inStock: variant.availableForSale as boolean,
    };
  } catch (_) {
    return null;
  }
}

export async function refreshProductCache(): Promise<void> {
  if (!config.shopifyStoreDomain || !config.shopifyStorefrontToken) return;

  try {
    const res = await fetch(
      `https://${config.shopifyStoreDomain}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": config.shopifyStorefrontToken,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY }),
      }
    );

    if (!res.ok) {
      console.warn(`[shopifyClient] Storefront API returned ${res.status}`);
      return;
    }

    const json = (await res.json()) as {
      data?: { products?: { edges: { node: Record<string, unknown> }[] } };
      errors?: unknown[];
    };

    if (json.errors?.length) {
      console.warn("[shopifyClient] GraphQL errors:", json.errors);
      return;
    }

    const edges = json.data?.products?.edges ?? [];
    const products = edges
      .map((e) => mapShopifyProduct(e.node))
      .filter((p): p is Product => p !== null);

    if (!products.length) {
      console.warn("[shopifyClient] No products returned — keeping existing cache");
      return;
    }

    cache = { products, fetchedAt: Date.now() };
    console.log(`[shopifyClient] Cache refreshed — ${products.length} products`);
  } catch (err) {
    console.warn("[shopifyClient] Refresh failed:", (err as Error).message);
  }
}

export function getLiveProducts(): Product[] {
  return cache.products;
}

export function startShopifySync(): void {
  refreshProductCache().catch(() => {});
  setInterval(() => {
    refreshProductCache().catch(() => {});
  }, CACHE_TTL_MS);
}
