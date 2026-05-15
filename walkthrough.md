# JuiceCraft Walkthrough

JuiceCraft is a complete, production-ready web application for a custom mixed-fruit juice service.

## Backend (Django + DRF)

The backend provides a robust REST API for managing fruits, recipes, and orders.

- **Models**: `Fruit`, `Recipe`, `RecipeIngredient`, and `Order`.
- **Auth**: JWT-based authentication using `djangorestframework-simplejwt`.
- **API Endpoints**:
    - `/api/fruits/`: List of available fruits with pricing and calories.
    - `/api/recipes/`: Signature blends.
    - `/api/calculate/`: Real-time calculation of custom blends based on size and ingredients.
    - `/api/orders/`: Order management.
- **Admin**: Accessible at `/admin` (User: `admin`, Pass: `admin123`).

## Frontend (React + Vite + TS)

The frontend is a modern, responsive SPA with high-quality animations.

### Juice Glass Visualizer
The "wow" factor of the app. It uses **SVG filters (Gooey effect)** and **Framer Motion** to simulate realistic liquid pouring and layering. Each fruit adds a unique colored layer with a ripple effect on top.

### Juice Builder
An intuitive 3-column layout:
1. **Fruit Library**: Filter and search for fruits.
2. **Glass Visualizer**: Real-time feedback as you add ingredients.
3. **Controls**: Adjust serving size, add boosters, and see live pricing/nutrition.

### Signature Gallery
Beautifully designed cards for pre-made recipes, with options to add directly to cart or customize further in the builder.

### Cart & Checkout
A seamless cart experience with quantity management and a glassmorphic summary panel.

## Key Implementation Details

- **State Management**: `Zustand` with persistence to handle the builder and cart states.
- **Styling**: `Tailwind CSS` for a fresh, vibrant, and responsive design.
- **Animations**: `Framer Motion` for smooth transitions and the pouring logic.

## Setup & Execution

1. **Backend**: 
   - `cd backend`
   - `python manage.py runserver`
2. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

Visit `http://localhost:5173` to start blending!
