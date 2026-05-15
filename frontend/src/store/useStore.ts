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

  // Sync Actions
  fetchNotifications: () => Promise<void>;
  fetchRewards: () => Promise<void>;
  syncCartWithBackend: () => Promise<void>;
  loadCartFromBackend: () => Promise<void>;
}

import api from '../utils/api';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Cart ───────────────────────────────────────────────────────────────
      cart: [],
      addToCart: (juice) => {
        set((state) => {
          const existing = state.cart.find(item => item.id === juice.id);
          let newCart;
          if (existing) {
            newCart = state.cart.map(item =>
              item.id === juice.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            newCart = [...state.cart, { ...juice, quantity: 1 }];
          }
          return { cart: newCart };
        });
        get().syncCartWithBackend();
      },
      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        }));
        get().syncCartWithBackend();
      },
      updateCartQuantity: (id, delta) => {
        set((state) => ({
          cart: state.cart.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
          )
        }));
        get().syncCartWithBackend();
      },
      clearCart: () => {
        set({ cart: [] });
        get().syncCartWithBackend();
      },

      // ── Builder ────────────────────────────────────────────────────────────
      ingredients: [],
      size: 'Medium',
      mixMode: 'Custom',
      addIns: [],
      setIngredients: (ingredients) => set({ ingredients }),
      
      addIngredient: (ingredient) => set((state) => {
        const existing = state.ingredients.find(i => i.fruitId === ingredient.fruitId);
        if (existing) {
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
      setMixMode: (mode) => set({ mixMode: mode, ingredients: [] }), 
      toggleAddIn: (addIn) => set((state) => ({
        addIns: state.addIns.includes(addIn)
          ? state.addIns.filter(i => i !== addIn)
          : [...state.addIns, addIn]
      })),
      resetBuilder: () => set({ ingredients: [], size: 'Medium', addIns: [] }),

      // ── Notifications ──────────────────────────────────────────────────────
      notifications: [],
      setNotifications: (notifications) => set({ notifications }),
      markNotificationRead: async (id) => {
        try {
<<<<<<< HEAD
          await api.post(`/api/notifications/${id}/read/`);
=======
          await api.post(`/notifications/${id}/read/`);
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
          set((state) => ({
            notifications: state.notifications.map(n =>
              n.id === id ? { ...n, is_read: true } : n
            )
          }));
        } catch (err) {
          console.error('Failed to mark notification as read', err);
        }
      },
      markAllNotificationsRead: async () => {
        try {
<<<<<<< HEAD
          await api.post('/api/notifications/mark-all-read/');
=======
          await api.post('/notifications/mark-all-read/');
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
          set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, is_read: true }))
          }));
        } catch (err) {
          console.error('Failed to mark all notifications as read', err);
        }
      },
      unreadCount: () => get().notifications.filter(n => !n.is_read).length,

      // ── Rewards ────────────────────────────────────────────────────────────
      rewardPoints: 0,
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
        // Trigger data sync
        get().loadCartFromBackend();
        get().fetchNotifications();
        get().fetchRewards();
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false,
          cart: [],
          notifications: [],
          rewardPoints: 0,
          appliedVoucher: null,
          ingredients: [],
          addIns: [],
          size: 'Medium',
          mixMode: 'Custom'
        });
      },

      // ── UI State ───────────────────────────────────────────────────────────
      isAIChatOpen: false,
      setAIChatOpen: (open) => set({ isAIChatOpen: open }),

      // ── Sync Actions ───────────────────────────────────────────────────────
      fetchNotifications: async () => {
        if (!get().isAuthenticated) return;
        try {
<<<<<<< HEAD
          const res = await api.get('/api/notifications/');
=======
          const res = await api.get('/notifications/');
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
          set({ notifications: res.data });
        } catch (err) {
          console.error('Failed to fetch notifications', err);
        }
      },
      fetchRewards: async () => {
        if (!get().isAuthenticated) return;
        try {
<<<<<<< HEAD
          const res = await api.get('/api/rewards-summary/');
=======
          const res = await api.get('/rewards-summary/');
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
          set({ rewardPoints: res.data.points });
        } catch (err) {
          console.error('Failed to fetch rewards', err);
        }
      },
      syncCartWithBackend: async () => {
        if (!get().isAuthenticated) return;
        try {
          const items = get().cart.map(item => ({
            product_id: null, // Update if pre-defined products are used
            custom_juice_data: {
              name: item.name,
              size: item.size,
              addIns: item.addIns,
              ingredients: item.ingredients,
              price: item.price,
              calories: item.calories
            },
            quantity: item.quantity
          }));
<<<<<<< HEAD
          await api.post('/api/cart/sync/', { items });
=======
          await api.post('/cart/sync/', { items });
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
        } catch (err) {
          console.error('Failed to sync cart', err);
        }
      },
      loadCartFromBackend: async () => {
        if (!get().isAuthenticated) return;
        try {
<<<<<<< HEAD
          const res = await api.get('/api/cart/');
=======
          const res = await api.get('/cart/');
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
          const backendItems: CartItem[] = res.data.map((item: any) => ({
            id: `back-${item.id}`,
            name: item.custom_juice_data.name,
            price: parseFloat(item.custom_juice_data.price),
            calories: item.custom_juice_data.calories,
            size: item.custom_juice_data.size,
            addIns: item.custom_juice_data.addIns,
            ingredients: item.custom_juice_data.ingredients,
            quantity: item.quantity
          }));
          set({ cart: backendItems });
        } catch (err) {
          console.error('Failed to load cart', err);
        }
      }
    }),
    { name: 'juicejunction-storage' }
  )
);
