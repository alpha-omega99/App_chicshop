from django.contrib import admin
from .models import Category, Product, Order, OrderItem, Review, PromoCode


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'unit_price', 'line_total']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'price', 'original_price', 'stock_quantity',
        'is_featured', 'is_available', 'badge'
    ]
    list_filter = ['category', 'is_featured', 'is_available', 'badge']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['views_count', 'sales_count']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'reference', 'customer_first_name', 'customer_last_name',
        'total_amount', 'status', 'payment_status', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'payment_method', 'created_at']
    search_fields = ['reference', 'customer_email', 'customer_phone']
    readonly_fields = ['reference', 'created_at', 'updated_at']
    inlines = [OrderItemInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'author_name', 'rating', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['author_name', 'comment', 'product__name']


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'discount_percent', 'current_uses', 'max_uses',
        'is_active', 'valid_from', 'valid_until'
    ]
    list_filter = ['is_active', 'valid_from', 'valid_until']
    search_fields = ['code']
