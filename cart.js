const CART_KEY = "clothing-shop-cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, size, color, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(
    (item) => item.productId === productId && item.size === size && item.color === color
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, size, color, quantity });
  }
  saveCart(cart);
}

function updateCartQuantity(productId, size, color, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(
      (item) => !(item.productId === productId && item.size === size && item.color === color)
    );
  } else {
    const item = cart.find(
      (item) => item.productId === productId && item.size === size && item.color === color
    );
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
}

function removeFromCart(productId, size, color) {
  const cart = getCart().filter(
    (item) => !(item.productId === productId && item.size === size && item.color === color)
  );
  saveCart(cart);
}

function cartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return getCart().reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function formatPrice(n) {
  return n.toLocaleString("ko-KR") + "원";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
