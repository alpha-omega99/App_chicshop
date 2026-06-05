import React, { useEffect, useState } from 'react';

const FlashStrip = () => {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 59, 0);
    const tick = () => {
      const diff = Math.max(0, target - new Date());
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTime({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-emerald2-500 text-white text-xs md:text-sm py-2.5 text-center tracking-widest" data-testid="flash-strip">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-gold-400">✦ Vente flash</span>
        <span className="hidden md:inline opacity-50">|</span>
        <span>Jusqu'à -40% · Code <strong className="text-gold-400">CHICSHOP15</strong></span>
        <span className="hidden md:inline opacity-50">|</span>
        <span className="font-mono tabular-nums">{time.h}:{time.m}:{time.s}</span>
      </div>
    </div>
  );
};

export default FlashStrip;
