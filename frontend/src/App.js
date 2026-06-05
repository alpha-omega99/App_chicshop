import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Personalize from './pages/Personalize';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalog />} />
            <Route path="/catalogue/:category" element={<Catalog />} />
            <Route path="/produit/:slug" element={<ProductDetail />} />
            <Route path="/personnaliser" element={<Personalize />} />
            <Route path="/commander" element={<Checkout />} />
            <Route path="/commande/:reference" element={<OrderSuccess />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
