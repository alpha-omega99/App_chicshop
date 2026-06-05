import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Gift, Shield, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { fetchProduct, fetchProducts } from '../lib/api';
import { useCart, formatCFA } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem, setOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [embroidery, setEmbroidery] = useState('');
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setProduct(null); setQty(1); setEmbroidery(''); setImgIdx(0);
    fetchProduct(slug).then((p) => {
      setProduct(p);
      if (p.category_slug) {
        fetchProducts({ category: p.category_slug }).then((list) =>
          setRelated(list.filter((x) => x.slug !== p.slug).slice(0, 4))
        );
      }
    });
  }, [slug]);

  if (!product) return <div className="p-16 text-center text-inkLight font-serif text-xl">Chargement…</div>;

  const gallery = (product.gallery && product.gallery.length ? product.gallery : [product.image || product.image_url]).filter(Boolean);

  const handleAdd = () => {
    if (product.allows_embroidery && product.embroidery_required && !embroidery.trim()) {
      toast.error('Veuillez saisir le prénom à broder');
      return;
    }
    addItem(product, { quantity: qty, embroidery_name: embroidery.trim() || null });
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-xs text-inkLight tracking-widest mb-6">
        <Link to="/" className="hover:text-emerald2-500">Accueil</Link> ·{' '}
        <Link to="/catalogue" className="hover:text-emerald2-500">Boutique</Link> ·{' '}
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-xl3 overflow-hidden bg-bone">
            {gallery[imgIdx] && (
              <img src={gallery[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-emerald2-500 text-white text-xs rounded-full tracking-widest">{product.badge}</span>
            )}
            {embroidery && (
              <div className="absolute inset-x-0 bottom-10 text-center">
                <p className="text-xs text-emerald2-900/70 mb-1 tracking-widest">Aperçu broderie</p>
                <p className="font-calli text-5xl text-gold-500 drop-shadow-lg">{embroidery}</p>
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 mt-4">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${imgIdx === i ? 'border-emerald2-500' : 'border-transparent'}`}
                >
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="eyebrow mb-3">{product.category_slug}</div>
          <h1 className="h-display text-4xl md:text-5xl text-emerald2-500 leading-tight">{product.name}</h1>
          {product.tagline && <p className="text-inkLight mt-3 italic font-serif text-xl">{product.tagline}</p>}

          <div className="flex items-center gap-4 mt-5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 4.9) ? 'fill-gold-500 text-gold-500' : 'text-line'}`} />
              ))}
            </div>
            <span className="text-sm text-inkLight">{Number(product.rating).toFixed(1)} · {product.review_count} avis</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-serif text-4xl text-emerald2-500">{formatCFA(product.price)}</span>
            {product.original_price && (
              <>
                <span className="text-inkLight line-through">{formatCFA(product.original_price)}</span>
                <span className="text-sm bg-gold-500 text-emerald2-900 px-2 py-0.5 rounded-full">-{product.discount_percent}%</span>
              </>
            )}
          </div>

          <p className="mt-6 text-inkLight leading-relaxed">{product.description}</p>

          {product.included_items?.length > 0 && (
            <div className="mt-6 bg-bone rounded-xl2 p-6">
              <p className="font-serif text-lg text-emerald2-500 mb-3">Ce que contient ce pack</p>
              <ul className="space-y-1.5">
                {product.included_items.map((it, i) => (
                  <li key={i} className="flex gap-2 text-sm text-inkLight">
                    <span className="text-gold-500">✦</span> {it}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.allows_embroidery && (
            <div className="mt-6">
              <label className="text-sm tracking-widest text-emerald2-500 uppercase">Prénom à broder (calligraphie dorée)</label>
              <input
                value={embroidery}
                onChange={(e) => setEmbroidery(e.target.value.slice(0, 18))}
                placeholder="Ex. Fatima"
                className="mt-2 w-full rounded-full border border-line bg-white px-5 py-3 outline-none focus:border-emerald2-500/40"
                data-testid="product-embroidery-input"
              />
              <p className="text-xs text-inkLight mt-2">18 caractères max · Écriture arabe disponible via WhatsApp</p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-line rounded-full">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} data-testid="qty-decrease" className="w-10 h-10 grid place-items-center"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} data-testid="qty-increase" className="w-10 h-10 grid place-items-center"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handleAdd} className="btn-emerald flex-1" data-testid="add-to-cart-btn">
              Ajouter au panier · {formatCFA(product.price * qty)}
            </button>
          </div>

          <button
            onClick={() => { handleAdd(); setOpen(true); }}
            className="btn-rose w-full mt-3"
            data-testid="buy-now-btn"
          >
            Acheter maintenant
          </button>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { I: Truck, t: 'Livraison Abidjan 24-48h' },
              { I: Gift, t: 'Emballage cadeau offert' },
              { I: Shield, t: 'Paiement Wave / OM / Cash' },
            ].map(({ I, t }, i) => (
              <div key={i} className="text-center p-4 bg-bone rounded-xl">
                <I className="w-5 h-5 mx-auto text-emerald2-500 mb-2" />
                <p className="text-xs text-inkLight">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="h-display text-4xl text-emerald2-500 mb-8">Vous pourriez aussi aimer</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
