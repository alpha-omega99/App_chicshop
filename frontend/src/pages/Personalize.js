import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProducts } from '../lib/api';
import { useCart, formatCFA } from '../context/CartContext';
import { Sparkles } from 'lucide-react';

const colors = [
  { id: 'rose', name: 'Rose poudré', hex: '#E5B3B3' },
  { id: 'emerald', name: 'Émeraude', hex: '#1A3C2F' },
  { id: 'bone', name: 'Ivoire', hex: '#F2EBE5' },
  { id: 'gold', name: 'Or royal', hex: '#D4AF37' },
];

const Personalize = () => {
  const [name, setName] = useState('Fatima');
  const [colorId, setColorId] = useState('rose');
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const { addItem, setOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts({ category: 'tapis' }).then((arr) => {
      setProducts(arr);
      if (arr.length) setSelected(arr[0]);
    });
  }, []);

  const color = colors.find((c) => c.id === colorId);

  const handleOrder = () => {
    if (!selected) return;
    if (!name.trim()) { toast.error('Saisissez un prénom à broder'); return; }
    addItem(selected, { embroidery_name: name.trim() });
    toast.success('Tapis personnalisé ajouté au panier');
    setOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="eyebrow">Personnalisation</span>
        <h1 className="h-display text-5xl md:text-6xl text-emerald2-500 mt-3">
          Créez votre <em>tapis unique</em>
        </h1>
        <p className="mt-4 text-inkLight">Choisissez la couleur, brodez le prénom — l'artisanat fait le reste. Livré sous 5 à 7 jours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Live preview */}
        <div className="lg:col-span-3">
          <div
            className="aspect-[4/5] rounded-xl3 relative flex items-center justify-center"
            style={{
              background: `linear-gradient(180deg, ${color.hex} 0%, ${color.hex}cc 60%, ${color.hex}99 100%)`,
              boxShadow:
                'inset 0 0 0 3px rgba(212,175,55,0.6), inset 0 0 0 12px rgba(255,255,255,0.35), inset 0 0 0 15px rgba(212,175,55,0.45), 0 40px 80px -30px rgba(26,60,47,0.45)',
              borderTopLeftRadius: '50% 28%',
              borderTopRightRadius: '50% 28%',
              borderBottomLeftRadius: '22% 6%',
              borderBottomRightRadius: '22% 6%',
            }}
          >
            <div className="text-center px-12">
              <p
                className="font-calli text-6xl md:text-7xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
                style={{ color: colorId === 'gold' ? '#1A3C2F' : '#D4AF37' }}
                data-testid="personalize-preview"
              >
                {name || 'Votre prénom'}
              </p>
              <p
                className="mt-4 text-xs tracking-widest"
                style={{ color: colorId === 'gold' ? '#1A3C2F99' : '#fffffff0' }}
              >
                ~ Brodé main à Abidjan ~
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <label className="eyebrow">Prénom à broder</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 18))}
              placeholder="Tapez le prénom…"
              className="mt-3 w-full rounded-full border border-line bg-white px-6 py-4 text-2xl font-calli text-gold-500 outline-none focus:border-emerald2-500/40"
              data-testid="personalize-name-input"
            />
            <p className="text-xs text-inkLight mt-2">18 caractères max · Aminata vous proposera l'écriture arabe sur WhatsApp.</p>
          </div>

          <div>
            <label className="eyebrow">Couleur du tapis</label>
            <div className="flex flex-wrap gap-2 mt-3">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  className={`flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 border transition ${
                    colorId === c.id ? 'border-emerald2-500 bg-emerald2-500/5' : 'border-line'
                  }`}
                  data-testid={`personalize-color-${c.id}`}
                >
                  <span className="w-7 h-7 rounded-full border border-white/40" style={{ background: c.hex }} />
                  <span className="text-sm">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="eyebrow">Modèle de tapis</label>
            <div className="grid grid-cols-2 gap-3 mt-3 max-h-80 overflow-y-auto">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`text-left rounded-xl2 p-3 border transition flex gap-3 ${
                    selected?.slug === p.slug ? 'border-emerald2-500 bg-rose-50' : 'border-line hover:border-emerald2-500/40'
                  }`}
                  data-testid={`personalize-tapis-${p.slug}`}
                >
                  <div className="w-14 h-14 rounded-lg bg-bone overflow-hidden shrink-0">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-sm text-emerald2-500 truncate">{p.name}</p>
                    <p className="text-xs text-inkLight mt-0.5">{formatCFA(p.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button onClick={handleOrder} className="btn-emerald w-full" data-testid="personalize-add-btn">
              <Sparkles className="w-4 h-4" /> Ajouter au panier {selected ? `· ${formatCFA(selected.price)}` : ''}
            </button>
            <button onClick={() => navigate('/catalogue/tapis')} className="btn-ghost w-full">
              Voir tous les tapis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalize;
