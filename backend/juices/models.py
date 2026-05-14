from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    is_vendor = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)

    def __str__(self):
        return self.username

class OTPVerification(models.Model):
    email = models.EmailField(db_index=True)
    otp_code = models.CharField(max_length=128) # hashed
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.email}"

class Vendor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vendor_profile')
    shop_name = models.CharField(max_length=200)
    owner_name = models.CharField(max_length=200, default='Owner')
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    address = models.TextField()
    
    # Compliance Fields
    gst_number = models.CharField(max_length=15, null=True, blank=True)
    fssai_license = models.CharField(max_length=20, null=True, blank=True)
    agreed_to_terms = models.BooleanField(default=False)
    
    logo = models.ImageField(upload_to='vendor_logos/', null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.shop_name

class Product(models.Model):
    vendor = models.ForeignKey(Vendor, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='vendor_products/', null=True, blank=True)
    category = models.CharField(max_length=100, default='Fresh Juice')
    stock_quantity = models.IntegerField(default=50)
    is_available = models.BooleanField(default=True)
    delivery_time = models.IntegerField(default=30, help_text="Estimated delivery time in minutes")
    nutrition_info = models.JSONField(null=True, blank=True, help_text="e.g. {'calories': 150, 'vitamins': ['C', 'A']}")
    tags = models.CharField(max_length=200, blank=True, help_text="Comma separated tags")

    def __str__(self):
        return f"{self.name} - {self.vendor.shop_name}"


class Fruit(models.Model):
    CATEGORY_CHOICES = [
        ('Citrus', 'Citrus'),
        ('Berry', 'Berry'),
        ('Tropical', 'Tropical'),
        ('Melon', 'Melon'),
        ('Other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='fruits/', null=True, blank=True)
    color_hex = models.CharField(max_length=7, help_text="Hex color for the juice layer (e.g. #FF0000)")
    price_per_100ml = models.DecimalField(max_digits=5, decimal_places=2)
    calories_per_100ml = models.IntegerField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')

    def __str__(self):
        return self.name


class Recipe(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='recipes/', null=True, blank=True)
    base_price = models.DecimalField(max_digits=6, decimal_places=2)
    is_signature = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    fruit = models.ForeignKey(Fruit, on_delete=models.CASCADE)
    percentage = models.IntegerField(help_text="Percentage of this fruit in the recipe (0-100)")

    def __str__(self):
        return f"{self.percentage}% {self.fruit.name} in {self.recipe.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('Placed', 'Placed'),
        ('Confirmed', 'Confirmed'),
        ('Preparing', 'Preparing'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_CHOICES = [
        ('COD', 'Cash on Delivery'),
        ('UPI', 'UPI'),
        ('Card', 'Card'),
    ]

    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    customer_name = models.CharField(max_length=100, default='Guest')
    items = models.JSONField(help_text="JSON representation of custom juice selection")
    juice_name = models.CharField(max_length=200, default='Custom Juice')
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Placed')
    tracking_step = models.IntegerField(default=0, help_text="0=Placed,1=Confirmed,2=Preparing,3=Out for Delivery,4=Delivered")
    delivery_address = models.TextField(default='123, Green Valley, Juicetown')
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='COD')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} — {self.juice_name} by {self.customer_name}"


class Notification(models.Model):
    TYPE_CHOICES = [
        ('order_update', 'Order Update'),
        ('reward', 'Reward'),
        ('promo', 'Promo'),
    ]

    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='order_update')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class GiftVoucher(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('flat', 'Flat Amount'),
    ]

    code = models.CharField(max_length=20, unique=True)
    description = models.CharField(max_length=200, default='')
    discount_type = models.CharField(max_length=15, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    discount_value = models.DecimalField(max_digits=6, decimal_places=2)
    min_order = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    expiry_date = models.DateField()
    is_active = models.BooleanField(default=True)
    usage_limit = models.IntegerField(default=100)
    times_used = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.code} — {self.discount_value}{'%' if self.discount_type == 'percentage' else '₹'} off"


class Reward(models.Model):
    LEVEL_CHOICES = [
        ('Bronze', 'Bronze'),
        ('Silver', 'Silver'),
        ('Gold', 'Gold'),
        ('Platinum', 'Platinum'),
    ]

    user_session = models.CharField(max_length=100, default='guest', help_text="session key or user id")
    points = models.IntegerField(default=0)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='Bronze')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_session} — {self.points} pts ({self.level})"

class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    razorpay_order_id = models.CharField(max_length=100)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=200, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id} — {self.status}"
