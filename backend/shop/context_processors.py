"""Context processors globaux pour ChicShop+"""
from typing import Any, Dict, List
from decimal import Decimal
from django.http import HttpRequest
from .models import Category
from .web_views import get_cart, cart_count, cart_subtotal


def global_context(request: HttpRequest) -> Dict[str, Any]:
    """Variables disponibles dans tous les templates"""
    cart: List[Dict[str, Any]] = get_cart(request)
    return {
        'global_categories': Category.objects.filter(is_active=True),
        'cart_items': cart,
        'cart_count': cart_count(cart),
        'cart_subtotal': cart_subtotal(cart),
    }
