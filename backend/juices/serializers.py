from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Fruit, Recipe, RecipeIngredient, Order, Notification, GiftVoucher, Reward, Vendor, Product

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'phone_number', 'is_vendor')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class FruitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fruit
        fields = '__all__'


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = (
            'id', 'user', 'shop_name', 'owner_name', 'phone', 'email', 
            'address', 'gst_number', 'fssai_license', 'agreed_to_terms',
            'logo', 'is_approved', 'rating', 'opening_time', 'closing_time', 'created_at'
        )
        read_only_fields = ('is_approved', 'rating', 'created_at')


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'id', 'vendor', 'name', 'price', 'description', 'image', 
            'category', 'stock_quantity', 'is_available', 'delivery_time', 
            'nutrition_info', 'tags'
        )
        read_only_fields = ('vendor',)


class RecipeIngredientSerializer(serializers.ModelSerializer):
    fruit_name = serializers.ReadOnlyField(source='fruit.name')
    fruit_color = serializers.ReadOnlyField(source='fruit.color_hex')

    class Meta:
        model = RecipeIngredient
        fields = ('id', 'fruit', 'fruit_name', 'fruit_color', 'percentage')


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = ('id', 'name', 'description', 'image', 'base_price', 'ingredients', 'is_signature')


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            'id', 'user', 'juice_name', 'items', 'total_price', 'status',
            'tracking_step', 'delivery_address', 'payment_method', 'created_at'
        )
        read_only_fields = ('user', 'created_at', 'tracking_step')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'user', 'order', 'title', 'message', 'notification_type', 'is_read', 'created_at')
        read_only_fields = ('user', 'created_at',)


class GiftVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftVoucher
        fields = (
            'id', 'code', 'description', 'discount_type', 'discount_value',
            'min_order', 'expiry_date', 'is_active', 'usage_limit', 'times_used'
        )


class RewardSerializer(serializers.ModelSerializer):
    points_to_next = serializers.SerializerMethodField()
    next_reward_label = serializers.SerializerMethodField()

    class Meta:
        model = Reward
        fields = ('id', 'user', 'user_session', 'points', 'level', 'points_to_next', 'next_reward_label', 'updated_at')
        read_only_fields = ('user', 'updated_at')

    def get_points_to_next(self, obj):
        tiers = [100, 250, 500, 1000]
        for t in tiers:
            if obj.points < t:
                return t - obj.points
        return 0

    def get_next_reward_label(self, obj):
        if obj.points < 100:
            return '₹50 off voucher'
        elif obj.points < 250:
            return 'Free add-in'
        elif obj.points < 500:
            return 'Free juice'
        elif obj.points < 1000:
            return 'Gold membership'
        return 'All rewards unlocked!'


from .models import CartItem

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ('id', 'user', 'product_id', 'custom_juice_data', 'quantity', 'created_at')
        read_only_fields = ('user', 'created_at')

from .models import OTPVerification

class OTPSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        email = value.lower()
        if not email.endswith('@gmail.com'):
            raise serializers.ValidationError("Only @gmail.com addresses are supported.")
        return email

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)

    def validate_email(self, value):
        return value.lower()
