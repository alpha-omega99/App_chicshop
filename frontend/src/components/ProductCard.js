import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart, formatCFA } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const image = product.image || product.image_url;
  return (
    <Link
      to={`/produit/${product.slug}`}
      className="group block animate-fadeUp"
      data-testid={`product-card-${product.slug}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 bg-bone">
        {image && (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 bg-emerald2-500 text-white rounded-full tracking-widest">
            {product.badge}
          </span>
        )}
        {product.original_price && (
          <span className="absolute top-3 right-3 text-xs px-3 py-1 bg-gold-500 text-emerald2-900 rounded-full font-medium">
            -{product.discount_percent || Math.round((1 - product.price / product.original_price) * 100)}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); addItem(product); }}
          className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-emerald2-500 text-rose-200 grid place-items-center shadow-emerald translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all hover:bg-emerald2-900"
          aria-label="Ajouter au panier"
          data-testid={`add-cart-${product.slug}`}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-4 px-1">
        <div className="flex items-center gap-1 text-xs text-inkLight">
          <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
          <span className="font-medium">{Number(product.rating || 4.9).toFixed(1)}</span>
          <span className="opacity-70">· {product.review_count || 0} avis</span>
        </div>
        <h3 className="font-serif text-xl text-emerald2-500 mt-1 leading-tight group-hover:text-gold-600 transition-colors">
          {product.name}
        </h3>
        {product.tagline && (
          <p className="text-xs text-inkLight mt-1 line-clamp-1">{product.tagline}</p>
        )}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-medium text-emerald2-500">{formatCFA(product.price)}</span>
          {product.original_price && (
            <span className="text-xs text-inkLight line-through">{formatCFA(product.original_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
