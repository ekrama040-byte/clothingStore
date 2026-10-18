'use client';

import Image from 'next/image';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image Container with Zoom Effect on Hover */}
      <div className="relative w-full h-48 mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.title}
          fill
          unoptimized
          className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            {product.category}
          </span>
          <h4 className="font-medium text-sm text-gray-900 line-clamp-1 mt-0.5">
            {product.title}
          </h4>
          <p className="text-base font-bold text-gray-900 mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}