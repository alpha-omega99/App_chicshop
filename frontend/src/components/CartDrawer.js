import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart, formatCFA } from '../context/CartContext';

const CartDrawer = () => {
  const { open, setOpen, items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-emerald2-900/40 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bg shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="cart-drawer"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-line">
            <h2 className="font-serif text-2xl text-emerald2-500">Votre panier</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-bone rounded-full"
              data-testid="cart-close-btn"
            >
              <X className="w-5 h-5 text-emerald2-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 text-inkLight">
                <div className="font-serif text-5xl text-rose-300 mb-4">✦</div>
                <p className="font-serif text-2xl text-emerald2-500 mb-2">Votre panier est vide</p>
                <p className="text-sm">Découvrez nos tapis personnalisés.</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="flex gap-4 bg-white rounded-xl2 p-4 border border-line">
                  <div className="w-20 h-20 rounded-xl bg-bone overflow-hidden shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg text-emerald2-500 truncate">{item.name}</h4>
                    {item.embroidery_name && (
                      <p className="text-xs text-gold-600 mt-0.5">✦ Brodé : <span className="font-calli">{item.embroidery_name}</span></p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-line rounded-full">
                        <button onClick={() => updateQty(idx, -1)} className="w-7 h-7 grid place-items-center text-emerald2-500"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(idx, 1)} className="w-7 h-7 grid place-items-center text-emerald2-500"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-medium text-emerald2-500">{formatCFA(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(idx)} className="self-start p-1.5 hover:bg-rose-50 rounded-full">
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-line p-6 space-y-4">
              <div className="flex justify-between text-inkLight">
                <span>Sous-total</span>
                <span className="font-medium text-emerald2-500">{formatCFA(subtotal)}</span>
              </div>
              <button
                onClick={() => { setOpen(false); navigate('/commander'); }}
                className="btn-emerald w-full"
                data-testid="cart-checkout-btn"
              >
                Passer commande
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full text-sm text-inkLight hover:text-emerald2-500 transition"
              >
                Continuer mes achats
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
