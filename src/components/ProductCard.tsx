'use client';

import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

export default function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, removeFromCart } = useCartStore();
  const isinCart = cart.some((item) => item.id === product.id);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between p-4 hover:shadow-md transition">
      <div>
        <div className="relative w-full h-48 mb-4 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            className="object-contain p-2"
          />
        </div>
        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{product.category}</span>
        <h3 className="font-medium text-gray-800 text-sm line-clamp-1 mt-1">{product.title}</h3>
        <p className="text-lg font-bold text-gray-900 mt-2">\${product.price.toFixed(2)}</p>
      </div>

      <button
        onClick={() => (isinCart ? removeFromCart(product.id) : addToCart(product))}
        className={`mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition ${
          isinCart
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isinCart ? 'Remove' : 'Add'}
      </button>
    </div>
  );
}