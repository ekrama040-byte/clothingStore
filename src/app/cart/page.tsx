'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart } = useCartStore();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">EKRAM STUDIO</Link>
          <Link href="/" className="text-sm font-medium flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Collection
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Your Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Explore our latest collection and find something you love.</p>
            <div className="flex gap-4">
              <Link href="/" className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                Go to Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-800 truncate">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
              <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="block w-full bg-black text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}