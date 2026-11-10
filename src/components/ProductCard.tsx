'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { cart, favorites, addToCart, removeFromCart, toggleFavorite } = useCartStore();
  const [imageError, setImageError] = useState(false);

  const existingItem = cart.find((item) => item.id === product.id);
  const isFavorite = favorites.includes(product.id);
  const productPrice = product.currency && product.currency !== 'USD' ? `${product.currency} ${product.price.toFixed(2)}` : `ETB ${product.price.toFixed(2)}`;
  const rating = product.rating?.rate ?? 4.5;
  const reviewCount = product.rating?.count ?? 120;
  const productImage = product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';

  return (
    <div className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="relative p-3">
        <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          {product.category || 'Featured'}
        </div>

        <button
          type="button"
          aria-label="Save product"
          onClick={() => toggleFavorite(product.id)}
          className={`absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition ${
            isFavorite
              ? 'border-rose-200 bg-rose-50 text-rose-500'
              : 'border-slate-200 bg-white/90 text-slate-600 hover:text-rose-500'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div
          className="relative h-52 cursor-pointer overflow-hidden rounded-[18px] bg-slate-100"
          onClick={() => onQuickView?.(product)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onQuickView?.(product);
            }
          }}
        >
          {!imageError ? (
            <Image
              src={productImage}
              alt={product.title}
              fill
              unoptimized
              onError={() => setImageError(true)}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs font-medium text-slate-500">
              Image unavailable
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
          <span className="font-medium text-slate-500">{product.category || 'Premium'}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-medium text-amber-700">
            <Star className="h-3 w-3 fill-current" />
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        <div>
          <h4 className="line-clamp-2 min-h-[2.8em] text-[0.96rem] font-semibold text-slate-900">{product.title}</h4>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
            {product.location ? <MapPin className="h-3.5 w-3.5 text-emerald-600" /> : <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />}
            <span>{product.location || 'Fast delivery'}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-[10px] text-slate-400 line-through">ETB {(product.price * 1.2).toFixed(2)}</p>
            <p className="text-lg font-extrabold text-slate-900">{productPrice}</p>
          </div>

          {existingItem ? (
            <button
              type="button"
              onClick={() => removeFromCart(product.id)}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-rose-600 transition hover:bg-rose-100"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-xl bg-[#0f8f62] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-md shadow-emerald-200 transition hover:bg-[#0c7d56]"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}