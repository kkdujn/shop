function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
}

function renderFail() {
  const wrap = document.getElementById("failWrap");
  const params = new URLSearchParams(location.search);
  const code = params.get("code") || "UNKNOWN_ERROR";
  const message = params.get("message") || "결제에 실패했습니다.";

  wrap.innerHTML = `
    <div class="check">❌</div>
    <h1>결제에 실패했습니다</h1>
    <p>${escapeHtml(message)}</p>
    <p style="color:#999;font-size:13px;">오류 코드: ${escapeHtml(code)}</p>
    <a href="checkout.html"><button class="primary-btn">다시 시도하기</button></a>
    <a href="cart.html"><button class="secondary-btn" style="margin-top:8px;">장바구니로 돌아가기</button></a>
  `;
}

renderFail();
updateCartBadge();
