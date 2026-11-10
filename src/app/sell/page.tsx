'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductsStore } from '@/store/useProductsStore';
import { Product } from '@/types/product';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  currency: 'USD',
  category: 'Fashion',
  location: '',
  image: '',
};

export default function SettingsPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentUserId = currentUser?.id ?? null;
  const allProducts = useProductsStore((state) => state.products);
  const userProducts = useMemo(
    () => allProducts.filter((product) => product.sellerId === currentUserId),
    [allProducts, currentUserId]
  );
  const addProduct = useProductsStore((state) => state.addProduct);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const removeProduct = useProductsStore((state) => state.removeProduct);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const canManage = Boolean(currentUser);

  const sortedProducts = useMemo(
    () => [...userProducts].sort((a, b) => b.id - a.id),
    [userProducts]
  );

  if (!canManage) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Account required</h1>
          <p className="mt-3 text-sm text-slate-600">Please log in to publish, edit, or manage your products.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">
              Log In
            </Link>
            <Link href="/register" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('Please upload an image smaller than 1MB. Large base64 images overflow local storage.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  }

  function beginEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      currency: product.currency || 'USD',
      category: product.category || 'Fashion',
      location: product.location || '',
      image: product.image || '',
    });
    setError('');
    setSuccess('');
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) {
      setError('Please log in first.');
      return;
    }

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      setError('Name, description, and pickup location are required.');
      return;
    }

    const priceValue = Number(form.price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setError('Please enter a valid price greater than zero.');
      return;
    }

    if (!form.image) {
      setError('Please select and upload a product image.');
      return;
    }

    const payload: Product = {
      id: editingId ?? Number(`${Date.now()}${Math.floor(Math.random() * 99)}`),
      title: form.title.trim(),
      description: form.description.trim(),
      price: priceValue,
      currency: form.currency,
      category: form.category.trim() || 'Fashion',
      image: form.image,
      location: form.location.trim(),
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar || '',
      createdByUser: true,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      updateProduct(editingId, payload);
      setSuccess('Product updated successfully.');
      setTimeout(() => router.push('/'), 200);
      return;
    }

    addProduct(payload);
    setSuccess('Product published successfully.');
    setTimeout(() => router.push('/'), 200);
    resetForm();
  }

  function handleDelete(id: number) {
    removeProduct(id);
    setSuccess('Product deleted successfully.');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
     <Navbar />
     
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="mt-8 flex flex-col gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Settings</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">My Products</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/audit')}
              className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700"
            >
              Audit Dashboard
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              Back to Shop
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Product' : 'Sell a Product'}
              </h2>
              {editingId ? (
                <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                  <XCircle className="h-4 w-4" /> Cancel
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Product name</label>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                    placeholder="Example: Signature Jacket"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                    placeholder="Tell buyers about the product, fabric, fit, and style."
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="ETB">ETB</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                  <input
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                    placeholder="Fashion"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Put your phone number</label>
                  <input
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                    placeholder="bole blg-name Addis Ababa,Ethiopia"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Product image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700"
                />
              </div>

              {form.image ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img src={form.image} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Plus className="h-4 w-4" />
                  {editingId ? 'Save Changes' : 'Publish Product'}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Your listings</h2>
            <div className="mt-4 space-y-3">
              {sortedProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  You have not published any products yet.
                </div>
              ) : (
                sortedProducts.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.title} className="h-14 w-14 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{product.title}</p>
                        <p className="text-xs text-slate-500">{product.location}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => beginEdit(product)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}