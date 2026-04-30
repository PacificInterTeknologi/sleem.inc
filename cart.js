// Shopping Cart System for SLEEM Fashion Store
// Cart management, checkout, and order processing

// Global Variables
let cart = [];

// Initialize Cart
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartUI();
    setupCartEventListeners();
});

function setupCartEventListeners() {
    // Cart sidebar close button
    const closeBtn = document.querySelector('.cart-header button');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleCart);
    }
}

// Load cart from localStorage
function loadCartFromStorage() {
    const saved = localStorage.getItem('sleemCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('sleemCart', JSON.stringify(cart));
}

// Add to cart
function addToCart(product, quantity = 1, size = null, color = null) {
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: size || product.sizes[0],
        color: color || product.colors[0],
        category: product.category,
        sku: product.sku,
        addedAt: new Date().toISOString()
    };
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => 
        item.id === product.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
        showNotification(`${product.name} quantity updated`);
    } else {
        cart.push(cartItem);
        showNotification(`${product.name} added to cart`);
    }
    
    updateCartUI();
    saveCartToStorage();
}

// Remove from cart
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        showNotification(`${removedItem.name} removed from cart`);
        updateCartUI();
        saveCartToStorage();
    }
}

// Update cart item quantity
function updateCartItemQuantity(itemId, quantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
            updateCartUI();
            saveCartToStorage();
        }
    }
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
    saveCartToStorage();
    showNotification('Cart cleared');
}

// Update cart UI
function updateCartUI() {
    updateCartCount();
    updateCartSidebar();
    updateCartPage();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update cart sidebar
function updateCartSidebar() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <div class="image-placeholder">${item.image}</div>
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-details">
                        <span class="cart-item-size">Size: ${item.size.toUpperCase()}</span>
                        <span class="cart-item-color">Color: ${item.color}</span>
                    </div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">
                        Rp ${itemTotal.toLocaleString('id-ID')}
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Update cart page
function updateCartPage() {
    const cartPageItems = document.getElementById('cartPageItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartPageItems) return;
    
    cartPageItems.innerHTML = '';
    let subtotal = 0;
    
    if (cart.length === 0) {
        cartPageItems.innerHTML = `
            <div class="empty-cart-page">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p>Add some items to your cart to get started!</p>
                <button class="btn-primary" onclick="window.location.href='index.html'">
                    <i class="fas fa-home"></i> Continue Shopping
                </button>
            </div>
        `;
        
        if (cartSubtotal) cartSubtotal.textContent = 'Rp 0';
        if (cartShipping) cartShipping.textContent = 'Rp 0';
        if (cartTotal) cartTotal.textContent = 'Rp 0';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item-page';
            cartItem.innerHTML = `
                <div class="cart-item-page-image">
                    <div class="image-placeholder">${item.image}</div>
                </div>
                <div class="cart-item-page-info">
                    <div class="cart-item-page-header">
                        <h4>${item.name}</h4>
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="cart-item-page-details">
                        <span class="cart-item-size">Size: ${item.size.toUpperCase()}</span>
                        <span class="cart-item-color">Color: ${item.color}</span>
                        <span class="cart-item-sku">SKU: ${item.sku}</span>
                    </div>
                    <div class="cart-item-page-price">
                        <span class="cart-item-unit-price">Rp ${item.price.toLocaleString('id-ID')}</span>
                        <div class="cart-item-quantity">
                            <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" value="${item.quantity}" min="1" 
                                   onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                            <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-total">
                            <span>Total: Rp ${itemTotal.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            `;
            cartPageItems.appendChild(cartItem);
        });
        
        // Calculate shipping (flat rate)
        const shipping = subtotal > 0 ? 15000 : 0;
        const total = subtotal + shipping;
        
        if (cartSubtotal) cartSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        if (cartShipping) cartShipping.textContent = `Rp ${shipping.toLocaleString('id-ID')}`;
        if (cartTotal) cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Get cart items
function getCartItems() {
    return cart;
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart count
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Validate cart for checkout
function validateCart() {
    if (cart.length === 0) {
        return { valid: false, message: 'Your cart is empty' };
    }
    
    // Check if any items are out of stock
    if (window.productFunctions) {
        for (let item of cart) {
            const product = window.productFunctions.getProductById(item.id);
            if (product && product.stock < item.quantity) {
                return { valid: false, message: `${item.name} is out of stock` };
            }
        }
    }
    
    return { valid: true, message: 'Cart is ready for checkout' };
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.className = 'notification';
        
        if (type === 'error') {
            notification.style.background = 'var(--danger-color)';
        } else if (type === 'warning') {
            notification.style.background = 'var(--warning-color)';
        } else {
            notification.style.background = 'var(--success-color)';
        }
        
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
}

// Export functions for use in other scripts
window.cartFunctions = {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartItems,
    getCartTotal,
    getCartCount,
    validateCart,
    toggleCart,
    goToCheckout,
    updateCartUI
};
