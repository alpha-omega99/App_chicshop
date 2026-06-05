import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-emerald2-500 text-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="font-serif text-3xl text-white">Chic</span>
            <span className="font-serif italic text-3xl text-gold-400">Shop+</span>
          </div>
          <p className="text-white/70 max-w-md leading-relaxed mb-6">
            Le tapis qui porte son nom. Artisanat islamique d'Abidjan, brodé main avec amour pour les moments qui comptent.
          </p>
          <div className="flex gap-3">
            {[Instagram, MessageCircle, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 grid place-items-center hover:bg-rose-300 hover:text-emerald2-500 hover:border-rose-300 transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Boutique */}
        <div>
          <h3 className="font-serif text-xl text-gold-400 mb-4">Boutique</h3>
          <ul className="space-y-2 text-white/70">
            <li><Link to="/catalogue/packs" className="hover:text-rose-300 transition">Packs cadeaux</Link></li>
            <li><Link to="/catalogue/tapis" className="hover:text-rose-300 transition">Tapis de prière</Link></li>
            <li><Link to="/catalogue/chapelet" className="hover:text-rose-300 transition">Chapelets</Link></li>
            <li><Link to="/catalogue/coran" className="hover:text-rose-300 transition">Coran</Link></li>
            <li><Link to="/personnaliser" className="hover:text-rose-300 transition">Personnaliser</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-xl text-gold-400 mb-4">Contact</h3>
          <ul className="space-y-3 text-white/70 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              Abidjan, Côte d'Ivoire
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              +225 07 00 00 00 00
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              hello@chicshop.ci
            </li>
          </ul>
          <Link to="/personnaliser" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-rose-300 text-emerald2-500 text-sm font-medium hover:bg-rose-400 transition">
            ✦ Créer mon tapis
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-white/50 text-sm">
        <p>© 2026 ChicShop+ · Tous droits réservés</p>
        <p className="italic font-serif text-gold-400">Le tapis qui porte son nom.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
