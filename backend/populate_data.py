import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'juicejunction_backend.settings')
django.setup()

from juices.models import Fruit, Recipe, RecipeIngredient

fruits_data = [
    {"name": "Apple", "color_hex": "#ff3b30", "price_per_100ml": 20.00, "calories_per_100ml": 52, "category": "Other"},
    {"name": "Mango", "color_hex": "#ffcc00", "price_per_100ml": 35.00, "calories_per_100ml": 60, "category": "Tropical"},
    {"name": "Orange", "color_hex": "#ff9500", "price_per_100ml": 25.00, "calories_per_100ml": 47, "category": "Citrus"},
    {"name": "Strawberry", "color_hex": "#ff2d55", "price_per_100ml": 40.00, "calories_per_100ml": 32, "category": "Berry"},
    {"name": "Banana", "color_hex": "#ffdb58", "price_per_100ml": 15.00, "calories_per_100ml": 89, "category": "Tropical"},
    {"name": "Pineapple", "color_hex": "#ffd60a", "price_per_100ml": 30.00, "calories_per_100ml": 50, "category": "Tropical"},
    {"name": "Kiwi", "color_hex": "#34c759", "price_per_100ml": 45.00, "calories_per_100ml": 61, "category": "Tropical"},
    {"name": "Blueberry", "color_hex": "#007aff", "price_per_100ml": 50.00, "calories_per_100ml": 57, "category": "Berry"},
    {"name": "Pomegranate", "color_hex": "#af52de", "price_per_100ml": 55.00, "calories_per_100ml": 83, "category": "Other"},
    {"name": "Watermelon", "color_hex": "#ff5e3a", "price_per_100ml": 18.00, "calories_per_100ml": 30, "category": "Melon"},
    {"name": "Lemon", "color_hex": "#fff44f", "price_per_100ml": 10.00, "calories_per_100ml": 29, "category": "Citrus"},
    {"name": "Ginger", "color_hex": "#f2d1a0", "price_per_100ml": 10.00, "calories_per_100ml": 80, "category": "Other"},
]

print("Populating fruits...")
for fruit in fruits_data:
    Fruit.objects.get_or_create(name=fruit["name"], defaults=fruit)

# Create some recipes
recipes_data = [
    {
        "name": "Sunset Glow",
        "description": "A stunning blend of Mango, Strawberry, and Orange that tastes like a summer evening.",
        "base_price": 149.00,
        "ingredients": [
            ("Mango", 50),
            ("Strawberry", 30),
            ("Orange", 20),
        ]
    },
    {
        "name": "Green Detox",
        "description": "Zesty Kiwi and Green Apple with a spicy hint of Ginger for a refreshing health boost.",
        "base_price": 129.00,
        "ingredients": [
            ("Kiwi", 60),
            ("Apple", 30),
            ("Ginger", 10),
        ]
    },
    {
        "name": "Berry Cloud",
        "description": "Sweet Blueberry and Strawberry mix that's packed with antioxidants.",
        "base_price": 179.00,
        "ingredients": [
            ("Blueberry", 50),
            ("Strawberry", 50),
        ]
    },
    {
        "name": "Morning Zest",
        "description": "Start your day right with a powerful punch of Orange, Lemon, and Pineapple.",
        "base_price": 119.00,
        "ingredients": [
            ("Orange", 40),
            ("Pineapple", 40),
            ("Lemon", 20),
        ]
    }
]

print("Populating recipes...")
for recipe_item in recipes_data:
    ingredients = recipe_item.pop("ingredients")
    recipe, created = Recipe.objects.get_or_create(name=recipe_item["name"], defaults=recipe_item)
    if created:
        for fruit_name, percentage in ingredients:
            fruit = Fruit.objects.get(name=fruit_name)
            RecipeIngredient.objects.create(recipe=recipe, fruit=fruit, percentage=percentage)

print("Data population complete!")
