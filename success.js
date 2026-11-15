function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
}

async function confirmPayment() {
  const wrap = document.getElementById("successWrap");
  const params = new URLSearchParams(location.search);
  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = Number(params.get("amount"));

  const pendingOrder = JSON.parse(sessionStorage.getItem("pendingOrder") || "null");

  if (!paymentKey || !orderId || !amount || !pendingOrder || pendingOrder.orderId !== orderId) {
    wrap.innerHTML = `<p>결제 정보를 확인할 수 없습니다.</p><a href="cart.html"><button class="secondary-btn">장바구니로 돌아가기</button></a>`;
    return;
  }

  if (amount !== pendingOrder.total) {
    wrap.innerHTML = `<p>결제 금액이 일치하지 않습니다. 결제가 취소되었습니다.</p><a href="cart.html"><button class="secondary-btn">장바구니로 돌아가기</button></a>`;
    return;
  }

  try {
    const res = await fetch("/api/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });
    const data = await res.json();

    if (!res.ok) {
      wrap.innerHTML = `<p>결제 승인에 실패했습니다.</p><p>${escapeHtml(data.message || "알 수 없는 오류")}</p><a href="cart.html"><button class="secondary-btn">장바구니로 돌아가기</button></a>`;
      return;
    }

    const order = {
      recipientName: pendingOrder.recipientName,
      phone: pendingOrder.phone,
      address: pendingOrder.address,
      requestNote: pendingOrder.requestNote,
      itemCount: pendingOrder.itemCount,
      total: pendingOrder.total,
      paymentKey: data.paymentKey,
      method: data.method,
    };
    sessionStorage.setItem("lastOrder", JSON.stringify(order));
    sessionStorage.removeItem("pendingOrder");
    saveCart([]);
    location.href = "complete.html";
  } catch (error) {
    console.error(error);
    wrap.innerHTML = `<p>결제 승인 중 오류가 발생했습니다.</p><a href="cart.html"><button class="secondary-btn">장바구니로 돌아가기</button></a>`;
  }
}

confirmPayment();
updateCartBadge();
