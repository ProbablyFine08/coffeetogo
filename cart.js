let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartPageItems = document.getElementById('cart-page-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

function renderCart() {
    if (cart.length === 0) {
        cartPageItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        summarySubtotal.textContent = '₱0';
        summaryTotal.textContent = '₱50';   // just delivery
        return;
    }

    cartPageItems.innerHTML = cart.map(item => `
        <div class="cart-page-item">
            <img src="${item.img}" alt="${item.title}">
            <div class="cart-page-item-details">
                <h3>${item.title}</h3>
                <p>${item.price}</p>
            </div>
            <button class="remove-btn" onclick="removeItem(${item.id})">✕</button>
        </div>
    `).join('');

    // calculate totals
    const subtotal = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const delivery = 50;
    summarySubtotal.textContent = `₱${subtotal}`;
    summaryTotal.textContent = `₱${subtotal + delivery}`;
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));   // sync to localStorage
    renderCart();
}

clearCartBtn.addEventListener('click', () => {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
});

checkoutBtn.addEventListener('click', () => {
    cart = [];
    window.location.href = 'payment.html';
    localStorage.removeItem('cart');
    renderCart();
});

// render on page load
renderCart();