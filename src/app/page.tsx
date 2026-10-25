'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { Product } from '@/types/product';
import { useProductsStore } from '@/store/useProductsStore';
import { useCartStore } from '@/store/useCartStore';

type DummyProductResponse = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail?: string;
  image?: string;
};

function mapDummyProduct(item: DummyProductResponse): Product {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    image: item.thumbnail ?? item.image ?? '',
    location: 'Delivery available',
  };
}

const fallbackProducts: Product[] = [
  {
    id: 101,
    title: 'Premium Wireless Headphones',
    price: 860,
    description: 'Noise-cancelling wireless headphones with immersive sound and all-day comfort.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    location: 'Addis Ababa',
  },
  {
    id: 102,
    title: 'Minimal Leather Backpack',
    price: 620,
    description: 'A stylish everyday backpack designed for work, travel, and daily commuting.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    location: 'Bole',
  },
  {
    id: 103,
    title: 'Modern Accent Chair',
    price: 980,
    description: 'Statement furniture piece with soft cushioning and a warm contemporary finish.',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    location: 'Kazanchis',
  },
  {
    id: 104,
    title: 'Classic Cotton Hoodie',
    price: 540,
    description: 'Comfortable premium cotton hoodie with a relaxed, modern silhouette.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    location: 'Megenagna',
  },
  {
    id: 105,
    title: 'Skin Glow Serum',
    price: 420,
    description: 'Hydrating daily skincare formula that supports smoother, healthier-looking skin.',
    category: 'Beauty & Health',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    location: 'Meskel Square',
  },
  {
    id: 106,
    title: 'Smart Fitness Watch',
    price: 740,
    description: 'Track your workouts, sleep, and daily activity with a sleek fitness companion.',
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    location: 'CMC',
  },
];

export default function Home() {
  const router = useRouter();
  const userProducts = useProductsStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categoryList = [
    { name: 'All', value: 'all' },
    { name: 'Electronics', value: 'electronics' },
    { name: 'Fashion', value: 'fashion' },
    { name: 'Home & Living', value: 'home' },
    { name: 'Beauty & Health', value: 'beauty' },
    { name: 'Sports & Fitness', value: 'sports' },
    { name: 'Books', value: 'books' },
    { name: 'Accessories', value: 'accessories' },
  ];

  useEffect(() => {
    let active = true;

    fetch('https://dummyjson.com/products?limit=20', {
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data: { products?: DummyProductResponse[] }) => {
        if (!active) return;
        setProducts((data.products ?? []).map(mapDummyProduct));
        setError(false);
      })
      .catch(() => {
        if (active) {
          setProducts(fallbackProducts);
          setError(false);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const mergedProducts = useMemo(() => {
    const combined = [...products, ...userProducts];
    const unique = new Map<number, Product>();

    combined.forEach((product) => {
      unique.set(product.id, product);
    });

    return [...unique.values()];
  }, [products, userProducts]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return mergedProducts;
    return mergedProducts.filter((product) => {
      const productCategory = (product.category || '').toLowerCase();
      const target = selectedCategory.toLowerCase();
      return productCategory.includes(target) || target.includes(productCategory);
    });
  }, [mergedProducts, selectedCategory]);

  const featuredProducts = filteredProducts.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[26px] bg-[#dfeee4] px-6 py-8 shadow-[0_18px_40px_rgba(16,24,40,0.06)] md:px-10 md:py-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.7),_rgba(255,255,255,0))] md:block" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.05fr_1.25fr]">
            <div className="max-w-lg">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-800">Premium quality • best prices</p>
              <h1 className="max-w-md text-[2.1rem] font-black leading-[1.08] tracking-[-0.05em] text-slate-900 md:text-[2.9rem]">
                Discover Amazing Products Just For You
              </h1>
              <p className="mt-4 text-[0.86rem] leading-6 text-slate-700 md:text-[0.95rem]">
                Shop the latest trends, top brands and exclusive deals.
              </p>

              <button
                type="button"
                onClick={() => router.push('/cart')}
                className="mt-6 inline-flex items-center rounded-full bg-[#0e8d5d] px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-emerald-300 transition hover:bg-[#0c7e51]"
              >
                Shop Now →
              </button>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] text-slate-700">
                {['Fast Delivery', 'Secure Payment', 'Easy Returns'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-2 backdrop-blur-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[320px] items-center justify-center">
              <div className="absolute bottom-0 right-12 h-28 w-56 rounded-[32px] bg-[#c9d9d0] blur-xl" />
              <div className="relative h-[300px] w-full max-w-[520px]">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
                  alt="Lifestyle product hero"
                  className="h-full w-full rounded-[30px] object-cover shadow-[0_30px_60px_rgba(15,23,42,0.12)]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[1.55rem] font-black tracking-[-0.04em] text-slate-900">Shop by Category</h2>
              <p className="mt-1 text-[0.8rem] text-slate-500">Find what you need, all in one place.</p>
            </div>
            <button type="button" className="text-[0.8rem] font-semibold text-emerald-700">View All →</button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-8">
            {categoryList.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`group rounded-[18px] border p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  selectedCategory === category.value ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="relative h-20 overflow-hidden rounded-[14px] bg-slate-100">
                  <img
                    src={
                      category.value === 'all'
                        ? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'
                        : category.name === 'Electronics'
                          ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
                          : category.name === 'Fashion'
                            ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
                            : category.name === 'Home & Living'
                              ? 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
                              : category.name === 'Beauty & Health'
                                ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
                                : category.name === 'Sports & Fitness'
                                  ? 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80'
                                  : category.name === 'Books'
                                    ? 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80'
                                    : 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80'
                    }
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">{category.name}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[1.6rem] font-black tracking-[-0.04em] text-slate-900">Featured Products</h2>
              <p className="mt-1 text-[0.8rem] text-slate-500">Top picks for you</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold text-slate-700">
              {['Best Seller', 'New', 'On Sale'].map((label) => (
                <button key={label} type="button" className={`rounded-full px-3 py-2 ${label === 'Best Seller' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading products...
            </div>
          ) : error ? (
            <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-900">
              <p className="font-semibold text-base">Unable to reach the product server</p>
              <p className="mt-1 text-sm text-amber-700">Please check your internet connection and refresh the page.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`${product.createdByUser ? 'user' : 'api'}-${product.id}`}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid gap-0 md:grid-cols-[1.3fr_0.7fr]">
              <div className="bg-slate-100 p-4">
                <div className="relative h-[380px] overflow-hidden rounded-[20px] bg-white">
                  <img
                    src={quickViewProduct.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'}
                    alt={quickViewProduct.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img
                        src={quickViewProduct.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'}
                        alt={`${quickViewProduct.title} ${item}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-700">Featured Item</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{quickViewProduct.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    className="text-2xl text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                </div>

                <div className="text-3xl font-black text-slate-900">
                  ETB {quickViewProduct.price.toFixed(2)}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  {quickViewProduct.description}
                </div>

                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold">{quickViewProduct.category}</span>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Location</span>
                    <span className="font-semibold">{quickViewProduct.location || 'Delivery available'}</span>
                  </div>
                  <div className="flex justify-between gap-3 pb-2">
                    <span className="text-slate-500">Condition</span>
                    <span className="font-semibold">Brand new</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 rounded-xl bg-[#0f8f62] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#0c7d56]"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}