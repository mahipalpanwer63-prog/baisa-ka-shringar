// ========================================
// BAISA KA SHRINGAR - MAIN WEBSITE SCRIPT
// ========================================

let cart = [];


// ========================================
// CATEGORIES
// ========================================

const defaultCategories = [
  {
    name: "हार",
    icon: "📿"
  },
  {
    name: "कड़े",
    icon: "💍"
  },
  {
    name: "अंगूठियाँ",
    icon: "💎"
  },
  {
    name: "माथा पट्टी",
    icon: "👑"
  },
  {
    name: "पायल",
    icon: "✨"
  },
  {
    name: "नथ",
    icon: "🌸"
  },
  {
    name: "गिफ्ट आइटम",
    icon: "🎁"
  }
];


// ========================================
// GET PRODUCTS FROM ADMIN PANEL
// ========================================

function getProducts() {

  try {

    const saved =
      localStorage.getItem("baisa_products");

    if (!saved) {
      return [];
    }

    const data = JSON.parse(saved);

    if (!Array.isArray(data)) {
      return [];
    }

    return data;

  } catch (error) {

    console.error(
      "Products load error:",
      error
    );

    return [];

  }
}


// ========================================
// GET CATEGORIES FROM ADMIN
// ========================================

function getCategories() {

  try {

    const saved =
      localStorage.getItem("baisa_categories");

    if (!saved) {
      return defaultCategories;
    }

    const names = JSON.parse(saved);

    if (!Array.isArray(names)) {
      return defaultCategories;
    }

    return names.map(name => {

      const old =
        defaultCategories.find(
          item => item.name === name
        );

      return {
        name: name,
        icon: old ? old.icon : "💎"
      };

    });

  } catch (error) {

    return defaultCategories;

  }

}


// ========================================
// LOAD CATEGORIES
// ========================================

function loadCategories() {

  const categoryGrid =
    document.getElementById("categoryGrid");

  if (!categoryGrid) return;

  const categories =
    getCategories();

  categoryGrid.innerHTML = "";

  categories.forEach(category => {

    const products =
      getProducts().filter(
        product =>
          product.category === category.name
      );

    const card =
      document.createElement("div");

    card.className =
      "category-card";

    card.innerHTML = `

      <div class="category-icon">
        ${category.icon}
      </div>

      <h3>
        ${escapeHTML(category.name)}
      </h3>

      <p>
        ${products.length} डिज़ाइन
      </p>

    `;

    card.addEventListener(
      "click",
      function () {

        openCategory(
          category.name
        );

      }
    );

    categoryGrid.appendChild(card);

  });

}


// ========================================
// OPEN CATEGORY
// ========================================

function openCategory(categoryName) {

  const productSection =
    document.getElementById("products");

  if (productSection) {

    productSection.scrollIntoView({
      behavior: "smooth"
    });

  }

  const title =
    document.getElementById(
      "productTitle"
    );

  if (title) {

    title.innerText =
      categoryName;

  }

  loadProducts(categoryName);

}


// ========================================
// LOAD PRODUCTS
// ========================================

function loadProducts(categoryName) {

  const productGrid =
    document.getElementById(
      "productGrid"
    );

  if (!productGrid) return;

  const allProducts =
    getProducts();

  const list =
    allProducts.filter(
      product =>
        product.category === categoryName
    );

  productGrid.innerHTML = "";

  if (list.length === 0) {

    productGrid.innerHTML = `

      <div class="empty-products">

        <div>💎</div>

        <h3>
          ${escapeHTML(categoryName)}
        </h3>

        <p>
          इस कैटेगरी में अभी कोई Design नहीं है।
        </p>

      </div>

    `;

    return;

  }


  list.forEach(product => {

    const card =
      document.createElement("div");

    card.className =
      "product-card";


    const metalText =
      product.metal === "Gold"
        ? "🥇 Gold"
        : "⚪ Silver";


    card.innerHTML = `

      <div
        class="product-image-wrap"
        onclick="openProduct(${product.id})"
        style="cursor:pointer;"
      >

        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          class="product-image"
        >

      </div>

      <div class="product-info">

        <h3 class="product-name">
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-meta">
          ${metalText}
        </p>

        <strong class="product-price">
          ₹${Number(product.price || 0)
            .toLocaleString("en-IN")}
        </strong>

        <p class="product-description">
          ${escapeHTML(
            product.description || ""
          )}
        </p>

        <button
          onclick="addToCart(${product.id})"
        >
          🛒 कार्ट में डालें
        </button>

      </div>

    `;

    productGrid.appendChild(card);

  });

}


// ========================================
// OPEN PRODUCT
// ========================================

function openProduct(productId) {

  const products =
    getProducts();

  const product =
    products.find(
      item =>
        String(item.id) ===
        String(productId)
    );

  if (!product) return;


  const metalText =
    product.metal === "Gold"
      ? "🥇 Gold"
      : "⚪ Silver";


  const modal =
    document.createElement("div");

  modal.className =
    "product-modal";


  modal.innerHTML = `

    <div
      class="product-modal-overlay"
      onclick="this.parentElement.remove()"
    ></div>

    <div class="product-modal-box">

      <button
        class="product-modal-close"
        onclick="this.parentElement.parentElement.remove()"
      >
        ✕
      </button>

      <img
        src="${product.image}"
        alt="${escapeHTML(product.name)}"
      >

      <h2>
        ${escapeHTML(product.name)}
      </h2>

      <p>
        ${metalText}
      </p>

      <h3>
        ₹${Number(product.price || 0)
          .toLocaleString("en-IN")}
      </h3>

      <p>
        ${escapeHTML(
          product.description ||
          "इस Product की जानकारी उपलब्ध नहीं है।"
        )}
      </p>

      <button
        onclick="addToCart(${product.id})"
      >
        🛒 कार्ट में डालें
      </button>

    </div>

  `;


  document.body.appendChild(modal);

}


// ========================================
// CART
// ========================================

function addToCart(productId) {

  const products =
    getProducts();

  const product =
    products.find(
      item =>
        String(item.id) ===
        String(productId)
    );

  if (!product) {

    alert(
      "Product नहीं मिला।"
    );

    return;

  }


  cart.push(product);

  updateCart();


  alert(
    "✅ आइटम कार्ट में जोड़ दिया गया।"
  );

}


// ========================================
// UPDATE CART
// ========================================

function updateCart() {

  const cartCount =
    document.getElementById(
      "cartCount"
    );

  if (cartCount) {

    cartCount.innerText =
      cart.length;

  }


  localStorage.setItem(
    "baisaCart",
    JSON.stringify(cart)
  );

}


// ========================================
// LOAD CART
// ========================================

function loadCart() {

  try {

    const saved =
      localStorage.getItem(
        "baisaCart"
      );

    if (saved) {

      const data =
        JSON.parse(saved);

      if (Array.isArray(data)) {

        cart = data;

      }

    }

  } catch (error) {

    cart = [];

  }

  updateCart();

}


// ========================================
// HOME
// ========================================

function goHome() {

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

  return String(value || "")

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ========================================
// ADD MODAL CSS
// ========================================

function addModalCSS() {

  if (
    document.getElementById(
      "productModalCSS"
    )
  ) return;


  const style =
    document.createElement("style");

  style.id =
    "productModalCSS";


  style.innerHTML = `

    .product-modal {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .product-modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,.65);
    }

    .product-modal-box {
      position: relative;
      z-index: 2;
      width: min(500px, 95%);
      max-height: 90vh;
      overflow-y: auto;
      background: white;
      border-radius: 18px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,.3);
    }

    .product-modal-box img {
      width: 100%;
      max-height: 420px;
      object-fit: contain;
      border-radius: 14px;
      background: #f7eee8;
    }

    .product-modal-box h2 {
      margin: 15px 0 8px;
    }

    .product-modal-box h3 {
      font-size: 24px;
      margin: 10px 0;
    }

    .product-modal-box button {
      border: none;
      background: #70002d;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 10px;
    }

    .product-modal-close {
      position: absolute;
      right: 12px;
      top: 12px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      background: white;
      color: #70002d;
      font-size: 18px;
      cursor: pointer;
      z-index: 5;
    }

  `;


  document.head.appendChild(style);

}


// ========================================
// START
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    addModalCSS();

    loadCategories();

    loadCart();

  }
);
