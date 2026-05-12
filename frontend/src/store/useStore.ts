import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppNotification, GiftVoucher } from '../types';

interface Ingredient {
  fruitId: number;
  name: string;
  color: string;
  percentage: number;
  pricePer100ml: number;
  caloriesPer100ml: number;
}

export type MixMode = 'Single' | 'Duo' | 'Trio' | 'Custom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  calories: number;
  size: 'Small' | 'Medium' | 'Large';
  addIns: string[];
  ingredients: Ingredient[];
  quantity: number;
}

interface AppState {
  // Cart
  cart: CartItem[];
  addToCart: (juice: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;

  // Builder
  ingredients: Ingredient[];
  size: 'Small' | 'Medium' | 'Large';
  mixMode: MixMode;
  addIns: string[];
  setIngredients: (ingredients: Ingredient[]) => void;
  addIngredient: (ingredient: Ingredient) => void;
  updatePercentage: (fruitId: number, delta: number) => void;
  setBuilderSize: (size: 'Small' | 'Medium' | 'Large') => void;
  setMixMode: (mode: MixMode) => void;
  toggleAddIn: (addIn: string) => void;
  resetBuilder: () => void;

  // Notifications
  notifications: AppNotification[];
  setNotifications: (notifications: AppNotification[]) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  // Rewards
  rewardPoints: number;
  addRewardPoints: (pts: number) => void;

  // Voucher
  appliedVoucher: GiftVoucher | null;
  applyVoucher: (v: GiftVoucher) => void;
  removeVoucher: () => void;

  // Auth
  token: string | null;
  user: { username: string; email?: string; phone?: string; is_vendor?: boolean } | null;
  isAuthenticated: boolean;
  login: (token: string, user: { username: string; email?: string; phone?: string; is_vendor?: boolean }) => void;
  logout: () => void;

  // UI State
  isAIChatOpen: boolean;
  setAIChatOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Cart ───────────────────────────────────────────────────────────────
      cart: [],
      addToCart: (juice) => set((state) => {
        const existing = state.cart.find(item => item.id === juice.id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.id === juice.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cart: [...state.cart, { ...juice, quantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),
      updateCartQuantity: (id, delta) => set((state) => ({
        cart: state.cart.map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
      })),
      clearCart: () => set({ cart: [] }),

      // ── Builder ────────────────────────────────────────────────────────────
      ingredients: [],
      size: 'Medium',
      mixMode: 'Custom',
      addIns: [],
      setIngredients: (ingredients) => set({ ingredients }),
      
      addIngredient: (ingredient) => set((state) => {
        const existing = state.ingredients.find(i => i.fruitId === ingredient.fruitId);
        if (existing) {
          // If in Custom mode, allow adding more percentage of the same fruit
          if (state.mixMode === 'Custom') {
            const total = state.ingredients.reduce((sum, i) => sum + i.percentage, 0);
            if (total >= 100) return state;
            return {
              ingredients: state.ingredients.map(i =>
                i.fruitId === ingredient.fruitId
                  ? { ...i, percentage: i.percentage + ingredient.percentage }
                  : i
              )
            };
          }
          // In Single/Duo/Trio, you can't click the same fruit twice to add more
          // because it's fixed percentage. So do nothing.
          return state;
        }
        return { ingredients: [...state.ingredients, ingredient] };
      }),

      updatePercentage: (fruitId, delta) => set((state) => {
        const newIngredients = state.ingredients.map(ing => {
          if (ing.fruitId === fruitId) {
            const newVal = Math.max(0, Math.min(100, ing.percentage + delta));
            return { ...ing, percentage: newVal };
          }
          return ing;
        }).filter(ing => ing.percentage > 0);
        const total = newIngredients.reduce((sum, i) => sum + i.percentage, 0);
        if (total > 100) return state;
        return { ingredients: newIngredients };
      }),
      setBuilderSize: (size) => set({ size }),
      setMixMode: (mode) => set({ mixMode: mode, ingredients: [] }), // Reset ingredients on mode change
      toggleAddIn: (addIn) => set((state) => ({
        addIns: state.addIns.includes(addIn)
          ? state.addIns.filter(i => i !== addIn)
          : [...state.addIns, addIn]
      })),
      resetBuilder: () => set({ ingredients: [], size: 'Medium', addIns: [] }),

      // ── Notifications ──────────────────────────────────────────────────────
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true }))
      })),
      unreadCount: () => get().notifications.filter(n => !n.is_read).length,

      // ── Rewards ────────────────────────────────────────────────────────────
      rewardPoints: 120,
      addRewardPoints: (pts) => set((state) => ({ rewardPoints: state.rewardPoints + pts })),

      // ── Voucher ────────────────────────────────────────────────────────────
      appliedVoucher: null,
      applyVoucher: (v) => set({ appliedVoucher: v }),
      removeVoucher: () => set({ appliedVoucher: null }),

      // ── Auth ───────────────────────────────────────────────────────────────
      token: localStorage.getItem('token'),
      user: null,
      isAuthenticated: !!localStorage.getItem('token'),
      login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },

      // ── UI State ───────────────────────────────────────────────────────────
      isAIChatOpen: false,
      setAIChatOpen: (open) => set({ isAIChatOpen: open }),
    }),
    { name: 'juicejunction-storage' }
  )
);
