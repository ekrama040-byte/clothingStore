import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { Product } from '@/types/product';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('https://fakestoreapi.com/products', { 
      next: { revalidate: 60 } // Cache and revalidate every 60 seconds for performance
    });
    
    if (!res.ok) {
      throw new Error(HTTP error! status: ${res.status});
    }
    
    return res.json();
  } catch (error) {
    console.error('Failed to fetch products from Fake Store API:', error);
    return []; // Fallback to an empty array so the page renders gracefully
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Rich Gradient Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white rounded-3xl p-10 md:p-16 flex flex-col items-start justify-center shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold mb-3 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-700/50">
            The New Season
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-xl">
            Everyday essentials, <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Elevated.</span>
          </h2>
          <p className="text-slate-300 mt-4 max-w-md text-sm md:text-base leading-relaxed">
            Discover curated clothing designed for style, comfort, and modern durability.
          </p>
        </div>
      </section>

      {/* Product Collection Grid */}
      <section className="max-w-7xl mx-auto px-6