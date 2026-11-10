import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  favorites: number[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  toggleFavorite: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),
      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity - 1;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favoriteId) => favoriteId !== id)
            : [...state.favorites, id],
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'cart-storage' }
  )
);