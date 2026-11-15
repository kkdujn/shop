let currentCategory = "전체";
let currentSort = "latest";

function renderCategoryTabs() {
  const wrap = document.getElementById("categoryTabs");
  const tabs = ["전체", ...CATEGORIES];
  wrap.innerHTML = tabs
    .map(
      (cat) =>
        `<button class="${cat === currentCategory ? "active" : ""}" data-cat="${cat}">${cat}</button>`
    )
    .join("");
  wrap.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.cat;
      renderCategoryTabs();
      renderProductGrid();
    });
  });
}

function getFilteredSortedProducts() {
  let list = PRODUCTS.filter(
    (p) => currentCategory === "전체" || p.category === currentCategory
  );
  if (currentSort === "price-asc") {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-desc") {
    list = [...list].sort((a, b) => b.price - a.price);
  } else {
    list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  return list;
}

function renderProductGrid() {
  const grid = document.getElementById("productGrid");
  const products = getFilteredSortedProducts();
  grid.innerHTML = products
    .map(
      (p) => `
    <a class="product-card" href="product.html?id=${p.id}">
      ${p.soldOut ? '<span class="badge-soldout">품절</span>' : ""}
      <img src="${p.thumbnail}" alt="${p.name}" />
      <div class="info">
        <p class="name">${p.name}</p>
        <p class="price">${formatPrice(p.price)}</p>
      </div>
    </a>
  `
    )
    .join("");
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
}

document.getElementById("sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderProductGrid();
});

renderCategoryTabs();
renderProductGrid();
updateCartBadge();
