import React from 'react';

const items = [
  'Brodé main à Abidjan',
  "Livraison express Côte d'Ivoire",
  'Paiement Wave · Orange Money · Cash',
  '2 000+ familles satisfaites',
  'Note 4.9★ · 2 000 avis',
  'Emballage cadeau offert',
];

const TrustMarquee = () => (
  <div className="bg-rose-50 border-y border-rose-100/60 overflow-hidden">
    <div className="marquee-track py-3">
      {Array.from({ length: 2 }).map((_, k) => (
        <div key={k} className="flex shrink-0 items-center">
          {items.map((it, i) => (
            <div key={`${k}-${i}`} className="flex items-center shrink-0">
              <span className="text-sm tracking-[0.2em] font-medium text-emerald2-500 px-8">{it}</span>
              <span className="text-gold-500">✦</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TrustMarquee;
