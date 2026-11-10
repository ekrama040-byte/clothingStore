'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Pencil, MapPin, Mail, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductsStore } from '@/store/useProductsStore';

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentUserId = currentUser?.id ?? null;
  const allProducts = useProductsStore((state) => state.products);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Please log in</h1>
          <p className="mt-3 text-sm text-slate-600">You need an account to view the profile.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
              Log In
            </Link>
            <Link href="/register" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const userProducts = useMemo(
    () => allProducts.filter((product) => product.sellerId === currentUserId),
    [allProducts, currentUserId]
  );

  function handleAvatarChange() {
    const url = window.prompt('Paste a profile image URL', currentUser?.avatar || '');
    if (!url) return;
    updateProfile({ avatar: url });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <button type="button" onClick={handleAvatarChange} className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-indigo-100 bg-slate-100">
                <img src={currentUser.avatar || '/default-avatar.png'} alt={currentUser.name} className="h-full w-full object-cover" />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Seller profile</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{currentUser.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-600" /> {currentUser.email}</div>
                  <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-600" /> {currentUser.location || 'Location not set'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/settings')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </button>
              <button
                type="button"
                onClick={() => router.push('/settings')}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Manage Products
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Posted products</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {userProducts.length} listing{userProducts.length === 1 ? '' : 's'}
            </span>
          </div>

          {userProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              You have not published any products yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {userProducts.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img src={product.image} alt={product.title} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-slate-800">{product.title}</h3>
                      <span className="text-sm font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" /> {product.location}</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
