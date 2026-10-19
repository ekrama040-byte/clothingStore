'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, removeFromCart } = useCartStore();
  const [imageError, setImageError] = useState(false);

  const existingItem = cart.find((item) => item.id === product.id);

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
      <div className="relative w-full h-48 mb-4 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            onError={() => setImageError(true)}
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="text-xs text-slate-400 font-medium px-4 text-center">
            Image unavailable
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full">
            {product.category}
          </span>
          <h4 className="font-semibold text-sm text-slate-800 line-clamp-1 mt-2.5">
            {product.title}
          </h4>
          <p className="text-base font-bold text-slate-900 mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {existingItem ? (
          <button
            type="button"
            onClick={() => removeFromCart(product.id)}
            className="mt-4 min-h-[44px] w-full py-2.5 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-xl hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-[0.98] transition-all"
          >
            Remove from Cart
          </button>
        ) : (
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="mt-4 min-h-[44px] w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold rounded-xl hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] transition-all shadow-md shadow-indigo-100"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}