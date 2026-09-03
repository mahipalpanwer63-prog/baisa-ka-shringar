// ==========================================
// BAISA KA SHRINGAR - MAIN WEBSITE SCRIPT
// ==========================================

let cart = [];

// ==========================================
// DEFAULT CATEGORIES
// ==========================================

const categories = [
  { name: "हार", icon: "📿", count: "100+ डिज़ाइन" },
  { name: "कड़े", icon: "💍", count: "100+ डिज़ाइन" },
  { name: "अंगूठियाँ", icon: "💎", count: "100+ डिज़ाइन" },
  { name: "माथा पट्टी", icon: "👑", count: "100+ डिज़ाइन" },
  { name: "पायल", icon: "✨", count: "100+ डिज़ाइन" },
  { name: "नथ", icon: "🌸", count: "100+ डिज़ाइन" },
  { name: "गिफ्ट आइटम", icon: "🎁", count: "100+ डिज़ाइन" }
];

// ==========================================
// PRODUCTS
// ADMIN PANEL से PRODUCTS आएंगे
// ==========================================

let products = {
  "हार": [],
  "कड़े": [],
  "अंगूठियाँ": [],
  "माथा पट्टी": [],
  "पायल": [],
  "नथ": [],
  "गिफ्ट आइटम": []
};

// ==========================================
// ADMIN PANEL से PRODUCTS LOAD
// ==========================================

function loadAdminProducts() {

  const savedProducts = localStorage.getItem("baisaProducts");

  if (!savedProducts) {
    console.log("अभी कोई Admin Product नहीं मिला।");
    return;
  }

  try {

    const adminProducts = JSON.parse(savedProducts);

    if (Array.isArray(adminProducts)) {

      // सभी products को category के अनुसार लगाएं
      adminProducts.forEach(product => {

        if (!product.category) return;

        if (!products[product.category]) {
          products[product.category] = [];
        }

        products[product.category].push(product);

      });

    }

    else if (typeof adminProducts === "object") {

      products = {
        ...products,
        ...adminProducts
      };

    }

    console.log("Admin Products Loaded:", products);

  } catch (error) {

    console.error("Products load error:", error);

  }
}

// ==========================================
// CATEGORIES LOAD
// ==========================================

function loadCategories() {

  const categoryGrid = document.getElementById("categoryGrid");

  if (!categoryGrid) return;

  categoryGrid.innerHTML = "";

  categories.forEach(category => {

    const card = document.createElement("div");

    card.className = "category-card";

    card.innerHTML = `
      <div class="category-icon">
        ${category.icon}
      </div>

      <h3>${category.name}</h3>

      <p>${category.count}</p>
    `;

    card.addEventListener("click", function () {
      openCategory(category.name);
    });

    categoryGrid.appendChild(card);

  });

}

// ==========================================
// OPEN CATEGORY
// ==========================================

function openCategory(categoryName) {

  const title = document.getElementById("productTitle");

  if (title) {
    title.innerText = categoryName;
  }

  loadProducts(categoryName);

  const productSection = document.getElementById("products");

  if (productSection) {

    productSection.scrollIntoView({
      behavior: "smooth"
    });

  }

}

// ==========================================
// LOAD PRODUCTS
// ==========================================

function loadProducts(categoryName) {

  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  const list = products[categoryName] || [];

  productGrid.innerHTML = "";

  if (list.length === 0) {

    productGrid.innerHTML = `
      <div class="empty-products">

        <div>💎</div>

        <h3>${categoryName} के डिज़ाइन</h3>

        <p>
          इस कैटेगरी में अभी डिज़ाइन नहीं जोड़े गए हैं।
        </p>

      </div>
    `;

    return;

  }

  list.forEach(product => {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

      <img
        src="${product.image || ""}"
        alt="${product.name || "Jewellery"}"
        style="
          width:100%;
          height:240px;
          object-fit:cover;
          border-radius:12px;
        "
      >

      <div class="product-info">

        <h3>${product.name || "Jewellery"}</h3>

        <p>${product.material || ""}</p>

        <strong>
          ₹${product.price || "0"}
        </strong>

        <p>
          ${product.description || ""}
        </p>

        <button
          onclick="addToCart('${product.id}')"
        >
          🛒 कार्ट में डालें
        </button>

      </div>

    `;

    productGrid.appendChild(card);

  });

}

// ==========================================
// ALL PRODUCTS SHOW
// ==========================================

function loadAllProducts() {

  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  productGrid.innerHTML = "";

  let allProducts = [];

  Object.keys(products).forEach(category => {

    products[category].forEach(product => {

      allProducts.push(product);

    });

  });

  if (allProducts.length === 0) {

    productGrid.innerHTML = `
      <div class="empty-products">

        <div>💎</div>

        <h3>अभी कोई Product नहीं है</h3>

        <p>
          Admin Panel से Jewellery जोड़ें।
        </p>

      </div>
    `;

    return;

  }

  allProducts.forEach(product => {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

      <img
        src="${product.image || ""}"
        alt="${product.name || "Jewellery"}"
        style="
          width:100%;
          height:240px;
          object-fit:cover;
          border-radius:12px;
        "
      >

      <h3>${product.name || "Jewellery"}</h3>

      <p>${product.category || ""}</p>

      <p>${product.material || ""}</p>

      <strong>₹${product.price || "0"}</strong>

      <p>${product.description || ""}</p>

      <button onclick="addToCart('${product.id}')">
        🛒 कार्ट में डालें
      </button>

    `;

    productGrid.appendChild(card);

  });

}

// ==========================================
// CART
// ==========================================

function addToCart(productId) {

  let foundProduct = null;

  for (const category in products) {

    const item = products[category].find(
      product => String(product.id) === String(productId)
    );

    if (item) {

      foundProduct = item;
      break;

    }

  }

  if (!foundProduct) return;

  cart.push(foundProduct);

  updateCart();

  alert("आइटम कार्ट में जोड़ दिया गया।");

}

// ==========================================
// UPDATE CART
// ==========================================

function updateCart() {

  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.innerText = cart.length;
  }

  localStorage.setItem(
    "baisaCart",
    JSON.stringify(cart)
  );

}

// ==========================================
// LOAD CART
// ==========================================

function loadCart() {

  const savedCart = localStorage.getItem("baisaCart");

  if (savedCart) {

    try {

      cart = JSON.parse(savedCart);

    } catch (error) {

      cart = [];

    }

  }

  updateCart();

}

// ==========================================
// HOME
// ==========================================

function goHome() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

// ==========================================
// WEBSITE START
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // सबसे पहले Admin के products लाओ
  loadAdminProducts();

  // Categories बनाओ
  loadCategories();

  // Cart लाओ
  loadCart();

  // अगर product section मौजूद है
  // तो शुरुआत में सभी products दिखाओ
  loadAllProducts();

});
