'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const cart = useCartStore((state) => state.cart);
  // Calculate total item quantity in the cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="font-bold text-lg tracking-tight">sarif STUDIO</h1>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/cart" className="relative flex items-center gap-1 hover:text-black">
            <ShoppingBag className="w-5 h-5" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}