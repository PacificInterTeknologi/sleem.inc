// Checkout System for SLEEM Fashion Store
// Order processing, payment, and order management

// Global Variables
let orders = [];
let currentOrder = null;

// Initialize Checkout
document.addEventListener('DOMContentLoaded', function() {
    loadOrdersFromStorage();
    initializeCheckout();
});

function initializeCheckout() {
    // Load cart items
    loadCheckoutItems();
    
    // Setup form validation
    setupCheckoutForm();
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// Load orders from localStorage
function loadOrdersFromStorage() {
    const saved = localStorage.getItem('sleemOrders');
    if (saved) {
        orders = JSON.parse(saved);
    }
}

// Save orders to localStorage
function saveOrdersToStorage() {
    localStorage.setItem('sleemOrders', JSON.stringify(orders));
}

// Save single order
function saveOrder(order) {
    orders.push(order);
    saveOrdersToStorage();
}

// Load checkout items
function loadCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutShipping = document.getElementById('checkoutShipping');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = '';
    
    if (window.cartFunctions) {
        const cartItems = window.cartFunctions.getCartItems();
        let subtotal = 0;
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <div class="checkout-item-image">
                    <div class="image-placeholder">${item.image}</div>
                </div>
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <div class="checkout-item-details">
                        <span>Size: ${item.size.toUpperCase()}</span>
                        <span>Color: ${item.color}</span>
                        <span>Qty: ${item.quantity}</span>
                    </div>
                    <div class="checkout-item-price">
                        Rp ${itemTotal.toLocaleString('id-ID')}
                    </div>
                </div>
            `;
            checkoutItems.appendChild(checkoutItem);
        });
        
        // Calculate totals
        const shipping = subtotal > 0 ? 15000 : 0;
        const total = subtotal + shipping;
        
        if (checkoutSubtotal) checkoutSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        if (checkoutShipping) checkoutShipping.textContent = `Rp ${shipping.toLocaleString('id-ID')}`;
        if (checkoutTotal) checkoutTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();
    
    // Check if user is logged in
    if (window.authFunctions && !window.authFunctions.isLoggedIn()) {
        showNotification('Please login to continue checkout', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Validate cart
    if (window.cartFunctions) {
        const validation = window.cartFunctions.validateCart();
        if (!validation.valid) {
            showNotification(validation.message, 'error');
            return;
        }
    }
    
    // Get form data
    const formData = getCheckoutFormData();
    
    if (!validateCheckoutForm(formData)) {
        return;
    }
    
    // Create order
    const order = createOrder(formData);
    
    // Save order
    saveOrder(order);
    
    // Clear cart
    if (window.cartFunctions) {
        window.cartFunctions.clearCart();
    }
    
    // Show success message
    showOrderSuccess(order);
    
    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = `orders.html?order=${order.id}`;
    }, 3000);
}

// Get checkout form data
function getCheckoutFormData() {
    return {
        fullName: document.getElementById('fullName')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        address: document.getElementById('address')?.value || '',
        city: document.getElementById('city')?.value || '',
        province: document.getElementById('province')?.value || '',
        postalCode: document.getElementById('postalCode')?.value || '',
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'transfer',
        notes: document.getElementById('notes')?.value || '',
        shippingMethod: document.querySelector('input[name="shippingMethod"]:checked')?.value || 'regular'
    };
}

// Validate checkout form
function validateCheckoutForm(formData) {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.province || !formData.postalCode) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    // Validate phone number
    const phoneRegex = /^08[0-9]{10,12}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Validate email if provided
    if (formData.email && !formData.email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

// Create order
function createOrder(formData) {
    const cartItems = window.cartFunctions ? window.cartFunctions.getCartItems() : [];
    const subtotal = window.cartFunctions ? window.cartFunctions.getCartTotal() : 0;
    const shipping = subtotal > 0 ? 15000 : 0;
    const total = subtotal + shipping;
    
    const order = {
        id: 'ORD-' + Date.now(),
        customerId: window.authFunctions ? window.authFunctions.getCurrentUser().id : 'GUEST',
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        shippingAddress: {
            address: formData.address,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode
        },
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            total: item.price * item.quantity
        })),
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: formData.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    currentOrder = order;
    return order;
}

// Show order success
function showOrderSuccess(order) {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.innerHTML = `
            <div class="order-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Order Placed Successfully!</h3>
                <p>Order ID: <strong>${order.id}</strong></p>
                <p>Total Amount: <strong>Rp ${order.total.toLocaleString('id-ID')}</strong></p>
                <p>We'll send you a confirmation message shortly.</p>
                <div class="order-actions">
                    <button class="btn-primary" onclick="window.location.href='orders.html'">
                        View Orders
                    </button>
                    <button class="btn-secondary" onclick="window.location.href='index.html'">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
        successMessage.style.display = 'block';
    }
}

// Get order by ID
function getOrderById(orderId) {
    return orders.find(order => order.id === orderId);
}

// Get orders by customer
function getOrdersByCustomer(customerId) {
    return orders.filter(order => order.customerId === customerId);
}

// Update order status
function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        saveOrdersToStorage();
        return true;
    }
    return false;
}

// Cancel order
function cancelOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'pending') {
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
        saveOrdersToStorage();
        showNotification('Order cancelled successfully');
        return true;
    }
    showNotification('Cannot cancel this order', 'error');
    return false;
}

// Generate order summary
function generateOrderSummary(order) {
    return `
        <div class="order-summary">
            <div class="order-header">
                <h3>Order Summary</h3>
                <p>Order ID: ${order.id}</p>
                <p>Status: <span class="order-status ${order.status}">${order.status}</span></p>
                <p>Date: ${new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
            
            <div class="order-items">
                <h4>Items</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="order-item-image">
                            <div class="image-placeholder">${item.image || '👗'}</div>
                        </div>
                        <div class="order-item-info">
                            <h5>${item.name}</h5>
                            <div class="order-item-details">
                                <span>Size: ${item.size.toUpperCase()}</span>
                                <span>Color: ${item.color}</span>
                                <span>Qty: ${item.quantity}</span>
                            </div>
                            <div class="order-item-price">
                                Rp ${item.price.toLocaleString('id-ID')} × ${item.quantity} = Rp ${item.total.toLocaleString('id-ID')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-shipping">
                <h4>Shipping Address</h4>
                <p>${order.customerName}</p>
                <p>${order.customerPhone}</p>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}</p>
            </div>
            
            <div class="order-payment">
                <h4>Payment Details</h4>
                <p>Method: ${order.paymentMethod}</p>
                <p>Shipping: ${order.shippingMethod}</p>
                <div class="order-totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>Rp ${order.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>Rp ${order.shipping.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="total-row total">
                        <span>Total:</span>
                        <span>Rp ${order.total.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate invoice
function generateInvoice(order) {
    const invoiceHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
                .invoice-header { text-align: center; margin-bottom: 30px; }
                .invoice-details { margin-bottom: 30px; }
                .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                .invoice-table th { background: #f5f5f5; }
                .invoice-totals { text-align: right; margin-top: 20px; }
                .total-row { margin: 5px 0; }
                .total { font-weight: bold; font-size: 18px; }
            </style>
        </head>
        <body>
            <div class="invoice">
                <div class="invoice-header">
                    <h1>SLEEM Fashion Store</h1>
                    <h2>Invoice</h2>
                    <p>Order ID: ${order.id}</p>
                    <p>Date: ${new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                
                <div class="invoice-details">
                    <h3>Customer Information</h3>
                    <p>Name: ${order.customerName}</p>
                    <p>Phone: ${order.customerPhone}</p>
                    <p>Email: ${order.customerEmail}</p>
                    
                    <h3>Shipping Address</h3>
                    <p>${order.shippingAddress.address}</p>
                    <p>${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}</p>
                </div>
                
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Color</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.size.toUpperCase()}</td>
                                <td>${item.color}</td>
                                <td>${item.quantity}</td>
                                <td>Rp ${item.price.toLocaleString('id-ID')}</td>
                                <td>Rp ${item.total.toLocaleString('id-ID')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="invoice-totals">
                    <div class="total-row">Subtotal: Rp ${order.subtotal.toLocaleString('id-ID')}</div>
                    <div class="total-row">Shipping: Rp ${order.shipping.toLocaleString('id-ID')}</div>
                    <div class="total-row total">Total: Rp ${order.total.toLocaleString('id-ID')}</div>
                </div>
                
                <div class="invoice-footer">
                    <p>Thank you for shopping at SLEEM Fashion Store!</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return invoiceHtml;
}

// Print invoice
function printInvoice(orderId) {
    const order = getOrderById(orderId);
    if (order) {
        const invoiceHtml = generateInvoice(order);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
        printWindow.print();
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
window.checkoutFunctions = {
    createOrder,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
    cancelOrder,
    generateOrderSummary,
    generateInvoice,
    printInvoice,
    loadCheckoutItems
};
