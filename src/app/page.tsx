import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-neutral-900 text-white rounded-2xl p-10 md:p-16 flex flex-col items-start justify-center">
          <span className="text-xs uppercase tracking-widest text-neutral-400 mb-2">The New Season</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-xl">Everyday essentials, Elevated.</h2>
          <p className="text-neutral-400 mt-4 max-w-md text-sm md:text-base">
            Discover curated clothing designed for our local and global lifestyle with comfort and durability.
          </p>
        </div>
      </section>

      {/* Product Collection Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h3 className="text-xl font-bold mb-6">Curated for You</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
