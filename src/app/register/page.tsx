'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.registerUser);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', avatar: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    router.push('/');
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, avatar: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const result = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      location: form.location,
      avatar: form.avatar,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.message || 'Unable to create your account.');
      return;
    }

    router.push('/');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
            E
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Join EKRAM STUDIO to publish and sell.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
              placeholder="Addis Ababa, Ethiopia"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Profile photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-600">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
