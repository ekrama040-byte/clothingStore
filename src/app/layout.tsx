import './globals.css'; // This line is required!
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ekram Studio - E-Commerce',
  description: 'Built with Next.js and Fake Store API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}