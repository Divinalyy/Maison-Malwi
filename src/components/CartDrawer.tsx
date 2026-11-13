import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import {
  CURRENCIES,
  CurrencyCode,
  formatPrice,
  getShadeById,
  getTextureById,
  HairProduct,
  LengthOption,
  TextureId,
} from '../data/catalog';
import { HairExtensionVisual } from './HairExtensionVisual';

export interface CartItem {
  key: string;
  product: HairProduct;
  shadeId: string;
  textureId: TextureId;
  length: LengthOption;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  email: string;
  address: string;
  totalUsd: number;
  itemCount: number;
}

const FREE_SHIPPING_THRESHOLD_USD = 250;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  currency,
  onCurrencyChange,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length > 0 && step === 'confirmed') {
      setStep('bag');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotalUsd = items.reduce(
    (sum, item) => sum + (item.product.basePrice + item.length.priceDelta) * item.quantity,
    0
  );
  const discountUsd = promoApplied ? subtotalUsd * 0.1 : 0;
  const discountedSubtotalUsd = subtotalUsd - discountUsd;
  const shippingUsd =
    discountedSubtotalUsd === 0 || discountedSubtotalUsd >= FREE_SHIPPING_THRESHOLD_USD ? 0 : 18;
  const totalUsd = discountedSubtotalUsd + shippingUsd;
  const remainingForFreeShippingUsd = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_USD - discountedSubtotalUsd
  );
  const progressPct = Math.min(
    100,
    (discountedSubtotalUsd / FREE_SHIPPING_THRESHOLD_USD) * 100
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (cleaned === 'MALWI10' || cleaned === 'ATELIER10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Try code MALWI10 for 10% private client courtesy.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setFormError('Please complete all delivery fields before confirming.');
      return;
    }
    const orderNum = `MM-${Math.floor(2040 + Math.random() * 890)}`;
    const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
    setConfirmedOrder({
      orderNumber: orderNum,
      customerName: fullName.trim(),
      email: email.trim(),
      address: `${address.trim()}, ${city.trim()} ${postalCode.trim()}`,
      totalUsd,
      itemCount: totalCount,
    });
    setFormError('');
    setStep('confirmed');
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1E1714]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#FAF7F2] border-l border-[#DFD3C3] flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#DFD3C3] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to bag"
                className="p-1.5 text-[#5C4B41] hover:text-[#1E1714] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-2xl font-medium text-[#1E1714]">
              {step === 'bag'
                ? 'Shopping Bag'
                : step === 'checkout'
                  ? 'Express Dispatch'
                  : 'Order Confirmed'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Select currency in bag"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="px-2 py-1 bg-[#F1EAE0] border border-[#DFD3C3] text-xs text-[#1E1714] focus:outline-none focus:border-[#1E1714]"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bag"
              className="w-9 h-9 flex items-center justify-center text-[#5C4B41] hover:text-[#1E1714] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="py-8 space-y-6">
              <div className="flex items-center gap-3 text-[#8F5E38]">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="text-sm font-medium text-[#1E1714]">
                  Order #{confirmedOrder.orderNumber} Confirmed — Preparing Maison Malwi Shipment
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#5C4B41]">
                Thank you, {confirmedOrder.customerName}. Your single-donor hair selection is being
                hand-inspected, steamed, and sealed in our champagne silk garment pouch.
              </p>
              <div className="p-5 bg-[#F1EAE0] border border-[#DFD3C3] space-y-3 text-xs text-[#5C4B41]">
                <div className="flex justify-between">
                  <span>Order Reference</span>
                  <span className="font-medium text-[#1E1714] tabular-nums">
                    #{confirmedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Items Reserved</span>
                  <span className="font-medium text-[#1E1714] tabular-nums">
                    {confirmedOrder.itemCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Address</span>
                  <span className="font-medium text-[#1E1714] text-right max-w-[60%]">
                    {confirmedOrder.address}
                  </span>
                </div>
                <div className="h-px bg-[#DFD3C3]" />
                <div className="flex justify-between text-sm font-medium text-[#1E1714]">
                  <span>Total Charged</span>
                  <span className="tabular-nums">
                    {formatPrice(confirmedOrder.totalUsd, currency)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('bag');
                  onClose();
                }}
                className="w-full py-3 px-5 bg-[#1E1714] text-[#FAF7F2] text-sm font-medium hover:bg-[#362923] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-display text-2xl text-[#1E1714]">Your shopping bag is empty.</p>
              <p className="text-sm text-[#5C4B41] max-w-xs mx-auto">
                Explore Maison Malwi Genius Wefts, Seamless Clip-Ins, Raw Bundles, or reserve a
                Shade Ring to match your tone at home.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-6 py-2.5 border border-[#1E1714] text-xs font-medium text-[#1E1714] hover:bg-[#1E1714] hover:text-[#FAF7F2] transition-colors"
              >
                Browse Collections
              </button>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-6">
              {/* Free shipping threshold */}
              <div className="p-4 bg-[#F1EAE0] border border-[#DFD3C3] space-y-2">
                <p className="text-xs text-[#5C4B41]">
                  {remainingForFreeShippingUsd === 0 ? (
                    <span className="font-medium text-[#1E1714]">
                      Complimentary Maison Malwi Express Shipping unlocked.
                    </span>
                  ) : (
                    <span>
                      Add{' '}
                      <strong className="font-medium text-[#1E1714] tabular-nums">
                        {formatPrice(remainingForFreeShippingUsd, currency)}
                      </strong>{' '}
                      more for complimentary insured shipping.
                    </span>
                  )}
                </p>
                <div className="h-1 w-full bg-[#DFD3C3] overflow-hidden">
                  <div
                    className="h-full bg-[#8F5E38] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#DFD3C3]">
                {items.map((item) => {
                  const shade = getShadeById(item.shadeId);
                  const texture = getTextureById(item.textureId);
                  const unitPriceUsd = item.product.basePrice + item.length.priceDelta;

                  return (
                    <div key={item.key} className="py-5 flex gap-4">
                      <div className="w-20 h-24 shrink-0 border border-[#DFD3C3] overflow-hidden bg-[#EFE6DA]">
                        <HairExtensionVisual
                          form={item.product.visualForm}
                          shadeId={item.shadeId}
                          textureId={item.textureId}
                          imageUrl={item.product.imageUrl}
                          imageAlt={item.product.imageAlt}
                          imagePosition={item.product.imagePosition}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-medium text-[#1E1714] truncate">
                              {item.product.name}
                            </h3>
                            <span className="text-sm font-medium text-[#1E1714] tabular-nums shrink-0">
                              {formatPrice(unitPriceUsd * item.quantity, currency)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#7D6A5E]">
                            {item.product.isSampleRing
                              ? '6-Shade Real Hair Ring'
                              : `${shade.name} · ${texture.name} · ${item.length.inches}"`}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#DFD3C3]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#5C4B41] hover:text-[#1E1714] hover:bg-[#F1EAE0] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium text-[#1E1714] tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#5C4B41] hover:text-[#1E1714] hover:bg-[#F1EAE0] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Remove ${item.product.name}`}
                            className="p-1.5 text-[#7D6A5E] hover:text-[#1E1714] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code */}
              <form onSubmit={handleApplyPromo} className="pt-2 space-y-2">
                <label htmlFor="promo-code" className="block text-xs text-[#5C4B41]">
                  Maison Courtesy Code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="MALWI10"
                    className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#DFD3C3] text-xs text-[#1E1714] placeholder:text-[#9A897B] focus:outline-none focus:border-[#1E1714]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 border border-[#1E1714] text-xs font-medium text-[#1E1714] hover:bg-[#1E1714] hover:text-[#FAF7F2] transition-colors whitespace-nowrap"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-xs text-[#8F5E38]">{promoError}</p>}
              </form>
            </div>
          ) : (
            /* Checkout verification form */
            <form id="atelier-checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <p className="text-xs leading-relaxed text-[#5C4B41]">
                Every order includes tamper-sealed hygiene packaging so you can hold the shade
                against natural daylight before opening.
              </p>

              <div>
                <label htmlFor="chk-name" className="block text-xs font-medium text-[#1E1714] mb-1">
                  Full Name
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Camille Laurent"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD3C3] text-sm text-[#1E1714] focus:outline-none focus:border-[#1E1714]"
                />
              </div>

              <div>
                <label htmlFor="chk-email" className="block text-xs font-medium text-[#1E1714] mb-1">
                  Email for Dispatch Tracking
                </label>
                <input
                  id="chk-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD3C3] text-sm text-[#1E1714] focus:outline-none focus:border-[#1E1714]"
                />
              </div>

              <div>
                <label htmlFor="chk-addr" className="block text-xs font-medium text-[#1E1714] mb-1">
                  Street Address
                </label>
                <input
                  id="chk-addr"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="14 Rue Saint-Honoré"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD3C3] text-sm text-[#1E1714] focus:outline-none focus:border-[#1E1714]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="chk-city" className="block text-xs font-medium text-[#1E1714] mb-1">
                    City
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Paris"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD3C3] text-sm text-[#1E1714] focus:outline-none focus:border-[#1E1714]"
                  />
                </div>
                <div>
                  <label htmlFor="chk-zip" className="block text-xs font-medium text-[#1E1714] mb-1">
                    Postal Code
                  </label>
                  <input
                    id="chk-zip"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="75001"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DFD3C3] text-sm text-[#1E1714] focus:outline-none focus:border-[#1E1714]"
                  />
                </div>
              </div>

              {formError && <p className="text-xs text-[#8F5E38] font-medium">{formError}</p>}
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="px-6 py-5 border-t border-[#DFD3C3] bg-[#F1EAE0] space-y-4">
            <div className="space-y-1.5 text-xs text-[#5C4B41]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#1E1714]">
                  {formatPrice(subtotalUsd, currency)}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-[#8F5E38]">
                  <span>Maison Courtesy (10%)</span>
                  <span className="tabular-nums">-{formatPrice(discountUsd, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                <span className="tabular-nums text-[#1E1714]">
                  {shippingUsd === 0 ? 'Complimentary' : formatPrice(shippingUsd, currency)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#DFD3C3] flex justify-between text-sm font-medium text-[#1E1714]">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(totalUsd, currency)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-6 bg-[#1E1714] text-[#FAF7F2] text-sm font-medium hover:bg-[#362923] transition-colors"
              >
                Proceed to Dispatch
              </button>
            ) : (
              <button
                type="submit"
                form="atelier-checkout-form"
                className="w-full py-3.5 px-6 bg-[#1E1714] text-[#FAF7F2] text-sm font-medium hover:bg-[#362923] transition-colors"
              >
                Confirm Order — {formatPrice(totalUsd, currency)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
