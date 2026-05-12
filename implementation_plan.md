# JuiceJunction - Implementation Plan

JuiceJunction is a premium custom mixed-fruit juice service. Users can build their own juices, see a real-time visualization, and order pre-made recipes.

## User Review Required

> [!IMPORTANT]
> The current environment seems to be missing `node` and `npm` in the PATH. I will proceed with the backend implementation and search for the frontend tools. If they are truly missing, I may need your assistance to ensure they are installed or properly configured.

> [!NOTE]
> The "Juice Glass Visualizer" will be implemented using a combination of Tailwind CSS, SVG filters, and Framer Motion to achieve a high-quality layered liquid effect without requiring a full 3D engine, ensuring better performance and compatibility.

## Proposed Changes

### Backend (Django + DRF)

#### [NEW] [backend/](file:///c:/mixed_fruit/backend)
- Initialize Django project `juicejunction_backend`.
- Create app `juices`.
- **Models**:
    - `Fruit`: Name, image, color_hex, price_per_100ml, calories_per_100ml, category.
    - `Recipe`: Name, description, image, base_price, fruits (M2M with percentage).
    - `Order`: User, items (JSON), total_price, status.
- **API Endpoints**:
    - `GET /api/fruits/`
    - `GET /api/recipes/`
    - `POST /api/calculate/`
    - `POST /api/orders/`
    - Auth (JWT).
- **Initial Data**: Script to populate 12+ fruits and initial recipes.

### Frontend (React + Vite + TS)

#### [NEW] [frontend/](file:///c:/mixed_fruit/frontend)
- Initialize React project `juicejunction-frontend`.
- **Design System**:
    - Colors: Fresh greens, oranges, berry reds.
    - Typography: Inter/Satoshi.
    - Components: Glassmorphic cards, smooth sliders, vibrant buttons.
- **State Management**: Zustand for builder and cart.
- **Core Pages**:
    - `Home`: Hero with CTA, featured juices.
    - `Builder`: The 3-column interactive mixer.
    - `Gallery`: Pre-made recipe grid.
    - `Cart/Checkout`: Summary and mock payment.
- **Juice Visualizer Component**:
    - Custom SVG-based glass container.
    - Layered `div` elements with dynamic heights and colors.
    - SVG "Gooey" filter for liquid-like mixing transitions.

## Verification Plan

### Automated Tests
- Backend: Run `python manage.py test` for API endpoints.
- Frontend: Visual verification of the builder and animation flows.

### Manual Verification
- Test the full flow: Select fruits -> Adjust % -> See visualizer update -> Generate -> Add to Cart -> Checkout.
- Verify JWT authentication works (login/register).
- Verify Django Admin shows all fruits and orders.
