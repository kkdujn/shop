const params = new URLSearchParams(location.search);
const product = getProductById(params.get("id"));

let selectedSize = null;
let selectedColor = null;

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
}

function updateSeoTags() {
  if (!product) return;

  const title = `${product.name} - SHOP`;
  const description = `${product.name} (${formatPrice(product.price)}) - ${product.category} 카테고리. 사이즈 ${product.sizes.join("/")}, 색상 ${product.colors.join("/")} 중 선택할 수 있습니다.`;
  const url = `https://shop-eight-beta-51.vercel.app/product.html?id=${product.id}`;

  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageDescription").setAttribute("content", description);
  document.getElementById("pageCanonical").setAttribute("href", url);
  document.getElementById("ogTitle").setAttribute("content", title);
  document.getElementById("ogDescription").setAttribute("content", description);
  document.getElementById("ogUrl").setAttribute("content", url);
  document.getElementById("ogImage").setAttribute("content", product.thumbnail);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.thumbnail,
    category: product.category,
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "KRW",
      price: product.price,
      availability: product.soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url,
    },
  };
  document.getElementById("productJsonLd").textContent = JSON.stringify(jsonLd);
}

function renderProduct() {
  const main = document.getElementById("productMain");
  if (!product) {
    main.innerHTML = `<div class="empty-state">상품을 찾을 수 없습니다.<br/><a href="index.html">목록으로 돌아가기</a></div>`;
    return;
  }

  main.innerHTML = `
    <div class="detail-layout">
      <img src="${product.thumbnail}" alt="${product.name}" />
      <div class="detail-info">
        <h1>${product.name}</h1>
        <p class="price">${formatPrice(product.price)}</p>

        <div class="option-group">
          <div class="label">사이즈</div>
          <div class="option-pills" id="sizePills">
            ${product.sizes
              .map((s) => `<button data-size="${s}">${s}</button>`)
              .join("")}
          </div>
        </div>

        <div class="option-group">
          <div class="label">색상</div>
          <div class="option-pills" id="colorPills">
            ${product.colors
              .map((c) => `<button data-color="${c}">${c}</button>`)
              .join("")}
          </div>
        </div>

        ${product.soldOut ? '<p style="color:#e53935;font-weight:600;">현재 품절된 상품입니다.</p>' : ""}

        <button class="primary-btn" id="addToCartBtn" ${product.soldOut ? "disabled" : ""}>
          ${product.soldOut ? "품절" : "장바구니에 담기"}
        </button>
      </div>
    </div>
  `;

  if (product.soldOut) return;

  const sizePills = document.querySelectorAll("#sizePills button");
  const colorPills = document.querySelectorAll("#colorPills button");
  const addBtn = document.getElementById("addToCartBtn");

  function refreshAddBtn() {
    addBtn.disabled = !(selectedSize && selectedColor);
  }

  sizePills.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      sizePills.forEach((b) => b.classList.toggle("selected", b === btn));
      refreshAddBtn();
    });
  });

  colorPills.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedColor = btn.dataset.color;
      colorPills.forEach((b) => b.classList.toggle("selected", b === btn));
      refreshAddBtn();
    });
  });

  refreshAddBtn();

  addBtn.addEventListener("click", () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(product.id, selectedSize, selectedColor, 1);
    updateCartBadge();
    showToast();
  });
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

renderProduct();
updateSeoTags();
updateCartBadge();
