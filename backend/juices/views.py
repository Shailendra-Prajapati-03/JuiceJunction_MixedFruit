from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Fruit, Recipe, Order, Notification, GiftVoucher, Reward, Vendor, Product
from .serializers import (
    FruitSerializer, RecipeSerializer, OrderSerializer,
    UserSerializer, NotificationSerializer, GiftVoucherSerializer, RewardSerializer,
    VendorSerializer, ProductSerializer, OTPSendSerializer, OTPVerifySerializer,
    CartItemSerializer
)
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import OTPVerification, CartItem
from .utils import generate_otp, send_otp_email
from datetime import timedelta
import razorpay
import hmac
import hashlib
import random
import string
import os

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class FruitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fruit.objects.all()
    serializer_class = FruitSerializer
    permission_classes = [permissions.AllowAny]


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny]


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        order = serializer.save(
            user=self.request.user if self.request.user.is_authenticated else None
        )
        # Auto-create a notification for the new order
        Notification.objects.create(
            user=order.user,
            order=order,
            title='Order Placed! 🎉',
            message=f'Your order #{order.id} ({order.juice_name}) has been placed successfully.',
            notification_type='order_update',
        )

    @action(detail=True, methods=['post'], url_path='advance')
    def advance_status(self, request, pk=None):
        """Move order to the next tracking step."""
        order = self.get_object()
        steps = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered']
        messages = [
            'Your order has been placed! 🎉',
            'Your order has been confirmed by our team! ✅',
            'Our team is preparing your fresh juice! 🍊',
            'Your juice is on its way! 🛵',
            'Your order has been delivered. Enjoy! 🥤',
        ]
        if order.tracking_step < 4:
            order.tracking_step += 1
            order.status = steps[order.tracking_step]
            order.save()
            Notification.objects.create(
                user=order.user,
                order=order,
                title=f'Order #{order.id} — {order.status}',
                message=messages[order.tracking_step],
                notification_type='order_update',
            )
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['post'], url_path='create-payment-order')
    def create_payment_order(self, request):
        amount = int(float(request.data.get('amount', 0)) * 100) # In paise
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        try:
            payment_order = client.order.create({
                'amount': amount,
                'currency': 'INR',
                'payment_capture': 1
            })
            return Response(payment_order)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request):
        data = request.data
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        order_id = data.get('order_id')

        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        try:
            client.utility.verify_payment_signature(params_dict)
            
            # Payment is valid, update order and create payment record
            from .models import Payment
            order = Order.objects.get(id=order_id)
            Payment.objects.update_or_create(
                order=order,
                defaults={
                    'razorpay_order_id': razorpay_order_id,
                    'razorpay_payment_id': razorpay_payment_id,
                    'razorpay_signature': razorpay_signature,
                    'amount': order.total_price,
                    'status': 'Success'
                }
            )
            order.status = 'Confirmed'
            order.save()
            
            return Response({'status': 'Payment Verified', 'order_status': 'Confirmed'})
        except Exception as e:
            return Response({'error': f'Payment Verification Failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_order(self, request, pk=None):
        """Cancel an order if it hasn't been prepared yet."""
        order = self.get_object()
        if order.tracking_step >= 2: # Preparing or further
            return Response(
                {"error": "Order cannot be cancelled as it is already being prepared or delivered."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'Cancelled'
        order.save()
        
        Notification.objects.create(
            user=order.user,
            order=order,
            title=f'Order #{order.id} Cancelled 🛑',
            message=f'Your order for {order.juice_name} has been cancelled successfully.',
            notification_type='order_update',
        )
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['get'], url_path='track')
    def track(self, request, pk=None):
        """Return tracking info for an order."""
        order = self.get_object()
        steps = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered']
        timeline = [
            {
                'step': i,
                'label': label,
                'is_complete': i < order.tracking_step,
                'is_current': i == order.tracking_step,
            }
            for i, label in enumerate(steps)
        ]
        return Response({
            'order_id': order.id,
            'juice_name': order.juice_name,
            'status': order.status,
            'tracking_step': order.tracking_step,
            'timeline': timeline,
            'delivery_address': order.delivery_address,
            'payment_method': order.payment_method,
            'total_price': str(order.total_price),
            'created_at': order.created_at,
        })


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all marked read'})

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)


class GiftVoucherViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GiftVoucher.objects.filter(is_active=True).order_by('expiry_date')
    serializer_class = GiftVoucherSerializer
    permission_classes = [permissions.AllowAny]


class RewardViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RewardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reward.objects.filter(user=self.request.user)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='sync')
    def sync_cart(self, request):
        """Sync local cart items to the database."""
        items_data = request.data.get('items', [])
        # Clear existing cart and replace with new items
        CartItem.objects.filter(user=request.user).delete()
        
        for item in items_data:
            CartItem.objects.create(
                user=request.user,
                product_id=item.get('product_id'),
                custom_juice_data=item.get('custom_juice_data'),
                quantity=item.get('quantity', 1)
            )
        return Response({'status': 'cart synced'})

# ── Vendor Endpoints ──────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def vendor_register(request):
    data = request.data
    try:
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data.get('email', ''),
            is_vendor=True
        )
        Vendor.objects.create(
            user=user,
            shop_name=data['shop_name'],
            address=data.get('address', '')
        )
        return Response({'message': 'Vendor registered successfully. Waiting for admin approval.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VendorViewSet(viewsets.ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Vendor.objects.all()
        return Vendor.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        vendor = self.get_object()
        vendor.is_approved = True
        vendor.save()
        return Response({'status': 'Vendor approved'})

    @action(detail=False, methods=['get'], url_path='analytics')
    def analytics(self, request):
        if not hasattr(request.user, 'vendor_profile'):
            return Response({'error': 'Not a vendor'}, status=403)
        
        vendor = request.user.vendor_profile
        orders = Order.objects.filter(vendor=vendor)
        products = Product.objects.filter(vendor=vendor)
        
        revenue = sum(float(o.total_price) for o in orders if o.status == 'Delivered')
        
        return Response({
            'total_orders': orders.count(),
            'total_revenue': revenue,
            'active_products': products.filter(is_available=True).count(),
            'pending_orders': orders.filter(status='Placed').count(),
            'recent_orders': OrderSerializer(orders.order_by('-created_at')[:5], many=True).data
        })

from rest_framework.exceptions import ValidationError

class VendorProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'vendor_profile'):
            return Product.objects.filter(vendor=self.request.user.vendor_profile)
        return Product.objects.none()

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'vendor_profile'):
            raise ValidationError("User is not a vendor.")
        if not self.request.user.vendor_profile.is_approved:
            raise ValidationError("Vendor is not approved yet.")
        serializer.save(vendor=self.request.user.vendor_profile)

class VendorOrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'vendor_profile'):
            return Order.objects.filter(vendor=self.request.user.vendor_profile).order_by('-created_at')
        return Order.objects.none()

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            # Update tracking step based on status
            status_to_step = {
                'Placed': 0, 'Confirmed': 1, 'Preparing': 2, 
                'Out for Delivery': 3, 'Delivered': 4
            }
            if new_status in status_to_step:
                order.tracking_step = status_to_step[new_status]
            order.save()
            
            Notification.objects.create(
                user=order.user,
                order=order,
                title=f"Order Update: {new_status}",
                message=f"Your order #{order.id} is now {new_status}.",
                notification_type='order_update'
            )
            return Response({'status': 'Order status updated'})
        return Response({'error': 'Invalid status'}, status=400)

# ── Standalone endpoints ──────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def calculate_juice(request):
    selection = request.data
    items = selection.get('items', [])
    size = selection.get('size', 'Medium')
    add_ins = selection.get('add_ins', [])

    total_percentage = sum(item.get('percentage', 0) for item in items)
    if total_percentage != 100:
        return Response(
            {"error": "Total percentage must be exactly 100%"},
            status=status.HTTP_400_BAD_REQUEST
        )

    total_price = 0
    total_calories = 0
    size_multipliers = {'Small': 2.5, 'Medium': 3.5, 'Large': 5.0}
    multiplier = size_multipliers.get(size, 3.5)

    for item in items:
        fruit_id = item.get('fruit_id')
        percentage = item.get('percentage', 0)
        try:
            fruit = Fruit.objects.get(id=fruit_id)
            total_price += (float(fruit.price_per_100ml) * (percentage / 100.0)) * multiplier
            total_calories += (fruit.calories_per_100ml * (percentage / 100.0)) * multiplier
        except Fruit.DoesNotExist:
            return Response(
                {"error": f"Fruit with ID {fruit_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    total_price += len(add_ins) * 10.0
    return Response({
        "total_price": round(total_price, 2),
        "total_calories": int(total_calories),
        "valid": True,
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def apply_voucher(request):
    code = request.data.get('code', '').strip().upper()
    order_total = float(request.data.get('order_total', 0))

    try:
        voucher = GiftVoucher.objects.get(code=code, is_active=True)
    except GiftVoucher.DoesNotExist:
        return Response({"error": "Invalid or expired voucher code."}, status=status.HTTP_404_NOT_FOUND)

    if voucher.expiry_date < timezone.now().date():
        return Response({"error": "This voucher has expired."}, status=status.HTTP_400_BAD_REQUEST)

    if voucher.times_used >= voucher.usage_limit:
        return Response({"error": "Voucher usage limit reached."}, status=status.HTTP_400_BAD_REQUEST)

    if order_total < float(voucher.min_order):
        return Response(
            {"error": f"Minimum order amount is ₹{voucher.min_order} for this voucher."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if voucher.discount_type == 'percentage':
        discount_amount = round(order_total * float(voucher.discount_value) / 100, 2)
    else:
        discount_amount = float(voucher.discount_value)

    voucher.times_used += 1
    voucher.save()

    return Response({
        "valid": True,
        "code": voucher.code,
        "discount_type": voucher.discount_type,
        "discount_value": float(voucher.discount_value),
        "discount_amount": discount_amount,
        "final_total": round(order_total - discount_amount, 2),
        "message": f"Voucher applied! You saved ₹{discount_amount}",
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def rewards_summary(request):
    """Return the user's reward record."""
    reward, _ = Reward.objects.get_or_create(user=request.user)

    # Auto-compute level
    if reward.points >= 1000:
        reward.level = 'Platinum'
    elif reward.points >= 500:
        reward.level = 'Gold'
    elif reward.points >= 250:
        reward.level = 'Silver'
    else:
        reward.level = 'Bronze'
    reward.save()

    return Response(RewardSerializer(reward).data)
    
# ── OTP Authentication Views (Production Ready) ────────────────────────────────
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_otp(request):
    """
    POST /api/auth/send-otp/
    """
    serializer = OTPSendSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        ip_address = get_client_ip(request)
        
        # Rate Limiting: Cooldown check (30 seconds as requested)
        last_otp = OTPVerification.objects.filter(email=email).order_by('-created_at').first()
        if last_otp and (timezone.now() - last_otp.created_at).total_seconds() < 30:
            return Response({
                "success": False,
                "message": "Please wait 30 seconds before requesting a new OTP."
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # OTP Generation Logic
        # 1. If OTP_DEBUG_MODE is True -> Use 123456
        # 2. If BREVO_API_KEY is missing -> Use 123456 (Auto-fallback for easy testing)
        # 3. Otherwise -> Generate real OTP
        
        debug_mode = os.getenv('OTP_DEBUG_MODE', 'False').strip().upper() == 'TRUE'
        has_api_key = os.getenv('BREVO_API_KEY') is not None
        
        is_mock = debug_mode or not has_api_key
        otp = "123456" if is_mock else generate_otp()
        
        hashed_otp = make_password(otp)
        expires_at = timezone.now() + timedelta(minutes=5)
        
        # Clear old unverified OTPs for this email
        OTPVerification.objects.filter(email=email, is_verified=False).delete()
        
        # Create record
        OTPVerification.objects.create(
            email=email,
            otp_code=hashed_otp,
            expires_at=expires_at,
            ip_address=ip_address
        )
        
        # Send Email (Skip if mock mode)
        if is_mock:
            return Response({
                "success": True,
                "message": "DEBUG MODE: Use 123456"
            }, status=status.HTTP_200_OK)
            
        # Real send
        if send_otp_email(email, otp):
            return Response({
                "success": True,
                "message": "OTP sent successfully"
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False, 
                "message": "Failed to send email. Please check your configuration on Render."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        # Return the first validation error as a simple message
        error_msg = list(serializer.errors.values())[0][0] if serializer.errors else "Invalid data"
        return Response({
            "success": False,
            "message": error_msg
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp(request):
    """
    POST /api/auth/verify-otp/
    """
    serializer = OTPVerifySerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        
        try:
            otp_record = OTPVerification.objects.filter(
                email=email, 
                is_verified=False
            ).order_by('-created_at').first()
            
            if not otp_record:
                return Response({
                    "success": False,
                    "message": "No active OTP request found for this email."
                }, status=status.HTTP_404_NOT_FOUND)
                
        except Exception:
            return Response({
                "success": False,
                "message": "Invalid request."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check Expiration
        if otp_record.is_expired():
            return Response({
                "success": False,
                "message": "OTP has expired. Please request a new one."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check Max Attempts (User requested 5)
        if otp_record.attempts >= 5:
            return Response({
                "success": False,
                "message": "Maximum attempts reached. Please request a new OTP."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify OTP
        if not check_password(otp_code, otp_record.otp_code):
            otp_record.attempts += 1
            otp_record.save()
            return Response({
                "success": False,
                "message": f"Invalid OTP. {5 - otp_record.attempts} attempts remaining."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Success!
        otp_record.is_verified = True
        otp_record.save()
        
        # Login or Create User
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            # Create a new user if it doesn't exist
            base_username = email.split('@')[0]
            username = base_username
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{''.join(random.choices(string.digits, k=4))}"
                
            user = User.objects.create_user(username=username, email=email)
            
        refresh = RefreshToken.for_user(user)
        return Response({
            "success": True,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_vendor": user.is_vendor
            }
        }, status=status.HTTP_200_OK)
        
    else:
        # Return the first validation error as a simple message
        error_msg = list(serializer.errors.values())[0][0] if serializer.errors else "Invalid data"
        return Response({
            "success": False,
            "message": error_msg
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_otp(request):
    """
    POST /api/auth/resend-otp/
    """
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    return send_otp(request) # Reuse send_otp logic

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_registration(request):
    """
    Special verification for registration (handles vendor creation)
    """
    data = request.data
    email = data.get('email')
    otp_code = data.get('otp_code')
    
    if not email or not otp_code:
        return Response({"error": "Email and OTP code are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        otp_record = OTPVerification.objects.filter(email=email, is_verified=False).order_by('-created_at').first()
        if not otp_record:
             return Response({"error": "No OTP request found."}, status=status.HTTP_400_BAD_REQUEST)
             
        if otp_record.is_expired():
            return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not check_password(otp_code, otp_record.otp_code):
            otp_record.attempts += 1
            otp_record.save()
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
            
        otp_record.is_verified = True
        otp_record.save()
        
        # Registration logic...
        is_vendor = data.get('is_vendor', False)
        
        # Generate random password if not provided
        password = data.get('password')
        if not password:
            password = "".join(random.choices(string.ascii_letters + string.digits, k=12))

        base_username = data.get('username', email.split('@')[0])
        username = base_username
        
        # Ensure unique username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{''.join(random.choices(string.digits, k=4))}"

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            is_vendor=is_vendor
        )
        
        if is_vendor:
            Vendor.objects.create(
                user=user,
                shop_name=data.get('shop_name', 'Juice Shop'),
                owner_name=data.get('owner_name', 'Owner'),
                email=email,
                address=data.get('address', ''),
                gst_number=data.get('gst_number', ''),
                fssai_license=data.get('fssai_license', ''),
                agreed_to_terms=True
            )
            return Response({'success': True, 'message': 'Vendor registered successfully.'})
            
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email,
                'is_vendor': user.is_vendor
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
