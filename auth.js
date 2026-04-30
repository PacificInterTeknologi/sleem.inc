// Authentication System for SLEEM Fashion Store
// Customer registration and login functionality

// Global Variables
let currentUser = null;
let customers = [];

// Initialize Authentication
document.addEventListener('DOMContentLoaded', function() {
    loadCustomersFromStorage();
    checkAuthStatus();
    setupAuthEventListeners();
});

function setupAuthEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Load customers from localStorage
function loadCustomersFromStorage() {
    const saved = localStorage.getItem('sleemCustomers');
    if (saved) {
        customers = JSON.parse(saved);
    } else {
        // Initialize with demo customers
        customers = [
            {
                id: 'CUST-001',
                fullName: 'Sarah Putri',
                phone: '08123456789',
                email: 'sarah@example.com',
                password: '123456',
                birthdate: '1995-05-15',
                address: 'Jakarta Selatan, Indonesia',
                registeredAt: '2024-01-15',
                totalOrders: 5,
                totalSpent: 2500000
            },
            {
                id: 'CUST-002',
                fullName: 'Maya Sari',
                phone: '08234567890',
                email: 'maya@example.com',
                password: '123456',
                birthdate: '1992-08-20',
                address: 'Bandung, Indonesia',
                registeredAt: '2024-02-20',
                totalOrders: 3,
                totalSpent: 1800000
            }
        ];
        saveCustomersToStorage();
    }
}

// Save customers to localStorage
function saveCustomersToStorage() {
    localStorage.setItem('sleemCustomers', JSON.stringify(customers));
}

// Check authentication status
function checkAuthStatus() {
    const savedUser = localStorage.getItem('sleemCurrentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate input
    if (!phone || !password) {
        showNotification('Mohon isi semua field', 'error');
        return;
    }
    
    // Find customer
    const customer = customers.find(c => c.phone === phone && c.password === password);
    
    if (customer) {
        // Login successful
        currentUser = customer;
        
        // Save session
        if (rememberMe) {
            localStorage.setItem('sleemCurrentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('sleemCurrentUser', JSON.stringify(currentUser));
        }
        
        showNotification('Login berhasil! Selamat datang, ' + customer.fullName);
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } else {
        // Login failed
        showNotification('Nomor HP atau password salah', 'error');
    }
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate input
    if (!fullName || !phone || !password || !confirmPassword) {
        showNotification('Mohon isi field yang wajib diisi', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password minimal 6 karakter', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Password dan konfirmasi password tidak sama', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Anda harus setuju dengan syarat dan ketentuan', 'error');
        return;
    }
    
    // Check if phone already exists
    if (customers.find(c => c.phone === phone)) {
        showNotification('Nomor HP sudah terdaftar', 'error');
        return;
    }
    
    // Create new customer
    const newCustomer = {
        id: 'CUST-' + Date.now(),
        fullName: fullName,
        phone: phone,
        email: email || '',
        password: password,
        birthdate: birthdate || '',
        address: address || '',
        registeredAt: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
        wishlist: [],
        cart: []
    };
    
    // Add to customers array
    customers.push(newCustomer);
    saveCustomersToStorage();
    
    // Auto login after registration
    currentUser = newCustomer;
    localStorage.setItem('sleemCurrentUser', JSON.stringify(currentUser));
    
    showNotification('Registrasi berhasil! Selamat datang, ' + fullName);
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('sleemCurrentUser');
    sessionStorage.removeItem('sleemCurrentUser');
    
    showNotification('Anda telah logout');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Update user UI
function updateUserUI() {
    if (!currentUser) return;
    
    // Update user button text
    const userButton = document.querySelector('.btn-user');
    if (userButton) {
        userButton.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.fullName}`;
    }
    
    // Update user menu
    updateUserMenu();
}

// Update user menu
function updateUserMenu() {
    const userMenuContent = document.getElementById('userMenuContent');
    if (!userMenuContent) return;
    
    if (currentUser) {
        userMenuContent.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="user-details">
                    <h4>${currentUser.fullName}</h4>
                    <p>${currentUser.phone}</p>
                    <p>${currentUser.email || 'Email tidak tersedia'}</p>
                </div>
            </div>
            <div class="user-menu-actions">
                <button class="btn-menu" onclick="showPage('orders')">
                    <i class="fas fa-clipboard-list"></i> Pesanan Saya
                </button>
                <button class="btn-menu" onclick="showPage('wishlist')">
                    <i class="fas fa-heart"></i> Wishlist
                </button>
                <button class="btn-menu" onclick="showPage('profile')">
                    <i class="fas fa-user"></i> Profil
                </button>
                <button class="btn-menu" onclick="showPage('settings')">
                    <i class="fas fa-cog"></i> Pengaturan
                </button>
                <button class="btn-logout" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;
    } else {
        userMenuContent.innerHTML = `
            <div class="auth-actions">
                <button class="btn-primary" onclick="window.location.href='login.html'">
                    <i class="fas fa-user"></i> Login
                </button>
                <button class="btn-secondary" onclick="window.location.href='register.html'">
                    <i class="fas fa-user-plus"></i> Daftar
                </button>
            </div>
        `;
    }
}

// Show user menu modal
function showUserMenu() {
    const modal = document.getElementById('userMenuModal');
    if (modal) {
        modal.style.display = 'flex';
        updateUserMenu();
    }
}

// Close user menu modal
function closeUserMenu() {
    const modal = document.getElementById('userMenuModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Get current user
function getCurrentUser() {
    if (!currentUser) {
        // Try to get from storage
        const savedUser = localStorage.getItem('sleemCurrentUser') || sessionStorage.getItem('sleemCurrentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }
    }
    return currentUser;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Require authentication
function requireAuth() {
    if (!isLoggedIn()) {
        showNotification('Silakan login terlebih dahulu', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return false;
    }
    return true;
}

// Update customer data
function updateCustomerData(updates) {
    if (!currentUser) return false;
    
    const customerIndex = customers.findIndex(c => c.id === currentUser.id);
    if (customerIndex === -1) return false;
    
    // Update customer data
    customers[customerIndex] = { ...customers[customerIndex], ...updates };
    currentUser = customers[customerIndex];
    
    // Save to storage
    saveCustomersToStorage();
    
    // Update current user in storage
    localStorage.setItem('sleemCurrentUser', JSON.stringify(currentUser));
    
    return true;
}

// Get customer orders
function getCustomerOrders() {
    // This would typically fetch from an API or database
    // For now, return empty array
    return [];
}

// Get customer wishlist
function getCustomerWishlist() {
    if (!currentUser) return [];
    return currentUser.wishlist || [];
}

// Add to wishlist
function addToWishlist(productId) {
    if (!requireAuth()) return false;
    
    if (!currentUser.wishlist) {
        currentUser.wishlist = [];
    }
    
    if (!currentUser.wishlist.includes(productId)) {
        currentUser.wishlist.push(productId);
        updateCustomerData({ wishlist: currentUser.wishlist });
        showNotification('Produk ditambahkan ke wishlist');
        return true;
    } else {
        showNotification('Produk sudah ada di wishlist', 'warning');
        return false;
    }
}

// Remove from wishlist
function removeFromWishlist(productId) {
    if (!currentUser) return false;
    
    if (!currentUser.wishlist) return false;
    
    const index = currentUser.wishlist.indexOf(productId);
    if (index > -1) {
        currentUser.wishlist.splice(index, 1);
        updateCustomerData({ wishlist: currentUser.wishlist });
        showNotification('Produk dihapus dari wishlist');
        return true;
    }
    return false;
}

// Forgot password
function forgotPassword() {
    const phone = prompt('Masukkan nomor HP Anda:');
    if (!phone) return;
    
    const customer = customers.find(c => c.phone === phone);
    if (customer) {
        // In a real app, this would send an SMS or email
        showNotification('Password reset link telah dikirim ke ' + phone);
    } else {
        showNotification('Nomor HP tidak ditemukan', 'error');
    }
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
window.authFunctions = {
    getCurrentUser,
    isLoggedIn,
    requireAuth,
    logout,
    showUserMenu,
    closeUserMenu,
    addToWishlist,
    removeFromWishlist,
    getCustomerWishlist,
    updateCustomerData,
    showNotification
};
