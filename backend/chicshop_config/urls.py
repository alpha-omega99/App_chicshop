"""
URL configuration for ChicShop+ API
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from shop.views import CategoryViewSet, ProductViewSet, OrderViewSet, stats_view, reviews_view

# Router pour l'API REST
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/stats/', stats_view, name='stats'),
    path('api/reviews/', reviews_view, name='reviews'),
]
