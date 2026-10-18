'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15.0 : 0;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment verification / order processing
    setTimeout(() => {
      clearCart();
      router.push('/order-success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/cart" className="text-sm font-medium flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="font-bold text-lg tracking-tight">EKRAM STUDIO</h1>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Checkout
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Shipping & Payment Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">First Name</label>
                  <input required type="text" placeholder="Ekram" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
                  <input required type="text" placeholder="Ahmed" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address</label>
                <input required type="text" placeholder="Bole Road, Around Edna Mall" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                  <input required type="text" placeholder="Addis Ababa" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Postal Code</label>
                  <input required type="text" placeholder="1000" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Payment Details</h2>
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
                  <input required type="text" placeholder="4532 •••• •••• 8920" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>
                    <input required type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
                    <input required type="password" placeholder="123" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Column */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 truncate max-w-[200px]">{item.title} × {item.quantity}</span>
                  <span className="font-medium">\${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>\${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping & Handling</span>
                <span>\${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
                <span>Total</span>
                <span>\${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={loading || cart.length === 0}
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}