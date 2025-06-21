document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const searchBtn = document.getElementById('search-btn');
    const cartBtn = document.getElementById('cart-btn');
    const userBtn = document.getElementById('user-btn');
    const searchModal = document.getElementById('search-modal');
    const userModal = document.getElementById('user-modal');
    const cartModal = document.getElementById('cart-modal');
    const closeButtons = document.querySelectorAll('.close');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const profileInfo = document.getElementById('profile-info');
    const logoutBtn = document.getElementById('logout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const menu = document.querySelector("nav");
    const menuBtn = document.querySelector("#open-menu-btn");
    const closeBtn = document.querySelector("#close-menu-btn");

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

    menuBtn.addEventListener('click', () => {
        menu.style.display = "flex";
    });

    closeBtn.addEventListener('click', closeNav);


    // Close modal when clicking outside
    // State
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    updateCartCount();
    checkUserStatus();

    searchBtn.addEventListener('click', () => searchModal.style.display = 'block');
    cartBtn.addEventListener('click', () => {
        renderCart();
        cartModal.style.display = 'block';
    });
    userBtn.addEventListener('click', () => {
        userModal.style.display = 'block';
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

    showSignup.addEventListener('click', function (e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });

    showLogin.addEventListener('click', function (e) {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    document.getElementById('login-submit').addEventListener('click', loginUser);
    document.getElementById('signup-submit').addEventListener('click', registerUser);
    logoutBtn.addEventListener('click', logoutUser);

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    checkoutBtn.addEventListener('click', checkout);

    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }
    
    function checkUserStatus() {
        if (currentUser) {
            loginForm.style.display = 'none';
            signupForm.style.display = 'none';
            profileInfo.style.display = 'block';
            document.getElementById('profile-name').textContent = currentUser.name;
            document.getElementById('profile-email').textContent = currentUser.email;
        } else {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            profileInfo.style.display = 'none';
        }
    }

    // User login and registration
    function loginUser() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Simple validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // In a real app, you would check against a database
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = {
                name: user.name,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            checkUserStatus();
            userModal.style.display = 'none';
            alert('Login successful!');
        } else {
            alert('Invalid credentials');
        }
    }

    function registerUser() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            alert('User with this email already exists');
            return;
        }

        // Add new user
        users.push({
            name,
            email,
            password // In a real app, you would hash the password
        });

        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    }

    function logoutUser() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        checkUserStatus();
        userModal.style.display = 'none';
        alert('Logged out successfully');
    }

    function addToCart() {
        if (!currentUser) {
            alert('Please login to add items to cart');
            userModal.style.display = 'block';
            return;
        }

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

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${productName} added to cart!`);
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

    // Update quantity of items in the cart
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;

            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        }
    }
    
    function removeItem(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
    
    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        if (!currentUser) {
            alert('Please login to proceed to checkout');
            userModal.style.display = 'block';
            return;
        }

        // In a real app, you would process payment here
        alert(`Order placed successfully! Total: $${document.getElementById('total-amount').textContent}`);
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        cartModal.style.display = 'none';
    }
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



// shop.js
document.addEventListener('DOMContentLoaded', function () {
    // Get all product items
    const productItems = document.querySelectorAll('.product-item');
    const searchInput = document.querySelector('.search-box input');
    const categoryTabs = document.querySelectorAll('.category-tab');

    // Search functionality
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        productItems.forEach(item => {
            const productName = item.querySelector('.product-name').textContent.toLowerCase();
            const productCategory = item.querySelector('.product-category').textContent.toLowerCase();

            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Category filtering
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            productItems.forEach(item => {
                const itemCategory = item.querySelector('.product-category').textContent.toLowerCase();

                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Reset filters button functionality (if you have one)
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function () {
            // Clear search
            searchInput.value = '';

            // Set category to 'all'
            categoryTabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector('.category-tab[data-category="all"]').classList.add('active');

            // Show all products
            productItems.forEach(item => {
                item.style.display = 'block';
            });
        });
    }
});