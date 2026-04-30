// Main JavaScript for SLEEM Fashion Store
// Global functionality and page management

// Global Variables
let currentPage = 'home';
let isCartOpen = false;
let isWishlistOpen = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load user data
    if (window.authFunctions) {
        window.authFunctions.updateUserUI();
    }
    
    // Load cart data
    if (window.cartFunctions) {
        window.cartFunctions.updateCartUI();
    }
    
    // Load wishlist data
    if (window.productFunctions) {
        window.productFunctions.updateWishlistUI();
    }
    
    // Setup global event listeners
    setupGlobalEventListeners();
    
    // Initialize current page
    initializeCurrentPage();
    
    // Setup mobile menu
    setupMobileMenu();
}

function setupGlobalEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                if (window.productFunctions) {
                    window.productFunctions.searchProducts();
                }
            }
        });
    }
    
    // Cart sidebar close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isCartOpen) {
                toggleCart();
            }
            if (isWishlistOpen) {
                toggleWishlist();
            }
        }
    });
}

function initializeCurrentPage() {
    // Get current page from URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    } else {
        showPage('home');
    }
}

// Page Management
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Update URL hash
        window.location.hash = pageName;
        
        // Update navigation
        updateNavigation(pageName);
        
        // Initialize page-specific functionality
        initializePage(pageName);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateNavigation(activePage) {
    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + activePage) {
            link.classList.add('active');
        }
    });
}

function initializePage(pageName) {
    switch(pageName) {
        case 'home':
            if (window.productFunctions) {
                window.productFunctions.loadFeaturedProducts();
            }
            break;
        case 'products':
            if (window.productFunctions) {
                window.productFunctions.loadAllProducts();
            }
            break;
        case 'categories':
            if (window.productFunctions) {
                window.productFunctions.loadCategories();
            }
            break;
        case 'new':
            if (window.productFunctions) {
                window.productFunctions.loadNewProducts();
            }
            break;
        case 'sale':
            if (window.productFunctions) {
                window.productFunctions.loadSaleProducts();
            }
            break;
        case 'cart':
            if (window.cartFunctions) {
                window.cartFunctions.updateCartPage();
            }
            break;
        case 'checkout':
            if (window.checkoutFunctions) {
                window.checkoutFunctions.loadCheckoutItems();
            }
            break;
        case 'orders':
            loadOrdersPage();
            break;
        case 'profile':
            loadProfilePage();
            break;
        case 'settings':
            loadSettingsPage();
            break;
    }
}

// Cart Functions
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        isCartOpen = !isCartOpen;
        cartSidebar.classList.toggle('active');
        
        // Close wishlist if open
        if (isWishlistOpen) {
            toggleWishlist();
        }
    }
}

// Wishlist Functions
function toggleWishlist() {
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    if (wishlistSidebar) {
        isWishlistOpen = !isWishlistOpen;
        wishlistSidebar.classList.toggle('active');
        
        // Close cart if open
        if (isCartOpen) {
            toggleCart();
        }
        
        // Load wishlist items
        loadWishlistItems();
    }
}

function loadWishlistItems() {
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistItems) return;
    
    wishlistItems.innerHTML = '';
    
    if (window.authFunctions && window.productFunctions) {
        const wishlist = window.authFunctions.getCustomerWishlist();
        
        if (wishlist.length === 0) {
            wishlistItems.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
        } else {
            wishlist.forEach(productId => {
                const product = window.productFunctions.getProductById(productId);
                if (product) {
                    const wishlistItem = document.createElement('div');
                    wishlistItem.className = 'wishlist-item';
                    wishlistItem.innerHTML = `
                        <div class="wishlist-item-image">
                            <div class="image-placeholder">${product.image}</div>
                        </div>
                        <div class="wishlist-item-info">
                            <h4>${product.name}</h4>
                            <div class="wishlist-item-price">
                                Rp ${product.price.toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="btn-cart" onclick="window.cartFunctions.addToCart(window.productFunctions.getProductById(${product.id}))">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="btn-remove" onclick="window.authFunctions.removeFromWishlist(${product.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    wishlistItems.appendChild(wishlistItem);
                }
            });
        }
    }
}

// User Functions
function showUserMenu() {
    const modal = document.getElementById('userMenuModal');
    if (modal) {
        modal.style.display = 'flex';
        if (window.authFunctions) {
            window.authFunctions.updateUserMenu();
        }
    }
}

function closeUserMenu() {
    const modal = document.getElementById('userMenuModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Orders Page
function loadOrdersPage() {
    // Require authentication
    if (window.authFunctions && !window.authFunctions.requireAuth()) {
        return;
    }
    
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    ordersContainer.innerHTML = '<div class="loading">Loading orders...</div>';
    
    // Load orders
    setTimeout(() => {
        if (window.checkoutFunctions && window.authFunctions) {
            const currentUser = window.authFunctions.getCurrentUser();
            const userOrders = window.checkoutFunctions.getOrdersByCustomer(currentUser.id);
            
            if (userOrders.length === 0) {
                ordersContainer.innerHTML = `
                    <div class="empty-orders">
                        <div class="empty-icon">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <h3>No orders yet</h3>
                        <p>Start shopping to see your orders here!</p>
                        <button class="btn-primary" onclick="window.location.href='index.html'">
                            <i class="fas fa-shopping-bag"></i> Start Shopping
                        </button>
                    </div>
                `;
            } else {
                ordersContainer.innerHTML = `
                    <div class="orders-list">
                        ${userOrders.map(order => `
                            <div class="order-card">
                                <div class="order-header">
                                    <h4>Order ID: ${order.id}</h4>
                                    <span class="order-status ${order.status}">${order.status}</span>
                                </div>
                                <div class="order-items">
                                    <p>${order.items.length} items</p>
                                    <p>Total: Rp ${order.total.toLocaleString('id-ID')}</p>
                                </div>
                                <div class="order-date">
                                    <p>${new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div class="order-actions">
                                    <button class="btn-secondary" onclick="viewOrderDetail('${order.id}')">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    ${order.status === 'pending' ? `
                                        <button class="btn-danger" onclick="cancelOrder('${order.id}')">
                                            <i class="fas fa-times"></i> Cancel
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
    }, 1000);
}

function viewOrderDetail(orderId) {
    if (window.checkoutFunctions) {
        const order = window.checkoutFunctions.getOrderById(orderId);
        if (order) {
            const summary = window.checkoutFunctions.generateOrderSummary(order);
            // Show order detail modal or navigate to detail page
            showNotification('Order details loaded');
        }
    }
}

function cancelOrder(orderId) {
    if (window.checkoutFunctions) {
        window.checkoutFunctions.cancelOrder(orderId);
        loadOrdersPage(); // Reload orders
    }
}

// Profile Page
function loadProfilePage() {
    // Require authentication
    if (window.authFunctions && !window.authFunctions.requireAuth()) {
        return;
    }
    
    const profileContainer = document.getElementById('profileContainer');
    if (!profileContainer) return;
    
    if (window.authFunctions) {
        const user = window.authFunctions.getCurrentUser();
        if (user) {
            profileContainer.innerHTML = `
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <h3>${user.fullName}</h3>
                        <p>${user.phone}</p>
                    </div>
                    <div class="profile-info">
                        <div class="info-group">
                            <h4>Personal Information</h4>
                            <div class="info-item">
                                <label>Full Name:</label>
                                <span>${user.fullName}</span>
                            </div>
                            <div class="info-item">
                                <label>Phone:</label>
                                <span>${user.phone}</span>
                            </div>
                            <div class="info-item">
                                <label>Email:</label>
                                <span>${user.email || 'Not provided'}</span>
                            </div>
                            <div class="info-item">
                                <label>Address:</label>
                                <span>${user.address || 'Not provided'}</span>
                            </div>
                        </div>
                        <div class="info-group">
                            <h4>Account Information</h4>
                            <div class="info-item">
                                <label>Member Since:</label>
                                <span>${user.registeredAt || 'N/A'}</span>
                            </div>
                            <div class="info-item">
                                <label>Total Orders:</label>
                                <span>${user.totalOrders || 0}</span>
                            </div>
                            <div class="info-item">
                                <label>Total Spent:</label>
                                <span>Rp ${(user.totalSpent || 0).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn-primary" onclick="editProfile()">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                        <button class="btn-secondary" onclick="changePassword()">
                            <i class="fas fa-lock"></i> Change Password
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

function editProfile() {
    showNotification('Edit profile feature coming soon');
}

function changePassword() {
    showNotification('Change password feature coming soon');
}

// Settings Page
function loadSettingsPage() {
    // Require authentication
    if (window.authFunctions && !window.authFunctions.requireAuth()) {
        return;
    }
    
    const settingsContainer = document.getElementById('settingsContainer');
    if (!settingsContainer) return;
    
    settingsContainer.innerHTML = `
        <div class="settings-card">
            <h3>Account Settings</h3>
            <div class="settings-group">
                <h4>Notifications</h4>
                <label class="setting-item">
                    <input type="checkbox" checked>
                    <span>Email notifications</span>
                </label>
                <label class="setting-item">
                    <input type="checkbox" checked>
                    <span>SMS notifications</span>
                </label>
                <label class="setting-item">
                    <input type="checkbox">
                    <span>Promotional emails</span>
                </label>
            </div>
            <div class="settings-group">
                <h4>Privacy</h4>
                <label class="setting-item">
                    <input type="checkbox" checked>
                    <span>Show profile to others</span>
                </label>
                <label class="setting-item">
                    <input type="checkbox">
                    <span>Share purchase history</span>
                </label>
            </div>
            <div class="settings-group">
                <h4>Preferences</h4>
                <div class="setting-item">
                    <label>Language:</label>
                    <select>
                        <option value="id" selected>Bahasa Indonesia</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Currency:</label>
                    <select>
                        <option value="idr" selected>IDR</option>
                        <option value="usd">USD</option>
                    </select>
                </div>
            </div>
            <div class="settings-actions">
                <button class="btn-primary" onclick="saveSettings()">
                    <i class="fas fa-save"></i> Save Settings
                </button>
            </div>
        </div>
    `;
}

function saveSettings() {
    showNotification('Settings saved successfully');
}

// Mobile Menu
function setupMobileMenu() {
    // Add mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

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

// Make functions globally available
window.showPage = showPage;
window.toggleCart = toggleCart;
window.toggleWishlist = toggleWishlist;
window.showUserMenu = showUserMenu;
window.closeUserMenu = closeUserMenu;
window.viewOrderDetail = viewOrderDetail;
window.cancelOrder = cancelOrder;
window.editProfile = editProfile;
window.changePassword = changePassword;
window.saveSettings = saveSettings;
window.showNotification = showNotification;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.increaseQuantity = window.productFunctions ? window.productFunctions.increaseQuantity : function() {};
window.decreaseQuantity = window.productFunctions ? window.productFunctions.decreaseQuantity : function() {};
window.addToCart = window.productFunctions ? window.productFunctions.addToCart : function() {};
window.buyNow = window.productFunctions ? window.productFunctions.buyNow : function() {};
window.searchProducts = window.productFunctions ? window.productFunctions.searchProducts : function() {};
window.filterProducts = window.productFunctions ? window.productFunctions.filterProducts : function() {};
window.sortProducts = window.productFunctions ? window.productFunctions.sortProducts : function() {};
window.filterByCategory = window.productFunctions ? window.productFunctions.filterByCategory : function() {};
window.loadMoreProducts = window.productFunctions ? window.productFunctions.loadMoreProducts : function() {};
window.toggleWishlist = window.productFunctions ? window.productFunctions.toggleWishlist : function() {};
