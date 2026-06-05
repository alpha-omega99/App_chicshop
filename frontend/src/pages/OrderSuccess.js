import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { reference } = useParams();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald2-500 grid place-items-center text-white mb-6 animate-fadeUp">
        <CheckCircle className="w-10 h-10" />
      </div>
      <span className="eyebrow">Commande confirmée</span>
      <h1 className="h-display text-5xl md:text-6xl text-emerald2-500 mt-3">
        Merci pour <em>votre commande !</em>
      </h1>
      <p className="text-inkLight mt-4 max-w-md mx-auto">
        Aminata vous contactera sur WhatsApp dans les prochaines minutes pour finaliser votre paiement et confirmer la livraison.
      </p>

      <div className="mt-10 bg-bone rounded-xl2 p-6 border border-line">
        <p className="text-xs text-inkLight tracking-widest uppercase">Numéro de commande</p>
        <p className="font-serif text-3xl text-gold-600 mt-1" data-testid="order-reference">#{reference}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <a
          href={`https://wa.me/2250700000000?text=Bonjour%20Aminata%2C%20je%20viens%20de%20passer%20commande%20%23${reference}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-emerald"
        >
          <MessageCircle className="w-4 h-4" /> Contacter Aminata
        </a>
        <Link to="/" className="btn-ghost">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
