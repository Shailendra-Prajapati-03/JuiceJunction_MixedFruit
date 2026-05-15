import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'juicejunction_backend.settings')
django.setup()

from juices.models import Fruit

new_fruits = [
    # Already exist (will be skipped by get_or_create)
    {"name": "Apple",       "color_hex": "#ff3b30", "price_per_100ml": 20.00, "calories_per_100ml": 52, "category": "Other"},
    {"name": "Mango",       "color_hex": "#ffcc00", "price_per_100ml": 35.00, "calories_per_100ml": 60, "category": "Tropical"},
    {"name": "Orange",      "color_hex": "#ff9500", "price_per_100ml": 25.00, "calories_per_100ml": 47, "category": "Citrus"},
    {"name": "Strawberry",  "color_hex": "#ff2d55", "price_per_100ml": 40.00, "calories_per_100ml": 32, "category": "Berry"},
    {"name": "Banana",      "color_hex": "#ffdb58", "price_per_100ml": 15.00, "calories_per_100ml": 89, "category": "Tropical"},
    {"name": "Pineapple",   "color_hex": "#ffd60a", "price_per_100ml": 30.00, "calories_per_100ml": 50, "category": "Tropical"},
    {"name": "Kiwi",        "color_hex": "#34c759", "price_per_100ml": 45.00, "calories_per_100ml": 61, "category": "Tropical"},
    {"name": "Blueberry",   "color_hex": "#007aff", "price_per_100ml": 50.00, "calories_per_100ml": 57, "category": "Berry"},
    {"name": "Pomegranate", "color_hex": "#af52de", "price_per_100ml": 55.00, "calories_per_100ml": 83, "category": "Other"},
    {"name": "Watermelon",  "color_hex": "#ff5e3a", "price_per_100ml": 18.00, "calories_per_100ml": 30, "category": "Melon"},
    {"name": "Lemon",       "color_hex": "#fff44f", "price_per_100ml": 10.00, "calories_per_100ml": 29, "category": "Citrus"},
    {"name": "Ginger",      "color_hex": "#f2d1a0", "price_per_100ml": 10.00, "calories_per_100ml": 80, "category": "Other"},

    # NEW FRUITS
    {"name": "Grapes",      "color_hex": "#6e40c9", "price_per_100ml": 30.00, "calories_per_100ml": 69, "category": "Berry"},
    {"name": "Papaya",      "color_hex": "#ff8c42", "price_per_100ml": 20.00, "calories_per_100ml": 43, "category": "Tropical"},
    {"name": "Guava",       "color_hex": "#a8d08d", "price_per_100ml": 22.00, "calories_per_100ml": 68, "category": "Tropical"},
    {"name": "Coconut",     "color_hex": "#f5deb3", "price_per_100ml": 25.00, "calories_per_100ml": 354, "category": "Tropical"},
    {"name": "Litchi",      "color_hex": "#ffb6c1", "price_per_100ml": 40.00, "calories_per_100ml": 66, "category": "Tropical"},
    {"name": "Peach",       "color_hex": "#ffcba4", "price_per_100ml": 35.00, "calories_per_100ml": 39, "category": "Other"},
    {"name": "Plum",        "color_hex": "#8e4585", "price_per_100ml": 38.00, "calories_per_100ml": 46, "category": "Berry"},
    {"name": "Cherry",      "color_hex": "#de3163", "price_per_100ml": 60.00, "calories_per_100ml": 50, "category": "Berry"},
    {"name": "Raspberry",   "color_hex": "#e30b5c", "price_per_100ml": 55.00, "calories_per_100ml": 52, "category": "Berry"},
    {"name": "Pear",        "color_hex": "#c5e384", "price_per_100ml": 28.00, "calories_per_100ml": 57, "category": "Other"},
    {"name": "Lime",        "color_hex": "#32cd32", "price_per_100ml": 12.00, "calories_per_100ml": 30, "category": "Citrus"},
    {"name": "Grapefruit",  "color_hex": "#ff6b6b", "price_per_100ml": 22.00, "calories_per_100ml": 42, "category": "Citrus"},
    {"name": "Passion Fruit","color_hex": "#9b59b6", "price_per_100ml": 65.00, "calories_per_100ml": 97, "category": "Tropical"},
    {"name": "Dragonfruit", "color_hex": "#ff69b4", "price_per_100ml": 70.00, "calories_per_100ml": 60, "category": "Tropical"},
    {"name": "Jackfruit",   "color_hex": "#f4a460", "price_per_100ml": 25.00, "calories_per_100ml": 95, "category": "Tropical"},
    {"name": "Avocado",     "color_hex": "#568203", "price_per_100ml": 50.00, "calories_per_100ml": 160, "category": "Other"},
    {"name": "Honeydew",    "color_hex": "#f0e68c", "price_per_100ml": 20.00, "calories_per_100ml": 36, "category": "Melon"},
    {"name": "Cantaloupe",  "color_hex": "#f5a26b", "price_per_100ml": 18.00, "calories_per_100ml": 34, "category": "Melon"},
]

print("Adding fruits to database...")
added = 0
skipped = 0
for fruit in new_fruits:
    obj, created = Fruit.objects.get_or_create(name=fruit["name"], defaults=fruit)
    if created:
        print(f"  [ADDED]   {fruit['name']}")
        added += 1
    else:
        print(f"  [SKIPPED] {fruit['name']}")
        skipped += 1

print(f"\nDone! {added} added, {skipped} skipped.")
print(f"Total fruits in DB: {Fruit.objects.count()}")
