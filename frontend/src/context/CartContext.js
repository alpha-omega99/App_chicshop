import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'chicshop_cart_v2';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, opts = {}) => {
    const qty = opts.quantity || 1;
    const embroidery = opts.embroidery_name || null;
    setItems(prev => {
      const key = `${product.slug}::${embroidery || ''}`;
      const idx = prev.findIndex(i => `${i.product_slug}::${i.embroidery_name || ''}` === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, {
        id: product.id,
        product_slug: product.slug,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image || product.image_url,
        quantity: qty,
        embroidery_name: embroidery,
      }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index, delta) => {
    setItems(prev => prev
      .map((it, i) => i === index ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)
      .filter(it => it.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const count = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, open, setOpen, addItem, removeItem, updateQty, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const formatCFA = (n) => {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString('fr-FR').replace(/,/g, ' ') + ' F CFA';
};
