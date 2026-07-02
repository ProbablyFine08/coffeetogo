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
        summaryTotal.textContent = '₱50';
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


// your store coordinates — update to your actual location
const STORE_COORDS = { lat: 14.4297, lng: 120.9367 };  // Imus, Cavite
const STORE_ADDRESS = 'Imus, Cavite, Philippines';

// delivery fee settings
const FREE_KM = 5;           // first 5km is free/base
const BASE_FEE = 50;         // base delivery fee
const FEE_PER_KM = 15;       // ₱15 per km beyond 5km

let map;
let marker;
let customerMarker;
let directionsRenderer;

// called automatically by Google Maps API
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: STORE_COORDS,
        zoom: 13,
    });

    // store marker
    marker = new google.maps.Marker({
        position: STORE_COORDS,
        map: map,
        title: 'Coffee to go',
        icon: {
            url: 'Logos/LOGO-NONAME.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false
    });

    // autocomplete on address input
    const input = document.getElementById('delivery-address');
    const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'ph' }   // restrict to Philippines
    });
}

// delivery radio toggle
document.getElementById('pickup').addEventListener('change', () => {
    document.getElementById('delivery-form').style.display = 'none';
    document.getElementById('delivery-fee-display').style.display = 'none';
    updateOrderSummary(0, 'pickup');
    if (map) map.setCenter(STORE_COORDS);
});

document.getElementById('delivery-option').addEventListener('change', () => {
    document.getElementById('delivery-form').style.display = 'flex';
});

// calculate distance and fee
document.getElementById('search-address-btn').addEventListener('click', () => {
    const address = document.getElementById('delivery-address').value.trim();

    if (address === '') {
        alert('Please enter a delivery address.');
        return;
    }

    calculateDeliveryFee(address);
});

// Enter key support
document.getElementById('delivery-address').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-address-btn').click();
    }
});

function calculateDeliveryFee(address) {
    const distanceService = new google.maps.DistanceMatrixService();
    const directionsService = new google.maps.DirectionsService();

    distanceService.getDistanceMatrix({
        origins: [STORE_ADDRESS],
        destinations: [address],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
    }, (response, status) => {
        if (status !== 'OK') {
            alert('Could not calculate distance. Please check the address.');
            return;
        }

        const element = response.rows[0].elements[0];

        if (element.status !== 'OK') {
            alert('Address not found. Please try a more specific address.');
            return;
        }

        // distance in km
        const distanceKm = element.distance.value / 1000;
        const distanceText = element.distance.text;

        // calculate fee
        let deliveryFee = BASE_FEE;
        if (distanceKm > FREE_KM) {
            const extraKm = distanceKm - FREE_KM;
            deliveryFee = BASE_FEE + Math.ceil(extraKm) * FEE_PER_KM;
        }

        // show results
        document.getElementById('distance-text').textContent = distanceText;
        document.getElementById('delivery-fee-text').textContent = `₱${deliveryFee}`;
        document.getElementById('delivery-fee-display').style.display = 'block';

        // update order summary
        updateOrderSummary(deliveryFee, 'delivery');

        // draw route on map
        directionsService.route({
            origin: STORE_ADDRESS,
            destination: address,
            travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
            }
        });
    });
}

function updateOrderSummary(deliveryFee, method) {
    const subtotal = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const delivery = method === 'pickup' ? 0 : deliveryFee;
    document.getElementById('summary-subtotal').textContent = `₱${subtotal}`;
    document.getElementById('summary-delivery').textContent = `₱${delivery}`;
    document.getElementById('summary-total').textContent = `₱${subtotal + delivery}`;
}