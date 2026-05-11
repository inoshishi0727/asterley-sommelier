import { getAllProducts, searchProducts } from "../services/product";

export interface AddToCartArgs {
  productId?: string;
  productName?: string;
  quantity?: number;
}

export function executeAddToCart(args: AddToCartArgs): string {
  const qty = Math.max(1, Math.floor(args.quantity ?? 1));
  const products = getAllProducts();

  let product = args.productId
    ? products.find(p => p.id === args.productId)
    : undefined;

  if (!product && args.productName) {
    const results = searchProducts(args.productName);
    product = results[0];
  }

  if (!product) {
    return JSON.stringify({ success: false, error: "Product not found." });
  }

  if (!product.inStock) {
    return JSON.stringify({
      success: false,
      error: `${product.name} is currently out of stock.`,
      productUrl: product.productUrl,
    });
  }

  // Subscriptions and experiences must go through their product page
  if (product.category === "subscription" || product.category === "experience") {
    return JSON.stringify({
      success: false,
      error: `${product.name} must be purchased on the product page.`,
      productUrl: product.productUrl,
    });
  }

  return JSON.stringify({
    success: true,
    autoAdd: true,
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      abv: product.abv,
      volume: product.volume,
      description: product.tastingNotes || product.description,
      imageUrl: product.imageUrl,
      shopifyVariantId: product.shopifyVariantId,
      productUrl: product.productUrl,
      allergens: product.allergens ?? [],
    },
    quantity: qty,
  });
}

export const addToCartDeclaration = {
  name: "add_to_cart",
  description:
    "Add a product directly to the customer's Shopify cart. Call this when the customer explicitly asks to add something to their cart. The widget executes the add automatically — you do NOT need to tell the customer to click anything.",
  input_schema: {
    type: "object" as const,
    properties: {
      productId: {
        type: "string",
        description:
          "The product ID (e.g. 'estate', 'schofields', 'britannica', 'cunard', 'asterley-original', 'dispense', 'rhubarb-negroni'). Prefer this over productName when you know it.",
      },
      productName: {
        type: "string",
        description: "Product name, if the ID is not known.",
      },
      quantity: {
        type: "number",
        description: "Quantity to add (default: 1).",
      },
    },
  },
};
