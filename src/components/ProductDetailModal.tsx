import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  CurrencyCode,
  formatPrice,
  getShadeById,
  getTextureById,
  HairProduct,
  LengthOption,
  TextureId,
} from '../data/catalog';
import { HairExtensionVisual } from './HairExtensionVisual';

interface ProductDetailModalProps {
  product: HairProduct | null;
  currency: CurrencyCode;
  initialShadeId?: string;
  initialTextureId?: TextureId;
  onClose: () => void;
  onAddToBag: (payload: {
    product: HairProduct;
    shadeId: string;
    textureId: TextureId;
    length: LengthOption;
  }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  initialShadeId,
  initialTextureId,
  onClose,
  onAddToBag,
}) => {
  const [selectedShade, setSelectedShade] = useState<string>('');
  const [selectedTexture, setSelectedTexture] = useState<TextureId>('silky-straight');
  const [selectedLength, setSelectedLength] = useState<LengthOption | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedShade(
      initialShadeId && product.availableShades.includes(initialShadeId)
        ? initialShadeId
        : product.availableShades[0]
    );
    setSelectedTexture(
      initialTextureId && product.availableTextures.includes(initialTextureId)
        ? initialTextureId
        : product.defaultTexture
    );
    setSelectedLength(product.lengths[0]);
    setAddedFeedback(false);
  }, [product, initialShadeId, initialTextureId]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product || !selectedLength) return null;

  const activeShade = getShadeById(selectedShade || product.availableShades[0]);
  const activeTexture = getTextureById(selectedTexture);
  const finalPriceUsd = product.basePrice + selectedLength.priceDelta;

  const handleAdd = () => {
    onAddToBag({
      product,
      shadeId: activeShade.id,
      textureId: selectedTexture,
      length: selectedLength,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1714]/55 backdrop-blur-xs p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#FAF7F2] border border-[#DFD3C3] shadow-2xl grid grid-cols-1 lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-[#1E1714] bg-[#FAF7F2]/90 border border-[#DFD3C3] hover:bg-[#F1EAE0] transition-colors focus-visible:outline-2 focus-visible:outline-[#8F5E38]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left sticky visual showcase */}
        <div className="lg:col-span-6 bg-[#EFE6DA] flex flex-col justify-between min-h-[340px] lg:min-h-[540px]">
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <HairExtensionVisual
              form={product.visualForm}
              shadeId={activeShade.id}
              textureId={selectedTexture}
              imageUrl={product.imageUrl}
              imageAlt={product.imageAlt}
              imagePosition={product.imagePosition}
              className="w-full h-full min-h-[360px] lg:min-h-[500px]"
            />
          </div>
          <div className="px-6 py-4 border-t border-[#DFD3C3] bg-[#F1EAE0]/90 flex items-center justify-between text-xs text-[#5C4B41]">
            <span>
              {activeShade.name} ({activeShade.code})
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeTexture.name}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{selectedLength.grams}g Single-Donor</span>
          </div>
        </div>

        {/* Right contiguous purchase module */}
        <div className="lg:col-span-6 p-6 md:p-10 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div>
              <p className="text-xs tracking-wide text-[#7D6A5E]">
                {product.category} <span aria-hidden="true">·</span> {product.kicker}
              </p>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <h2
                  id="pdp-title"
                  className="font-display text-3xl md:text-4xl font-medium text-[#1E1714] tracking-tight"
                >
                  {product.name}
                </h2>
                <span className="text-xl font-medium text-[#1E1714] tabular-nums whitespace-nowrap">
                  {formatPrice(finalPriceUsd, currency)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#5C4B41]">{product.shortDesc}</p>
            </div>

            <div className="h-px bg-[#DFD3C3]" />

            {/* Shade selector */}
            {!product.isSampleRing && (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E1714]">Dimensional Shade</span>
                  <span className="text-[#5C4B41]">
                    {activeShade.name} · {activeShade.undertone}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {product.availableShades.map((shadeId) => {
                    const s = getShadeById(shadeId);
                    const isSelected = s.id === activeShade.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedShade(s.id)}
                        aria-label={`Select shade ${s.name}`}
                        title={`${s.name} (${s.code})`}
                        className={`group flex items-center gap-2 px-3 py-2 border text-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                          isSelected
                            ? 'border-[#1E1714] bg-[#F1EAE0] text-[#1E1714] font-medium'
                            : 'border-[#DFD3C3] bg-transparent text-[#5C4B41] hover:border-[#8F5E38]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-[#1E1714]/20 shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${s.rootColor} 0%, ${s.highlightColor} 70%, ${s.sheenColor} 100%)`,
                          }}
                        />
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-[#7D6A5E]">{activeShade.description}</p>
              </div>
            )}

            {/* Texture selector */}
            {product.availableTextures.length > 1 && (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E1714]">Hair Texture</span>
                  <span className="text-[#5C4B41]">{activeTexture.subtitle}</span>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  {product.availableTextures.map((texId) => {
                    const t = getTextureById(texId);
                    const active = texId === selectedTexture;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTexture(t.id)}
                        className={`px-3.5 py-2.5 border text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                          active
                            ? 'border-[#1E1714] bg-[#F1EAE0] text-[#1E1714] font-medium'
                            : 'border-[#DFD3C3] text-[#5C4B41] hover:border-[#8F5E38]'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Length selector */}
            {!product.isSampleRing && (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E1714]">Length &amp; Weight</span>
                  <span className="text-[#5C4B41] tabular-nums">
                    {selectedLength.inches}&quot; · {selectedLength.grams}g Double-Drawn
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.lengths.map((len) => {
                    const active = len.inches === selectedLength.inches;
                    return (
                      <button
                        key={len.inches}
                        type="button"
                        onClick={() => setSelectedLength(len)}
                        className={`px-4 py-2 border text-xs tabular-nums transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                          active
                            ? 'border-[#1E1714] bg-[#1E1714] text-[#FAF7F2] font-medium'
                            : 'border-[#DFD3C3] bg-transparent text-[#1E1714] hover:border-[#8F5E38]'
                        }`}
                      >
                        {len.inches}&quot;
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-xs leading-relaxed text-[#5C4B41] bg-[#F1EAE0] p-4 border border-[#DFD3C3]">
              {product.craftNote}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-3.5 px-6 bg-[#1E1714] text-[#FAF7F2] text-sm font-medium hover:bg-[#362923] transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#8F5E38]"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <span className="tabular-nums">
                  Add to Bag — {formatPrice(finalPriceUsd, currency)}
                </span>
              )}
            </button>
            <p className="text-center text-xs text-[#7D6A5E]">
              In stock · Ships worldwide in champagne silk pouch within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
