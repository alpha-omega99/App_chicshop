"""URLs ChicShop+"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from shop.views import CategoryViewSet, ProductViewSet, OrderViewSet, stats_view, reviews_view
from shop import web_views

# API REST router
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

# Web URLs (Django templates)
web_urlpatterns = ([
    path('', web_views.home, name='home'),
    path('catalogue/', web_views.catalog, name='catalog'),
    path('catalogue/<slug:category_slug>/', web_views.catalog, name='catalog_category'),
    path('produit/<slug:slug>/', web_views.product_detail, name='product_detail'),
    path('personnaliser/', web_views.personalize, name='personalize'),
    path('panier/', web_views.cart_view, name='cart'),
    path('commander/', web_views.checkout, name='checkout'),
    path('commande/<str:reference>/', web_views.order_success, name='order_success'),
    # AJAX
    path('cart/add/', web_views.add_to_cart, name='cart_add'),
    path('cart/update/', web_views.update_cart, name='cart_update'),
    path('cart/remove/', web_views.remove_from_cart, name='cart_remove'),
    path('promo/validate/', web_views.validate_promo, name='validate_promo'),
], 'shop')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/stats/', stats_view, name='stats'),
    path('api/reviews/', reviews_view, name='reviews'),
    path('', include(web_urlpatterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
