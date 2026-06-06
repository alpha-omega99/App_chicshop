# ChicShop+ - Product Requirement Document

## Problem Statement
Refonte complète du site e-commerce ChicShop+ (boutique de tapis de prière islamiques personnalisés) avec:
- Stack: **Django + MySQL + HTML/CSS/JS pur** (pas de React)
- Design "Spiritual Luxury" : Rose poudré, Émeraude, Or, Bone
- Toutes les images du repo GitHub utilisées
- Nom: ChicShop+
- Effets spéciaux et animations modernes

## Architecture
- **Backend**: Django 5 + Django REST Framework
- **Frontend**: Templates Django + Vanilla JavaScript + CSS3
- **DB**: MySQL (`ecom_db`)
- **Service**: Django runserver sur port 3000

## User Personas
- **Aminata** (Abidjan, 28 ans) : Veut acheter un tapis brodé pour offrir à sa mère pour l'Aïd
- **Fatou** (Bouaké, 35 ans) : Cherche un pack cadeau premium pour un mariage
- **Khadija** (Yamoussoukro, 22 ans) : Veut personnaliser son propre tapis avec son prénom

## Core Requirements ✅ COMPLETED
- [x] Pages: Home, Catalog, Product Detail, Personalize, Cart, Checkout, Order Success
- [x] Live preview personnalisation (prénom en calligraphie dorée Amiri en temps réel)
- [x] Catalogue avec filtres par catégorie et tri
- [x] Page détail avec galerie d'images et personnalisation
- [x] Cart drawer slide-in avec session-based persistence
- [x] Checkout multi-étapes avec paiements Wave/Orange Money/Cash
- [x] Codes promo CHICSHOP15 (-15%) et BIENVENUE10 (-10%)
- [x] WhatsApp FAB + Flash Sale Strip + Trust Marquee
- [x] Page de personnalisation interactive avec choix de couleurs
- [x] Testimonials et stats clients

## Database Models
- Category (4 catégories: Packs Cadeaux, Tapis, Chapelets, Coran)
- Product (10 produits avec broderie, gallery, ratings)
- Order + OrderItem (commandes avec personnalisation)
- Review (avis clients)
- PromoCode (codes promotionnels)

## Implementation Status (Jan 2026)
- ✅ Backend Django installé et configuré
- ✅ MySQL configuré avec ecom_db
- ✅ Modèles + Migrations + Seed Data
- ✅ Templates HTML purs (base, home, catalog, product_detail, personalize, cart, checkout, order_success)
- ✅ CSS Spiritual Luxury (rose/émeraude/or)
- ✅ JavaScript vanilla (cart drawer, live preview, flash timer, AJAX)
- ✅ Toutes les 6 images du repo GitHub intégrées
- ✅ Django runs on port 3000 (replaces React)

## Future Backlog
- [ ] Système d'auth utilisateur (compte client)
- [ ] Historique des commandes pour le client
- [ ] Avis clients après livraison
- [ ] Newsletter
- [ ] Wishlist (favoris)
- [ ] Intégration paiement Wave/Orange Money réelle
- [ ] Système de notification WhatsApp automatique
