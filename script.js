document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const searchBtn = document.getElementById('search-btn');
    const cartBtn = document.getElementById('cart-btn');
    const searchModal = document.getElementById('search-modal');
    const cartModal = document.getElementById('cart-modal');
    const closeButtons = document.querySelectorAll('.close');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('paymentModal');
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    const submitPaymentBtn = document.getElementById('submitPaymentBtn');
    const menu = document.querySelector("nav");
    const menuBtn = document.querySelector("#open-menu-btn");
    const closeBtn = document.querySelector("#close-menu-btn");

    // State
    let cart = [];

    updateCartCount();

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        menu.style.display = "flex";
        closeBtn.style.display = "inline-block";
        menuBtn.style.display = "none";
    });

    const closeNav = () => {
        menu.style.display = "none";
        closeBtn.style.display = 'none';
        menuBtn.style.display = "inline-block";
    };

    closeBtn.addEventListener('click', closeNav);

    // Modal functionality
    searchBtn.addEventListener('click', () => searchModal.style.display = 'block');
    cartBtn.addEventListener('click', () => {
        renderCart();
        cartModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    checkoutBtn.addEventListener('click', checkout);

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    function addToCart() {
        const productId = this.getAttribute('data-id');
        const productName = this.getAttribute('data-name');
        const productPrice = parseFloat(this.getAttribute('data-price'));

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        updateCartCount();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartTotal.style.display = 'none';
            return;
        }

        emptyCartMessage.style.display = 'none';

        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;

            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        document.getElementById('total-amount').textContent = total.toFixed(2);
        cartTotal.style.display = 'block';

        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function () {
                updateQuantity(this.getAttribute('data-id'), -1);
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function () {
                updateQuantity(this.getAttribute('data-id'), 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                removeItem(this.getAttribute('data-id'));
            });
        });
    }

    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;

            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }

            updateCartCount();
            renderCart();
        }
    }

    function removeItem(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        renderCart();
    }

    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        // Hide cart modal and show payment modal
        cartModal.style.display = 'none';
        paymentModal.style.display = 'flex';
    }

    // Add event listeners for payment modal
    cancelPaymentBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    submitPaymentBtn.addEventListener('click', () => {
        // Here you would normally process the payment
        alert('Payment submitted successfully!');
        cart = []; // Clear the cart
        updateCartCount();
        paymentModal.style.display = 'none';
        cartModal.style.display = 'none';
    });

    // Update the selectMethod function to properly show forms
    function selectMethod(method) {
        const methods = ['visa', 'bkash', 'nagad'];
        methods.forEach(m => {
            const form = document.getElementById(`${m}-form`);
            if (form) {
                form.style.display = (m === method) ? 'block' : 'none';
            }
        });
    }

    window.selectMethod = selectMethod;
});

// FAQ Accordion
const faqs = document.querySelectorAll('.faq');
faqs.forEach(faq => {
    faq.addEventListener('click', () => {
        faq.classList.toggle('open');

        const icon = faq.querySelector('.faq_icon i');
        if (icon.className === 'fa-solid fa-angle-down') {
            icon.className = 'fa-solid fa-angle-up'
        }
        else {
            icon.className = 'fa-solid fa-angle-down'
        }
    })
})

// Swiper Slider Initialization
var swiper = new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2
        }
    }
});


// Updated Countdown Timer
function updateCountdown() {
    // Set end date to 7 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 0); // Set to end at end of day

    const now = new Date().getTime();
    const distance = endDate - now;

    // Stop timer when sale ends
    if (distance < 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return; // Exit the function
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display results
    document.getElementById("days").textContent = days.toString().padStart(2, '0');
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
}

// Update every second
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Optional: Hide banner when countdown ends
function checkSaleEnd() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    if (new Date() > endDate) {
        document.querySelector('.sale-banner').style.display = 'none';
        clearInterval(countdownInterval); // Stop the countdown
    }
}

// Check every hour if sale has ended
setInterval(checkSaleEnd, 3600000);
checkSaleEnd(); // Initial check
