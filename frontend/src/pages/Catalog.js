import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchCategories, fetchProducts } from '../lib/api';

const Catalog = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category && category !== 'tout') params.category = category;
    if (q) params.search = q;
    fetchProducts(params).then(setProducts).finally(() => setLoading(false));
  }, [category, q]);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === 'price-asc') arr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    else if (sort === 'price-desc') arr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    else if (sort === 'rating') arr.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else arr.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    return arr;
  }, [products, sort]);

  const currentCat = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-xs text-inkLight tracking-widest mb-4">
        <Link to="/" className="hover:text-emerald2-500">Accueil</Link> · <Link to="/catalogue" className="hover:text-emerald2-500">Boutique</Link>
        {currentCat && <> · {currentCat.name}</>}
      </div>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="h-display text-5xl md:text-6xl text-emerald2-500">
            {q ? <>Résultats pour <em>"{q}"</em></> : currentCat ? <>{currentCat.name}</> : <>Notre <em>boutique</em></>}
          </h1>
          <p className="text-sm text-inkLight mt-2">{sorted.length} produit{sorted.length > 1 ? 's' : ''}</p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm outline-none"
          data-testid="catalog-sort"
        >
          <option value="featured">Mis en avant</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Mieux notés</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          to="/catalogue"
          className={`px-5 py-2 rounded-full text-sm transition ${
            !category ? 'bg-emerald2-500 text-white' : 'bg-bone text-inkLight hover:bg-rose-100'
          }`}
        >
          Tout
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/catalogue/${c.slug}`}
            className={`px-5 py-2 rounded-full text-sm transition ${
              category === c.slug ? 'bg-emerald2-500 text-white' : 'bg-bone text-inkLight hover:bg-rose-100'
            }`}
          >
            {c.icon} {c.name}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-bone rounded-xl2 animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">✦</div>
          <p className="font-serif text-2xl text-emerald2-500">Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Catalog;
