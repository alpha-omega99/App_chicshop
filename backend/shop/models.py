"""
ChicShop+ Models - Boutique de tapis de prière islamiques
"""
import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class Category(models.Model):
    """Catégories de produits"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(unique=True, max_length=120)
    description = models.TextField(blank=True, verbose_name="Description")
    icon = models.CharField(max_length=10, blank=True, help_text="Emoji ou icône")
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'catégorie'
        verbose_name_plural = 'catégories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Produits ChicShop+ - tapis, chapelets, packs"""
    
    BADGE_CHOICES = [
        ('NEW', 'Nouveau'),
        ('HOT', 'Populaire'),
        ('PROMO', 'Promotion'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, verbose_name="Nom du produit")
    slug = models.SlugField(unique=True, max_length=220)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name='products'
    )
    description = models.TextField(verbose_name="Description complète")
    short_description = models.TextField(
        blank=True, max_length=250, verbose_name="Description courte"
    )

    # Tarification en F CFA
    price = models.DecimalField(
        max_digits=10, decimal_places=0,
        validators=[MinValueValidator(1)],
        verbose_name="Prix (F CFA)"
    )
    original_price = models.DecimalField(
        max_digits=10, decimal_places=0,
        null=True, blank=True,
        validators=[MinValueValidator(1)],
        verbose_name="Prix barré (F CFA)"
    )

    # Stock
    stock_quantity = models.PositiveIntegerField(default=0, verbose_name="Stock")
    is_available = models.BooleanField(default=True, verbose_name="Disponible")

    # Personnalisation broderie
    allows_embroidery = models.BooleanField(
        default=True, verbose_name="Permet la broderie"
    )
    embroidery_required = models.BooleanField(
        default=True, 
        verbose_name="Broderie obligatoire",
        help_text="Le prénom est obligatoire avant d'ajouter au panier"
    )
    max_embroidery_chars = models.PositiveSmallIntegerField(default=20)

    # Message personnalisé (packs premium ≥ 11000 F)
    allows_personal_message = models.BooleanField(
        default=False,
        verbose_name="Permet message personnalisé",
        help_text="Pour les packs premium"
    )
    max_message_chars = models.PositiveSmallIntegerField(default=200)

    # Présentation
    badge = models.CharField(
        max_length=10, choices=BADGE_CHOICES, blank=True
    )
    emoji = models.CharField(max_length=10, blank=True)
    color = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(
        blank=True, 
        verbose_name="URL de l'image",
        help_text="URL de l'image du produit"
    )
    gallery = models.JSONField(
        default=list, blank=True,
        help_text="Liste d'URLs d'images additionnelles"
    )
    tagline = models.CharField(max_length=150, blank=True, verbose_name="Slogan")
    rating = models.DecimalField(
        max_digits=3, decimal_places=1, default=4.9,
        verbose_name="Note moyenne"
    )
    review_count = models.PositiveIntegerField(default=0)
    is_flash = models.BooleanField(default=False, verbose_name="Vente flash")

    # Éléments inclus (pour les packs)
    included_items = models.JSONField(
        default=list, blank=True,
        help_text="Liste des éléments inclus dans le pack"
    )

    # SEO & Stats
    views_count = models.PositiveIntegerField(default=0)
    sales_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False, verbose_name="Produit vedette")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'produit'
        verbose_name_plural = 'produits'
        ordering = ['-is_featured', '-sales_count', '-created_at']
        indexes = [
            models.Index(fields=['is_active', 'is_available']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['-sales_count']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def discount_percent(self):
        if self.original_price and self.original_price > self.price:
            return round((1 - float(self.price) / float(self.original_price)) * 100)
        return None


class Order(models.Model):
    """Commandes"""
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmée'),
        ('in_embroidery', 'En personnalisation'),
        ('packaging', 'En emballage'),
        ('shipped', 'Expédiée'),
        ('delivered', 'Livrée'),
        ('cancelled', 'Annulée'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('orange_money', 'Orange Money'),
        ('wave', 'Wave'),
        ('cash', 'Cash à la livraison'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=20, unique=True, db_index=True)
    
    # Informations client
    customer_first_name = models.CharField(max_length=50)
    customer_last_name = models.CharField(max_length=50)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    
    # Livraison
    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=100)
    delivery_instructions = models.TextField(blank=True)
    
    # Personnalisation
    embroidery_name = models.CharField(max_length=20, blank=True)
    personal_message = models.CharField(max_length=200, blank=True)
    
    # Tarification
    subtotal = models.DecimalField(max_digits=12, decimal_places=0)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=0, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=0)
    promo_code = models.CharField(max_length=30, blank=True)
    
    # Paiement & Statut
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash'
    )
    payment_status = models.CharField(
        max_length=20, default='pending',
        choices=[('pending', 'En attente'), ('paid', 'Payée'), ('failed', 'Échec')]
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'commande'
        verbose_name_plural = 'commandes'
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.reference} - {self.customer_first_name} {self.customer_last_name}"

    def save(self, *args, **kwargs):
        if not self.reference:
            import secrets, string
            suffix = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            self.reference = f"CS-{suffix}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Lignes de commande"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, related_name='order_items'
    )
    product_name = models.CharField(max_length=200)
    unit_price = models.DecimalField(max_digits=10, decimal_places=0)
    quantity = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    embroidery_name = models.CharField(max_length=20, blank=True)
    personal_message = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "ligne de commande"
        verbose_name_plural = "lignes de commande"

    def __str__(self):
        return f"{self.product_name} ×{self.quantity}"

    @property
    def line_total(self):
        return self.unit_price * self.quantity


class Review(models.Model):
    """Avis clients"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    author_name = models.CharField(max_length=100)
    author_city = models.CharField(max_length=100, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(max_length=1000)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'avis client'
        verbose_name_plural = 'avis clients'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author_name} - {self.product.name} ({self.rating}★)"


class PromoCode(models.Model):
    """Codes promotionnels"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=30, unique=True, db_index=True)
    discount_percent = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(80)]
    )
    max_uses = models.PositiveIntegerField(default=100)
    current_uses = models.PositiveIntegerField(default=0)
    min_order_amount = models.DecimalField(
        max_digits=10, decimal_places=0, default=0
    )
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'code promo'
        verbose_name_plural = 'codes promo'

    def __str__(self):
        return f"{self.code} - -{self.discount_percent}%"

    def is_valid(self, order_amount=0):
        from django.utils import timezone
        now = timezone.now()
        return (
            self.is_active
            and self.current_uses < self.max_uses
            and self.valid_from <= now <= self.valid_until
            and order_amount >= float(self.min_order_amount)
        )
