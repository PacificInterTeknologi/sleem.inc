// Products Management for SLEEM Fashion Store
// Product catalog, search, filter, and detail functionality

// Global Variables
let products = [];
let categories = [];
let currentProduct = null;
let wishlist = [];

// Initialize Products
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromStorage();
    loadCategoriesFromStorage();
    initializeProductPages();
});

function initializeProductPages() {
    // Load products on page load
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
    
    if (document.getElementById('allProducts')) {
        loadAllProducts();
    }
    
    if (document.getElementById('newProducts')) {
        loadNewProducts();
    }
    
    if (document.getElementById('saleProducts')) {
        loadSaleProducts();
    }
    
    if (document.getElementById('categoryGrid')) {
        loadCategories();
    }
}

// Load demo products
function loadProductsFromStorage() {
    const saved = localStorage.getItem('sleemProducts');
    if (saved) {
        products = JSON.parse(saved);
    } else {
        // Initialize with demo fashion products
        products = [
            {
                id: 1,
                name: 'Elegant Pink Dress',
                category: 'dress',
                price: 450000,
                originalPrice: 650000,
                discount: 30,
                description: 'Beautiful pink dress perfect for special occasions. Made from high-quality fabric with elegant design.',
                image: '👗',
                images: ['👗', '👗', '👗'],
                brand: 'SLEEM',
                sku: 'SLM-DRS-001',
                stock: 15,
                sizes: ['xs', 's', 'm', 'l', 'xl'],
                colors: ['pink', 'rose', 'coral'],
                rating: 4.5,
                reviews: 23,
                isNew: true,
                isSale: true,
                tags: ['elegant', 'formal', 'party'],
                addedDate: '2024-03-15'
            },
            {
                id: 2,
                name: 'Floral Summer Top',
                category: 'tops',
                price: 280000,
                originalPrice: 350000,
                discount: 20,
                description: 'Light and comfortable summer top with beautiful floral pattern. Perfect for casual outings.',
                image: '👚',
                images: ['👚', '👚', '👚'],
                brand: 'SLEEM',
                sku: 'SLM-TOP-002',
                stock: 25,
                sizes: ['s', 'm', 'l', 'xl'],
                colors: ['white', 'pink', 'blue'],
                rating: 4.3,
                reviews: 18,
                isNew: true,
                isSale: true,
                tags: ['summer', 'casual', 'floral'],
                addedDate: '2024-03-18'
            },
            {
                id: 3,
                name: 'Classic Blue Jeans',
                category: 'bottoms',
                price: 380000,
                originalPrice: 450000,
                discount: 15,
                description: 'Classic fit blue jeans with modern styling. Comfortable and versatile for any occasion.',
                image: '👖',
                images: ['👖', '👖', '👖'],
                brand: 'SLEEM',
                sku: 'SLM-BTM-003',
                stock: 30,
                sizes: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
                colors: ['blue', 'black', 'grey'],
                rating: 4.7,
                reviews: 45,
                isNew: false,
                isSale: true,
                tags: ['classic', 'casual', 'versatile'],
                addedDate: '2024-02-20'
            },
            {
                id: 4,
                name: 'Chic Handbag',
                category: 'accessories',
                price: 550000,
                originalPrice: 750000,
                discount: 27,
                description: 'Elegant handbag made from premium materials. Perfect complement to any outfit.',
                image: '👜',
                images: ['👜', '👜', '👜'],
                brand: 'SLEEM',
                sku: 'SLM-ACC-004',
                stock: 10,
                sizes: ['one-size'],
                colors: ['black', 'brown', 'pink'],
                rating: 4.8,
                reviews: 32,
                isNew: true,
                isSale: true,
                tags: ['elegant', 'premium', 'versatile'],
                addedDate: '2024-03-20'
            },
            {
                id: 5,
                name: 'Romantic Red Dress',
                category: 'dress',
                price: 520000,
                originalPrice: 650000,
                discount: 20,
                description: 'Stunning red dress for romantic occasions. Eye-catching design with comfortable fit.',
                image: '👗',
                images: ['👗', '👗', '👗'],
                brand: 'SLEEM',
                sku: 'SLM-DRS-005',
                stock: 12,
                sizes: ['xs', 's', 'm', 'l'],
                colors: ['red', 'burgundy', 'wine'],
                rating: 4.6,
                reviews: 28,
                isNew: false,
                isSale: false,
                tags: ['romantic', 'formal', 'bold'],
                addedDate: '2024-02-15'
            },
            {
                id: 6,
                name: 'Casual White Shirt',
                category: 'tops',
                price: 220000,
                originalPrice: 280000,
                discount: 21,
                description: 'Comfortable white shirt perfect for everyday wear. Classic design with modern fit.',
                image: '👔',
                images: ['👔', '👔', '👔'],
                brand: 'SLEEM',
                sku: 'SLM-TOP-006',
                stock: 40,
                sizes: ['xs', 's', 'm', 'l', 'xl'],
                colors: ['white', 'cream', 'beige'],
                rating: 4.4,
                reviews: 35,
                isNew: false,
                isSale: false,
                tags: ['casual', 'classic', 'versatile'],
                addedDate: '2024-01-20'
            },
            {
                id: 7,
                name: 'Stylish Black Skirt',
                category: 'bottoms',
                price: 320000,
                originalPrice: 400000,
                discount: 20,
                description: 'Modern black skirt with elegant design. Perfect for office or casual outings.',
                image: '👗',
                images: ['👗', '👗', '👗'],
                brand: 'SLEEM',
                sku: 'SLM-BTM-007',
                stock: 20,
                sizes: ['xs', 's', 'm', 'l', 'xl'],
                colors: ['black', 'navy', 'grey'],
                rating: 4.5,
                reviews: 22,
                isNew: false,
                isSale: false,
                tags: ['modern', 'versatile', 'office'],
                addedDate: '2024-02-10'
            },
            {
                id: 8,
                name: 'Fashion Sunglasses',
                category: 'accessories',
                price: 180000,
                originalPrice: 250000,
                discount: 28,
                description: 'Stylish sunglasses with UV protection. Complete your look with these trendy shades.',
                image: '🕶️',
                images: ['🕶️', '🕶️', '🕶️'],
                brand: 'SLEEM',
                sku: 'SLM-ACC-008',
                stock: 35,
                sizes: ['one-size'],
                colors: ['black', 'brown', 'pink'],
                rating: 4.2,
                reviews: 15,
                isNew: true,
                isSale: true,
                tags: ['trendy', 'protection', 'summer'],
                addedDate: '2024-03-22'
            }
        ];
        saveProductsToStorage();
    }
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('sleemProducts', JSON.stringify(products));
}

// Load categories
function loadCategoriesFromStorage() {
    const saved = localStorage.getItem('sleemCategories');
    if (saved) {
        categories = JSON.parse(saved);
    } else {
        categories = [
            { id: 'dress', name: 'Dress', icon: '👗', description: 'Elegant dresses for all occasions' },
            { id: 'tops', name: 'Tops', icon: '👚', description: 'Casual and formal tops' },
            { id: 'bottoms', name: 'Bottoms', icon: '👖', description: 'Jeans, skirts, and pants' },
            { id: 'accessories', name: 'Accessories', icon: '💎', description: 'Bags, jewelry, and more' },
            { id: 'shoes', name: 'Shoes', icon: '👠', description: 'Fashionable footwear' },
            { id: 'outerwear', name: 'Outerwear', icon: '🧥', description: 'Jackets and coats' }
        ];
        saveCategoriesToStorage();
    }
}

// Save categories to localStorage
function saveCategoriesToStorage() {
    localStorage.setItem('sleemCategories', JSON.stringify(categories));
}

// Load featured products
function loadFeaturedProducts() {
    const featuredProducts = products.filter(p => p.isNew || p.rating >= 4.5).slice(0, 6);
    renderProducts('featuredProducts', featuredProducts);
}

// Load all products
function loadAllProducts() {
    renderProducts('allProducts', products);
}

// Load new products
function loadNewProducts() {
    const newProducts = products.filter(p => p.isNew);
    renderProducts('newProducts', newProducts);
}

// Load sale products
function loadSaleProducts() {
    const saleProducts = products.filter(p => p.isSale);
    renderProducts('saleProducts', saleProducts);
}

// Load categories
function loadCategories() {
    const container = document.getElementById('categoryGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.onclick = () => filterByCategory(category.id);
        
        categoryCard.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <h4>${category.name}</h4>
            <p>${category.description}</p>
        `;
        
        container.appendChild(categoryCard);
    });
}

// Render products
function renderProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    productList.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetail(product.id);
    
    const stockClass = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
    const stockText = product.stock > 0 ? `Stok: ${product.stock}` : 'Habis';
    
    card.innerHTML = `
        <div class="product-image">
            ${product.isNew ? '<div class="product-badge new">NEW</div>' : ''}
            ${product.isSale ? `<div class="product-badge sale">-${product.discount}%</div>` : ''}
            ${product.image}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <div class="stars">
                    ${generateStars(product.rating)}
                </div>
                <span class="review-count">(${product.reviews})</span>
            </div>
            <div class="product-price">
                <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                ${product.discount > 0 ? `<span class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="btn-wishlist-product" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="btn-cart-product" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Show product detail
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Update breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    if (breadcrumbCategory) {
        const category = categories.find(c => c.id === product.category);
        breadcrumbCategory.textContent = category ? category.name : product.category;
    }
    
    // Update product info
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productRating').innerHTML = generateStars(product.rating);
    document.getElementById('reviewCount').textContent = `(${product.reviews} reviews)`;
    document.getElementById('currentPrice').textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
    document.getElementById('originalPrice').textContent = product.discount > 0 ? `Rp ${product.originalPrice.toLocaleString('id-ID')}` : '';
    document.getElementById('discountBadge').textContent = product.discount > 0 ? `${product.discount}% OFF` : '';
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productSku').textContent = product.sku;
    document.getElementById('stockStatus').textContent = product.stock > 0 ? `Tersedia (${product.stock} unit)` : 'Stok Habis';
    document.getElementById('stockStatus').className = product.stock > 0 ? 'availability in-stock' : 'availability out-of-stock';
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('quantity').value = 1;
    
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.innerHTML = `<div class="image-placeholder">${product.image}</div>`;
    }
    
    // Load image thumbnails
    loadImageThumbnails(product);
    
    // Load size options
    loadSizeOptions(product);
    
    // Load color options
    loadColorOptions(product);
    
    // Show product detail page
    if (window.showPage) {
        window.showPage('productDetail');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load image thumbnails
function loadImageThumbnails(product) {
    const container = document.getElementById('imageThumbnails');
    if (!container) return;
    
    container.innerHTML = '';
    
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        thumbnail.innerHTML = `<div class="image-placeholder">${image}</div>`;
        thumbnail.onclick = () => selectImage(image, thumbnail);
        container.appendChild(thumbnail);
    });
}

// Select image
function selectImage(image, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.innerHTML = `<div class="image-placeholder">${image}</div>`;
    }
    
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Load size options
function loadSizeOptions(product) {
    const container = document.getElementById('sizeOptions');
    if (!container) return;
    
    container.innerHTML = '';
    
    product.sizes.forEach(size => {
        const sizeOption = document.createElement('button');
        sizeOption.className = 'size-option';
        sizeOption.textContent = size.toUpperCase();
        sizeOption.onclick = () => selectSize(size, sizeOption);
        container.appendChild(sizeOption);
    });
}

// Select size
function selectSize(size, element) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    if (currentProduct) {
        currentProduct.selectedSize = size;
    }
}

// Load color options
function loadColorOptions(product) {
    const container = document.getElementById('colorOptions');
    if (!container) return;
    
    container.innerHTML = '';
    
    product.colors.forEach(color => {
        const colorOption = document.createElement('button');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = getColorHex(color);
        colorOption.title = color;
        colorOption.onclick = () => selectColor(color, colorOption);
        container.appendChild(colorOption);
    });
}

// Get color hex code
function getColorHex(color) {
    const colorMap = {
        'pink': '#ff69b4',
        'rose': '#ff85c1',
        'coral': '#ff7f50',
        'red': '#e91e63',
        'burgundy': '#800020',
        'wine': '#722f37',
        'white': '#ffffff',
        'cream': '#fff8e1',
        'beige': '#f5f5dc',
        'blue': '#2196f3',
        'navy': '#000080',
        'grey': '#808080',
        'black': '#000000',
        'brown': '#8b4513'
    };
    return colorMap[color] || '#cccccc';
}

// Select color
function selectColor(color, element) {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    if (currentProduct) {
        currentProduct.selectedColor = color;
    }
}

// Increase quantity
function increaseQuantity() {
    const input = document.getElementById('quantity');
    if (input) {
        input.value = Math.max(1, parseInt(input.value) + 1);
    }
}

// Decrease quantity
function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (input) {
        input.value = Math.max(1, parseInt(input.value) - 1);
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const size = product.selectedSize || product.sizes[0];
    const color = product.selectedColor || product.colors[0];
    
    if (window.cartFunctions) {
        window.cartFunctions.addToCart(product, quantity, size, color);
    }
}

// Buy now
function buyNow(productId) {
    addToCart(productId);
    if (window.showPage) {
        window.showPage('cart');
    }
}

// Toggle wishlist
function toggleWishlist(productId) {
    if (window.authFunctions) {
        if (window.authFunctions.addToWishlist(productId)) {
            updateWishlistUI();
        }
    }
}

// Update wishlist UI
function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount && window.authFunctions) {
        const wishlist = window.authFunctions.getCustomerWishlist();
        wishlistCount.textContent = wishlist.length;
    }
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        loadAllProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    renderProducts('allProducts', filteredProducts);
    
    if (window.showPage) {
        window.showPage('products');
    }
}

// Filter products
function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const size = document.getElementById('sizeFilter').value;
    
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (size) {
        filteredProducts = filteredProducts.filter(p => p.sizes.includes(size));
    }
    
    renderProducts('allProducts', filteredProducts);
}

// Sort products
function sortProducts() {
    const sortBy = document.getElementById('sortFilter').value;
    
    let sortedProducts = [...products];
    
    switch(sortBy) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            break;
        case 'popular':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    renderProducts('allProducts', sortedProducts);
}

// Filter by category
function filterByCategory(categoryId) {
    const filteredProducts = products.filter(p => p.category === categoryId);
    renderProducts('allProducts', filteredProducts);
    
    if (window.showPage) {
        window.showPage('products');
    }
    
    // Update category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = categoryId;
    }
}

// Load more products
function loadMoreProducts() {
    // In a real app, this would load more products from the server
    showNotification('Tidak ada produk lagi untuk ditampilkan');
}

// Get product by ID
function getProductById(productId) {
    return products.find(p => p.id === productId);
}

// Get products by category
function getProductsByCategory(category) {
    return products.filter(p => p.category === category);
}

// Get new products
function getNewProducts() {
    return products.filter(p => p.isNew);
}

// Get sale products
function getSaleProducts() {
    return products.filter(p => p.isSale);
}

// Get featured products
function getFeaturedProducts() {
    return products.filter(p => p.isNew || p.rating >= 4.5).slice(0, 6);
}

// Export functions for use in other scripts
window.productFunctions = {
    products,
    categories,
    currentProduct,
    showProductDetail,
    searchProducts,
    filterProducts,
    sortProducts,
    filterByCategory,
    getProductsByCategory,
    getNewProducts,
    getSaleProducts,
    getFeaturedProducts,
    getProductById,
    addToCart,
    buyNow,
    toggleWishlist,
    updateWishlistUI
};
