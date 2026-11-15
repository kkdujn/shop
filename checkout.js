const TOSS_CLIENT_KEY = "test_ck_YOUR_TEST_CLIENT_KEY";

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = cartItemCount();
}

const cart = getCart();

if (cart.length === 0) {
  location.href = "cart.html";
}

function renderOrderSummary() {
  const box = document.getElementById("orderSummaryBox");
  const count = cartItemCount();
  box.innerHTML = `
    <div class="row" style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span>주문 상품 수</span><span>${count}개</span>
    </div>
    <div class="row" style="display:flex;justify-content:space-between;font-weight:700;">
      <span>총 결제 예정 금액</span><span>${formatPrice(cartTotal())}</span>
    </div>
  `;
}

function validateField(id, value) {
  const valid = value.trim().length > 0;
  const input = document.getElementById(id);
  const err = document.getElementById(`err-${id}`);
  input.classList.toggle("invalid", !valid);
  err.style.display = valid ? "none" : "block";
  return valid;
}

function generateOrderId() {
  return "order-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

let widgets = null;

function getWidgets() {
  if (!widgets) {
    const tossPayments = TossPayments(TOSS_CLIENT_KEY);
    widgets = tossPayments.widgets({ customerKey: TossPayments.ANONYMOUS });
  }
  return widgets;
}

document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("recipientName").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const requestNote = document.getElementById("requestNote").value;

  const nameValid = validateField("recipientName", name);
  const phoneValid = validateField("phone", phone);
  const addressValid = validateField("address", address);

  if (!nameValid || !phoneValid || !addressValid) return;

  const total = cartTotal();
  const itemCount = cartItemCount();
  const orderId = generateOrderId();

  const order = {
    orderId,
    recipientName: name.trim(),
    phone: phone.trim(),
    address: address.trim(),
    requestNote: requestNote.trim(),
    itemCount,
    total,
  };
  sessionStorage.setItem("pendingOrder", JSON.stringify(order));

  const submitBtn = document.getElementById("submitOrderBtn");
  submitBtn.disabled = true;

  try {
    const widgets = getWidgets();
    await widgets.setAmount({ currency: "KRW", value: total });

    const paymentWindow = await widgets.renderPaymentWindow({
      orderName: itemCount > 1 ? `상품 외 ${itemCount - 1}건` : "상품 1건",
      variantKey: {
        paymentMethod: "DEFAULT",
        agreement: "AGREEMENT",
      },
    });

    paymentWindow.on("paymentRequest", async () => {
      try {
        await widgets.requestPayment({
          orderId,
          orderName: itemCount > 1 ? `상품 외 ${itemCount - 1}건` : "상품 1건",
          successUrl: window.location.origin + "/success.html",
          failUrl: window.location.origin + "/fail.html",
          customerName: name.trim(),
          customerMobilePhone: phone.trim().replace(/-/g, ""),
        });
      } catch (error) {
        console.error(error);
        submitBtn.disabled = false;
      }
    });

    paymentWindow.on("cancel", () => {
      submitBtn.disabled = false;
    });
  } catch (error) {
    console.error(error);
    if (error.name === "InvalidClientKeyError") {
      alert("토스페이먼츠 클라이언트 키가 설정되지 않았습니다. checkout.js의 TOSS_CLIENT_KEY를 발급받은 테스트 키로 교체해주세요.");
    } else {
      alert("결제창을 여는 중 오류가 발생했습니다.");
    }
    submitBtn.disabled = false;
  }
});

renderOrderSummary();
updateCartBadge();
