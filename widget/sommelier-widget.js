/**
 * Asterley Bros Online Sommelier — Chat Widget
 * Standalone Web Component (<asterley-sommelier>)
 */

class AsterleySommelier extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
    this._sessionId = localStorage.getItem("ab-session-id") || null;
    this._messages = [];
    this._isLoading = false;
  }

  static get observedAttributes() {
    return ["api-url"];
  }

  get apiUrl() {
    return this.getAttribute("api-url") || "";
  }

  connectedCallback() {
    this._render();
    this._bindEvents();
    // Show welcome message
    this._addBotMessage({
      message:
        "Welcome to Asterley Bros! I'm your personal sommelier — here to help you discover our handcrafted vermouths, amari, and aperitifs. What brings you in today?",
      productCards: [],
      recipeCards: [],
      suggestedActions: [
        { label: "What do you make?", type: "question", value: "What products do you offer?" },
        { label: "Help me choose", type: "question", value: "I'm not sure what to pick — can you help me choose?" },
        { label: "Cocktail ideas", type: "question", value: "What cocktails can I make with your products?" },
      ],
    });
  }

  _render() {
    const css = fetch(new URL("sommelier-widget.css", import.meta.url).href)
      .then((r) => r.text())
      .catch(() => "");

    // Inline styles as fallback, load external CSS async
    this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      </style>
      <link rel="stylesheet" href="${new URL("sommelier-widget.css", import.meta.url).href}">

      <!-- Chat Bubble -->
      <button class="ab-bubble" aria-label="Open chat" id="bubble">
        <svg class="ab-icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm0 15.17L18.83 16H4V4h16v13.17z"/>
          <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
        </svg>
        <svg class="ab-icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      <!-- Chat Panel -->
      <div class="ab-panel" id="panel">
        <!-- Header -->
        <div class="ab-header">
          <div class="ab-header-avatar">AB</div>
          <div class="ab-header-info">
            <h3>Asterley Sommelier</h3>
            <p>Bold British Botanical Spirits</p>
          </div>
        </div>

        <!-- Messages -->
        <div class="ab-messages" id="messages"></div>

        <!-- Input -->
        <div class="ab-input-area">
          <textarea
            class="ab-input"
            id="input"
            placeholder="Ask me about our spirits, cocktails, or gifts..."
            rows="1"
          ></textarea>
          <button class="ab-send" id="send" aria-label="Send message">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    const bubble = this.shadowRoot.getElementById("bubble");
    const input = this.shadowRoot.getElementById("input");
    const send = this.shadowRoot.getElementById("send");

    bubble.addEventListener("click", () => this._toggle());

    send.addEventListener("click", () => this._sendMessage());

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this._sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 80) + "px";
    });
  }

  _toggle() {
    this._isOpen = !this._isOpen;
    const bubble = this.shadowRoot.getElementById("bubble");
    const panel = this.shadowRoot.getElementById("panel");

    bubble.classList.toggle("ab-open", this._isOpen);
    panel.classList.toggle("ab-visible", this._isOpen);

    if (this._isOpen) {
      setTimeout(() => {
        this.shadowRoot.getElementById("input")?.focus();
      }, 300);
    }
  }

  async _sendMessage() {
    const input = this.shadowRoot.getElementById("input");
    const text = input.value.trim();
    if (!text || this._isLoading) return;

    input.value = "";
    input.style.height = "auto";

    // Add user message
    this._addUserMessage(text);

    // Show typing indicator
    this._showTyping();

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: this._sessionId,
          message: text,
          pageContext: this._getPageContext(),
        }),
      });

      this._hideTyping();

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      this._sessionId = data.sessionId;
      localStorage.setItem("ab-session-id", data.sessionId);

      this._addBotMessage(data);
    } catch (err) {
      this._hideTyping();
      this._addBotMessage({
        message:
          "Sorry, I'm having trouble connecting right now. Please try again in a moment, or email us at hello@asterleybros.com.",
        productCards: [],
        recipeCards: [],
        suggestedActions: [
          { label: "Try again", type: "question", value: text },
        ],
      });
    }
  }

  _getPageContext() {
    try {
      const context = { currentUrl: window.location.href };

      // Try to detect Shopify cart
      if (typeof window.Shopify !== "undefined") {
        // Will be enriched by Shopify theme integration
        return context;
      }

      return context;
    } catch {
      return {};
    }
  }

  _addUserMessage(text) {
    const container = this.shadowRoot.getElementById("messages");
    const div = document.createElement("div");
    div.className = "ab-msg ab-msg-user";
    div.textContent = text;
    container.appendChild(div);
    this._scrollToBottom();
  }

  _addBotMessage(data) {
    const container = this.shadowRoot.getElementById("messages");

    // Text message
    if (data.message) {
      const div = document.createElement("div");
      div.className = "ab-msg ab-msg-bot";
      div.innerHTML = this._formatText(data.message);
      container.appendChild(div);
    }

    // Product cards
    if (data.productCards && data.productCards.length > 0) {
      const cardsDiv = document.createElement("div");
      cardsDiv.className = "ab-product-cards";
      data.productCards.forEach((card) => {
        cardsDiv.appendChild(this._createProductCard(card));
      });
      container.appendChild(cardsDiv);
    }

    // Recipe cards
    if (data.recipeCards && data.recipeCards.length > 0) {
      const recipesDiv = document.createElement("div");
      recipesDiv.className = "ab-recipe-cards";
      data.recipeCards.forEach((card) => {
        recipesDiv.appendChild(this._createRecipeCard(card));
      });
      container.appendChild(recipesDiv);
    }

    // Suggestion chips
    if (data.suggestedActions && data.suggestedActions.length > 0) {
      const chipsDiv = document.createElement("div");
      chipsDiv.className = "ab-suggestions";
      data.suggestedActions.forEach((action) => {
        const chip = document.createElement("button");
        chip.className = "ab-chip";
        chip.textContent = action.label;
        chip.addEventListener("click", () => this._handleAction(action));
        chipsDiv.appendChild(chip);
      });
      container.appendChild(chipsDiv);
    }

    this._scrollToBottom();
  }

  _createProductCard(card) {
    const div = document.createElement("div");
    div.className = "ab-product-card";

    const meta = [
      card.abv ? `${card.abv}% ABV` : null,
      card.volume,
      `£${typeof card.price === "number" ? card.price.toFixed(2) : card.price}`,
    ]
      .filter(Boolean)
      .join(" · ");

    const imgHtml = card.imageUrl && card.imageUrl.startsWith("http")
      ? `<img class="ab-product-card-img" src="${this._escapeHtml(card.imageUrl)}" alt="${this._escapeHtml(card.name)}">`
      : `<div class="ab-product-card-img">${(card.name || "A")[0]}</div>`;

    div.innerHTML = `
      ${imgHtml}
      <div class="ab-product-card-info">
        <h4>${this._escapeHtml(card.name)}</h4>
        <div class="ab-meta">${this._escapeHtml(meta)}</div>
        <div class="ab-desc">${this._escapeHtml(card.description || "")}</div>
        <button class="ab-btn-cart" data-variant="${this._escapeHtml(card.shopifyVariantId || "")}">Add to Cart</button>
      </div>
    `;

    const btn = div.querySelector(".ab-btn-cart");
    btn.addEventListener("click", () => this._addToCart(card));

    return div;
  }

  _createRecipeCard(card) {
    const div = document.createElement("div");
    div.className = "ab-recipe-card";

    const ingredientsHtml = (card.ingredients || [])
      .map((i) => {
        const cls = i.isAsterleyProduct ? ' class="ab-asterley"' : "";
        return `<li${cls}>${this._escapeHtml(i.amount)}${this._escapeHtml(i.unit)} ${this._escapeHtml(i.item)}</li>`;
      })
      .join("");

    const methodHtml = (card.method || [])
      .map((step) => `<li>${this._escapeHtml(step)}</li>`)
      .join("");

    div.innerHTML = `
      <h4>${this._escapeHtml(card.name)}</h4>
      <div class="ab-recipe-desc">${this._escapeHtml(card.description || "")}</div>
      <ul class="ab-recipe-ingredients">${ingredientsHtml}</ul>
      <ol class="ab-recipe-method">${methodHtml}</ol>
      <div class="ab-recipe-footer">${this._escapeHtml(card.glassware || "")} · Garnish: ${this._escapeHtml(card.garnish || "none")}</div>
    `;

    return div;
  }

  _handleAction(action) {
    switch (action.type) {
      case "question":
        // Set input and send
        const input = this.shadowRoot.getElementById("input");
        input.value = action.value;
        this._sendMessage();
        break;
      case "link":
        window.open(action.value, "_blank");
        break;
      case "add_to_cart":
        this._addToCart({ shopifyVariantId: action.value });
        break;
    }
  }

  async _addToCart(product) {
    try {
      // Shopify Ajax Cart API
      const res = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.shopifyVariantId,
          quantity: 1,
        }),
      });

      if (res.ok) {
        this._addBotMessage({
          message: `Added ${product.name || "item"} to your cart! Shall I suggest anything else to go with it?`,
          productCards: [],
          recipeCards: [],
          suggestedActions: [
            { label: "View cart", type: "link", value: "/cart" },
            { label: "Suggest a pairing", type: "question", value: "What pairs well with what I just added?" },
          ],
        });
      } else {
        throw new Error("Cart API error");
      }
    } catch {
      // Not on Shopify or cart API unavailable
      this._addBotMessage({
        message: `Great choice! To add this to your cart, visit the product page directly.`,
        productCards: [],
        recipeCards: [],
        suggestedActions: [
          {
            label: "View on site",
            type: "link",
            value: product.productUrl || "https://asterleybros.com/collections/all",
          },
        ],
      });
    }
  }

  _showTyping() {
    this._isLoading = true;
    const container = this.shadowRoot.getElementById("messages");
    const send = this.shadowRoot.getElementById("send");
    send.disabled = true;

    const typing = document.createElement("div");
    typing.className = "ab-typing";
    typing.id = "typing";
    typing.innerHTML = `
      <div class="ab-typing-dot"></div>
      <div class="ab-typing-dot"></div>
      <div class="ab-typing-dot"></div>
    `;
    container.appendChild(typing);
    this._scrollToBottom();
  }

  _hideTyping() {
    this._isLoading = false;
    const typing = this.shadowRoot.getElementById("typing");
    const send = this.shadowRoot.getElementById("send");
    send.disabled = false;
    if (typing) typing.remove();
  }

  _scrollToBottom() {
    const container = this.shadowRoot.getElementById("messages");
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
  }

  _formatText(text) {
    // Basic markdown-like formatting
    return this._escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  _escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }
}

customElements.define("asterley-sommelier", AsterleySommelier);
