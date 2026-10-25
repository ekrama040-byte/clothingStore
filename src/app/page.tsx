import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { Product } from '@/types/product';

type DummyProductResponse = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail?: string;
  image?: string;
};

async function getProducts(): Promise<{ products: Product[]; error: boolean }> {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=20', {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data: { products?: DummyProductResponse[] } = await res.json();

    const products: Product[] = (data.products ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.thumbnail ?? item.image ?? '',
    }));

    return { products, error: false };
  } catch {
    return { products: [], error: true };
  }
}

export default async function Home() {
  const { products, error } = await getProducts();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white rounded-3xl p-10 md:p-16 flex flex-col items-start justify-center shadow-xl relative overflow-hidden">
          <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold mb-3 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-700/50">
            The New Season
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-xl">
            Everyday essentials,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Elevated.
            </span>
          </h2>
          <p className="text-slate-300 mt-4 max-w-md text-sm md:text-base leading-relaxed">
            Discover curated clothing designed for style, comfort, and modern durability.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h3 className="text-xl font-bold mb-6 text-slate-800">Curated for You</h3>

        {error ? (
          <div
            role="status"
            className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center text-amber-900"
          >
            <p className="font-semibold text-base">Unable to reach the product server</p>
            <p className="text-sm text-amber-700 mt-1">
              Please check your internet connection and refresh the page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}