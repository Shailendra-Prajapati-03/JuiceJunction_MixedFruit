import os, sys, django, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'juicejunction_backend.settings')
django.setup()

from datetime import date, timedelta
from juices.models import Order, Notification, GiftVoucher, Reward

print("Seeding advanced data...")

# ── Orders ────────────────────────────────────────────────────────────────────
orders_data = [
    dict(juice_name='Tropical Sunrise Blend', total_price=149, status='Delivered',       tracking_step=4, delivery_address='42, Mango Lane, Fruit City', payment_method='UPI'),
    dict(juice_name='Berry Blast Supreme',    total_price=199, status='Out for Delivery', tracking_step=3, delivery_address='7, Berry Street, Juicetown',   payment_method='Card'),
    dict(juice_name='Citrus Power Shot',      total_price=99,  status='Preparing',        tracking_step=2, delivery_address='15, Lemon Park, Green Valley',  payment_method='COD'),
    dict(juice_name='Green Detox Warrior',    total_price=179, status='Confirmed',        tracking_step=1, delivery_address='88, Kale Road, Wellness Hub',   payment_method='UPI'),
    dict(juice_name='Mango Tango Special',    total_price=129, status='Placed',           tracking_step=0, delivery_address='3, Mango Grove, Sunshine City', payment_method='COD'),
]
orders = []
for d in orders_data:
    o, created = Order.objects.get_or_create(
        juice_name=d['juice_name'],
        defaults=dict(items=[], **d)
    )
    orders.append(o)
    if created:
        print(f"  Created order: {o}")

# ── Notifications ─────────────────────────────────────────────────────────────
notifs = [
    dict(order=orders[0], title='Order Delivered! 🥤', message='Your Tropical Sunrise Blend has been delivered. Enjoy!', notification_type='order_update', is_read=True),
    dict(order=orders[1], title='Out for Delivery! 🛵', message='Your Berry Blast Supreme is on its way. ETA: 10 mins.', notification_type='order_update', is_read=False),
    dict(order=orders[2], title='Preparing Your Juice 🍊', message='Our team is squeezing your Citrus Power Shot fresh.', notification_type='order_update', is_read=False),
    dict(order=orders[3], title='Order Confirmed ✅', message='Green Detox Warrior confirmed. Preparing soon!', notification_type='order_update', is_read=False),
    dict(order=orders[4], title='Order Placed 🎉', message='Mango Tango Special order received. Thank you!', notification_type='order_update', is_read=True),
    dict(order=None, title='🎁 New Voucher: SUMMER20', message='Use SUMMER20 for 20% off orders above ₹200. Valid till month end!', notification_type='promo', is_read=False),
    dict(order=None, title='⭐ You earned 50 points!', message='Keep ordering to unlock your next reward. 80 more points to go!', notification_type='reward', is_read=True),
    dict(order=None, title='🥇 Welcome to JuiceJunction!', message='Use WELCOME10 for 10% off your first order.', notification_type='promo', is_read=True),
]
for n in notifs:
    obj, created = Notification.objects.get_or_create(title=n['title'], defaults=n)
    if created:
        print(f"  Created notification: {obj.title}")

# ── Gift Vouchers ─────────────────────────────────────────────────────────────
today = date.today()
vouchers = [
    dict(code='WELCOME10',   description='10% off your first order',        discount_type='percentage', discount_value=10,  min_order=0,   expiry_date=today+timedelta(days=30),  is_active=True, usage_limit=500),
    dict(code='FREESHIP',    description='Free delivery on any order',       discount_type='flat',       discount_value=40,  min_order=0,   expiry_date=today+timedelta(days=15),  is_active=True, usage_limit=200),
    dict(code='SUMMER20',    description='Summer special 20% off',           discount_type='percentage', discount_value=20,  min_order=200, expiry_date=today+timedelta(days=60),  is_active=True, usage_limit=300),
    dict(code='LOYALTY50',   description='₹50 off for loyal customers',      discount_type='flat',       discount_value=50,  min_order=150, expiry_date=today+timedelta(days=7),   is_active=True, usage_limit=100),
    dict(code='FIRSTORDER',  description='15% off on first order',           discount_type='percentage', discount_value=15,  min_order=100, expiry_date=today+timedelta(days=45),  is_active=True, usage_limit=1000),
    dict(code='JUICE100',    description='₹100 off orders above ₹500',       discount_type='flat',       discount_value=100, min_order=500, expiry_date=today+timedelta(days=20),  is_active=True, usage_limit=50),
]
for v in vouchers:
    obj, created = GiftVoucher.objects.get_or_create(code=v['code'], defaults=v)
    if created:
        print(f"  Created voucher: {obj.code}")

# ── Rewards ───────────────────────────────────────────────────────────────────
reward, created = Reward.objects.get_or_create(user_session='guest', defaults=dict(points=120, level='Bronze'))
if created:
    print(f"  Created reward: {reward}")

print("✅ Seed complete!")
