import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, Heart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/catalogue?q=${encodeURIComponent(query.trim())}`);
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/catalogue/packs', label: 'Packs cadeaux' },
    { to: '/catalogue/tapis', label: 'Tapis' },
    { to: '/catalogue/chapelet', label: 'Chapelets' },
    { to: '/personnaliser', label: 'Personnaliser', highlight: true },
  ];

  return (
    <header className="glass sticky top-0 z-40 border-b border-line/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-baseline gap-1" data-testid="header-logo">
            <span className="font-serif text-3xl text-emerald2-500 tracking-tight">Chic</span>
            <span className="font-serif italic text-3xl text-gold-500">Shop+</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors ${
                    isActive
                      ? 'text-emerald2-500 font-medium'
                      : l.highlight
                      ? 'text-gold-600 font-medium hover:text-gold-500'
                      : 'text-inkLight hover:text-emerald2-500'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Search desktop */}
          <form onSubmit={submit} className="hidden md:flex items-center bg-bone rounded-full px-4 py-2 w-64">
            <Search className="w-4 h-4 text-inkLight" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un tapis…"
              className="bg-transparent ml-2 outline-none text-sm w-full"
              data-testid="header-search-input"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-bone rounded-full transition-colors" aria-label="Favoris">
              <Heart className="w-5 h-5 text-emerald2-500" />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 hover:bg-bone rounded-full transition-colors"
              data-testid="header-cart-btn"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5 text-emerald2-500" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-300 text-emerald2-500 text-[10px] font-semibold grid place-items-center">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-bone rounded-full"
              aria-label="Menu"
              data-testid="header-mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-5 h-5 text-emerald2-500" /> : <Menu className="w-5 h-5 text-emerald2-500" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 space-y-1 animate-fadeUp">
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition ${
                    isActive ? 'bg-emerald2-500 text-white' : 'text-inkLight hover:bg-bone'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
