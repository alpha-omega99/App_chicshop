"""
Seed data ChicShop+ - Refactored into modular functions
"""
import os
import django
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chicshop_config.settings')
django.setup()

from django.utils import timezone
from shop.models import Category, Product, PromoCode, Review


# === Image URLs ===
LOCAL_TAPIS = {
    'banniere': "/static/shop/images/banniere.png",
    'tapis_bannier': "/static/shop/images/tapis_bannier.png",
    'tapisban': "/static/shop/images/tapisban.png",
    'banntapis': "/static/shop/images/banntapis.png",
    'bantapis2': "/static/shop/images/bantapis2.png",
    'bantapis3': "/static/shop/images/bantapis3.png",
}


def seed_categories():
    """Crée les catégories de produits"""
    data = [
        ('packs', "Packs Cadeaux", "Expériences cadeaux complètes", "🎁", 1),
        ('tapis', "Tapis de Prière", "Brodés à la main avec votre prénom", "🕌", 2),
        ('chapelet', "Chapelets", "Tasbih artisanaux", "📿", 3),
        ('coran', "Coran", "Éditions bilingues", "📖", 4),
    ]
    cats = {}
    for slug, name, desc, icon, order in data:
        cat, _ = Category.objects.update_or_create(
            slug=slug,
            defaults={'name': name, 'description': desc, 'icon': icon, 'order': order}
        )
        cats[slug] = cat
    print(f"✓ {Category.objects.count()} catégories")
    return cats


def seed_packs(categories):
    """Crée les packs cadeaux"""
    packs = [
        {
            'slug': "duo-essentiel",
            'name': "Le Duo Essentiel",
            'tagline': "Pour débuter sa quête spirituelle",
            'description': "Le pack idéal pour commencer votre voyage spirituel. Comprend un tapis de prière brodé avec votre prénom en calligraphie dorée, ainsi qu'un chapelet artisanal. Présenté dans un emballage cadeau soigné.",
            'short_description': "Tapis brodé + Chapelet",
            'price': 8990, 'original_price': 11200,
            'badge': "NEW", 'emoji': "🌸",
            'image_url': LOCAL_TAPIS['banniere'],
            'gallery': [LOCAL_TAPIS['banniere'], LOCAL_TAPIS['banntapis'], LOCAL_TAPIS['bantapis2']],
            'included_items': ["Tapis personnalisé (Nom & Prénom)", "Chapelet (Tasbih)", "Emballage cadeau soigné"],
            'allows_embroidery': True, 'embroidery_required': True,
            'stock_quantity': 50, 'is_featured': True, 'is_flash': True,
            'rating': 4.9, 'review_count': 234,
        },
        {
            'slug': "ecrin-de-serenite",
            'name': "L'Écrin de Sérénité",
            'tagline': "Le cadeau le plus offert pour marquer les cœurs",
            'description': "Notre best-seller. L'expérience cadeau ultime pour célébrer l'Aïd, un mariage ou tout moment spécial. Chaque détail est pensé pour émouvoir.",
            'short_description': "Pack premium avec message personnalisé",
            'price': 11990, 'original_price': 14100,
            'badge': "HOT", 'emoji': "✨",
            'image_url': LOCAL_TAPIS['tapis_bannier'],
            'gallery': [LOCAL_TAPIS['tapis_bannier'], LOCAL_TAPIS['tapisban'], LOCAL_TAPIS['banniere']],
            'included_items': [
                "Tapis Personnalisé (Nom & Prénom)", "Message personnalisé brodé",
                "Saint Coran arabe/français", "Chapelet (Tasbih)",
                "Zikromètre", "Emballage cadeau soigné"
            ],
            'allows_embroidery': True, 'embroidery_required': True,
            'allows_personal_message': True,
            'stock_quantity': 30, 'is_featured': True, 'is_flash': True,
            'rating': 5.0, 'review_count': 412,
        },
        {
            'slug': "heritage-royal",
            'name': "L'Héritage Royal",
            'tagline': "Le luxe ultime — Mariage, Hajj, grandes occasions",
            'description': "Le pack le plus prestigieux de notre collection. Pensé pour les moments inoubliables : mariages, départ au Hajj, cadeaux royaux.",
            'short_description': "Pack luxe complet",
            'price': 19850, 'original_price': 22000,
            'badge': "PROMO", 'emoji': "👑",
            'image_url': LOCAL_TAPIS['tapisban'],
            'gallery': [LOCAL_TAPIS['tapisban'], LOCAL_TAPIS['tapis_bannier'], LOCAL_TAPIS['bantapis3']],
            'included_items': [
                "Tapis Personnalisé (Nom & Prénom)", "Message personnalisé brodé",
                "Saint Coran arabe/français", "Chapelet + Zikromètre",
                "Boubou marocain (H ou F)", "Parfum de luxe", "Emballage cadeau soigné"
            ],
            'allows_embroidery': True, 'embroidery_required': True,
            'allows_personal_message': True,
            'stock_quantity': 15, 'is_featured': True,
            'rating': 4.9, 'review_count': 156,
        },
    ]
    _create_products(packs, categories['packs'])


def seed_tapis(categories):
    """Crée les tapis individuels"""
    tapis = [
        {
            'slug': "tapis-rose-poudre", 'name': "Tapis Rose Poudré",
            'tagline': "Délicat et raffiné",
            'description': "Tapis de prière brodé à la main dans des tons rose poudré apaisants. Calligraphie dorée pour votre prénom.",
            'price': 5990, 'original_price': 7500,
            'emoji': "🌸", 'color': "Rose",
            'image_url': LOCAL_TAPIS['banntapis'],
            'gallery': [LOCAL_TAPIS['banntapis'], LOCAL_TAPIS['bantapis2']],
            'allows_embroidery': True, 'embroidery_required': True,
            'stock_quantity': 60, 'is_featured': True,
            'rating': 4.8, 'review_count': 89,
        },
        {
            'slug': "tapis-emeraude-royal", 'name': "Tapis Émeraude Royal",
            'tagline': "L'élégance d'un vert profond",
            'description': "Tapis de prière dans un vert émeraude majestueux. Broderie dorée pour une touche de luxe ultime.",
            'price': 6990, 'original_price': 8500,
            'badge': "NEW", 'emoji': "💚", 'color': "Émeraude",
            'image_url': LOCAL_TAPIS['bantapis2'],
            'gallery': [LOCAL_TAPIS['bantapis2'], LOCAL_TAPIS['banniere']],
            'allows_embroidery': True, 'embroidery_required': True,
            'stock_quantity': 40, 'is_featured': True, 'is_flash': True,
            'rating': 4.9, 'review_count': 127,
        },
        {
            'slug': "tapis-ivoire-precieux", 'name': "Tapis Ivoire Précieux",
            'tagline': "Pureté et grâce",
            'description': "Un tapis blanc ivoire d'une grande douceur. Idéal pour offrir lors des occasions spéciales.",
            'price': 7990, 'emoji': "🤍", 'color': "Ivoire",
            'image_url': LOCAL_TAPIS['bantapis3'],
            'gallery': [LOCAL_TAPIS['bantapis3'], LOCAL_TAPIS['tapis_bannier']],
            'allows_embroidery': True, 'embroidery_required': True,
            'stock_quantity': 35, 'rating': 4.7, 'review_count': 64,
        },
        {
            'slug': "tapis-or-lumiere", 'name': "Tapis Or & Lumière",
            'tagline': "Calligraphie dorée magistrale",
            'description': "Notre tapis le plus élégant. Finitions or sur fond ivoire pour un effet majestueux.",
            'price': 9990, 'emoji': "✨", 'badge': "HOT", 'color': "Or",
            'image_url': LOCAL_TAPIS['banniere'],
            'gallery': [LOCAL_TAPIS['banniere'], LOCAL_TAPIS['tapisban']],
            'allows_embroidery': True, 'embroidery_required': True,
            'stock_quantity': 20, 'is_featured': True,
            'rating': 5.0, 'review_count': 98,
        },
    ]
    _create_products(tapis, categories['tapis'])


def seed_chapelets(categories):
    """Crée les chapelets"""
    chapelets = [
        {
            'slug': "tasbih-bois-olivier", 'name': "Tasbih Bois d'Olivier",
            'tagline': "Artisanat naturel",
            'description': "Chapelet artisanal en bois d'olivier véritable. 99 perles. Léger et agréable au toucher.",
            'price': 2990, 'original_price': 3500,
            'emoji': "🌿", 'image_url': LOCAL_TAPIS['banntapis'],
            'allows_embroidery': False, 'embroidery_required': False,
            'stock_quantity': 80, 'rating': 4.8, 'review_count': 145,
        },
        {
            'slug': "tasbih-nacre-premium", 'name': "Tasbih Nacre Premium",
            'tagline': "Luxe et éclat",
            'description': "Chapelet d'exception en perles de nacre véritable. Chaque perle reflète la lumière différemment.",
            'price': 4990, 'badge': "NEW", 'emoji': "✨",
            'image_url': LOCAL_TAPIS['bantapis2'],
            'allows_embroidery': False, 'embroidery_required': False,
            'stock_quantity': 25, 'is_featured': True,
            'rating': 4.9, 'review_count': 72,
        },
    ]
    _create_products(chapelets, categories['chapelet'])


def seed_coran(categories):
    """Crée les Corans"""
    corans = [
        {
            'slug': "coran-bilingue-premium", 'name': "Coran Bilingue Premium",
            'tagline': "Édition arabe/français",
            'description': "Coran complet avec traduction française. Couverture en velours, tranches dorées.",
            'price': 8990, 'emoji': "📖",
            'image_url': LOCAL_TAPIS['bantapis3'],
            'allows_embroidery': False,
            'stock_quantity': 40, 'rating': 4.9, 'review_count': 203,
        },
    ]
    _create_products(corans, categories['coran'])


def _create_products(items, category):
    """Helper to create products in bulk"""
    for item in items:
        Product.objects.update_or_create(
            slug=item.pop('slug'),
            defaults={**item, 'category': category}
        )


def seed_reviews():
    """Crée les avis clients"""
    Review.objects.all().delete()
    
    reviews_data = [
        ("Aminata D.", "Abidjan", 5, "Magnifique ! La broderie est parfaite, j'ai pleuré en l'ouvrant. Mon nom en or sur le tapis... un cadeau inoubliable.", "duo-essentiel"),
        ("Mariam K.", "Yamoussoukro", 5, "L'Écrin de Sérénité est juste sublime. Tous les détails sont soignés. Le Coran, le chapelet, le parfum... Tout est parfait.", "ecrin-de-serenite"),
        ("Fatou B.", "Bouaké", 5, "J'ai offert l'Héritage Royal pour le mariage de ma cousine. Sa famille a été émue aux larmes. Merci ChicShop !", "heritage-royal"),
        ("Khadija S.", "Abidjan", 5, "Service rapide, livraison en 24h ! Aminata est adorable sur WhatsApp. Je recommande à 100%.", "duo-essentiel"),
        ("Aïcha M.", "San-Pédro", 5, "Le tapis Émeraude est tout simplement royal. La qualité est exceptionnelle, la broderie d'une finesse incroyable.", "tapis-emeraude-royal"),
        ("Bintou T.", "Korhogo", 5, "Cadeau parfait pour ma maman. Elle l'a adoré ! La couleur rose est magnifique.", "tapis-rose-poudre"),
    ]
    
    for name, city, rating, comment, prod_slug in reviews_data:
        try:
            product = Product.objects.get(slug=prod_slug)
            Review.objects.create(
                product=product, author_name=name, author_city=city,
                rating=rating, comment=comment, is_approved=True,
            )
        except Product.DoesNotExist:
            continue
    
    print(f"✓ {Review.objects.count()} avis")


def seed_promo_codes():
    """Crée les codes promotionnels"""
    codes = [
        ("CHICSHOP15", 15, 1000, 5000, 365),
        ("BIENVENUE10", 10, 500, 0, 30),
    ]
    for code, percent, max_uses, min_amount, days in codes:
        PromoCode.objects.update_or_create(
            code=code,
            defaults={
                'discount_percent': percent,
                'max_uses': max_uses,
                'min_order_amount': min_amount,
                'is_active': True,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=days),
            }
        )
    print(f"✓ {PromoCode.objects.count()} codes promo")


def seed():
    """Orchestrateur principal - exécute toutes les étapes"""
    print("🌸 Seeding ChicShop+...")
    
    Product.objects.all().delete()
    
    categories = seed_categories()
    seed_packs(categories)
    seed_tapis(categories)
    seed_chapelets(categories)
    seed_coran(categories)
    
    print(f"✓ {Product.objects.count()} produits")
    
    seed_reviews()
    seed_promo_codes()
    
    print("\n🎉 ChicShop+ est prêt!")
    print("📦 Codes: CHICSHOP15 (-15%) | BIENVENUE10 (-10%)")


if __name__ == '__main__':
    seed()
