"""
Serializers pour l'API ChicShop+
"""
from rest_framework import serializers
from .models import Category, Product, Order, OrderItem, Review, PromoCode


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True, is_available=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste de produits"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    discount_percent = serializers.ReadOnlyField()
    image = serializers.URLField(source='image_url', read_only=True)
    is_featured = serializers.BooleanField(read_only=True)
    is_flash = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category_name', 'category_slug',
            'short_description', 'tagline', 'description',
            'price', 'original_price', 'discount_percent', 'badge', 'emoji',
            'image', 'image_url', 'gallery', 'is_featured', 'is_flash',
            'stock_quantity', 'allows_embroidery', 'embroidery_required',
            'rating', 'review_count', 'included_items', 'color'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'author_name', 'author_city', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un produit"""
    category = CategorySerializer(read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    discount_percent = serializers.ReadOnlyField()
    reviews = ReviewSerializer(many=True, read_only=True)
    image = serializers.URLField(source='image_url', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_slug',
            'description', 'short_description', 'tagline',
            'price', 'original_price', 'discount_percent', 'stock_quantity',
            'is_available', 'allows_embroidery', 'embroidery_required',
            'max_embroidery_chars', 'allows_personal_message', 'max_message_chars',
            'badge', 'emoji', 'color', 'image', 'image_url', 'gallery',
            'included_items', 'views_count', 'sales_count', 'is_featured',
            'is_flash', 'reviews', 'rating', 'review_count',
            'created_at', 'updated_at'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()
    product_name = serializers.CharField(required=False, allow_blank=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=0, required=False)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'unit_price', 'quantity',
            'embroidery_name', 'personal_message', 'line_total'
        ]
        read_only_fields = ['id', 'line_total']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer une commande"""
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'customer_first_name', 'customer_last_name', 'customer_email',
            'customer_phone', 'delivery_address', 'delivery_city',
            'delivery_instructions', 'embroidery_name', 'personal_message',
            'payment_method', 'promo_code', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculer les totaux
        subtotal = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            unit_price = product.price
            item_data['unit_price'] = unit_price
            item_data['product_name'] = product.name
            subtotal += unit_price * quantity
        
        # Appliquer le code promo si présent
        discount_amount = 0
        promo_code_str = validated_data.get('promo_code', '')
        if promo_code_str:
            try:
                promo = PromoCode.objects.get(code=promo_code_str)
                if promo.is_valid(float(subtotal)):
                    discount_amount = subtotal * promo.discount_percent / 100
                    promo.current_uses += 1
                    promo.save()
            except PromoCode.DoesNotExist:
                pass
        
        total_amount = subtotal - discount_amount
        
        # Créer la commande
        order = Order.objects.create(
            subtotal=subtotal,
            discount_amount=discount_amount,
            total_amount=total_amount,
            **validated_data
        )
        
        # Créer les lignes de commande
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class OrderSerializer(serializers.ModelSerializer):
    """Serializer pour afficher une commande"""
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'reference', 'customer_first_name', 'customer_last_name',
            'customer_email', 'customer_phone', 'delivery_address',
            'delivery_city', 'delivery_instructions', 'embroidery_name',
            'personal_message', 'subtotal', 'discount_amount', 'total_amount',
            'promo_code', 'payment_method', 'payment_status', 'status',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reference', 'created_at', 'updated_at']


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ['code', 'discount_percent', 'min_order_amount']


class PromoCodeValidateSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=30)
    order_amount = serializers.DecimalField(max_digits=12, decimal_places=0)
    
    def validate(self, data):
        code = data.get('code')
        order_amount = float(data.get('order_amount', 0))
        
        try:
            promo = PromoCode.objects.get(code=code)
            if not promo.is_valid(order_amount):
                raise serializers.ValidationError({
                    'code': 'Ce code promo n\'est pas valide ou a expiré.'
                })
            data['promo'] = promo
        except PromoCode.DoesNotExist:
            raise serializers.ValidationError({
                'code': 'Ce code promo n\'existe pas.'
            })
        
        return data
