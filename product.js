const params = new URLSearchParams(location.search);
const product = getProductById(params.get("id"));

let selectedSize = null;
let selectedColor = null;

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
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
updateCartBadge();
