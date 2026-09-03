// ================================
// BAISA KA SHRINGAR - MAIN SCRIPT
// ================================

let cart = [];


// ================================
// CATEGORY DATA
// ================================

const categories = [
  {
    name: "हार",
    icon: "📿",
    count: "100+ डिज़ाइन"
  },
  {
    name: "कड़े",
    icon: "💍",
    count: "100+ डिज़ाइन"
  },
  {
    name: "अंगूठियाँ",
    icon: "💎",
    count: "100+ डिज़ाइन"
  },
  {
    name: "माथा पट्टी",
    icon: "👑",
    count: "100+ डिज़ाइन"
  },
  {
    name: "पायल",
    icon: "✨",
    count: "100+ डिज़ाइन"
  },
  {
    name: "नथ",
    icon: "🌸",
    count: "100+ डिज़ाइन"
  },
  {
    name: "गिफ्ट आइटम",
    icon: "🎁",
    count: "100+ डिज़ाइन"
  }
];


// ================================
// LOAD CATEGORIES
// ================================

function loadCategories() {

  const categoryGrid = document.getElementById("categoryGrid");

  if (!categoryGrid) return;

  categoryGrid.innerHTML = "";

  categories.forEach((category, index) => {

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


// ================================
// OPEN CATEGORY
// ================================

function openCategory(categoryName) {

  const productSection = document.getElementById("products");

  if (productSection) {
    productSection.scrollIntoView({
      behavior: "smooth"
    });
  }

  const title = document.getElementById("productTitle");

  if (title) {
    title.innerText = categoryName;
  }

  loadProducts(categoryName);
}


// ================================
// PRODUCT DATA
// ================================

const products = {

  "हार": [],

  "कड़े": [],

  "अंगूठियाँ": [],

  "माथा पट्टी": [],

  "पायल": [],

  "नथ": [],

  "गिफ्ट आइटम": []

};


// ================================
// LOAD PRODUCTS
// ================================

function loadProducts(categoryName) {

  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  const list = products[categoryName] || [];

  productGrid.innerHTML = "";

  if (list.length === 0) {

    productGrid.innerHTML = `
      <div class="empty-products">

        <div>💎</div>

        <h3>
          ${categoryName} के डिज़ाइन
        </h3>

        <p>
          इस कैटेगरी में अभी डिज़ाइन जोड़े नहीं गए हैं।
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
        src="${product.image}"
        alt="${product.name}"
      >

      <h3>${product.name}</h3>

      <p>${product.material}</p>

      <strong>
        ₹${product.price}
      </strong>

      <button
        onclick="addToCart('${product.id}')"
      >
        कार्ट में डालें
      </button>

    `;

    productGrid.appendChild(card);

  });

}


// ================================
// CART
// ================================

function addToCart(productId) {

  let foundProduct = null;

  for (const category in products) {

    const item = products[category].find(
      product => product.id === productId
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


// ================================
// UPDATE CART
// ================================

function updateCart() {

  const cartCount =
    document.getElementById("cartCount");

  if (cartCount) {
    cartCount.innerText = cart.length;
  }

  localStorage.setItem(
    "baisaCart",
    JSON.stringify(cart)
  );

}


// ================================
// LOAD SAVED CART
// ================================

function loadCart() {

  const savedCart =
    localStorage.getItem("baisaCart");

  if (savedCart) {

    try {

      cart = JSON.parse(savedCart);

    } catch (error) {

      cart = [];

    }

  }

  updateCart();

}


// ================================
// HOME BUTTON
// ================================

function goHome() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ================================
// START WEBSITE
// ================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadCategories();

    loadCart();

  }
);
