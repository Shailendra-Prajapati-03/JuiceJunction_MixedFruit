import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'juicejunction_backend.settings')
django.setup()

from juices.models import Fruit, Recipe, RecipeIngredient

recipes_data = [
    {
        "name": "Sunset Glow",
        "description": "A stunning blend of Mango, Strawberry, and Orange that tastes like a summer evening.",
        "base_price": 149.00,
        "ingredients": [("Mango", 50), ("Strawberry", 30), ("Orange", 20)]
    },
    {
        "name": "Green Detox",
        "description": "Zesty Kiwi and Apple with a spicy hint of Ginger for a refreshing health boost.",
        "base_price": 129.00,
        "ingredients": [("Kiwi", 60), ("Apple", 30), ("Ginger", 10)]
    },
    {
        "name": "Berry Cloud",
        "description": "Sweet Blueberry and Strawberry packed with antioxidants.",
        "base_price": 179.00,
        "ingredients": [("Blueberry", 50), ("Strawberry", 50)]
    },
    {
        "name": "Citrus Storm",
        "description": "A powerful punch of Orange, Lemon and Grapefruit to supercharge your morning.",
        "base_price": 119.00,
        "ingredients": [("Orange", 40), ("Lemon", 30), ("Grapefruit", 30)]
    },
    {
        "name": "Tropical Punch",
        "description": "Exotic blend of Mango, Pineapple and Coconut straight from the tropics.",
        "base_price": 159.00,
        "ingredients": [("Mango", 40), ("Pineapple", 40), ("Coconut", 20)]
    },
    {
        "name": "Watermelon Wave",
        "description": "Cool and refreshing Watermelon with a zesty twist of Lime.",
        "base_price": 99.00,
        "ingredients": [("Watermelon", 70), ("Lime", 30)]
    },
    {
        "name": "Dragon Fire",
        "description": "Vibrant Dragonfruit and Passion Fruit fusion with a hint of Lemon.",
        "base_price": 199.00,
        "ingredients": [("Dragonfruit", 50), ("Passion Fruit", 30), ("Lemon", 20)]
    },
    {
        "name": "Pink Lemonade",
        "description": "Classic strawberry lemonade with a fresh twist of raspberry.",
        "base_price": 109.00,
        "ingredients": [("Strawberry", 40), ("Lemon", 40), ("Raspberry", 20)]
    },
    {
        "name": "Melon Bliss",
        "description": "Light and refreshing blend of Watermelon, Honeydew and Cantaloupe.",
        "base_price": 119.00,
        "ingredients": [("Watermelon", 40), ("Honeydew", 30), ("Cantaloupe", 30)]
    },
    {
        "name": "Guava Sunrise",
        "description": "Tropical Guava and Papaya blend with a squeeze of Orange.",
        "base_price": 139.00,
        "ingredients": [("Guava", 50), ("Papaya", 30), ("Orange", 20)]
    },
    {
        "name": "Cherry Bomb",
        "description": "Intense Cherry, Pomegranate and Blueberry powerhouse packed with antioxidants.",
        "base_price": 189.00,
        "ingredients": [("Cherry", 40), ("Pomegranate", 40), ("Blueberry", 20)]
    },
    {
        "name": "Golden Glow",
        "description": "Energizing Banana, Mango and Pineapple with a hint of Ginger.",
        "base_price": 149.00,
        "ingredients": [("Banana", 40), ("Mango", 40), ("Ginger", 20)]
    },
]

print("Adding recipes to database...")
added = 0
skipped = 0

for recipe_item in recipes_data:
    ingredients = recipe_item.pop("ingredients")
    recipe, created = Recipe.objects.get_or_create(
        name=recipe_item["name"], defaults=recipe_item
    )
    if created:
        for fruit_name, percentage in ingredients:
            try:
                fruit = Fruit.objects.get(name=fruit_name)
                RecipeIngredient.objects.create(
                    recipe=recipe, fruit=fruit, percentage=percentage
                )
            except Fruit.DoesNotExist:
                print(f"  [WARN] Fruit not found: {fruit_name}")
        print(f"  [ADDED]   {recipe.name}")
        added += 1
    else:
        print(f"  [SKIPPED] {recipe.name}")
        skipped += 1

print(f"\nDone! {added} added, {skipped} skipped.")
print(f"Total recipes in DB: {Recipe.objects.count()}")
