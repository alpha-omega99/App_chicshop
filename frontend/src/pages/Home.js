import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fetchCategories, fetchProducts, fetchReviews, fetchStats } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { formatCFA, useCart } from '../context/CartContext';

const Home = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [name, setName] = useState('Fatima');
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [packs, setPacks] = useState([]);
  const [flash, setFlash] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ families_served: 2000, today_sales: 14, avg_rating: 4.9, whatsapp_response_min: 5 });

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    fetchProducts({ featured: 'true' }).then(setFeatured).catch(() => {});
    fetchProducts({ category: 'packs' }).then(setPacks).catch(() => {});
    fetchProducts({ flash: 'true' }).then(setFlash).catch(() => {});
    fetchReviews().then(setReviews).catch(() => {});
    fetchStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-emerald2-50 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-fadeUp">
              <span className="eyebrow">✦ Artisanat · Brodé main · Abidjan</span>
              <h1 className="h-display text-5xl md:text-7xl lg:text-8xl mt-6 leading-none text-emerald2-500">
                Le tapis qui<br />
                <em>porte son nom.</em>
              </h1>
              <p className="mt-8 max-w-xl text-lg text-inkLight leading-relaxed">
                Offrez un moment de paix unique. Nos tapis de prière sont brodés à la main avec votre prénom en calligraphie dorée — un cadeau qui marque les cœurs pour l'Aïd, le mariage et le Hajj.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button onClick={() => navigate('/personnaliser')} className="btn-emerald" data-testid="hero-create-btn">
                  <Sparkles className="w-4 h-4" /> Créer mon tapis unique
                </button>
                <Link to="/catalogue" className="btn-ghost">
                  Voir la galerie <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {['F', 'A', 'M', 'K'].map((l, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-bg font-serif text-emerald2-500 grid place-items-center"
                      style={{ background: ['#E5B3B3', '#F7DEDE', '#D4AF37', '#B8CDC1'][i] }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-serif text-2xl text-emerald2-500">{stats.families_served}+ familles</p>
                  <p className="text-xs text-inkLight">★★★★★ 4.9/5 · 2 000 avis</p>
                </div>
              </div>
            </div>

            {/* Live personalize preview */}
            <div className="lg:col-span-5 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 chip">✦ Nouveau</div>
                <div className="absolute -top-2 -right-2 bg-emerald2-500 text-white rounded-full px-4 py-2 text-xs">
                  <p className="opacity-70 text-[10px]">À partir de</p>
                  <p className="font-medium">8 990 F CFA</p>
                </div>

                <div className="rug-shape aspect-[4/5] relative">
                  <div className="absolute inset-x-0 top-[35%] flex flex-col items-center px-12">
                    <p className="font-calli text-5xl md:text-6xl text-gold-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]" data-testid="hero-name-preview">
                      {name || 'Votre prénom'}
                    </p>
                    <p className="text-xs text-emerald2-900/70 tracking-widest mt-2">~ Personnalisation dorée ~</p>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-full p-1.5 flex items-center gap-2 shadow-soft border border-line">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 18))}
                    placeholder="Tapez un prénom…"
                    className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
                    data-testid="hero-name-input"
                  />
                  <button
                    onClick={() => navigate('/personnaliser')}
                    className="px-5 py-2.5 rounded-full bg-rose-300 text-emerald2-500 text-sm font-medium hover:bg-rose-400 transition"
                    data-testid="hero-customize-btn"
                  >
                    Commander
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES BENTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow">Nos univers</span>
            <h2 className="h-display text-4xl md:text-5xl mt-3 text-emerald2-500">Explorez la <em>collection</em></h2>
          </div>
          <Link to="/catalogue" className="hidden md:inline-flex items-center gap-1 text-sm text-emerald2-500 hover:gap-2 transition-all">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-4 md:gap-6 auto-rows-[180px]">
          {categories.slice(0, 4).map((c, i) => {
            const spans = [
              'md:col-span-5 md:row-span-2',
              'md:col-span-4',
              'md:col-span-3',
              'md:col-span-7',
            ];
            const bgs = [
              'bg-emerald2-500 text-white',
              'bg-rose-100',
              'bg-bone',
              'bg-rose-300 text-emerald2-500',
            ];
            return (
              <Link
                key={c.id}
                to={`/catalogue/${c.slug}`}
                className={`${spans[i]} ${bgs[i]} relative overflow-hidden rounded-xl2 p-8 group hover:shadow-soft transition-all`}
                data-testid={`category-card-${c.slug}`}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {c.icon}
                </div>
                <h3 className="font-serif text-3xl">{c.name}</h3>
                <p className="text-sm opacity-70 mt-1">{c.description}</p>
                <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-current grid place-items-center group-hover:bg-current/10">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PACKS SPIRITUELS */}
      <section className="bg-white border-y border-line/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">Pensé comme une expérience</span>
            <h2 className="h-display text-4xl md:text-5xl mt-3 text-emerald2-500">
              Nos <em>univers spirituels</em>
            </h2>
            <p className="mt-4 text-inkLight">
              Chaque pack est conçu comme un cadeau — pas un simple produit. Brodé, parfumé, emballé à la main.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.slice(0, 3).map((p, i) => {
              const isFeature = i === 1;
              return (
                <div
                  key={p.id}
                  className={`relative rounded-xl3 p-8 transition-all ${
                    isFeature ? 'bg-emerald2-500 text-white -mt-4 shadow-emerald' : 'bg-bone border border-line hover:-translate-y-1'
                  }`}
                  data-testid={`pack-card-${p.slug}`}
                >
                  {isFeature && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-emerald2-900 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest">
                      ✦ Le choix des familles
                    </div>
                  )}
                  <div className="text-5xl mb-4">{p.emoji || (i === 0 ? '🌸' : i === 1 ? '✦' : '👑')}</div>
                  <h3 className={`font-serif text-3xl ${isFeature ? 'text-white' : 'text-emerald2-500'}`}>{p.name}</h3>
                  <p className={`text-sm mt-1 ${isFeature ? 'text-rose-200' : 'text-inkLight'}`}>{p.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className={`font-serif text-3xl ${isFeature ? 'text-gold-400' : 'text-emerald2-500'}`}>
                      {formatCFA(p.price).replace(' F CFA', '')}
                    </span>
                    <span className={`text-sm ${isFeature ? 'text-white' : 'text-emerald2-500'}`}>F CFA</span>
                    {p.original_price && (
                      <span className={`text-xs line-through ${isFeature ? 'text-white/40' : 'text-inkLight'}`}>
                        {formatCFA(p.original_price)}
                      </span>
                    )}
                  </div>
                  <ul className={`mt-6 space-y-2 text-sm ${isFeature ? 'text-rose-100' : 'text-inkLight'}`}>
                    {(p.included_items || []).slice(0, 6).map((it, k) => (
                      <li key={k} className="flex gap-2">
                        <span className={isFeature ? 'text-gold-400' : 'text-gold-500'}>✦</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => addItem(p)}
                      className={`flex-1 rounded-full py-3 text-sm font-medium transition ${
                        isFeature
                          ? 'bg-rose-300 text-emerald2-500 hover:bg-rose-400'
                          : 'bg-emerald2-500 text-rose-200 hover:bg-emerald2-900'
                      }`}
                      data-testid={`pack-add-${p.slug}`}
                    >
                      Choisir ce pack
                    </button>
                    <Link
                      to={`/produit/${p.slug}`}
                      className={`px-5 py-3 rounded-full border text-sm transition ${
                        isFeature ? 'border-white/30 text-white hover:bg-white/10' : 'border-emerald2-500/30 text-emerald2-500 hover:bg-emerald2-500/5'
                      }`}
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-inkLight">
              🎁 Emballage cadeau offert · 📦 Livraison Abidjan · Code <strong className="text-gold-600">CHICSHOP15</strong> pour -15%
            </p>
          </div>
        </div>
      </section>

      {/* FLASH SALE */}
      {flash.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="eyebrow">✦ Vente flash</span>
              <h2 className="h-display text-4xl md:text-5xl mt-3 text-emerald2-500">Promotions <em>éphémères</em></h2>
            </div>
            <Link to="/catalogue" className="hidden md:inline-flex items-center gap-1 text-sm text-emerald2-500">Tout voir <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {flash.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow">Best-sellers</span>
            <h2 className="h-display text-4xl md:text-5xl mt-3 text-emerald2-500">Les plus <em>populaires</em></h2>
          </div>
          <Link to="/catalogue" className="hidden md:inline-flex items-center gap-1 text-sm text-emerald2-500">Voir tout <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* EDITORIAL DUO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[5/4] rounded-xl3 overflow-hidden group">
            <img
              src="https://images.pexels.com/photos/7129561/pexels-photo-7129561.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Collection Hajj"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald2-900/80 via-emerald2-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="eyebrow text-rose-200">Collection Hajj</span>
              <h3 className="h-display text-3xl md:text-4xl mt-2">Le voyage <em className="text-gold-400">sacré</em> commence ici.</h3>
              <Link to="/catalogue" className="inline-flex items-center gap-2 mt-4 text-gold-400 hover:gap-3 transition-all">
                Découvrir <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[5/4] rounded-xl3 overflow-hidden bg-rose-100 p-10 flex flex-col justify-end">
            <div className="absolute top-8 right-8 text-6xl opacity-30 font-calli text-gold-500">بسم الله</div>
            <span className="eyebrow">Broderie d'or</span>
            <h3 className="h-display text-3xl md:text-4xl mt-2 text-emerald2-500">Votre prénom, en <em className="text-gold-500">calligraphie dorée.</em></h3>
            <Link to="/personnaliser" className="inline-flex items-center gap-2 mt-4 text-emerald2-500 hover:gap-3 transition-all">
              Créer mon tapis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white border-y border-line/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">La preuve par 2 000+</span>
            <h2 className="h-display text-4xl md:text-5xl mt-3 text-emerald2-500">Ce qu'en disent <em>nos sœurs</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="bg-bone rounded-xl2 p-7 border border-line">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-300 grid place-items-center font-serif text-xl text-emerald2-500">
                    {r.initial}
                  </div>
                  <div>
                    <p className="font-medium text-emerald2-500">{r.name}</p>
                    <p className="text-xs text-inkLight">{r.city}</p>
                  </div>
                </div>
                <div className="text-gold-500 mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-inkLight italic font-serif text-lg leading-relaxed">"{r.comment}"</p>
                <p className="text-xs text-inkLight/70 mt-4">{r.time_ago} · Lu 📖</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: `${stats.families_served}+`, l: 'Familles satisfaites' },
            { v: stats.today_sales, l: "Personnalisés aujourd'hui" },
            { v: `${stats.avg_rating}★`, l: 'Note moyenne' },
            { v: `${stats.whatsapp_response_min} min`, l: 'Réponse WhatsApp' },
          ].map((s, i) => (
            <div key={i} className="text-center p-6">
              <p className="font-serif text-4xl md:text-5xl text-gold-500">{s.v}</p>
              <p className="text-xs uppercase tracking-widest text-inkLight mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
