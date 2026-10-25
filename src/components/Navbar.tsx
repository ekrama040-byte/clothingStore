'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBag, User, LogOut, Settings, Package, ChevronDown, Search, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import {usePathname} from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const favorites = useCartStore((state) => state.favorites);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = favorites.length;
  const pathname=usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f8f62] text-xs text-white shadow-sm">E</span>
              <span className="text-[0.82rem] uppercase tracking-[0.12em]">EKRAM STUDIO</span>
            </Link>
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                <Heart className="h-4 w-4" />
              </button>
              {favoriteCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {favoriteCount}
                </span>
              )}
            </div>
            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
              <ShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm"
                  aria-label="Account menu"
                >
                  <img
                    src={currentUser.avatar || 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                        <rect width="64" height="64" rx="18" fill="#eef2ff"/>
                        <circle cx="32" cy="24" r="12" fill="#818cf8"/>
                        <path d="M15 52c4-10 12-15 17-15s13 5 17 15" fill="#c4b5fd"/>
                      </svg>
                    `)}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="hidden text-left sm:block">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-700">Account</span>
                    <span className="block text-xs font-semibold text-slate-800">{currentUser.name}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <User className="h-4 w-4 text-emerald-700" /> My Profile
                    </Link>
                    <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Package className="h-4 w-4 text-emerald-700" /> My Products
                    </Link>
                    <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Settings className="h-4 w-4 text-emerald-700" /> Settings
                    </Link>
                    <Link href="/audit" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Package className="h-4 w-4 text-emerald-700" /> Audit
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        router.push('/');
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut className="h-4 w-4 text-emerald-700" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                  <User className="h-4 w-4" /> Login
                </Link>
                <Link href="/register" className="hidden rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 sm:inline-flex">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-3 flex items-center gap-6 border-t border-slate-200 pt-3 text-[0.8rem] font-medium text-slate-600">
          <button type="button" className="inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-slate-700">All Categories <span className="text-[0.7rem]">▾</span></button>
          <Link href="/" className= "border-b-2 border-transparent">Home</Link>
          <Link href="/sell" className={`${pathname.startsWith("/sell")? "border-b-2 border-emerald-600 pb-1 text-emerald-700 ": "border-b-2 border-transparent"}`}>Sell</Link>
        </nav>
      </div>
    </header>
  );
}