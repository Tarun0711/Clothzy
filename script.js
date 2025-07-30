// Global Variables
let cartItems = [];
let isDarkMode = false;
let isWishListed = false;

document.addEventListener('DOMContentLoaded', function() {
    loadUserPreferences();
    setupEventListeners();
    console.log('🚀 Chlothzy Product Card Initialized');
});

function setupEventListeners() {
    // Wishlist button event listeners
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', toggleWishlist);
    });

    // Image zoom functionality
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
        container.addEventListener('mousemove', handleImageZoom);
        container.addEventListener('mouseleave', resetImageZoom);
    });

    // Size selector functionality
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', selectSize);
    });
}

function handleImageZoom(e) {
    const container = e.currentTarget;
    const image = container.querySelector('.product-image');
    const rect = container.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    image.style.transformOrigin = `${x}% ${y}%`;
}

function resetImageZoom() {
    const images = document.querySelectorAll('.product-image');
    images.forEach(image => {
        image.style.transformOrigin = 'center center';
    });
}

// Add to Cart Functionality
async function addToCart(button) {
    // Prevent multiple clicks
    if (button.classList.contains('loading')) return;
    
    // Add loading state
    button.classList.add('loading');
    button.innerHTML = '<span class="loading-spinner"></span>Adding...';
    button.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get product details
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('.product-image').src;
        
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => item.name === productName);
        
        if (existingItemIndex !== -1) {
            // Increment quantity if item exists
            cartItems[existingItemIndex].quantity += 1;
            console.log(`Increased quantity of ${productName} in cart`);
        } else {
            // Add new item to cart
            cartItems.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            console.log(`${productName} added to cart!`);
        }
        
        // Update cart counter
        updateCartCounter();
        
        // Success state
        button.classList.remove('loading');
        button.classList.add('success');
        button.innerHTML = '✓ Added!';
        
        // Save to localStorage
        saveCartData();
        
        // Reset button after delay
        setTimeout(() => {
            button.classList.remove('success');
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            button.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        console.error('Error adding to cart. Please try again.');
        
        // Reset button
        button.classList.remove('loading');
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        button.disabled = false;
    }
}

// Buy Now Functionality
async function buyNow(button) {
    // Prevent multiple clicks
    if (button.classList.contains('loading')) return;
    
    // Add loading state
    button.classList.add('loading');
    button.innerHTML = '<span class="loading-spinner"></span>Processing...';
    button.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get product details
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        console.log(`Buying ${productName} for ${productPrice}`);
        
        // Success state
        button.classList.remove('loading');
        button.classList.add('success');
        button.innerHTML = '✓ Purchased!';
        
        // Reset button after delay
        setTimeout(() => {
            button.classList.remove('success');
            button.innerHTML = '<i class="fas fa-bolt"></i> Buy Now';
            button.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error processing purchase:', error);
        console.error('Error processing purchase. Please try again.');
        
        // Reset button
        button.classList.remove('loading');
        button.innerHTML = '<i class="fas fa-bolt"></i> Buy Now';
        button.disabled = false;
    }
}

// Remove from Cart Functionality
function removeFromCart(productName) {
    const itemIndex = cartItems.findIndex(item => item.name === productName);
    
    if (itemIndex !== -1) {
        if (cartItems[itemIndex].quantity > 1) {
            cartItems[itemIndex].quantity -= 1;
            console.log(`Decreased quantity of ${productName} in cart`);
        } else {
            cartItems.splice(itemIndex, 1);
            console.log(`${productName} removed from cart`);
        }
        
        updateCartCounter();
        saveCartData();
    }
}

// Update Cart Counter
function updateCartCounter() {
    const cartCounter = document.getElementById('cartCounter');
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        
        // Add animation
        cartCounter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCounter.style.transform = 'scale(1)';
        }, 200);
    }
}

// Toggle Wishlist
function toggleWishlist() {
    isWishListed = !isWishListed;
    const wishlistBtn = this;
    
    if (isWishListed) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        console.log('Added to wishlist!');
    } else {
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        console.log('Removed from wishlist');
    }
    
    localStorage.setItem('isWishListed', isWishListed);
}

// Size Selection
function selectSize() {
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedSize = this.getAttribute('data-size');
    
    // Remove selected class from all options
    sizeOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    this.classList.add('selected');
    
    console.log(`Selected size: ${selectedSize}`);
    
    // Store selected size in localStorage
    localStorage.setItem('selectedSize', selectedSize);
}

// Theme Toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        console.log('Dark mode enabled');
    } else {
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        console.log('Light mode enabled');
    }
    
    localStorage.setItem('isDarkMode', isDarkMode);
}

// Show Cart
function showCart() {
    if (cartItems.length === 0) {
        console.log('Your cart is empty');
    } else {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return total + (price * item.quantity);
        }, 0);
        
        console.log(`You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`);
        console.log(`Total: ₹${totalPrice.toFixed(2)}`);
        
        // Log cart items
        cartItems.forEach(item => {
            console.log(`- ${item.name} x${item.quantity} (${item.price})`);
        });
    }
}

// Show Wishlist
function showWishlist() {
    const wishlistItems = document.querySelectorAll('.wishlist-btn.active');
    if (wishlistItems.length === 0) {
        console.log('Your wishlist is empty');
    } else {
        console.log(`You have ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} in your wishlist`);
    }
}

// Load User Preferences
function loadUserPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Load cart items
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
        cartItems = JSON.parse(savedCartItems);
        updateCartCounter();
    }
    
    // Load wishlist state
    const savedWishlist = localStorage.getItem('isWishListed');
    if (savedWishlist === 'true') {
        isWishListed = true;
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        wishlistBtns.forEach(btn => {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        });
    }
    
    // Load selected size
    const savedSize = localStorage.getItem('selectedSize');
    if (savedSize) {
        const sizeOptions = document.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-size') === savedSize) {
                option.classList.add('selected');
            }
        });
    }
}

// Save Cart Data
function saveCartData() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('lastCartUpdate', new Date().toISOString());
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript Error:', e.error);
    console.error('Something went wrong. Please refresh the page.');
});

// Performance monitoring
window.addEventListener('load', () => {
    console.log('📊 Page loaded successfully');
    
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`⏱️ Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
    }
});

// Add animation for product card on load
document.addEventListener('DOMContentLoaded', () => {
    const productCard = document.querySelector('.product-card');
    if (productCard) {
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(20px)';
        productCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateY(0)';
        }, 100);
    }
});
