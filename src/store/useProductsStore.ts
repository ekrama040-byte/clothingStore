'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';

interface ProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  removeProduct: (id: number) => void;
}

const sanitizeProductForStorage = (product: Product): Product => ({
  ...product,
  image: product.image?.startsWith('data:') ? '' : product.image || '',
  description: product.description?.slice(0, 1000) || '',
});

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
    }),
    {
      name: 'ekram-user-products-store',
      partialize: (state) => ({
        products: state.products.map(sanitizeProductForStorage),
      }),
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return localStorage;
      }),
    }
  )
);
