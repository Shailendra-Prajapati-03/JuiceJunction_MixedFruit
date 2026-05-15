export interface Fruit {
  id: number;
  name: string;
  image: string | null;
  color_hex: string;
  price_per_100ml: string;
  calories_per_100ml: number;
  category: 'Citrus' | 'Berry' | 'Tropical' | 'Melon' | 'Other';
}

export interface RecipeIngredient {
  id: number;
  fruit: number;
  fruit_name: string;
  fruit_color: string;
  percentage: number;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string | null;
  base_price: string;
  category: string;

  ingredients: RecipeIngredient[];
  is_signature: boolean;
}

export interface CartItem {
  id: string;
  type: 'custom' | 'recipe';
  recipeId?: number;
  name: string;
  ingredients: {
    fruitId: number;
    name: string;
    color: string;
    percentage: number;
  }[];
  size: 'Small' | 'Medium' | 'Large';
  addIns: string[];
  totalPrice: number;
  totalCalories: number;
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_vendor?: boolean;
}

export interface Vendor {
  id: number;
  user: number;
  shop_name: string;
  address: string;
  is_approved: boolean;
}

export interface Product {
  id: number;
  vendor: number;
  name: string;
  price: string;
  description: string;
  image: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

// ── New types ─────────────────────────────────────────────────────────────────

export interface TrackingStep {
  step: number;
  label: string;
  is_complete: boolean;
  is_current: boolean;
}

export interface Order {
  id: number;
  juice_name: string;
  items: unknown[];
  total_price: string;
  status: string;
  tracking_step: number;
  delivery_address: string;
  payment_method: string;
  created_at: string;
}

export interface AppNotification {
  id: number;
  order: number | null;
  title: string;
  message: string;
  notification_type: 'order_update' | 'reward' | 'promo';
  is_read: boolean;
  created_at: string;
}

export interface GiftVoucher {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'flat';
  discount_value: string;
  min_order: string;
  expiry_date: string;
  is_active: boolean;
  usage_limit: number;
  times_used: number;
}

export interface Reward {
  id: number;
  user_session: string;
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points_to_next: number;
  next_reward_label: string;
  updated_at: string;
}
