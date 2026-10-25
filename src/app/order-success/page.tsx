'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  MapPin,
  Clock3,
  MessageSquareText,
  Phone,
  Truck,
  Store,
  ChevronDown,
  ChevronUp,
  Send,
} from 'lucide-react';

type FulfillmentMethod = 'delivery' | 'pickup';

type ChatMessage = {
  id: number;
  sender: 'customer' | 'courier';
  text: string;
  time: string;
};

const shopAddress = 'Bole Atlas, Addis Ababa, Ethiopia';
const shopMapsQuery = encodeURIComponent(shopAddress);

function getCurrentTimeLabel(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function OrderSuccessPage() {
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>(() => {
    if (typeof window === 'undefined') return 'delivery';

    return window.localStorage.getItem('ekram-studio-fulfillment') === 'pickup' ? 'pickup' : 'delivery';
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ekram-studio-fulfillment', fulfillment);
    }
  }, [fulfillment]);

  const statusInfo =
    fulfillment === 'pickup'
      ? { label: 'Pickup Status', value: 'Ready in 2 Hours', icon: Store }
      : { label: 'Estimated Delivery', value: '3 - 5 Business Days', icon: Truck };

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'customer',
      text: trimmed,
      time: getCurrentTimeLabel(),
    };

    setMessages((current) => [...current, newMessage]);
    setMessage('');

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: 'courier',
          text: 'Thanks! Your message has been received in this demo chat.',
          time: getCurrentTimeLabel(),
        },
      ]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 flex flex-col justify-between">
      <header className="bg-[#111111] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight text-white">EKRAM STUDIO</Link>
          <span className="text-xs text-gray-300 font-medium">Order Verification</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16 w-full">
        <div className="bg-[#111111] rounded-2xl p-6 md:p-10 border border-white/10 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Order Confirmed</span>
          <h2 className="text-2xl font-bold tracking-tight text-white">Thank you for your purchase!</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md text-center">
            Your order has been successfully placed and is being prepared for secure dispatch.
          </p>

          <div className="w-full grid grid-cols-2 gap-4 mt-8 p-4 bg-[#1a1a1a] rounded-xl text-left text-sm border border-white/10">
            <div>
              <span className="text-gray-400 block text-xs">Order Number</span>
              <span className="font-semibold text-white">EKRAM-2026-1042</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Payment Status</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <PackageCheck className="w-4 h-4" /> Verified & Paid
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-4 p-4 bg-[#1a1a1a] rounded-xl text-left text-sm border border-white/10">
            <div>
              <span className="text-gray-400 block text-xs">{statusInfo.label}</span>
              <span className="font-semibold text-white flex items-center gap-2">
                <statusInfo.icon className="w-4 h-4 text-emerald-400" />
                {statusInfo.value}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Order Status</span>
              <span className="font-semibold text-white">Confirmed</span>
            </div>
          </div>

          <div className="mt-8 w-full rounded-2xl border border-white/10 bg-[#171717] p-4 md:p-5">
            <h3 className="text-lg font-semibold text-white">Choose Fulfillment Method</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2" role="tablist" aria-label="Fulfillment method selector">
              <button
                type="button"
                role="tab"
                aria-selected={fulfillment === 'delivery'}
                aria-controls="delivery-panel"
                onClick={() => setFulfillment('delivery')}
                className={`rounded-xl border p-4 text-left transition ${
                  fulfillment === 'delivery'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]'
                    : 'border-white/10 bg-[#111111] hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-white">🚚 Home Delivery</div>
                    <div className="mt-1 text-sm text-gray-400">Delivered to your address</div>
                  </div>
                  {fulfillment === 'delivery' && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-black font-bold">✓</span>
                  )}
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={fulfillment === 'pickup'}
                aria-controls="pickup-panel"
                onClick={() => setFulfillment('pickup')}
                className={`rounded-xl border p-4 text-left transition ${
                  fulfillment === 'pickup'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]'
                    : 'border-white/10 bg-[#111111] hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-white">🏪 Pick Up at Shop</div>
                    <div className="mt-1 text-sm text-gray-400">Collect your order from our shop</div>
                  </div>
                  {fulfillment === 'pickup' && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-black font-bold">✓</span>
                  )}
                </div>
              </button>
            </div>

            {fulfillment === 'delivery' ? (
              <div id="delivery-panel" className="mt-5 space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white">Your Delivery Courier</h4>
                        <p className="text-sm text-gray-400">Express Dispatch</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
                      Assigned & Ready
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-300">
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#111111] px-3 py-2 border border-white/10">
                      <span className="text-gray-400">Courier</span>
                      <span className="font-medium text-white">Dawit M.</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#111111] px-3 py-2 border border-white/10">
                      <span className="text-gray-400">Phone</span>
                      <span className="font-medium text-white">+251 911 234 567</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href="tel:+251911234567"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400"
                    >
                      <Phone className="h-4 w-4" />
                      Call Courier
                    </a>
                    <button
                      type="button"
                      onClick={() => setChatOpen((value) => !value)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20"
                    >
                      <MessageSquareText className="h-4 w-4" />
                      {chatOpen ? 'Hide Chat' : 'Chat with Courier'}
                    </button>
                  </div>
                </div>

                {chatOpen && (
                  <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-white">Chat with Dawit M.</h4>
                        <p className="text-xs text-amber-300">Demo courier chat — not a real-time backend connection</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setChatOpen(false)}
                        className="rounded-full p-1 text-gray-400 hover:text-white"
                        aria-label="Collapse courier chat"
                      >
                        {chatOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      {['Please call when you arrive', "I'm at the entrance", 'Please share your arrival time'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setMessage(option)}
                          className="rounded-full border border-white/10 bg-[#111111] px-2.5 py-1.5 text-[11px] text-gray-300 transition hover:border-emerald-500/40 hover:text-white"
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    <div className="max-h-52 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-[#111111] p-3">
                      {messages.length === 0 ? (
                        <p className="text-sm text-gray-400">Send a message about your delivery</p>
                      ) : (
                        messages.map((item) => (
                          <div
                            key={item.id}
                            className={`flex ${item.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                                item.sender === 'customer'
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-[#1f1f1f] text-gray-100 border border-white/10'
                              }`}
                            >
                              <div>{item.text}</div>
                              <div className={`mt-1 text-[10px] ${item.sender === 'customer' ? 'text-black/70' : 'text-gray-400'}`}>
                                {item.time}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <textarea
                        aria-label="Send a delivery message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={2}
                        className="min-h-[44px] flex-1 resize-none rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
                        placeholder="Type a message..."
                      />
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Send delivery message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4 text-sm">
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-emerald-400" />
                      <span>Delivery address: Bole Road, Around Edna Mall, Addis Ababa, Ethiopia</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <PackageCheck className="mt-0.5 h-4 w-4 text-emerald-400" />
                      <span>Order reference: EKRAM-2026-1042</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 h-4 w-4 text-emerald-400" />
                      <span>Estimated arrival: 3 - 5 business days (estimate only)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id="pickup-panel" className="mt-5 space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white">Pick Up at Our Shop</h4>
                        <p className="text-sm text-gray-400">Visit our shop to collect your confirmed order.</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
                      Ready Estimate
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-emerald-400" />
                      <div>
                        <div className="font-medium text-white">Ekram Studio Flagship</div>
                        <div>Bole Atlas, Addis Ababa, Ethiopia</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 h-4 w-4 text-emerald-400" />
                      <div>
                        <div className="font-medium text-white">Opening hours</div>
                        <div>9:00 AM – 8:00 PM</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
                    <iframe
                      title="Ekram Studio shop location"
                      src={`https://www.google.com/maps?q=${shopMapsQuery}&output=embed`}
                      className="h-64 w-full border-0 sm:h-72"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${shopMapsQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400"
                    >
                      <MapPin className="h-4 w-4" />
                      Get Directions in Google Maps
                    </a>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4 text-sm text-gray-300">
                  <p>
                    Your order will be available for collection according to its pickup status. Please bring your order
                    confirmation or order number when visiting the shop.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 w-full flex justify-center">
            <Link
              href="/"
              className="bg-white text-[#111111] px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition flex items-center gap-2"
            >
              Return to Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-white/10 bg-[#111111]">
        © 2026 Ekram Studio. All rights reserved.
      </footer>
    </div>
  );
}