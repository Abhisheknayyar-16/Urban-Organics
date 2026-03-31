// script.js
const customProducts = [
    { id: 'groundnut', name: 'Groundnut Oil', price: 310, unit: '1L', img: 'media/groundnut.png' },
    { id: 'mustard', name: 'Mustard Oil', price: 400, unit: '1L', img: 'media/mustard.png' },
    { id: 'sesame', name: 'Sesame Oil', price: 500, unit: '1L', img: 'media/sesame.png' },
    { id: 'coconut', name: 'Coconut Oil', price: 350, unit: '500ml', img: 'media/coconut.png' },
    { id: 'almond', name: 'Almond Oil', price: 500, unit: '100ml', img: 'media/almond%20oil.png' },
    { id: 'hairoil', name: 'Hair Oil', price: 450, unit: '200ml', img: 'media/hair%20oil.png' },
    { id: 'rosewater', name: 'Rose Water', price: 150, unit: '100ml', img: 'media/rose%20water.png' },
    { id: 'faceoil', name: 'Face Oil', price: 399, unit: '', img: '' }
];

let cart = JSON.parse(localStorage.getItem('urbanCart')) || {};
let toastTimeout;

function saveCart() {
    localStorage.setItem('urbanCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const totalCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const countBadge = document.querySelector('.cart-count');
    const navCountBadge = document.querySelector('.nav-cart-count');
    
    if(totalCount > 0) {
        countBadge.textContent = totalCount;
        countBadge.classList.remove('hidden');
        if(navCountBadge) {
            navCountBadge.textContent = totalCount;
            navCountBadge.classList.remove('hidden');
        }
    } else {
        countBadge.classList.add('hidden');
        if(navCountBadge) navCountBadge.classList.add('hidden');
    }

    // Update Product Cards
    document.querySelectorAll('.product-card').forEach(card => {
        const id = card.dataset.id;
        const qtyObj = cart[id] || 0;
        const addBtn = card.querySelector('.add-to-cart-btn');
        const qtySelector = card.querySelector('.qty-selector');
        const qtyVal = card.querySelector('.qty-val');

        if(qtyObj > 0) {
            addBtn.classList.add('hidden');
            qtySelector.classList.remove('hidden');
            qtyVal.textContent = qtyObj;
        } else {
            addBtn.classList.remove('hidden');
            qtySelector.classList.add('hidden');
        }
    });

    renderCartSidebar();
}

function renderCartSidebar() {
    const cartItemsContainer = document.getElementById('cartItems');
    const grandTotalEl = document.getElementById('grandTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    const showFormBtn = document.getElementById('showFormBtn');
    
    cartItemsContainer.innerHTML = '';
    let grandTotal = 0;
    
    const items = Object.entries(cart).filter(([id, qty]) => qty > 0);
    
    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        grandTotalEl.textContent = '₹0';
        checkoutForm.classList.add('hidden');
        showFormBtn.style.display = 'none';
        return;
    }
    
    showFormBtn.style.display = checkoutForm.classList.contains('hidden') ? 'block' : 'none';

    items.forEach(([id, qty]) => {
        const product = customProducts.find(p => p.id === id);
        if(!product) return;
        
        const itemTotal = product.price * qty;
        grandTotal += itemTotal;
        
        const imgHtml = product.img ? `<img src="${product.img}" alt="${product.name}">` : `<div style="width:60px;height:60px;background:#eee;border-radius:6px;"></div>`;
        
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                ${imgHtml}
                <div class="cart-item-details">
                    <div class="cart-item-title">${product.name} ${product.unit ? `(${product.unit})` : ''}</div>
                    <div class="cart-item-price">₹${product.price} x ${qty} = <b>₹${itemTotal}</b></div>
                </div>
                <div class="qty-selector" style="height:30px; width:80px; margin-left:auto;">
                    <button class="qty-btn minus" style="width:25px;" data-id="${id}">-</button>
                    <span class="qty-val" style="font-size:0.9rem;">${qty}</span>
                    <button class="qty-btn plus" style="width:25px;" data-id="${id}">+</button>
                </div>
            </div>
        `;
    });
    
    grandTotalEl.textContent = `₹${grandTotal}`;
}

function triggerCartBounce() {
    const navCart = document.getElementById('navCart');
    const floatingCart = document.getElementById('floatingCart');
    if(navCart) {
        navCart.classList.remove('cart-bounce');
        void navCart.offsetWidth;
        navCart.classList.add('cart-bounce');
    }
    if(floatingCart) {
        floatingCart.classList.remove('cart-bounce');
        void floatingCart.offsetWidth;
        floatingCart.classList.add('cart-bounce');
    }
}

function showToast() {
    const toast = document.getElementById('cartToast');
    if(toast) {
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Event Listeners
document.addEventListener('click', (e) => {
    // Add to cart main button
    if (e.target.classList.contains('add-to-cart-btn')) {
        const card = e.target.closest('.product-card');
        const id = card.dataset.id;
        cart[id] = 1;
        saveCart();
        triggerCartBounce();
        showToast();
    }
    
    // Plus minus qty actions
    if (e.target.classList.contains('qty-btn')) {
        let id;
        if(e.target.closest('.product-card')) {
            id = e.target.closest('.product-card').dataset.id;
        } else if(e.target.closest('.cart-item')) {
            id = e.target.dataset.id;
        }
        
        if(id) {
            if(e.target.classList.contains('plus')) {
                cart[id] = (cart[id] || 0) + 1;
                triggerCartBounce();
            } else if (e.target.classList.contains('minus')) {
                cart[id] = Math.max(0, (cart[id] || 0) - 1);
            }
            saveCart();
        }
    }
    
    // Cart Toggle
    if (e.target.closest('#floatingCart') || e.target.closest('#navCart') || e.target.closest('#toastCartBtn')) {
        document.getElementById('cartOverlay').classList.add('active');
        document.getElementById('cartSidebar').classList.add('active');
        const toast = document.getElementById('cartToast');
        if (toast) toast.classList.remove('show');
    }
    
    if (e.target.closest('#closeCart') || e.target.id === 'cartOverlay') {
        document.getElementById('cartOverlay').classList.remove('active');
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('checkoutForm').classList.add('hidden');
        document.getElementById('showFormBtn').style.display = Object.keys(cart).length ? 'block' : 'none';
    }
    
    // Show Form btn
    if (e.target.id === 'showFormBtn') {
        e.target.style.display = 'none';
        document.getElementById('checkoutForm').classList.remove('hidden');
    }
});

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    
    let orderText = "Hey, I would like to place an order:\n\n";
    let grandTotal = 0;
    
    const items = Object.entries(cart).filter(([id, qty]) => qty > 0);
    items.forEach(([id, qty]) => {
        const product = customProducts.find(p => p.id === id);
        if(!product) return;
        const itemTotal = product.price * qty;
        grandTotal += itemTotal;
        orderText += `${product.name} ${product.unit ? `(${product.unit})` : ''} x ${qty} – ₹${itemTotal}\n`;
    });
    
    orderText += `\nTotal: ₹${grandTotal}\n\n`;
    orderText += `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n`;
    orderText += `I understand I have to pay a delivery charge if I am outside Vadodara. Please confirm my order.`;
    
    const encodedMessage = encodeURIComponent(orderText);
    window.open(`https://wa.me/919227799556?text=${encodedMessage}`, '_blank');
});

// Initialize UI
updateCartUI();

// Navbar Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
