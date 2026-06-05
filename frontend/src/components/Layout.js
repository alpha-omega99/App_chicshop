import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import WhatsAppFab from './WhatsAppFab';
import TrustMarquee from './TrustMarquee';
import FlashStrip from './FlashStrip';

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-bg">
    <FlashStrip />
    <Header />
    <TrustMarquee />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <CartDrawer />
    <WhatsAppFab />
  </div>
);

export default Layout;
