let cart = JSON.parse(localStorage.getItem('cart')) || [];

window.addEventListener('scroll', () => {
    const header = document.getElementById('navbar');

    if (window.scrollY > 110) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

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
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.");
        return;
    }
    window.location.href = 'payment.html';
    localStorage.removeItem('cart');
    renderCart();
});

// render on page load
renderCart();


const pickupRadio = document.getElementById('pickup');
const deliveryRadio = document.getElementById('delivery-option');
const deliveryForm = document.getElementById('delivery-form');
const searchAddressBtn = document.getElementById('search-address-btn');
const deliveryAddress = document.getElementById('delivery-address');
const mapFrame = document.getElementById('map-frame');

// your store's coordinates — replace with your actual location
const STORE_LOCATION = 'Coffee+to+go+Imus+Cavite';

// toggle delivery form visibility
pickupRadio.addEventListener('change', () => {
    deliveryForm.style.display = 'none';
    // reset map to store location
    mapFrame.src = `https://www.google.com/maps?q=${STORE_LOCATION}&output=embed`;
});

deliveryRadio.addEventListener('change', () => {
    deliveryForm.style.display = 'flex';
});

// search address and update map
searchAddressBtn.addEventListener('click', () => {
    const address = deliveryAddress.value.trim();

    if (address === '') {
        alert('Please enter a delivery address.');
        return;
    }

    // encode address for URL
    const encodedAddress = encodeURIComponent(address);
    mapFrame.src = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
});

// also search on Enter key
deliveryAddress.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchAddressBtn.click();
    }
});