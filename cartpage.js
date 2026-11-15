function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
}

function renderCart() {
  const cart = getCart();
  const listEl = document.getElementById("cartList");
  const summaryEl = document.getElementById("cartSummary");
  const orderBtn = document.getElementById("orderBtn");

  if (cart.length === 0) {
    listEl.innerHTML = `<div class="empty-state">장바구니가 비어 있습니다.<br/><a href="index.html">쇼핑 계속하기</a></div>`;
    summaryEl.style.display = "none";
    orderBtn.disabled = true;
    updateCartBadge();
    return;
  }

  listEl.innerHTML = cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return "";
      return `
        <div class="cart-item" data-id="${item.productId}" data-size="${item.size}" data-color="${item.color}">
          <img src="${product.thumbnail}" alt="${product.name}" />
          <div class="meta">
            <p class="name">${product.name}</p>
            <p class="options">${item.size} / ${item.color}</p>
            <div class="qty-control">
              <button class="qty-dec">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-inc">+</button>
            </div>
          </div>
          <div style="text-align:right;">
            <p class="price">${formatPrice(product.price * item.quantity)}</p>
            <button class="remove-btn">삭제</button>
          </div>
        </div>
      `;
    })
    .join("");

  summaryEl.style.display = "block";
  document.getElementById("cartTotal").textContent = formatPrice(cartTotal());
  orderBtn.disabled = false;

  listEl.querySelectorAll(".cart-item").forEach((el) => {
    const { id, size, color } = el.dataset;
    const productId = Number(id);
    const item = cart.find(
      (i) => i.productId === productId && i.size === size && i.color === color
    );

    el.querySelector(".qty-inc").addEventListener("click", () => {
      updateCartQuantity(productId, size, color, item.quantity + 1);
      renderCart();
    });
    el.querySelector(".qty-dec").addEventListener("click", () => {
      updateCartQuantity(productId, size, color, item.quantity - 1);
      renderCart();
    });
    el.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(productId, size, color);
      renderCart();
    });
  });

  updateCartBadge();
}

document.getElementById("orderBtn").addEventListener("click", () => {
  if (getCart().length === 0) return;
  location.href = "checkout.html";
});

renderCart();
