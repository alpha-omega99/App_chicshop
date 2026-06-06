"""
Vues HTML pour ChicShop+ - Django templates classiques
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.db.models import Q
from decimal import Decimal
import json

from .models import Category, Product, Order, OrderItem, Review, PromoCode


# ============================================================
# CART HELPERS (session-based)
# ============================================================

def get_cart(request):
    """Récupère le panier depuis la session"""
    return request.session.get('cart', [])


def save_cart(request, cart):
    request.session['cart'] = cart
    request.session.modified = True


def cart_subtotal(cart):
    return sum(Decimal(str(item['price'])) * item['quantity'] for item in cart)


def cart_count(cart):
    return sum(item['quantity'] for item in cart)


# ============================================================
# PAGES HTML
# ============================================================

def home(request):
    """Page d'accueil ChicShop+"""
    featured = Product.objects.filter(is_active=True, is_featured=True).select_related('category')[:8]
    packs = Product.objects.filter(is_active=True, category__slug='packs').select_related('category')[:3]
    flash = Product.objects.filter(is_active=True, is_flash=True).select_related('category')[:4]
    categories = Category.objects.filter(is_active=True)[:4]
    reviews = Review.objects.filter(is_approved=True).select_related('product')[:3]
    
    total_orders = Order.objects.count()
    stats = {
        'families_served': 2000 + total_orders,
        'today_sales': 14 + total_orders,
        'avg_rating': '4.9',
        'whatsapp_response_min': 5,
    }
    
    # Préparer les reviews avec time_ago
    from django.utils import timezone
    reviews_data = []
    for r in reviews:
        delta = timezone.now() - r.created_at
        if delta.days == 0:
            time_ago = "Aujourd'hui"
        elif delta.days == 1:
            time_ago = "Hier"
        elif delta.days < 30:
            time_ago = f"Il y a {delta.days} jours"
        else:
            time_ago = f"Il y a {delta.days // 30} mois"
        reviews_data.append({
            'name': r.author_name,
            'initial': r.author_name[0].upper() if r.author_name else 'A',
            'city': r.author_city,
            'rating': r.rating,
            'comment': r.comment,
            'time_ago': time_ago,
        })
    
    return render(request, 'shop/home.html', {
        'featured_products': featured,
        'packs': packs,
        'flash_products': flash,
        'categories': categories,
        'reviews': reviews_data,
        'stats': stats,
    })


def catalog(request, category_slug=None):
    """Catalogue produits"""
    products = Product.objects.filter(is_active=True, is_available=True).select_related('category')
    current_category = None
    
    if category_slug:
        current_category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=current_category)
    
    search = request.GET.get('q', '').strip()
    if search:
        products = products.filter(Q(name__icontains=search) | Q(description__icontains=search))
    
    sort = request.GET.get('sort', 'featured')
    if sort == 'price-asc':
        products = products.order_by('price')
    elif sort == 'price-desc':
        products = products.order_by('-price')
    elif sort == 'rating':
        products = products.order_by('-rating')
    else:
        products = products.order_by('-is_featured', '-sales_count')
    
    categories = Category.objects.filter(is_active=True)
    
    return render(request, 'shop/catalog.html', {
        'products': products,
        'categories': categories,
        'current_category': current_category,
        'search_query': search,
        'sort': sort,
    })


def product_detail(request, slug):
    """Détail produit"""
    product = get_object_or_404(
        Product.objects.select_related('category').prefetch_related('reviews'),
        slug=slug, is_active=True
    )
    # Incrémenter les vues
    Product.objects.filter(pk=product.pk).update(views_count=product.views_count + 1)
    
    related = Product.objects.filter(
        is_active=True, category=product.category
    ).exclude(pk=product.pk)[:4]
    
    approved_reviews = product.reviews.filter(is_approved=True)
    
    return render(request, 'shop/product_detail.html', {
        'product': product,
        'related_products': related,
        'reviews': approved_reviews,
    })


def personalize(request):
    """Page de personnalisation"""
    tapis = Product.objects.filter(is_active=True, category__slug='tapis')
    return render(request, 'shop/personalize.html', {
        'tapis_products': tapis,
    })


@require_POST
def add_to_cart(request):
    """Ajouter au panier (AJAX)"""
    try:
        data = json.loads(request.body)
        slug = data.get('slug')
        quantity = int(data.get('quantity', 1))
        embroidery = data.get('embroidery_name', '').strip()
        
        product = Product.objects.get(slug=slug, is_active=True)
        
        # Validation broderie
        if product.allows_embroidery and product.embroidery_required and not embroidery:
            return JsonResponse({'success': False, 'error': 'Veuillez saisir le prénom à broder'}, status=400)
        
        cart = get_cart(request)
        
        # Chercher item existant avec même broderie
        for item in cart:
            if item['slug'] == slug and item.get('embroidery_name', '') == embroidery:
                item['quantity'] += quantity
                save_cart(request, cart)
                return JsonResponse({
                    'success': True,
                    'cart_count': cart_count(cart),
                    'message': f"{product.name} ajouté au panier"
                })
        
        # Nouvel item
        cart.append({
            'slug': product.slug,
            'name': product.name,
            'price': str(product.price),
            'image': product.image_url,
            'quantity': quantity,
            'embroidery_name': embroidery,
        })
        save_cart(request, cart)
        
        return JsonResponse({
            'success': True,
            'cart_count': cart_count(cart),
            'message': f"{product.name} ajouté au panier"
        })
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Produit introuvable'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@require_POST
def update_cart(request):
    """Mettre à jour la quantité d'un item"""
    data = json.loads(request.body)
    index = int(data.get('index', -1))
    delta = int(data.get('delta', 0))
    
    cart = get_cart(request)
    if 0 <= index < len(cart):
        cart[index]['quantity'] = max(1, cart[index]['quantity'] + delta)
        save_cart(request, cart)
    
    return JsonResponse({
        'success': True,
        'cart_count': cart_count(cart),
        'subtotal': str(cart_subtotal(cart)),
    })


@require_POST
def remove_from_cart(request):
    """Retirer un item"""
    data = json.loads(request.body)
    index = int(data.get('index', -1))
    
    cart = get_cart(request)
    if 0 <= index < len(cart):
        cart.pop(index)
        save_cart(request, cart)
    
    return JsonResponse({
        'success': True,
        'cart_count': cart_count(cart),
        'subtotal': str(cart_subtotal(cart)),
    })


def cart_view(request):
    """Page panier"""
    cart = get_cart(request)
    return render(request, 'shop/cart.html', {
        'cart': cart,
        'subtotal': cart_subtotal(cart),
    })


def checkout(request):
    """Page checkout"""
    cart = get_cart(request)
    if not cart:
        return redirect('shop:catalog')
    
    if request.method == 'POST':
        # Créer la commande
        try:
            subtotal = cart_subtotal(cart)
            
            # Code promo
            discount_amount = Decimal('0')
            promo_code_str = request.POST.get('promo_code', '').strip().upper()
            if promo_code_str:
                try:
                    promo = PromoCode.objects.get(code=promo_code_str)
                    if promo.is_valid(float(subtotal)):
                        discount_amount = subtotal * Decimal(promo.discount_percent) / Decimal('100')
                        promo.current_uses += 1
                        promo.save()
                except PromoCode.DoesNotExist:
                    pass
            
            delivery_fee = Decimal('0') if subtotal >= Decimal('15000') else Decimal('1500')
            total = subtotal - discount_amount + delivery_fee
            
            order = Order.objects.create(
                customer_first_name=request.POST.get('first_name', ''),
                customer_last_name=request.POST.get('last_name', ''),
                customer_email=request.POST.get('email', ''),
                customer_phone=request.POST.get('phone', ''),
                delivery_address=request.POST.get('address', ''),
                delivery_city=request.POST.get('city', 'Abidjan'),
                delivery_instructions=request.POST.get('instructions', ''),
                subtotal=subtotal,
                discount_amount=discount_amount,
                total_amount=total,
                promo_code=promo_code_str,
                payment_method=request.POST.get('payment_method', 'cash'),
            )
            
            for item in cart:
                product = Product.objects.get(slug=item['slug'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    unit_price=Decimal(item['price']),
                    quantity=item['quantity'],
                    embroidery_name=item.get('embroidery_name', ''),
                )
            
            # Vider le panier
            save_cart(request, [])
            
            return redirect('shop:order_success', reference=order.reference)
        except Exception as e:
            messages.error(request, f"Erreur: {e}")
    
    subtotal = cart_subtotal(cart)
    delivery_fee = Decimal('0') if subtotal >= Decimal('15000') else Decimal('1500')
    
    return render(request, 'shop/checkout.html', {
        'cart': cart,
        'subtotal': subtotal,
        'delivery_fee': delivery_fee,
    })


def order_success(request, reference):
    """Confirmation de commande"""
    order = get_object_or_404(Order, reference=reference)
    return render(request, 'shop/order_success.html', {'order': order})


@require_POST
def validate_promo(request):
    """Valider un code promo (AJAX)"""
    data = json.loads(request.body)
    code = data.get('code', '').strip().upper()
    amount = Decimal(str(data.get('amount', 0)))
    
    try:
        promo = PromoCode.objects.get(code=code)
        if promo.is_valid(float(amount)):
            discount = amount * Decimal(promo.discount_percent) / Decimal('100')
            return JsonResponse({
                'success': True,
                'code': promo.code,
                'percent': promo.discount_percent,
                'discount': str(round(discount)),
                'message': f"-{promo.discount_percent}% appliqué !"
            })
        return JsonResponse({'success': False, 'error': "Code expiré ou invalide"})
    except PromoCode.DoesNotExist:
        return JsonResponse({'success': False, 'error': "Code promo invalide"})
