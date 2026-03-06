import { Type } from "@google/genai";
import { getShippingInfo, getProductById } from "../services/product";

export interface ShippingInfoArgs {
  topic?: string;
  productId?: string;
}

export function executeShippingInfo(args: ShippingInfoArgs): string {
  const shipping = getShippingInfo();

  const response: Record<string, any> = {};

  if (args.topic) {
    const topic = args.topic.toLowerCase();

    if (topic.includes("shipping") || topic.includes("delivery")) {
      response.shipping = {
        standardRate: shipping.standard,
        freeShipping: shipping.freeThreshold,
        deliveryTime: shipping.delivery,
        international: shipping.international,
      };
    }

    if (topic.includes("allergen") || topic.includes("allergy") || topic.includes("dietary")) {
      if (args.productId) {
        const product = getProductById(args.productId);
        if (product) {
          response.dietary = {
            product: product.name,
            allergens: product.allergens.length > 0 ? product.allergens : ["None listed"],
            isVegan: product.isVegan,
            isGlutenFree: product.isGlutenFree,
          };
        }
      } else {
        // Provide overview for all products
        response.dietary = {
          overview: "All Asterley Bros products are vegan and low in sugar.",
          glutenWarning: "BRITANNICA. (London Fernet) contains gluten from Chocolate Spelt Malt. All other products are gluten-free.",
          commonAllergens: "All products contain sulphites (naturally occurring in wine-based spirits).",
          recommendation: "If you have specific allergies, please ask about individual products.",
        };
      }
    }

    if (topic.includes("return") || topic.includes("refund")) {
      response.returns = {
        policy: "If you're not satisfied with your order, please contact us within 14 days of delivery.",
        contact: "Email hello@asterleybros.com with your order number.",
        note: "Due to the nature of alcoholic beverages, opened bottles cannot be returned unless faulty.",
      };
    }

    if (topic.includes("age") || topic.includes("underage") || topic.includes("legal")) {
      response.agePolicy = {
        minimumAge: "You must be 18 or over to purchase alcoholic beverages.",
        verification: "Age verification is required at checkout and upon delivery.",
        responsibility: "Please drink responsibly. drinkaware.co.uk",
      };
    }

    if (topic.includes("contact") || topic.includes("help") || topic.includes("support")) {
      response.contact = {
        email: "hello@asterleybros.com",
        location: "South London, UK",
        socialMedia: "Find us on Instagram @asterleybros",
      };
    }

    if (topic.includes("storage") || topic.includes("shelf life") || topic.includes("keep")) {
      response.storage = {
        vermouth: "Once opened, store in the fridge and consume within 3-4 weeks for best flavour.",
        spirits: "Britannica and Dispense can be stored at room temperature. No rush to finish, but best within 6 months of opening.",
        readyToDrink: "Keep the Rhubarb Negroni refrigerated. Best served well chilled.",
      };
    }
  }

  // Default to general shipping info if nothing specific matched
  if (Object.keys(response).length === 0) {
    response.shipping = {
      standardRate: shipping.standard,
      freeShipping: shipping.freeThreshold,
      deliveryTime: shipping.delivery,
      international: shipping.international,
    };
    response.contact = {
      email: "hello@asterleybros.com",
      location: "South London, UK",
    };
  }

  return JSON.stringify(response);
}

export const shippingInfoDeclaration = {
  name: "shipping_info",
  description:
    "Get shipping rates, delivery info, allergen/dietary information, returns policy, storage advice, age policy, or contact details. Use for any logistics or policy questions.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: {
        type: Type.STRING,
        description:
          "The topic to look up: 'shipping', 'allergen', 'dietary', 'returns', 'age', 'contact', 'storage', or a combination",
      },
      productId: {
        type: Type.STRING,
        description: "Optional product ID for product-specific allergen/dietary info",
      },
    },
  },
};
