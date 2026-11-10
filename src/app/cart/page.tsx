'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
        >
          EKRAM STUDIO
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <Link href="/audit" className="hover:text-red-600 transition-colors">Audit</Link>
        </nav>
      </div>
    </header>
      
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>
       
        {cart.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-gray-500 mb-4">Your cart is currently empty.</p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between gap-4"
              >
                {/* Product Image with unoptimized flag to prevent timeouts */}
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                </div>

                {/* Details & Quantity Modifiers */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center justify-center font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center justify-center font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Item Price & Delete Button */}
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="font-bold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Subtotal & Checkout Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-xl font-bold">${subtotal.toFixed(2)}</p>
 </div>
              <Link
                href="/checkout"
                className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}