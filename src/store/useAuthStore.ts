'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/user';

export const defaultAvatar = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <rect width="160" height="160" rx="24" fill="#eef2ff"/>
    <circle cx="80" cy="58" r="26" fill="#818cf8"/>
    <path d="M38 122c11-20 27-28 42-28s31 8 42 28" fill="#c4b5fd"/>
  </svg>
`)}`;

async function hashPassword(value: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return value;
  }

  const encoded = new TextEncoder().encode(value);
  const hash = await window.crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

interface AuthState {
  users: UserProfile[];
  currentUser: UserProfile | null;
  registerUser: (payload: {
    name: string;
    email: string;
    password: string;
    location?: string;
    avatar?: string;
  }) => Promise<{ ok: boolean; message?: string }>; 
  loginUser: (payload: { email: string; password: string }) => Promise<{ ok: boolean; message?: string; user?: UserProfile }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => UserProfile | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      registerUser: async ({ name, email, password, location, avatar }) => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedName || !trimmedEmail || !password.trim()) {
          return { ok: false, message: 'Please complete all required fields.' };
        }

        if (password.length < 6) {
          return { ok: false, message: 'Password must be at least 6 characters long.' };
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(trimmedEmail)) {
          return { ok: false, message: 'Please enter a valid email address.' };
        }

        const exists = get().users.some((user) => user.email.toLowerCase() === trimmedEmail);
        if (exists) {
          return { ok: false, message: 'An account with this email already exists.' };
        }

        const newUser: UserProfile = {
          id: `user_${Date.now()}`,
          name: trimmedName,
          email: trimmedEmail,
          passwordHash: await hashPassword(password),
          avatar: avatar || defaultAvatar,
          location: location?.trim() || 'Addis Ababa, Ethiopia',
          createdAt: new Date().toISOString(),
        };

        const users = [...get().users, newUser];
        set({ users, currentUser: newUser });
        return { ok: true, message: 'Registration successful.' };
      },
      loginUser: async ({ email, password }) => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail || !password.trim()) {
          return { ok: false, message: 'Email and password are required.' };
        }

        const user = get().users.find((entry) => entry.email.toLowerCase() === trimmedEmail);
        if (!user) {
          return { ok: false, message: 'No account was found for that email.' };
        }

        const passwordHash = await hashPassword(password);
        if (user.passwordHash !== passwordHash) {
          return { ok: false, message: 'Incorrect password. Please try again.' };
        }

        set({ currentUser: user });
        return { ok: true, message: 'Login successful.', user };
      },
      logout: () => {
        set({ currentUser: null });
      },
      updateProfile: (updates) => {
        const currentUser = get().currentUser;
        if (!currentUser) return null;

        const nextUser = {
          ...currentUser,
          ...updates,
          avatar: updates.avatar || currentUser.avatar || defaultAvatar,
        };

        set((state) => ({
          currentUser: nextUser,
          users: state.users.map((user) => (user.id === currentUser.id ? nextUser : user)),
        }));

        return nextUser;
      },
    }),
    {
      name: 'ekram-auth-store',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
      }),
    }
  )
);
