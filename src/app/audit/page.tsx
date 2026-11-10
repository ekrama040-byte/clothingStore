'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { BarChart3, CircleAlert, DatabaseZap, PackageCheck, TrendingUp } from 'lucide-react';

type ProductCatalog = {
  id: number | string;
  title: string;
  category?: string;
  price?: number;
};

type ProductSales = {
  productId: string;
  name: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
};

type OrderRecord = {
  id?: string | number;
  orderId?: string | number;
  productId?: string | number;
  product_id?: string | number;
  productName?: string;
  product_name?: string;
  name?: string;
  title?: string;
  quantity?: number | string;
  qty?: number | string;
  units?: number | string;
  price?: number | string;
  unitPrice?: number | string;
  total?: number | string;
  totalPrice?: number | string;
  revenue?: number | string;
  amount?: number | string;
  status?: string;
  orderStatus?: string;
  items?: OrderRecord[];
  orders?: OrderRecord[];
  sales?: OrderRecord[];
  product?: { id?: string | number; title?: string; price?: number | string; category?: string };
};

const STORAGE_KEYS = ['completed-orders', 'sales-data', 'ekram-sales', 'checkout-orders', 'order-history', 'sales', 'audit-sales'];
const CANCELLED_STATUSES = new Set(['cancelled', 'canceled', 'failed', 'refunded', 'void', 'rejected', 'deleted']);
const COMPLETED_STATUSES = new Set(['completed', 'paid', 'fulfilled', 'confirmed', 'success', 'succeeded', 'approved', 'done']);
const DEMO_UNITS = [48, 36, 29, 22, 15, 11];

function safeNumber(value: number | string | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toId(value: string | number | undefined): string {
  return String(value ?? '').trim();
}

function normalizeProductId(value: string | number | undefined): string {
  return toId(value).replace(/\s+/g, ' ').trim() || 'unknown';
}

function isCompletedStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  if (!normalized) return true;
  if (CANCELLED_STATUSES.has(normalized)) return false;
  if (COMPLETED_STATUSES.has(normalized)) return true;
  return !['pending', 'processing', 'in-progress', 'queued', 'awaiting', 'draft'].includes(normalized);
}

function parseOrderRecords(value: string | null): OrderRecord[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    const results: OrderRecord[] = [];

    const flatten = (entry: unknown): void => {
      if (!entry || typeof entry !== 'object') return;
      const candidate = entry as OrderRecord;

      if (Array.isArray(candidate.items)) {
        candidate.items.forEach((item) => {
          if (item && typeof item === 'object') {
            results.push({
              ...item,
              orderId: candidate.id ?? candidate.orderId,
              status: item.status ?? candidate.status ?? item.orderStatus ?? candidate.orderStatus,
            });
          }
        });
      }

      if (candidate.productId || candidate.product_id || candidate.productName || candidate.product_name || candidate.title || candidate.name) {
        results.push(candidate);
      }

      if (Array.isArray(candidate.orders)) {
        candidate.orders.forEach((order) => flatten(order));
      }
      if (Array.isArray(candidate.sales)) {
        candidate.sales.forEach((sale) => flatten(sale));
      }
    };

    if (Array.isArray(parsed)) {
      parsed.forEach((entry) => flatten(entry));
      return results;
    }

    flatten(parsed);
    return results;
  } catch {
    return [];
  }
}

function resolveProductFromCatalog(productId: string, productName: string, products: ProductCatalog[]): ProductCatalog | undefined {
  if (productId && productId !== 'unknown') {
    const directlyMatched = products.find((product) => String(product.id) === productId);
    if (directlyMatched) return directlyMatched;
  }

  const cleanedName = productName.trim().toLowerCase();
  if (!cleanedName) return undefined;

  return products.find((product) => product.title.trim().toLowerCase() === cleanedName) ??
    products.find((product) => product.title.trim().toLowerCase().includes(cleanedName) || cleanedName.includes(product.title.trim().toLowerCase()));
}

function aggregateSalesFromOrders(records: OrderRecord[], products: ProductCatalog[]): ProductSales[] {
  const productLookup = new Map<string, ProductCatalog>();
  products.forEach((product) => productLookup.set(String(product.id), product));
  const nameLookup = new Map<string, ProductCatalog>();
  products.forEach((product) => nameLookup.set(product.title.trim().toLowerCase(), product));

  const byProduct = new Map<string, ProductSales>();
  const seenItems = new Set<string>();

  records.forEach((record, index) => {
    const qualifiedStatus = String(record.status ?? record.orderStatus ?? '').trim().toLowerCase();
    if (!isCompletedStatus(qualifiedStatus)) {
      return;
    }

    const explicitProductId = normalizeProductId(record.productId ?? record.product_id ?? record.product?.id);
    const rawName = String(
      record.productName ??
      record.product_name ??
      record.name ??
      record.title ??
      record.product?.title ??
      'Unnamed product'
    ).trim();

    const resolvedProduct = explicitProductId !== 'unknown'
      ? productLookup.get(explicitProductId) ?? resolveProductFromCatalog(explicitProductId, rawName, products)
      : resolveProductFromCatalog('', rawName, products) ?? nameLookup.get(rawName.trim().toLowerCase());

    const productId = resolvedProduct ? String(resolvedProduct.id) : explicitProductId !== 'unknown' ? explicitProductId : normalizeProductId(index + 1);
    const name = resolvedProduct?.title ?? (rawName || 'Unnamed product');
    const category = resolvedProduct?.category ?? 'General';
    const quantity = safeNumber(record.quantity ?? record.qty ?? record.units ?? 1);

    if (quantity <= 0) {
      return;
    }

    const orderKey = `${productId}-${record.id ?? record.orderId ?? index}`;
    if (seenItems.has(orderKey)) {
      return;
    }
    seenItems.add(orderKey);

    const unitPrice =
      safeNumber(record.price ?? record.unitPrice ?? record.total ?? record.amount ?? record.revenue) / Math.max(quantity, 1);

    const resolvedUnitPrice = unitPrice > 0
      ? unitPrice
      : safeNumber(resolvedProduct?.price ?? 0);

    if (resolvedUnitPrice <= 0) {
      return;
    }

    const existing = byProduct.get(productId) ?? {
      productId,
      name,
      category,
      unitsSold: 0,
      totalRevenue: 0,
    };

    existing.unitsSold += quantity;
    existing.totalRevenue += resolvedUnitPrice * quantity;
    byProduct.set(productId, existing);
  });

  return [...byProduct.values()].sort((a, b) => b.unitsSold - a.unitsSold || a.name.localeCompare(b.name));
}

function buildDemoSales(products: ProductCatalog[]): ProductSales[] {
  if (products.length > 0) {
    return products.slice(0, 6).map((product, index) => {
      const unitsSold = DEMO_UNITS[index] ?? 12;
      const unitPrice = Number(product.price) > 0 ? Number(product.price) : 180 + index * 35;
      return {
        productId: String(product.id),
        name: product.title,
        category: product.category ?? 'General',
        unitsSold,
        totalRevenue: Number((unitsSold * unitPrice).toFixed(2)),
      };
    }).sort((a, b) => b.unitsSold - a.unitsSold || a.name.localeCompare(b.name));
  }

  return [
    { productId: 'demo-1', name: 'Studio Signature Set', category: 'Signature', unitsSold: 48, totalRevenue: 24000 },
    { productId: 'demo-2', name: 'Premium Everyday Collection', category: 'Essentials', unitsSold: 36, totalRevenue: 18000 },
    { productId: 'demo-3', name: 'Classic Essential Piece', category: 'Classic', unitsSold: 29, totalRevenue: 11600 },
    { productId: 'demo-4', name: 'Modern Minimalist Set', category: 'Modern', unitsSold: 22, totalRevenue: 13200 },
    { productId: 'demo-5', name: 'Limited Edition Collection', category: 'Limited', unitsSold: 15, totalRevenue: 12000 },
    { productId: 'demo-6', name: 'Studio Gift Bundle', category: 'Gifts', unitsSold: 11, totalRevenue: 5500 },
  ];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AuditPage() {
  const [products, setProducts] = useState<ProductCatalog[]>([]);
  const [productError, setProductError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const savedRecords = STORAGE_KEYS.flatMap((key) => parseOrderRecords(window.localStorage.getItem(key)));
      return savedRecords;
    } catch {
      return [];
    }
  });
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [demoOverride, setDemoOverride] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    fetch('https://dummyjson.com/products?limit=20')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        const catalog = Array.isArray(data?.products)
          ? data.products.map((product: Record<string, unknown>) => ({
              id: product.id as number | string,
              title: String(product.title ?? 'Unnamed product'),
              category: typeof product.category === 'string' ? product.category : 'General',
              price: typeof product.price === 'number' ? product.price : safeNumber(String(product.price ?? 0)),
            }))
          : [];
        setProducts(catalog);
        setProductError(null);
      })
      .catch(() => {
        if (active) {
          setProducts([]);
          setProductError('Unable to load the current catalog.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const realSales = useMemo(() => aggregateSalesFromOrders(orders, products), [orders, products]);
  const demoSales = useMemo(() => buildDemoSales(products), [products]);

  const loading = products.length === 0 && orders.length === 0 && !productError && !ordersError;
  const hasRealSales = realSales.length > 0;
  const autoDemo = !hasRealSales && !loading && !productError && !ordersError;
  const demoActive = demoOverride ?? autoDemo;
  const activeSales = hasRealSales ? realSales : demoActive ? demoSales : [];

  const totalUnitsSold = activeSales.reduce((sum, item) => sum + item.unitsSold, 0);
  const totalRevenue = activeSales.reduce((sum, item) => sum + item.totalRevenue, 0);
  const topProduct = [...activeSales].sort((a, b) => b.unitsSold - a.unitsSold || a.productId.localeCompare(b.productId))[0] ?? null;
  const chartData = [...activeSales].sort((a, b) => b.unitsSold - a.unitsSold || a.productId.localeCompare(b.productId)).slice(0, 6).map((item) => ({
    ...item,
    shortName: item.name.length > 14 ? `${item.name.slice(0, 14)}…` : item.name,
  }));
  const barColors = ['#4f46e5', '#7c3aed', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const maxUnitsSold = Math.max(...chartData.map((item) => item.unitsSold), 1);

  const statusText = hasRealSales ? 'Sales data available' : demoActive ? 'Demo Data Active' : 'No sales recorded yet';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Audit dashboard</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Best-selling products
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <TrendingUp className="h-3.5 w-3.5" />
              {statusText}
            </div>

            {!hasRealSales && (
              <button
                type="button"
                onClick={() => setDemoOverride((value) => (value === null ? false : !value))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700"
              >
                <DatabaseZap className="h-3.5 w-3.5" />
                {demoActive ? 'Demo enabled' : 'Demo disabled'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 rounded-full bg-slate-200" />
              <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-28 rounded-2xl bg-slate-200" />
                ))}
              </div>
              <div className="h-[300px] rounded-2xl bg-slate-200" />
            </div>
          </div>
        ) : activeSales.length === 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Completed sales', value: '0', helper: 'No recorded purchases' },
                { label: 'Best seller', value: '—', helper: 'Awaiting data' },
                { label: 'Tracked products', value: '0', helper: 'No product activity' },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
                  <p className="mt-2 text-xs text-slate-500">{card.helper}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm md:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <CircleAlert className="h-8 w-8" />
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-slate-900">No completed-order sales are available</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  {productError || ordersError
                    ? 'The current catalog or saved order records could not be loaded. Toggle demo data on to inspect the dashboard layout without affecting real records.'
                    : 'This project does not currently include valid completed purchase records, so there is no sales data to summarize yet.'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Completed sales</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{totalUnitsSold}</p>
                <p className="mt-2 text-xs text-slate-500">{formatCurrency(totalRevenue)} total revenue</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Best seller</p>
                <p className="mt-3 text-xl font-bold text-slate-900">{topProduct?.name ?? '—'}</p>
                <p className="mt-2 text-xs text-slate-500">{topProduct ? `${topProduct.unitsSold} units sold` : 'No sales'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Tracked products</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{activeSales.length}</p>
                <p className="mt-2 text-xs text-slate-500">Unique products with recorded sales</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Top products by sales</p>
                    <h3 className="text-xl font-bold text-slate-900">Most popular items</h3>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Units sold
                  </div>
                </div>

                <div className="h-[320px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <svg viewBox="0 0 760 280" className="h-full w-full" role="img" aria-label="Sales bar chart">
                    <g stroke="#cbd5e1" strokeWidth="1">
                      {[0, 1, 2, 3, 4].map((line) => (
                        <line key={line} x1="40" x2="720" y1={30 + line * 50} y2={30 + line * 50} />
                      ))}
                    </g>

                    {chartData.map((item, index) => {
                      const barHeight = (item.unitsSold / maxUnitsSold) * 180;
                      const x = 70 + index * 115;
                      const y = 230 - barHeight;

                      return (
                        <g key={`${item.productId}-${index}`}>
                          <rect
                            x={x}
                            y={y}
                            width="56"
                            height={barHeight}
                            rx="10"
                            fill={barColors[index % barColors.length]}
                          />
                          <text x={x + 28} y="250" textAnchor="middle" fontSize="11" fill="#475569">
                            {item.shortName}
                          </text>
                          <text x={x + 28} y={y - 10} textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="700">
                            {item.unitsSold}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Current leader</p>
                    <h3 className="text-lg font-bold text-slate-900">{topProduct?.name ?? '—'}</h3>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Units sold</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{topProduct?.unitsSold ?? 0}</p>
                  <p className="mt-2 text-xs text-slate-500">{topProduct ? formatCurrency(topProduct.totalRevenue) : 'No revenue yet'}</p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
                    <span>Top product</span>
                    <span>{topProduct?.name ?? '—'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                    <span>Products ranked</span>
                    <span>{activeSales.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ranked product list</p>
                  <h3 className="text-xl font-bold text-slate-900">Product popularity</h3>
                </div>
              </div>

              <div className="space-y-3">
                {[...activeSales].sort((a, b) => b.unitsSold - a.unitsSold || a.productId.localeCompare(b.productId)).map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{product.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{product.unitsSold} sold • {formatCurrency(product.totalRevenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
