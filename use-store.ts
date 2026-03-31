import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@workspace/api-client-react';

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  name: string;
  image: string;
  quantityValue: number; // e.g., 250
  quantityUnit: string; // e.g., 'g' or 'ml'
  price: number; // total price for this item
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // Referral
  referralDiscount: number;
  referralCodeApplied: string | null;
  applyReferral: (code: string, discount: number) => void;
  removeReferral: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set((state) => ({ user, token: token !== undefined ? token : state.token })),
      logout: () => set({ user: null, token: null, referralDiscount: 0, referralCodeApplied: null }),

      cart: [],
      isCartOpen: false,
      setCartOpen: (isCartOpen) => set({ isCartOpen }),
      addToCart: (item) => set((state) => {
        // Check if exact same product + quantity exists, if so, we could just add to it, 
        // but for simplicity and showing separate line items, we generate a unique ID.
        const newItem = { ...item, id: Math.random().toString(36).substring(7) };
        return { cart: [...state.cart, newItem], isCartOpen: true };
      }),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(item => item.id !== id) })),
      clearCart: () => set({ cart: [], referralDiscount: 0, referralCodeApplied: null }),

      referralDiscount: 0,
      referralCodeApplied: null,
      applyReferral: (code, discount) => set({ referralCodeApplied: code, referralDiscount: discount }),
      removeReferral: () => set({ referralCodeApplied: null, referralDiscount: 0 }),
    }),
    {
      name: 'modi-dairy-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        cart: state.cart,
        referralDiscount: state.referralDiscount,
        referralCodeApplied: state.referralCodeApplied
      }),
    }
  )
);
