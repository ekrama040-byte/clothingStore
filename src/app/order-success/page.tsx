import Link from 'next/link';
import { CheckCircle2, PackageCheck, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">EKRAM STUDIO</Link>
          <span className="text-xs text-gray-500 font-medium">Order Verification</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">Order Confirmed</span>
          <h2 className="text-2xl font-bold tracking-tight">Thank you for your purchase!</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-md">
            Your order has been successfully placed and is being prepared for secure dispatch.
          </p>

          <div className="w-full grid grid-cols-2 gap-4 mt-8 p-4 bg-gray-50 rounded-xl text-left text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Estimated Delivery</span>
              <span className="font-semibold text-gray-800">3 - 5 Business Days</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Payment Status</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <PackageCheck className="w-4 h-4" /> Verified & Paid
              </span>
            </div>
          </div>

          <div className="mt-8 w-full flex justify-center">
            <Link
              href="/"
              className="bg-black text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
            >
              Return to Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100 bg-white">
        © 2026 Ekram Studio. All rights reserved.
      </footer>
    </div>
  );
}