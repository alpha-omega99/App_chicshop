import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFab = () => (
  <a
    href="https://wa.me/2250700000000?text=Bonjour%20ChicShop%2C%20je%20suis%20intéressé(e)%20par%20vos%20tapis"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-40 group"
    data-testid="whatsapp-fab"
    aria-label="Contacter Aminata sur WhatsApp"
  >
    <div className="absolute -top-12 right-0 bg-emerald2-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Aminata répond en 5 min ✦
    </div>
    <div className="w-14 h-14 rounded-full bg-emerald2-500 text-white grid place-items-center shadow-emerald hover:-translate-y-1 hover:bg-emerald2-900 transition-all">
      <MessageCircle className="w-6 h-6" />
    </div>
  </a>
);

export default WhatsAppFab;
