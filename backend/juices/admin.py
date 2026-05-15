from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Fruit, Recipe, RecipeIngredient, Order, Notification, GiftVoucher, Reward, CustomUser, Vendor, Product, OTPVerification

admin.site.register(CustomUser, UserAdmin)

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'owner_name', 'phone', 'is_approved', 'agreed_to_terms', 'created_at')
    list_filter = ('is_approved', 'agreed_to_terms', 'created_at')
    search_fields = ('shop_name', 'owner_name', 'phone', 'email')
    readonly_fields = ('created_at',)
    actions = ['approve_vendors', 'reject_vendors']

    def approve_vendors(self, request, queryset):
        queryset.update(is_approved=True)
        # In a real app, send email notification here
    approve_vendors.short_description = "Approve selected vendors"

    def reject_vendors(self, request, queryset):
        queryset.update(is_approved=False)
    reject_vendors.short_description = "Reject selected vendors"

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_verified', 'attempts', 'created_at', 'expires_at', 'ip_address')
    list_filter = ('is_verified', 'created_at', 'expires_at')
    search_fields = ('email', 'ip_address')
    readonly_fields = ('created_at',)

admin.site.register(Product)


class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1


@admin.register(Fruit)
class FruitAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price_per_100ml', 'calories_per_100ml', 'color_hex')
    list_filter = ('category',)
    search_fields = ('name',)


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_price', 'is_signature')
    inlines = [RecipeIngredientInline]
    search_fields = ('name',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'juice_name', 'total_price', 'status', 'tracking_step', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read')
    readonly_fields = ('created_at',)


@admin.register(GiftVoucher)
class GiftVoucherAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'min_order', 'expiry_date', 'is_active', 'times_used')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('code',)


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ('user_session', 'points', 'level', 'updated_at')
    list_filter = ('level',)
