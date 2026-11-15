function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
}

const order = JSON.parse(sessionStorage.getItem("lastOrder") || "null");
const wrap = document.getElementById("completeWrap");

if (!order) {
  wrap.innerHTML = `<p>주문 정보를 찾을 수 없습니다.</p><a href="index.html">쇼핑 계속하기</a>`;
} else {
  wrap.innerHTML = `
    <div class="check">✅</div>
    <h1>주문이 완료되었습니다</h1>
    <p>결제가 완료되어 주문이 접수되었습니다.</p>
    <div class="summary">
      <p><strong>받는사람</strong> ${escapeHtml(order.recipientName)}</p>
      <p><strong>전화번호</strong> ${escapeHtml(order.phone)}</p>
      <p><strong>배송지</strong> ${escapeHtml(order.address)}</p>
      ${order.requestNote ? `<p><strong>요청사항</strong> ${escapeHtml(order.requestNote)}</p>` : ""}
      <p><strong>주문 상품 수</strong> ${order.itemCount}개</p>
      <p><strong>총 합계</strong> ${formatPrice(order.total)}</p>
      ${order.method ? `<p><strong>결제수단</strong> ${escapeHtml(order.method)}</p>` : ""}
    </div>
    <a href="index.html"><button class="secondary-btn">쇼핑 계속하기</button></a>
  `;
  sessionStorage.removeItem("lastOrder");
}

updateCartBadge();
