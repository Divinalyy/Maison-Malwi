import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface CareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareGuideModal: React.FC<CareGuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1714]/55 backdrop-blur-xs p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="care-guide-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#DFD3C3] p-8 md:p-10 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close care guide"
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-[#5C4B41] hover:text-[#1E1714] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <p className="text-xs text-[#7D6A5E]">Maison Malwi Care Protocol</p>
          <h2 id="care-guide-title" className="mt-1 font-display text-3xl font-medium text-[#1E1714]">
            Preserving Single-Donor Extensions &amp; Wigs
          </h2>
        </div>

        <div className="divide-y divide-[#DFD3C3] text-sm text-[#5C4B41]">
          <div className="py-4">
            <h3 className="font-medium text-[#1E1714]">01. Cleanse Without Sulfates or Heavy Silicones</h3>
            <p className="mt-1 leading-relaxed">
              Wash in cool-to-lukewarm water in a single downward motion using a pH-balanced,
              sulfate-free cleanser. Avoid rubbing weft seams, lace fronts, or keratin bonds directly.
            </p>
          </div>
          <div className="py-4">
            <h3 className="font-medium text-[#1E1714]">02. Thermal Restraint (Max 350°F / 175°C)</h3>
            <p className="mt-1 leading-relaxed">
              Because our single-donor hair retains its natural lipid layer, low-to-medium heat
              styles effortlessly. Always mist a weightless thermal protectant before silk pressing
              or waving.
            </p>
          </div>
          <div className="py-4">
            <h3 className="font-medium text-[#1E1714]">03. Overnight Silk Protection</h3>
            <p className="mt-1 leading-relaxed">
              Braid installed wefts loosely before sleeping on a mulberry silk pillowcase. Store
              unworn Seamless Clip-In Sets and wigs flat inside your Maison Malwi champagne dust pouch.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1E1714] text-[#FAF7F2] text-xs font-medium hover:bg-[#362923] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
