/* ChicShop+ - Main JavaScript */

// ============ UTILITIES ============
function getCSRFToken() {
  const cookie = document.cookie.split('; ').find(r => r.startsWith('csrftoken='));
  if (cookie) return cookie.split('=')[1];
  const meta = document.querySelector('[name=csrfmiddlewaretoken]');
  return meta ? meta.value : '';
}

function formatCFA(n) {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString('fr-FR').replace(/,/g, ' ') + ' F CFA';
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

async function apiPost(url, data) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
    body: JSON.stringify(data),
    credentials: 'same-origin',
  });
  return r.json();
}

// ============ FLASH SALE TIMER ============
function updateFlashTimer() {
  const el = document.getElementById('flash-timer');
  if (!el) return;
  const target = new Date();
  target.setHours(23, 59, 59, 0);
  const diff = Math.max(0, target - new Date());
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateFlashTimer, 1000);
updateFlashTimer();

// ============ MOBILE MENU ============
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ============ CART DRAWER ============
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');

function openCart() {
  if (cartOverlay) cartOverlay.classList.add('open');
  if (cartDrawer) cartDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  if (cartOverlay) cartOverlay.classList.remove('open');
  if (cartDrawer) cartDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

if (cartToggle) cartToggle.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// ============ ADD TO CART ============
async function addToCart(slug, quantity = 1, embroideryName = '') {
  try {
    const res = await apiPost('/cart/add/', {
      slug,
      quantity,
      embroidery_name: embroideryName,
    });
    if (res.success) {
      updateCartBadge(res.cart_count);
      showToast(res.message || 'Ajouté au panier');
      // Refresh cart drawer
      await refreshCartDrawer();
      openCart();
    } else {
      showToast(res.error || 'Erreur', 'error');
    }
  } catch (e) {
    showToast('Erreur réseau', 'error');
  }
}

function updateCartBadge(count) {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? '' : 'none';
}

async function updateCartItem(index, delta) {
  const res = await apiPost('/cart/update/', { index, delta });
  if (res.success) {
    updateCartBadge(res.cart_count);
    await refreshCartDrawer();
  }
}

async function removeCartItem(index) {
  const res = await apiPost('/cart/remove/', { index });
  if (res.success) {
    updateCartBadge(res.cart_count);
    await refreshCartDrawer();
  }
}

async function refreshCartDrawer() {
  try {
    const r = await fetch('/panier/?partial=1', { credentials: 'same-origin' });
    const html = await r.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newBody = doc.getElementById('cart-body-content');
    const newFooter = doc.getElementById('cart-footer-content');
    const currentBody = document.getElementById('cart-body-content');
    const currentFooter = document.getElementById('cart-footer-content');
    if (newBody && currentBody) currentBody.innerHTML = newBody.innerHTML;
    if (newFooter && currentFooter) currentFooter.innerHTML = newFooter.innerHTML;
  } catch (e) {}
}

// ============ HERO PERSONALIZATION ============
const heroInput = document.getElementById('hero-name-input');
const heroPreview = document.getElementById('hero-name-preview');
if (heroInput && heroPreview) {
  heroInput.addEventListener('input', (e) => {
    const v = e.target.value.slice(0, 18);
    e.target.value = v;
    heroPreview.textContent = v || 'Votre prénom';
  });
}

// ============ ADD TO CART BUTTONS (delegation) ============
document.addEventListener('click', async (e) => {
  // Add to cart from product card
  const addBtn = e.target.closest('[data-add-cart]');
  if (addBtn) {
    e.preventDefault();
    const slug = addBtn.dataset.addCart;
    addToCart(slug, 1);
  }
  
  // Add to cart from product detail
  const detailBtn = e.target.closest('[data-add-cart-detail]');
  if (detailBtn) {
    e.preventDefault();
    const slug = detailBtn.dataset.addCartDetail;
    const qty = parseInt(document.getElementById('qty-value')?.textContent || '1');
    const embroidery = document.getElementById('embroidery-input')?.value || '';
    addToCart(slug, qty, embroidery);
  }
  
  // Cart item update
  const qtyBtn = e.target.closest('[data-cart-qty]');
  if (qtyBtn) {
    e.preventDefault();
    const index = parseInt(qtyBtn.dataset.cartIndex);
    const delta = parseInt(qtyBtn.dataset.cartQty);
    updateCartItem(index, delta);
  }
  
  // Cart item remove
  const removeBtn = e.target.closest('[data-cart-remove]');
  if (removeBtn) {
    e.preventDefault();
    const index = parseInt(removeBtn.dataset.cartRemove);
    removeCartItem(index);
  }
});

// ============ PRODUCT DETAIL QUANTITY ============
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const qtyValue = document.getElementById('qty-value');
if (qtyMinus && qtyPlus && qtyValue) {
  qtyMinus.addEventListener('click', () => {
    const v = Math.max(1, parseInt(qtyValue.textContent) - 1);
    qtyValue.textContent = v;
  });
  qtyPlus.addEventListener('click', () => {
    qtyValue.textContent = parseInt(qtyValue.textContent) + 1;
  });
}

// Live preview of embroidery on product detail
const embroideryInput = document.getElementById('embroidery-input');
const embroideryPreview = document.getElementById('embroidery-preview');
if (embroideryInput && embroideryPreview) {
  embroideryInput.addEventListener('input', (e) => {
    embroideryPreview.textContent = e.target.value || '';
    if (e.target.value) {
      embroideryPreview.parentElement.style.display = '';
    } else {
      embroideryPreview.parentElement.style.display = 'none';
    }
  });
}

// ============ PERSONALIZE PAGE ============
const personalizeInput = document.getElementById('personalize-name');
const personalizePreview = document.getElementById('personalize-preview');
if (personalizeInput && personalizePreview) {
  personalizeInput.addEventListener('input', (e) => {
    const v = e.target.value.slice(0, 18);
    e.target.value = v;
    personalizePreview.textContent = v || 'Votre prénom';
  });
}

const colorBtns = document.querySelectorAll('[data-color]');
const rugShape = document.getElementById('rug-shape-preview');
const colors = {
  rose: { bg: 'linear-gradient(180deg, #E5B3B3 0%, #D89595 60%, #C56F6F 100%)', textColor: '#D4AF37' },
  emerald: { bg: 'linear-gradient(180deg, #1A3C2F 0%, #0E2419 100%)', textColor: '#D4AF37' },
  bone: { bg: 'linear-gradient(180deg, #F2EBE5 0%, #D6CCBF 100%)', textColor: '#1A3C2F' },
  gold: { bg: 'linear-gradient(180deg, #E4C76A 0%, #B8932A 100%)', textColor: '#1A3C2F' },
};
colorBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    colorBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const color = btn.dataset.color;
    if (rugShape && colors[color]) {
      rugShape.style.background = colors[color].bg;
      if (personalizePreview) {
        personalizePreview.style.color = colors[color].textColor;
      }
    }
  });
});

const tapisBtns = document.querySelectorAll('[data-tapis]');
tapisBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    tapisBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

const personalizeAddBtn = document.getElementById('personalize-add-btn');
if (personalizeAddBtn) {
  personalizeAddBtn.addEventListener('click', () => {
    const active = document.querySelector('[data-tapis].active');
    const slug = active?.dataset.tapis || personalizeAddBtn.dataset.defaultSlug;
    const name = personalizeInput?.value?.trim() || '';
    if (!name) {
      showToast('Saisissez un prénom à broder', 'error');
      return;
    }
    addToCart(slug, 1, name);
  });
}

// ============ CHECKOUT PROMO VALIDATION ============
const promoBtn = document.getElementById('promo-apply');
if (promoBtn) {
  promoBtn.addEventListener('click', async () => {
    const code = document.getElementById('promo-input')?.value?.trim();
    if (!code) return;
    const amount = parseFloat(document.getElementById('promo-amount')?.value || '0');
    const res = await apiPost('/promo/validate/', { code, amount });
    if (res.success) {
      showToast(res.message, 'success');
      const codeInput = document.getElementById('promo-code-hidden');
      if (codeInput) codeInput.value = res.code;
      const discountEl = document.getElementById('discount-display');
      const totalEl = document.getElementById('total-display');
      if (discountEl) {
        discountEl.style.display = '';
        discountEl.querySelector('.value').textContent = '-' + formatCFA(res.discount);
      }
      if (totalEl) {
        const current = parseFloat(totalEl.dataset.subtotal);
        const delivery = parseFloat(totalEl.dataset.delivery);
        const newTotal = current - parseFloat(res.discount) + delivery;
        totalEl.textContent = formatCFA(newTotal);
      }
    } else {
      showToast(res.error || 'Code invalide', 'error');
    }
  });
}

// ============ PRODUCT GALLERY ============
const galleryThumbs = document.querySelectorAll('[data-gallery-thumb]');
const galleryMain = document.getElementById('gallery-main-img');
galleryThumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const src = thumb.dataset.galleryThumb;
    if (galleryMain && src) galleryMain.src = src;
    galleryThumbs.forEach((t) => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// ============ FADE IN ON SCROLL ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-up');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
