// ====== Cart & Modal Variables ======
const cart = [];
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCountMobile = document.getElementById("cart-count-mobile");

const productModal = new bootstrap.Modal(document.getElementById("productModal"));
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const size16 = document.getElementById("size16");
const size22 = document.getElementById("size22");
const label16 = document.getElementById("label16");
const label22 = document.getElementById("label22");
const modalTotal = document.getElementById("modalTotal");
const addToCartBtn = document.getElementById("addToCartBtn");
const sizeSection = document.getElementById("sizeSection");
const addonSection = document.getElementById("addonSection");

const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const quantityInput = document.getElementById("quantity");
let quantity = 1;

let currentProduct = { name: "", price16: 0, price22: 0, img: "", category: "" };

// ====== Open Product Modal ======
document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", () => {
    currentProduct.name = card.dataset.name;
    currentProduct.img = card.dataset.img;
    currentProduct.price16 = parseInt(card.dataset.price16);
    currentProduct.price22 = parseInt(card.dataset.price22);
    currentProduct.category = card.dataset.category;

    modalTitle.textContent = currentProduct.name;
    modalImg.src = currentProduct.img;

    // Update sizes
    size16.value = currentProduct.price16;
    label16.textContent = `16oz - ₱${currentProduct.price16}`;
    size22.value = currentProduct.price22;
    label22.textContent = `22oz - ₱${currentProduct.price22}`;
    size16.checked = true;

    // Hide size & addons for Snacks
    if (currentProduct.category === "Snacks") {
      sizeSection.style.display = "none";
      addonSection.style.display = "none";
    } else {
      sizeSection.style.display = "block";
      addonSection.style.display = "block";
      document.querySelectorAll(".addon-option").forEach(cb => cb.checked = false);
    }

    quantity = 1;
    quantityInput.value = quantity;
    updateModalTotal();
    productModal.show();
  });
});

// ====== Update Modal Total ======
function updateModalTotal() {
  let basePrice = 0;
  if (currentProduct.category !== "Snacks") {
    basePrice = parseInt(document.querySelector('input[name="size"]:checked').value);
  } else {
    basePrice = currentProduct.price16;
  }

  let addonsTotal = 0;
  if (currentProduct.category !== "Snacks") {
    document.querySelectorAll('.addon-option:checked').forEach(addon => addonsTotal += parseInt(addon.value));
  }

  modalTotal.textContent = (basePrice + addonsTotal) * quantity;
}

// ====== Event Listeners ======
document.querySelectorAll(".size-option, .addon-option").forEach(el => {
  el.addEventListener("change", updateModalTotal);
});

qtyMinus.addEventListener("click", () => {
  if (quantity > 1) quantity--;
  quantityInput.value = quantity;
  updateModalTotal();
});

qtyPlus.addEventListener("click", () => {
  quantity++;
  quantityInput.value = quantity;
  updateModalTotal();
});

// ====== Add to Cart ======
addToCartBtn.addEventListener("click", () => {
  let finalPrice = 0;
  if (currentProduct.category === "Snacks") {
    finalPrice = currentProduct.price16 * quantity;
  } else {
    const basePrice = parseInt(document.querySelector('input[name="size"]:checked').value);
    let addonTotal = 0;
    document.querySelectorAll('.addon-option:checked').forEach(addon => addonTotal += parseInt(addon.value));
    finalPrice = (basePrice + addonTotal) * quantity;
  }

  cart.push({ name: currentProduct.name, price: finalPrice, qty: quantity });
  updateCart();
  productModal.hide();
});

// ====== Update Cart Display ======
function updateCart() {
  cartCount.textContent = cart.length;
  cartCountMobile.textContent = cart.length;

  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name} x${item.qty} - ₱${item.price}
        <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">x</button>
      </li>`;
  });
  cartTotal.textContent = total;
}

// ====== Remove Item ======
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCartTotal() {
  const cartItems = document.querySelectorAll('#cart-items li');
  let total = 0;
  cartItems.forEach(item => {
    total += parseFloat(item.dataset.price);
  });
  document.getElementById('cart-total').textContent = `₱${total}`;
  document.getElementById('checkoutBtn').disabled = total === 0;
}

