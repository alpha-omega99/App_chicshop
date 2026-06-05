"""
Script de données initiales ChicShop+ - Design Spiritual Luxury
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chicshop_config.settings')
django.setup()

from shop.models import Category, Product, PromoCode, Review
from django.utils import timezone
from datetime import timedelta

# Images depuis le repo GitHub et Pexels
TAPIS_IMG_1 = "https://images.pexels.com/photos/7129561/pexels-photo-7129561.jpeg?auto=compress&cs=tinysrgb&w=800"
TAPIS_IMG_2 = "https://images.pexels.com/photos/7249335/pexels-photo-7249335.jpeg?auto=compress&cs=tinysrgb&w=800"
TAPIS_IMG_3 = "https://images.pexels.com/photos/34982280/pexels-photo-34982280.jpeg?auto=compress&cs=tinysrgb&w=800"

# Images du repo GitHub
LOCAL_TAPIS_1 = "/images/banniere.png"
LOCAL_TAPIS_2 = "/images/tapis_bannier.png"
LOCAL_TAPIS_3 = "/images/tapisban.png"
LOCAL_TAPIS_4 = "/images/banntapis.png"
LOCAL_TAPIS_5 = "/images/bantapis2.png"
LOCAL_TAPIS_6 = "/images/bantapis3.png"


def seed():
    print("🌸 Seeding ChicShop+...")
    
    # Catégories
    cat_packs = Category.objects.update_or_create(
        slug="packs",
        defaults={
            'name': "Packs Cadeaux",
            'description': "Expériences cadeaux complètes",
            'icon': "🎁",
            'order': 1
        }
    )[0]
    
    cat_tapis = Category.objects.update_or_create(
        slug="tapis",
        defaults={
            'name': "Tapis de Prière",
            'description': "Brodés à la main avec votre prénom",
            'icon': "🕌",
            'order': 2
        }
    )[0]
    
    cat_chapelet = Category.objects.update_or_create(
        slug="chapelet",
        defaults={
            'name': "Chapelets",
            'description': "Tasbih artisanaux",
            'icon': "📿",
            'order': 3
        }
    )[0]
    
    cat_coran = Category.objects.update_or_create(
        slug="coran",
        defaults={
            'name': "Coran",
            'description': "Éditions bilingues",
            'icon': "📖",
            'order': 4
        }
    )[0]
    
    print(f"✓ {Category.objects.count()} catégories")
    
    # Supprimer les anciens produits
    Product.objects.all().delete()
    
    # === PACKS CADEAUX ===
    Product.objects.create(
        name="Le Duo Essentiel",
        slug="duo-essentiel",
        category=cat_packs,
        tagline="Pour débuter sa quête spirituelle",
        description="Le pack idéal pour commencer votre voyage spirituel. Comprend un tapis de prière brodé avec votre prénom en calligraphie dorée, ainsi qu'un chapelet artisanal. Présenté dans un emballage cadeau soigné.",
        short_description="Tapis brodé + Chapelet",
        price=8990,
        original_price=11200,
        badge="NEW",
        emoji="🌸",
        image_url=LOCAL_TAPIS_1,
        gallery=[LOCAL_TAPIS_1, LOCAL_TAPIS_4, LOCAL_TAPIS_5],
        included_items=["Tapis personnalisé (Nom & Prénom)", "Chapelet (Tasbih)", "Emballage cadeau soigné"],
        allows_embroidery=True,
        embroidery_required=True,
        stock_quantity=50,
        is_featured=True,
        is_flash=True,
        rating=4.9,
        review_count=234,
    )
    
    Product.objects.create(
        name="L'Écrin de Sérénité",
        slug="ecrin-de-serenite",
        category=cat_packs,
        tagline="Le cadeau le plus offert pour marquer les cœurs",
        description="Notre best-seller. L'expérience cadeau ultime pour célébrer l'Aïd, un mariage ou tout moment spécial. Chaque détail est pensé pour émouvoir.",
        short_description="Pack premium avec message personnalisé",
        price=11990,
        original_price=14100,
        badge="HOT",
        emoji="✨",
        image_url=LOCAL_TAPIS_2,
        gallery=[LOCAL_TAPIS_2, LOCAL_TAPIS_3, LOCAL_TAPIS_1],
        included_items=[
            "Tapis Personnalisé (Nom & Prénom)",
            "Message personnalisé brodé",
            "Saint Coran arabe/français",
            "Chapelet (Tasbih)",
            "Zikromètre",
            "Emballage cadeau soigné"
        ],
        allows_embroidery=True,
        embroidery_required=True,
        allows_personal_message=True,
        stock_quantity=30,
        is_featured=True,
        is_flash=True,
        rating=5.0,
        review_count=412,
    )
    
    Product.objects.create(
        name="L'Héritage Royal",
        slug="heritage-royal",
        category=cat_packs,
        tagline="Le luxe ultime — Mariage, Hajj, grandes occasions",
        description="Le pack le plus prestigieux de notre collection. Pensé pour les moments inoubliables : mariages, départ au Hajj, cadeaux royaux.",
        short_description="Pack luxe complet",
        price=19850,
        original_price=22000,
        badge="PROMO",
        emoji="👑",
        image_url=LOCAL_TAPIS_3,
        gallery=[LOCAL_TAPIS_3, LOCAL_TAPIS_2, LOCAL_TAPIS_6],
        included_items=[
            "Tapis Personnalisé (Nom & Prénom)",
            "Message personnalisé brodé",
            "Saint Coran arabe/français",
            "Chapelet + Zikromètre",
            "Boubou marocain (H ou F)",
            "Parfum de luxe",
            "Emballage cadeau soigné"
        ],
        allows_embroidery=True,
        embroidery_required=True,
        allows_personal_message=True,
        stock_quantity=15,
        is_featured=True,
        rating=4.9,
        review_count=156,
    )
    
    # === TAPIS DE PRIÈRE ===
    Product.objects.create(
        name="Tapis Rose Poudré",
        slug="tapis-rose-poudre",
        category=cat_tapis,
        tagline="Délicat et raffiné",
        description="Tapis de prière brodé à la main dans des tons rose poudré apaisants. Calligraphie dorée pour votre prénom.",
        price=5990,
        original_price=7500,
        emoji="🌸",
        color="Rose",
        image_url=LOCAL_TAPIS_4,
        gallery=[LOCAL_TAPIS_4, LOCAL_TAPIS_5],
        allows_embroidery=True,
        embroidery_required=True,
        stock_quantity=60,
        is_featured=True,
        rating=4.8,
        review_count=89,
    )
    
    Product.objects.create(
        name="Tapis Émeraude Royal",
        slug="tapis-emeraude-royal",
        category=cat_tapis,
        tagline="L'élégance d'un vert profond",
        description="Tapis de prière dans un vert émeraude majestueux. Broderie dorée pour une touche de luxe ultime.",
        price=6990,
        original_price=8500,
        badge="NEW",
        emoji="💚",
        color="Émeraude",
        image_url=LOCAL_TAPIS_5,
        gallery=[LOCAL_TAPIS_5, LOCAL_TAPIS_1],
        allows_embroidery=True,
        embroidery_required=True,
        stock_quantity=40,
        is_featured=True,
        is_flash=True,
        rating=4.9,
        review_count=127,
    )
    
    Product.objects.create(
        name="Tapis Ivoire Précieux",
        slug="tapis-ivoire-precieux",
        category=cat_tapis,
        tagline="Pureté et grâce",
        description="Un tapis blanc ivoire d'une grande douceur. Idéal pour offrir lors des occasions spéciales.",
        price=7990,
        emoji="🤍",
        color="Ivoire",
        image_url=LOCAL_TAPIS_6,
        gallery=[LOCAL_TAPIS_6, LOCAL_TAPIS_2],
        allows_embroidery=True,
        embroidery_required=True,
        stock_quantity=35,
        rating=4.7,
        review_count=64,
    )
    
    Product.objects.create(
        name="Tapis Or & Lumière",
        slug="tapis-or-lumiere",
        category=cat_tapis,
        tagline="Calligraphie dorée magistrale",
        description="Notre tapis le plus élégant. Finitions or sur fond ivoire pour un effet majestueux.",
        price=9990,
        emoji="✨",
        badge="HOT",
        color="Or",
        image_url=LOCAL_TAPIS_1,
        gallery=[LOCAL_TAPIS_1, LOCAL_TAPIS_3],
        allows_embroidery=True,
        embroidery_required=True,
        stock_quantity=20,
        is_featured=True,
        rating=5.0,
        review_count=98,
    )
    
    # === CHAPELETS ===
    Product.objects.create(
        name="Tasbih Bois d'Olivier",
        slug="tasbih-bois-olivier",
        category=cat_chapelet,
        tagline="Artisanat naturel",
        description="Chapelet artisanal en bois d'olivier véritable. 99 perles. Léger et agréable au toucher.",
        price=2990,
        original_price=3500,
        emoji="🌿",
        image_url=LOCAL_TAPIS_4,
        allows_embroidery=False,
        embroidery_required=False,
        stock_quantity=80,
        rating=4.8,
        review_count=145,
    )
    
    Product.objects.create(
        name="Tasbih Nacre Premium",
        slug="tasbih-nacre-premium",
        category=cat_chapelet,
        tagline="Luxe et éclat",
        description="Chapelet d'exception en perles de nacre véritable. Chaque perle reflète la lumière différemment.",
        price=4990,
        badge="NEW",
        emoji="✨",
        image_url=LOCAL_TAPIS_5,
        allows_embroidery=False,
        embroidery_required=False,
        stock_quantity=25,
        is_featured=True,
        rating=4.9,
        review_count=72,
    )
    
    # === CORAN ===
    Product.objects.create(
        name="Coran Bilingue Premium",
        slug="coran-bilingue-premium",
        category=cat_coran,
        tagline="Édition arabe/français",
        description="Coran complet avec traduction française. Couverture en velours, tranches dorées.",
        price=8990,
        emoji="📖",
        image_url=LOCAL_TAPIS_6,
        allows_embroidery=False,
        stock_quantity=40,
        rating=4.9,
        review_count=203,
    )
    
    print(f"✓ {Product.objects.count()} produits")
    
    # === AVIS CLIENTS ===
    Review.objects.all().delete()
    
    reviews_data = [
        # Aminata - Duo Essentiel
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
                product=product,
                author_name=name,
                author_city=city,
                rating=rating,
                comment=comment,
                is_approved=True,
            )
        except Product.DoesNotExist:
            pass
    
    print(f"✓ {Review.objects.count()} avis")
    
    # === CODES PROMO ===
    PromoCode.objects.update_or_create(
        code="CHICSHOP15",
        defaults={
            'discount_percent': 15,
            'max_uses': 1000,
            'min_order_amount': 5000,
            'is_active': True,
            'valid_from': timezone.now(),
            'valid_until': timezone.now() + timedelta(days=365),
        }
    )
    
    PromoCode.objects.update_or_create(
        code="BIENVENUE10",
        defaults={
            'discount_percent': 10,
            'max_uses': 500,
            'min_order_amount': 0,
            'is_active': True,
            'valid_from': timezone.now(),
            'valid_until': timezone.now() + timedelta(days=30),
        }
    )
    
    print(f"✓ {PromoCode.objects.count()} codes promo")
    print("\n🎉 ChicShop+ est prêt!")
    print("📦 Codes: CHICSHOP15 (-15%) | BIENVENUE10 (-10%)")


if __name__ == '__main__':
    seed()
