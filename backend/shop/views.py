"""
Views API pour ChicShop+
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db import models
from django.db.models import Q, Avg
from .models import Category, Product, Order, Review, PromoCode
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    OrderCreateSerializer, OrderSerializer, ReviewSerializer,
    PromoCodeValidateSerializer
)


@api_view(['GET'])
def stats_view(request):
    """Statistiques globales du site"""
    total_orders = Order.objects.count()
    return Response({
        'families_served': 2000 + total_orders,
        'today_sales': 14 + total_orders,
        'avg_rating': 4.9,
        'whatsapp_response_min': 5,
    })


@api_view(['GET'])
def reviews_view(request):
    """Tous les avis approuvés"""
    limit = int(request.query_params.get('limit', 20))
    product_slug = request.query_params.get('product_slug', None)
    
    queryset = Review.objects.filter(is_approved=True).select_related('product')
    if product_slug:
        queryset = queryset.filter(product__slug=product_slug)
    
    reviews = queryset[:limit]
    
    data = []
    for r in reviews:
        # Calculer "il y a X jours"
        from django.utils import timezone
        delta = timezone.now() - r.created_at
        if delta.days == 0:
            time_ago = "Aujourd'hui"
        elif delta.days == 1:
            time_ago = "Hier"
        elif delta.days < 30:
            time_ago = f"Il y a {delta.days} jours"
        else:
            time_ago = f"Il y a {delta.days // 30} mois"
        
        data.append({
            'id': str(r.id),
            'name': r.author_name,
            'initial': r.author_name[0].upper() if r.author_name else 'A',
            'city': r.author_city,
            'rating': r.rating,
            'comment': r.comment,
            'time_ago': time_ago,
            'product_slug': r.product.slug,
        })
    
    return Response(data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API pour les catégories"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    pagination_class = None


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """API pour les produits"""
    lookup_field = 'slug'
    pagination_class = None  # Pas de pagination
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, is_available=True)
        
        # Filtres
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        flash = self.request.query_params.get('flash', None)
        if flash == 'true':
            queryset = queryset.filter(is_flash=True)
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset.select_related('category').prefetch_related('reviews')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrémenter le compteur de vues
        Product.objects.filter(pk=instance.pk).update(
            views_count=models.F('views_count') + 1
        )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, slug=None):
        """Ajouter un avis sur un produit"""
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    """API pour les commandes"""
    queryset = Order.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Retourner la commande créée avec tous les détails
        output_serializer = OrderSerializer(order)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def validate_promo(self, request):
        """Valider un code promo"""
        serializer = PromoCodeValidateSerializer(data=request.data)
        
        if serializer.is_valid():
            promo = serializer.validated_data['promo']
            order_amount = float(serializer.validated_data['order_amount'])
            discount_amount = order_amount * promo.discount_percent / 100
            
            return Response({
                'valid': True,
                'code': promo.code,
                'discount_percent': promo.discount_percent,
                'discount_amount': int(discount_amount),
                'message': f'Code promo appliqué ! -{promo.discount_percent}% de réduction'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
