# JuiceJunction - Custom Mixed-Fruit Juice Service

JuiceJunction is a premium, interactive web application that allows users to craft their own custom fruit juices with real-time visualization. It features a modern, vibrant UI where users can select fruits, adjust percentages, and see their juice come to life in a realistic glass visualizer with simulated liquid layers.

## Table of Contents
- [Project Overview](#project-overview)
- [Technical Stack](#technical-stack)
- [Implementation Plan & Architecture](#implementation-plan--architecture)
- [Key Features](#key-features)
- [Setup & Execution](#setup--execution)

---

## Project Overview

JuiceJunction provides an end-to-end purchasing experience for custom-built juice blends. Users can:
- **Build Custom Juices**: An interactive 3-column builder lets users pick from over 30+ fruits.
- **Visualize the Blend**: A real-time 2D glass visualizer built using Framer Motion and custom SVG filters simulates the mixing of the selected fruits in layers.
- **Track Nutrition & Cost**: Live updates on calories and price per 100ml based on the fruit composition.
- **Browse Signature Recipes**: Users can explore pre-made signature recipes crafted by mixologists.
- **Checkout & Order**: Complete cart and checkout flows with support for simulated payments (COD, UPI, Card) and order tracking.
- **Rewards System**: A premium, ticket-inspired dashboard for gift vouchers and rewards.

---

## Technical Stack

The project is structured as a monorepo, divided into a React frontend and a Django backend.

### Frontend
- **Core**: React 18+, TypeScript, Vite (for fast development and building)
- **Styling**: Tailwind CSS (for utility-first styling), `clsx` and `tailwind-merge` (for dynamic class merging)
- **Animations & Visuals**: Framer Motion (used extensively for the liquid physics simulation and page transitions)
- **State Management**: Zustand (for builder and cart state), TanStack React Query (for data fetching and caching)
- **Routing**: React Router DOM (v6)
- **Networking**: Axios
- **Icons**: Lucide React

### Backend
- **Core Framework**: Django 6.0.4, Python 3
- **API**: Django REST Framework (DRF) 3.17.1
- **Authentication**: Simple JWT (`djangorestframework_simplejwt`) for secure token-based auth
- **Database**: SQLite (default, via `db.sqlite3`)
- **Image Processing**: Pillow 12.2.0 (for handling fruit and recipe images)
- **CORS Management**: `django-cors-headers`

---

## Implementation Plan & Architecture

The application was built following a structured plan prioritizing a premium user experience and a robust API backend.

### 1. Backend Architecture (Django + DRF)
- **App Structure**: A core app named `juices` handles the business logic.
- **Models**:
  - `Fruit`: Stores details like name, image, color hex code (crucial for the visualizer), price per 100ml, calories per 100ml, and category.
  - `Recipe`: Stores pre-made combinations, descriptions, base prices, and has a Many-to-Many relationship with `Fruit` to define percentages.
  - `Order`: Tracks user purchases, stores items as JSON, calculates total price, and manages order status.
- **API Endpoints**: RESTful endpoints for fetching fruits/recipes, calculating real-time nutritional values, and processing orders (`/api/fruits/`, `/api/recipes/`, `/api/orders/`).
- **Data Seeding**: Custom Python scripts (`populate_data.py`, `seed_advanced.py`) were used to populate the database with a comprehensive selection of fruits and default recipes.

### 2. Frontend Architecture (React + Vite)
- **Design System**: Focuses on vibrant, fresh colors (greens, oranges, berry reds) using modern typography (Inter/Satoshi). Components make use of glassmorphism and smooth sliders.
- **Juice Visualizer**: Rather than a heavy 3D engine, the visualizer uses a clever combination of SVG filters (for a "gooey" liquid effect) and Framer Motion to animate layered `div` elements representing different fruit juices pouring and mixing.
- **Lead Automation & Campaign Intelligence**: Includes internal dashboards with optimized UI for monitoring user engagement and order statistics.
- **Performance**: Optimized rendering of custom juice visualizations on the Cart and Checkout pages to ensure a seamless purchasing experience.

---

## Key Features

- **Interactive Juice Builder**: The hallmark feature, providing instant visual feedback as users tweak their juice composition.
- **Live Nutrition & Pricing Calculation**: Algorithmically computes the final cost and caloric content based on the exact volumetric percentage of each selected fruit.
- **Signature Recipes Gallery**: A grid of beautifully displayed pre-made options.
- **Seamless Checkout Flow**: Maps user-selected payment methods to required server-side formats.
- **Responsive Layout**: Designed for optimal viewing across all devices, ensuring the visualizer remains stunning on mobile screens.

---

## Setup & Execution

### Prerequisites
- Node.js and npm
- Python 3.x

### Running the Application Locally

1. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   # source venv/bin/activate # On Mac/Linux
   pip install -r requirements.txt
   python manage.py migrate
   ```

3. **Start the Servers**:
   You can start the backend and frontend separately:

   - **Backend** (from `backend/` directory):
     ```bash
     python manage.py runserver
     ```
     API will be available at `http://localhost:8000`

   - **Frontend** (from `frontend/` directory):
     ```bash
     npm run dev
     ```
     The web app will be available at `http://localhost:5173`

*(Note: The frontend is configured to automatically proxy API requests to `localhost:8000` to prevent CORS issues during development.)*
