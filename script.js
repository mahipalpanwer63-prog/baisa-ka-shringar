// ======================================================
// BAISA KA SHRINGAR - MAIN WEBSITE SCRIPT
// Admin Panel से Products पढ़कर Website पर दिखाएगा
// ======================================================

let cart = [];


// ======================================================
// CATEGORIES
// ======================================================

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


// ======================================================
// GET ADMIN PRODUCTS
// ======================================================

function getAdminProducts() {

  const possibleKeys = [
    "baisaProducts",
    "products",
    "baisaProductData",
    "jewelleryProducts",
    "baisaProductsData"
  ];

  for (const key of possibleKeys) {

    const saved = localStorage.getItem(key);

    if (!saved) continue;

    try {

      const data = JSON.parse(saved);

      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === "object") {

        let allProducts = [];

        Object.keys(data).forEach(category => {

          if (Array.isArray(data[category])) {

            data[category].forEach(product => {

              allProducts.push({
                ...product,
                category:
                  product.category || category
              });

            });

          }

        });

        if (allProducts.length > 0) {
          return allProducts;
        }

      }

    } catch (error) {

      console.log(
        "Product data read error:",
        key,
        error
      );

    }

  }

  return [];
}


// ======================================================
// NORMALIZE PRODUCTS
// ======================================================

function getProductsByCategory(categoryName) {

  const adminProducts = getAdminProducts();

  return adminProducts.filter(product => {

    const category =
      product.category ||
      product.categoryName ||
      product.type ||
      "";

    return String(category).trim() ===
      String(categoryName).trim();

  });

}


// ======================================================
// LOAD CATEGORIES
// ======================================================

function loadCategories() {

  const categoryGrid =
    document.getElementById("categoryGrid");

  if (!categoryGrid) return;

  categoryGrid.innerHTML = "";

  defaultCategories.forEach(category => {

    const products =
      getProductsByCategory(category.name);

    const count =
      products.length > 0
        ? products.length + "+ डिज़ाइन"
        : "50+ डिज़ाइन";

    const card =
      document.createElement("div");

    card.className = "category-card";

    card.innerHTML = `

      <div class="category-icon">
        ${category.icon}
      </div>

      <h3>
        ${category.name}
      </h3>

      <p>
        ${count}
      </p>

    `;

    card.addEventListener(
      "click",
      function () {

        openCategory(category.name);

      }
    );

    categoryGrid.appendChild(card);

  });

}


// ======================================================
// OPEN CATEGORY
// ======================================================

function openCategory(categoryName) {

  const productSection =
    document.getElementById("products");

  if (productSection) {

    productSection.scrollIntoView({
      behavior: "smooth"
    });

  }

  const title =
    document.getElementById("productTitle");

  if (title) {

    title.innerText =
      categoryName;

  }

  loadProducts(categoryName);

}


// ======================================================
// LOAD PRODUCTS
// ======================================================

function loadProducts(categoryName) {

  const productGrid =
    document.getElementById("productGrid");

  if (!productGrid) return;

  const list =
    getProductsByCategory(categoryName);

  productGrid.innerHTML = "";


  // ----------------------------------------------------
  // NO PRODUCTS
  // ----------------------------------------------------

  if (list.length === 0) {

    productGrid.innerHTML = `

      <div class="empty-products">

        <div style="font-size:50px;">
          💎
        </div>

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


  // ----------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------

  list.forEach(product => {

    const card =
      document.createElement("div");

    card.className =
      "product-card";


    const image =
      product.image ||
      product.photo ||
      product.photoUrl ||
      product.imageUrl ||
      "";


    const name =
      product.name ||
      product.title ||
      "सुंदर आभूषण";


    const material =
      product.material ||
      product.metal ||
      "Premium Jewellery";


    const price =
      product.price ||
      "0";


    const id =
      product.id ||
      product.productId ||
      Date.now();


    card.innerHTML = `

      <div class="product-image">

        ${
          image
            ? `
              <img
                src="${image}"
                alt="${name}"
                loading="lazy"
              >
            `
            : `
              <div
                style="
                  height:220px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size:60px;
                "
              >
                💎
              </div>
            `
        }

      </div>


      <div class="product-info">

        <h3>
          ${name}
        </h3>

        <p>
          ${material}
        </p>

        <strong>
          ₹${price}
        </strong>

        <div class="product-buttons">

          <button
            onclick="viewProduct('${id}')"
          >
            देखें
          </button>

          <button
            onclick="addToCart('${id}')"
          >
            कार्ट में डालें
          </button>

        </div>

      </div>

    `;


    productGrid.appendChild(card);

  });

}


// ======================================================
// FIND SINGLE PRODUCT
// ======================================================

function findProduct(productId) {

  const allProducts =
    getAdminProducts();

  return allProducts.find(product => {

    return String(
      product.id ||
      product.productId
    ) === String(productId);

  });

}


// ======================================================
// VIEW PRODUCT
// ======================================================

function viewProduct(productId) {

  const product =
    findProduct(productId);

  if (!product) {

    alert(
      "Product नहीं मिला।"
    );

    return;

  }


  const image =
    product.image ||
    product.photo ||
    product.photoUrl ||
    product.imageUrl ||
    "";


  const name =
    product.name ||
    product.title ||
    "सुंदर आभूषण";


  const material =
    product.material ||
    product.metal ||
    "Premium Jewellery";


  const price =
    product.price ||
    "0";


  // ----------------------------------------------------
  // PRODUCT MODAL
  // ----------------------------------------------------

  let modal =
    document.getElementById(
      "productModal"
    );


  if (!modal) {

    modal =
      document.createElement("div");

    modal.id =
      "productModal";


    modal.style.cssText = `

      position:fixed;
      inset:0;
      background:rgba(0,0,0,.65);
      z-index:99999;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;

    `;


    document.body.appendChild(modal);

  }


  modal.innerHTML = `

    <div
      style="
        background:#fff;
        width:100%;
        max-width:500px;
        max-height:90vh;
        overflow:auto;
        border-radius:18px;
        padding:20px;
        position:relative;
      "
    >

      <button
        onclick="
          document.getElementById('productModal').remove()
        "
        style="
          position:absolute;
          right:15px;
          top:15px;
          width:35px;
          height:35px;
          border:0;
          border-radius:50%;
          cursor:pointer;
          font-size:20px;
        "
      >
        ×
      </button>


      ${
        image
          ? `
            <img
              src="${image}"
              alt="${name}"
              style="
                width:100%;
                max-height:400px;
                object-fit:contain;
                border-radius:12px;
              "
            >
          `
          : `
            <div
              style="
                height:300px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:80px;
              "
            >
              💎
            </div>
          `
      }


      <h2>
        ${name}
      </h2>


      <p>
        ${material}
      </p>


      <h2>
        ₹${price}
      </h2>


      ${
        product.description
          ? `
            <p>
              ${product.description}
            </p>
          `
          : ""
      }


      <button
        onclick="
          addToCart('${product.id || product.productId}');
          document.getElementById('productModal').remove();
        "
        style="
          width:100%;
          padding:14px;
          border:0;
          border-radius:10px;
          background:#800020;
          color:white;
          font-size:16px;
          cursor:pointer;
        "
      >
        🛒 कार्ट में डालें
      </button>

    </div>

  `;

}


// ======================================================
// CART
// ======================================================

function addToCart(productId) {

  const product =
    findProduct(productId);

  if (!product) {

    alert(
      "Product नहीं मिला।"
    );

    return;

  }


  cart.push(product);

  updateCart();


  alert(
    "आइटम कार्ट में जोड़ दिया गया।"
  );

}


// ======================================================
// UPDATE CART
// ======================================================

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


// ======================================================
// LOAD CART
// ======================================================

function loadCart() {

  const savedCart =
    localStorage.getItem(
      "baisaCart"
    );


  if (savedCart) {

    try {

      cart =
        JSON.parse(savedCart);

      if (!Array.isArray(cart)) {

        cart = [];

      }

    } catch (error) {

      cart = [];

    }

  }


  updateCart();

}


// ======================================================
// HOME
// ======================================================

function goHome() {

  window.scrollTo({

    top:0,

    behavior:"smooth"

  });

}


// ======================================================
// PHOTO PREVIEW
// ======================================================

function setupPhotoUpload() {

  const productPhoto =
    document.getElementById(
      "productPhoto"
    );


  const photoPreview =
    document.getElementById(
      "photoPreview"
    );


  if (
    !productPhoto ||
    !photoPreview
  ) {

    return;

  }


  productPhoto.addEventListener(
    "change",
    function () {

      const file =
        this.files[0];


      if (!file) {

        photoPreview.style.display =
          "none";

        return;

      }


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "कृपया केवल फोटो चुनें।"
        );

        this.value = "";

        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        function (event) {

          photoPreview.src =
            event.target.result;

          photoPreview.style.display =
            "block";

        };


      reader.readAsDataURL(file);

    }
  );

}


// ======================================================
// REFRESH PRODUCTS
// ======================================================

function refreshProducts() {

  const title =
    document.getElementById(
      "productTitle"
    );


  if (title && title.innerText) {

    loadProducts(
      title.innerText
    );

  }

}


// ======================================================
// START WEBSITE
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadCategories();

    loadCart();

    setupPhotoUpload();

  }
);
