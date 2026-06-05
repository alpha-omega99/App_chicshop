import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart, formatCFA } from '../context/CartContext';
import { createOrder, validatePromo } from '../lib/api';

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_first_name: '',
    customer_last_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_city: 'Abidjan',
    delivery_address: '',
    delivery_instructions: '',
    payment_method: 'wave',
  });
  const [promoCode, setPromoCode] = useState('');
  const [promo, setPromo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const delivery = subtotal >= 15000 ? 0 : 1500;
  const discount = promo?.discount_amount || 0;
  const total = Math.max(0, subtotal - discount + delivery);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const data = await validatePromo(promoCode.trim().toUpperCase(), subtotal);
      setPromo(data);
      toast.success(`Code ${data.code} appliqué : -${data.discount_percent}%`);
    } catch (e) {
      setPromo(null);
      toast.error(e.response?.data?.code?.[0] || 'Code invalide');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!items.length) return toast.error('Votre panier est vide');
    if (!form.customer_first_name || !form.customer_phone || !form.delivery_address) {
      return toast.error('Veuillez compléter vos informations');
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        ...form,
        items: items.map((it) => ({
          product: it.id,
          quantity: it.quantity,
          embroidery_name: it.embroidery_name || '',
          personal_message: '',
        })),
        promo_code: promo?.code || '',
      });
      clear();
      navigate(`/commande/${order.reference}`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">✦</div>
        <h1 className="h-display text-4xl text-emerald2-500">Votre panier est vide</h1>
        <p className="text-inkLight mt-3">Découvrez nos tapis et packs cadeaux personnalisés.</p>
        <Link to="/catalogue" className="btn-emerald mt-8">Voir la boutique</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="eyebrow">Finalisation</span>
        <h1 className="h-display text-5xl md:text-6xl text-emerald2-500 mt-3">Votre <em>commande</em></h1>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl2 p-6 border border-line">
            <h2 className="font-serif text-2xl text-emerald2-500 mb-5">Informations de livraison</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.customer_first_name} onChange={(e) => update('customer_first_name', e.target.value)} placeholder="Prénom *" className="rounded-full border border-line px-5 py-3 bg-white outline-none focus:border-emerald2-500/40" data-testid="checkout-firstname" />
              <input value={form.customer_last_name} onChange={(e) => update('customer_last_name', e.target.value)} placeholder="Nom" className="rounded-full border border-line px-5 py-3 bg-white outline-none focus:border-emerald2-500/40" data-testid="checkout-lastname" />
              <input value={form.customer_phone} onChange={(e) => update('customer_phone', e.target.value)} placeholder="Téléphone WhatsApp *" className="rounded-full border border-line px-5 py-3 bg-white outline-none focus:border-emerald2-500/40" data-testid="checkout-phone" />
              <input value={form.customer_email} onChange={(e) => update('customer_email', e.target.value)} placeholder="Email" className="rounded-full border border-line px-5 py-3 bg-white outline-none focus:border-emerald2-500/40" data-testid="checkout-email" />
              <input value={form.delivery_city} onChange={(e) => update('delivery_city', e.target.value)} placeholder="Ville" className="rounded-full border border-line px-5 py-3 bg-white outline-none focus:border-emerald2-500/40" data-testid="checkout-city" />
              <input value={form.delivery_address} onChange={(e) => update('delivery_address', e.target.value)} placeholder="Adresse, quartier, repère *" className="sm:col-span-2 rounded-full border border-line px-5 py-3 bg-white outline-none focus:border-emerald2-500/40" data-testid="checkout-address" />
              <textarea value={form.delivery_instructions} onChange={(e) => update('delivery_instructions', e.target.value)} placeholder="Note pour le livreur (optionnel)" rows="2" className="sm:col-span-2 rounded-xl2 border border-line px-5 py-3 bg-white outline-none focus:border-emerald2-500/40" />
            </div>
          </div>

          <div className="bg-white rounded-xl2 p-6 border border-line">
            <h2 className="font-serif text-2xl text-emerald2-500 mb-5">Mode de paiement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { v: 'wave', l: 'Wave', emoji: '🌊' },
                { v: 'orange_money', l: 'Orange Money', emoji: '🍊' },
                { v: 'cash', l: 'Cash à la livraison', emoji: '💵' },
              ].map((p) => (
                <button
                  key={p.v}
                  type="button"
                  onClick={() => update('payment_method', p.v)}
                  className={`p-4 rounded-xl2 border transition text-left ${
                    form.payment_method === p.v ? 'border-emerald2-500 bg-emerald2-500/5' : 'border-line hover:border-emerald2-500/40'
                  }`}
                  data-testid={`checkout-payment-${p.v}`}
                >
                  <div className="text-2xl mb-1">{p.emoji}</div>
                  <div className="font-medium text-emerald2-500">{p.l}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl2 p-6 border border-line sticky top-28">
            <h2 className="font-serif text-2xl text-emerald2-500 mb-5">Récapitulatif</h2>

            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {items.map((it, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-14 h-14 rounded-lg bg-bone overflow-hidden shrink-0">
                    {it.image && <img src={it.image} alt={it.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-emerald2-500 truncate">{it.name}</p>
                    {it.embroidery_name && <p className="text-xs text-gold-600">✦ <span className="font-calli">{it.embroidery_name}</span></p>}
                    <p className="text-xs text-inkLight">×{it.quantity}</p>
                  </div>
                  <span className="text-sm text-emerald2-500">{formatCFA(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-4 space-y-2">
              <div className="flex gap-2">
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Code promo" className="flex-1 rounded-full border border-line px-4 py-2 text-sm outline-none" data-testid="checkout-promo-input" />
                <button type="button" onClick={applyPromo} className="px-4 py-2 rounded-full bg-emerald2-500 text-white text-sm hover:bg-emerald2-900" data-testid="checkout-promo-apply">Appliquer</button>
              </div>

              <div className="flex justify-between text-sm text-inkLight pt-3">
                <span>Sous-total</span><span>{formatCFA(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-gold-600">
                  <span>Remise</span><span>-{formatCFA(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-inkLight">
                <span>Livraison</span>
                <span>{delivery === 0 ? 'Offerte' : formatCFA(delivery)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-emerald2-500 border-t border-line pt-3">
                <span>Total</span><span>{formatCFA(total)}</span>
              </div>

              <button type="submit" disabled={submitting} className="btn-emerald w-full mt-4 disabled:opacity-50" data-testid="checkout-submit-btn">
                {submitting ? 'Traitement…' : 'Confirmer la commande'}
              </button>
              <p className="text-xs text-center text-inkLight mt-2">Aminata vous contactera pour finaliser le paiement</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
