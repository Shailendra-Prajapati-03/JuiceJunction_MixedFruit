from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, FruitViewSet, RecipeViewSet, OrderViewSet,
    NotificationViewSet, GiftVoucherViewSet, RewardViewSet,
    calculate_juice, apply_voucher, rewards_summary,
    vendor_register, VendorProductViewSet, VendorOrderViewSet, VendorViewSet,
    send_otp, verify_otp, verify_registration, resend_otp,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'fruits', FruitViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'users', UserViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'vouchers', GiftVoucherViewSet)
router.register(r'rewards', RewardViewSet)
router.register(r'vendor/products', VendorProductViewSet, basename='vendor-product')
router.register(r'vendor/orders', VendorOrderViewSet, basename='vendor-order')
router.register(r'vendors', VendorViewSet, basename='vendor')

urlpatterns = [
    path('', include(router.urls)),
    path('calculate/', calculate_juice, name='calculate_juice'),
    path('apply-voucher/', apply_voucher, name='apply_voucher'),
    path('rewards-summary/', rewards_summary, name='rewards_summary'),
    # Auth endpoints
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Vendor endpoints
    path('vendor/register/', vendor_register, name='vendor_register'),
    path('vendor/login/', TokenObtainPairView.as_view(), name='vendor_login'),
    # OTP Authentication (Production Ready)
    path('auth/send-otp/', send_otp, name='send_otp'),
    path('auth/verify-otp/', verify_otp, name='verify_otp'),
    path('auth/resend-otp/', resend_otp, name='resend_otp'),
    path('verify-registration/', verify_registration, name='verify_registration'),
]
