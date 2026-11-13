import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Pause,
  Play,
  Search,
  ShoppingBag,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  CLIENT_REVIEWS,
  CURRENCIES,
  CurrencyCode,
  formatPrice,
  getShadeById,
  getTextureById,
  HAIR_SHADES,
  HAIR_TEXTURES,
  HairProduct,
  LengthOption,
  ProductCategory,
  PRODUCTS,
  TextureId,
} from './data/catalog';
import { HairExtensionVisual } from './components/HairExtensionVisual';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { CareGuideModal } from './components/CareGuideModal';

const HERO_VIDEO_SRC = '/assets/aistudio/Model_smiling_in_studio_portrait_2d31b145_ddb0a49d.mp4';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Honey Chestnut',
  'Genius Wefts',
  'Seamless Clip-Ins',
  'Raw Bundles',
  'K-Tips & Pro',
];

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currency, setCurrency] = useState<CurrencyCode>('EUR');
  const [showPromoBar, setShowPromoBar] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeShadeFilter, setActiveShadeFilter] = useState<string | null>(null);

  // Card-level shade preview state
  const [cardShades, setCardShades] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    PRODUCTS.forEach((p) => {
      initial[p.id] = p.availableShades[0];
    });
    return initial;
  });

  // Shade & Texture Studio state
  const [studioShadeId, setStudioShadeId] = useState<string>('honey-chestnut');
  const [studioTextureId, setStudioTextureId] = useState<TextureId>('silky-straight');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<HairProduct | null>(null);
  const [pdpInitialShade, setPdpInitialShade] = useState<string | undefined>(undefined);
  const [pdpInitialTexture, setPdpInitialTexture] = useState<TextureId | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bagNotice, setBagNotice] = useState<string | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterJoined, setNewsletterJoined] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, []);

  const toggleVideoPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsVideoPlaying(true);
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsVideoMuted(video.muted);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCat =
        activeCategory === 'All' ||
        product.category === activeCategory ||
        (activeCategory === 'Honey Chestnut' &&
          product.availableShades.includes('honey-chestnut'));
      const matchesShade =
        !activeShadeFilter ||
        product.isSampleRing ||
        product.availableShades.includes(activeShadeFilter);

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCat && matchesShade;

      const shadeNames = product.availableShades
        .map((id) => getShadeById(id).name.toLowerCase())
        .join(' ');
      const texNames = product.availableTextures
        .map((id) => getTextureById(id).name.toLowerCase())
        .join(' ');
      const haystack = `${product.name} ${product.category} ${product.kicker} ${product.shortDesc} ${shadeNames} ${texNames}`.toLowerCase();
      return matchesCat && matchesShade && haystack.includes(q);
    });
  }, [activeCategory, activeShadeFilter, searchQuery]);

  const totalBagCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleAddToBag = ({
    product,
    shadeId,
    textureId,
    length,
  }: {
    product: HairProduct;
    shadeId: string;
    textureId: TextureId;
    length: LengthOption;
  }) => {
    const key = `${product.id}__${shadeId}__${textureId}__${length.inches}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { key, product, shadeId, textureId, length, quantity: 1 }];
    });

    const shadeName = product.isSampleRing ? '6-Shade Set' : getShadeById(shadeId).name;
    setBagNotice(`${product.name} (${shadeName}) added to your bag`);
    setTimeout(() => setBagNotice(null), 3200);
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key === key));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const openCampaignLook = () => {
    const campaignProduct = PRODUCTS.find((p) => p.id === 'wavy-genius-weft') ?? PRODUCTS[0];
    setPdpInitialShade('honey-chestnut');
    setPdpInitialTexture('silky-straight');
    setSelectedProduct(campaignProduct);
  };

  const handleAddShadeRing = () => {
    const ring = PRODUCTS.find((p) => p.isSampleRing);
    if (!ring) return;
    handleAddToBag({
      product: ring,
      shadeId: 'honey-chestnut',
      textureId: 'silky-straight',
      length: ring.lengths[0],
    });
    setIsCartOpen(true);
  };

  const handleFilterByStudioShade = () => {
    setActiveShadeFilter(studioShadeId);
    setActiveCategory('All');
    const el = document.getElementById('collections');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterJoined(true);
    setNewsletterEmail('');
  };

  const studioShade = getShadeById(studioShadeId);
  const studioTexture = getTextureById(studioTextureId);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1714]">
      {/* Slim Dismissible Announcement Bar */}
      {showPromoBar && (
        <div className="bg-[#1E1714] text-[#FAF7F2] px-4 py-2 text-xs flex items-center justify-center relative">
          <p className="text-center tracking-wide pr-6">
            Complimentary Worldwide Express Shipping Over {formatPrice(250, currency)}
            <span className="mx-2 text-[#C4AC90]" aria-hidden="true">
              ·
            </span>
            100% Single-Donor Extensions &amp; Luxury Wigs
          </p>
          <button
            type="button"
            onClick={() => setShowPromoBar(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#C4AC90] hover:text-[#FAF7F2] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#DFD3C3]">
        <div className="max-w-7xl mx-auto h-16 px-6 md:px-10 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-xl sm:text-2xl md:text-[26px] font-medium tracking-[0.12em] text-[#1E1714] whitespace-nowrap shrink-0"
          >
            MAISON MALWI
          </a>

          {/* Zone 2: 4–5 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm text-[#5C4B41]"
          >
            <a
              href="#collections"
              className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0"
            >
              Collections
            </a>
            <a
              href="#shade-studio"
              className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0"
            >
              Shade Studio
            </a>
            <a
              href="#craftsmanship"
              className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0"
            >
              Our Hair
            </a>
            <a
              href="#reviews"
              className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
            <button
              type="button"
              onClick={() => setIsCareOpen(true)}
              className="hover:text-[#1E1714] transition-colors whitespace-nowrap shrink-0"
            >
              Care Guide
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E1714] text-[#FAF7F2] text-xs font-medium hover:bg-[#362923] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8F5E38]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="tabular-nums">Bag ({totalBagCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Subtle Bag Confirmation Toast */}
      {bagNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 bg-[#1E1714] text-[#FAF7F2] px-5 py-3 text-xs shadow-xl border border-[#5C4B41] flex items-center gap-4"
        >
          <span>{bagNotice}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="underline underline-offset-4 text-[#DFCBB3] hover:text-[#FAF7F2] whitespace-nowrap"
          >
            View Bag
          </button>
        </div>
      )}

      <main className="flex-1">
        {/* SECTION 1: HERO — Animated Studio Video Front & Center */}
        <section className="relative bg-[#D3BDA3] border-b border-[#DFD3C3] overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[560px] lg:min-h-[680px]">
            {/* Editorial Typography Column */}
            <div className="order-2 lg:order-1 lg:col-span-5 relative z-10 px-6 md:px-10 py-12 lg:py-20 flex flex-col justify-between bg-[#F4ECE1] lg:bg-transparent">
              <div className="space-y-6 my-auto">
                <p className="text-xs tracking-wide text-[#5C4B41]">
                  Maison Malwi E-Commerce
                  <span className="mx-2" aria-hidden="true">
                    ·
                  </span>
                  Extensions &amp; Luxury Wigs
                </p>

                <h1
                  className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.05] font-medium text-[#1E1714] tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Effortless movement, crafted to disappear.
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-[#42352D] max-w-md">
                  Shop single-donor Genius Wefts, Seamless Clip-Ins, Raw Bundles, Italian K-Tips,
                  and bespoke wigs—shipped directly to your door with intact cuticles and luminous
                  dimension.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-5">
                  <a
                    href="#collections"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1E1714] text-[#FAF7F2] text-sm font-medium hover:bg-[#362923] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8F5E38]"
                  >
                    <span>Shop Collections</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={openCampaignLook}
                    className="text-sm font-medium text-[#1E1714] underline underline-offset-4 decoration-[#8F5E38] hover:text-[#8F5E38] transition-colors whitespace-nowrap shrink-0"
                  >
                    Shop Campaign Look
                  </button>
                </div>
              </div>

              <div className="pt-10 lg:pt-0 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#5C4B41]">
                <span>100% Single-Donor</span>
                <span aria-hidden="true">·</span>
                <span>12+ Month Longevity</span>
                <span aria-hidden="true">·</span>
                <span>Worldwide Delivery</span>
              </div>
            </div>

            {/* Responsive Studio Video Canvas */}
            <div className="order-1 lg:order-2 lg:col-span-7 relative aspect-video lg:aspect-auto bg-[#D3BDA3]">
              <video
                ref={videoRef}
                src={HERO_VIDEO_SRC}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center lg:object-right"
              />
              <div
                aria-hidden="true"
                className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#D3BDA3] via-[#D3BDA3]/65 to-transparent"
              />

              {/* Studio Controls & Campaign Caption */}
              <div className="absolute bottom-3 right-3 lg:bottom-6 lg:right-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={openCampaignLook}
                  className="hidden sm:inline-flex px-4 py-2 bg-[#FAF7F2]/85 backdrop-blur-xs border border-[#DFD3C3] text-xs text-[#1E1714] hover:bg-[#FAF7F2] transition-colors whitespace-nowrap"
                >
                  Look 01 · Honey Chestnut Genius Weft 22&quot;
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleVideoPlay}
                    aria-label={isVideoPlaying ? 'Pause campaign video' : 'Play campaign video'}
                    className="w-10 h-10 flex items-center justify-center bg-[#FAF7F2]/85 backdrop-blur-xs text-[#1E1714] border border-[#DFD3C3] hover:bg-[#FAF7F2] transition-colors"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleVideoMute}
                    aria-label={isVideoMuted ? 'Unmute campaign video' : 'Mute campaign video'}
                    className="w-10 h-10 flex items-center justify-center bg-[#FAF7F2]/85 backdrop-blur-xs text-[#1E1714] border border-[#DFD3C3] hover:bg-[#FAF7F2] transition-colors"
                  >
                    {isVideoMuted ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SIGNATURE COLLECTIONS (3-Column Grid with Real Product Photos & Multi-Currency) */}
        <section id="collections" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#DFD3C3]">
            <div>
              <p className="text-xs tracking-wide text-[#7D6A5E]">Maison Malwi Boutique</p>
              <h2 className="mt-1 font-display text-3xl md:text-4xl font-medium text-[#1E1714]">
                Signature Collections
              </h2>
            </div>

            {/* Currency Switcher + Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Select currency"
                className="inline-flex items-center border border-[#DFD3C3] bg-[#F1EAE0]"
              >
                {CURRENCIES.map((c) => {
                  const active = currency === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCurrency(c.code)}
                      className={`px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                        active
                          ? 'bg-[#1E1714] text-[#FAF7F2]'
                          : 'text-[#5C4B41] hover:text-[#1E1714]'
                      }`}
                    >
                      {c.code} {c.symbol}
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#7D6A5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wefts, shades..."
                  aria-label="Search hair extensions"
                  className="w-full sm:w-52 pl-8 pr-3 py-2 bg-[#F1EAE0] border border-[#DFD3C3] text-xs text-[#1E1714] placeholder:text-[#7D6A5E] focus:outline-none focus:border-[#1E1714]"
                />
              </div>
            </div>
          </div>

          {/* Interactive Category Segmented Bar + Active Shade Filter Indicator */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Filter collections by category"
              className="flex flex-wrap items-center gap-2"
            >
              {CATEGORIES.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                      active
                        ? 'bg-[#1E1714] text-[#FAF7F2] border-[#1E1714]'
                        : 'bg-transparent text-[#5C4B41] border-[#DFD3C3] hover:border-[#8F5E38] hover:text-[#1E1714]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {activeShadeFilter && (
              <div className="flex items-center gap-3 text-xs text-[#5C4B41]">
                <span>
                  Filtered by shade:{' '}
                  <strong className="font-medium text-[#1E1714]">
                    {getShadeById(activeShadeFilter).name}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveShadeFilter(null)}
                  className="underline underline-offset-4 text-[#8F5E38] hover:text-[#1E1714]"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center border border-[#DFD3C3] bg-[#F1EAE0] mt-8 space-y-3">
              <p className="font-display text-2xl text-[#1E1714]">No extensions match that filter.</p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setActiveShadeFilter(null);
                  setSearchQuery('');
                }}
                className="px-5 py-2 border border-[#1E1714] text-xs font-medium text-[#1E1714] hover:bg-[#1E1714] hover:text-[#FAF7F2] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const activeShadeId =
                  activeShadeFilter && product.availableShades.includes(activeShadeFilter)
                    ? activeShadeFilter
                    : activeCategory === 'Honey Chestnut' &&
                        product.availableShades.includes('honey-chestnut')
                      ? 'honey-chestnut'
                      : (cardShades[product.id] ?? product.availableShades[0]);
                const activeShade = getShadeById(activeShadeId);

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col justify-between bg-[#FAF7F2] border border-[#DFD3C3] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    {/* Visual Area (65%-75% card presence) */}
                    <div className="relative aspect-[4/4.2] bg-[#EFE6DA] border-b border-[#DFD3C3] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setPdpInitialShade(activeShadeId);
                          setPdpInitialTexture(product.defaultTexture);
                          setSelectedProduct(product);
                        }}
                        aria-label={`Inspect ${product.name}`}
                        className="w-full h-full block text-left focus-visible:outline-2 focus-visible:outline-[#8F5E38]"
                      >
                        <HairExtensionVisual
                          form={product.visualForm}
                          shadeId={activeShadeId}
                          textureId={product.defaultTexture}
                          imageUrl={product.imageUrl}
                          imageAlt={product.imageAlt}
                          imagePosition={product.imagePosition}
                          className="transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </button>

                      {product.highlightTag && (
                        <span className="pointer-events-none absolute top-4 left-4 text-[11px] font-medium tracking-wide text-[#5C4B41] bg-[#FAF7F2]/92 px-2.5 py-1 border border-[#DFD3C3]">
                          {product.highlightTag}
                        </span>
                      )}
                    </div>

                    {/* Clean Unboxed Card Metadata & Actions */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#7D6A5E]">
                          {product.category} <span aria-hidden="true">·</span>{' '}
                          {getTextureById(product.defaultTexture).name}
                        </p>
                        <div className="mt-1.5 flex items-baseline justify-between gap-3">
                          <h3 className="text-base font-semibold text-[#1E1714]">
                            <button
                              type="button"
                              onClick={() => {
                                setPdpInitialShade(activeShadeId);
                                setPdpInitialTexture(product.defaultTexture);
                                setSelectedProduct(product);
                              }}
                              className="text-left hover:text-[#8F5E38] transition-colors"
                            >
                              {product.name}
                            </button>
                          </h3>
                          <span className="text-[15px] font-medium text-[#1E1714] tabular-nums whitespace-nowrap">
                            {formatPrice(product.basePrice, currency)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-[#5C4B41]">
                          {product.shortDesc}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Interactive On-Card Shade Swatches */}
                        {!product.isSampleRing && (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {product.availableShades.map((sid) => {
                                const s = getShadeById(sid);
                                const selected = sid === activeShadeId;
                                return (
                                  <button
                                    key={sid}
                                    type="button"
                                    onClick={() =>
                                      setCardShades((prev) => ({ ...prev, [product.id]: sid }))
                                    }
                                    aria-label={`Select ${s.name} on ${product.name}`}
                                    title={s.name}
                                    className={`w-5 h-5 rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                                      selected
                                        ? 'ring-2 ring-[#1E1714] ring-offset-2 ring-offset-[#FAF7F2] scale-105'
                                        : 'border border-[#1E1714]/20 hover:scale-110'
                                    }`}
                                    style={{
                                      background: `linear-gradient(135deg, ${s.rootColor} 0%, ${s.highlightColor} 75%, ${s.sheenColor} 100%)`,
                                    }}
                                  />
                                );
                              })}
                            </div>
                            <span className="text-xs text-[#7D6A5E] truncate">
                              {activeShade.name}
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPdpInitialShade(activeShadeId);
                              setPdpInitialTexture(product.defaultTexture);
                              setSelectedProduct(product);
                            }}
                            className="py-2.5 px-3 border border-[#DFD3C3] text-xs font-medium text-[#1E1714] hover:border-[#1E1714] transition-colors whitespace-nowrap"
                          >
                            Select Length
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddToBag({
                                product,
                                shadeId: activeShadeId,
                                textureId: product.defaultTexture,
                                length: product.lengths[0],
                              })
                            }
                            className="py-2.5 px-3 bg-[#1E1714] text-[#FAF7F2] text-xs font-medium hover:bg-[#362923] transition-colors whitespace-nowrap"
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: DIMENSIONAL SHADE & TEXTURE STUDIO */}
        <section
          id="shade-studio"
          className="bg-[#F1EAE0] border-y border-[#DFD3C3] py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            {/* Interactive Studio Preview */}
            <div className="lg:col-span-5 bg-[#EFE6DA] border border-[#DFD3C3] flex flex-col justify-between min-h-[380px] overflow-hidden">
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <HairExtensionVisual
                  form="genius-weft"
                  shadeId={studioShade.id}
                  textureId={studioTexture.id}
                  imageUrl={studioShade.imageUrl}
                  imageAlt={`${studioShade.name} luxury hair shade preview`}
                  imagePosition="top"
                  className="w-full h-full min-h-[380px] max-h-[460px]"
                />
              </div>
              <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#DFD3C3] flex items-center justify-between text-xs text-[#5C4B41]">
                <span className="font-medium text-[#1E1714]">
                  {studioShade.name} ({studioShade.code})
                </span>
                <span>{studioTexture.name}</span>
              </div>
            </div>

            {/* Shade & Texture Selector Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <p className="text-xs tracking-wide text-[#7D6A5E]">
                  Dimensional Color &amp; Texture Matching
                </p>
                <h2
                  className="font-display text-3xl md:text-4xl font-medium text-[#1E1714]"
                  style={{ textWrap: 'balance' }}
                >
                  Multi-tonal blends crafted to melt into natural hair.
                </h2>
                <p className="text-sm leading-relaxed text-[#5C4B41] max-w-2xl">
                  Every shade combines three to four tonal depths from root to tip—never flat,
                  single-note dye. Pair your preferred tone with our steam-set single-donor
                  textures.
                </p>
              </div>

              {/* 6 Shades */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E1714]">1. Select Shade Profile</span>
                  <span className="text-[#5C4B41]">
                    {studioShade.name} · {studioShade.undertone}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {HAIR_SHADES.map((shade) => {
                    const active = shade.id === studioShade.id;
                    return (
                      <button
                        key={shade.id}
                        type="button"
                        onClick={() => setStudioShadeId(shade.id)}
                        className={`flex items-center gap-2.5 p-3 border text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                          active
                            ? 'bg-[#FAF7F2] border-[#1E1714] text-[#1E1714] font-medium'
                            : 'bg-[#FAF7F2]/60 border-[#DFD3C3] text-[#5C4B41] hover:border-[#8F5E38]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-[#1E1714]/20 shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${shade.rootColor} 0%, ${shade.highlightColor} 75%, ${shade.sheenColor} 100%)`,
                          }}
                        />
                        <span className="truncate">{shade.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[#5C4B41]">{studioShade.description}</p>
              </div>

              {/* 4 Textures */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E1714]">2. Select Strand Texture</span>
                  <span className="text-[#5C4B41]">{studioTexture.density}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {HAIR_TEXTURES.map((tex) => {
                    const active = tex.id === studioTexture.id;
                    return (
                      <button
                        key={tex.id}
                        type="button"
                        onClick={() => setStudioTextureId(tex.id)}
                        className={`p-3 border text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#8F5E38] ${
                          active
                            ? 'bg-[#1E1714] border-[#1E1714] text-[#FAF7F2]'
                            : 'bg-[#FAF7F2]/60 border-[#DFD3C3] text-[#1E1714] hover:border-[#8F5E38]'
                        }`}
                      >
                        <span className="block text-xs font-medium">{tex.name}</span>
                        <span
                          className={`block text-[11px] mt-0.5 ${
                            active ? 'text-[#D5C0A7]' : 'text-[#7D6A5E]'
                          }`}
                        >
                          {tex.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[#5C4B41]">{studioTexture.matchNote}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleFilterByStudioShade}
                  className="px-6 py-3 bg-[#1E1714] text-[#FAF7F2] text-xs font-medium hover:bg-[#362923] transition-colors whitespace-nowrap"
                >
                  Shop {studioShade.name} Extensions
                </button>
                <button
                  type="button"
                  onClick={handleAddShadeRing}
                  className="px-6 py-3 border border-[#1E1714] text-xs font-medium text-[#1E1714] hover:bg-[#1E1714] hover:text-[#FAF7F2] transition-colors whitespace-nowrap tabular-nums"
                >
                  Order 6-Shade Swatch Ring — {formatPrice(25, currency)}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: MAISON MALWI QUALITY & CLIENT PROOF */}
        <section id="craftsmanship" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#DFD3C3]">
            <div>
              <p className="text-xs tracking-wide text-[#7D6A5E]">The Maison Malwi Standard</p>
              <h2 className="mt-1 font-display text-3xl md:text-4xl font-medium text-[#1E1714]">
                Direct-to-Client Luxury Extensions &amp; Wigs
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCareOpen(true)}
              className="text-xs font-medium text-[#1E1714] underline underline-offset-4 decoration-[#8F5E38] hover:text-[#8F5E38] transition-colors self-start md:self-auto"
            >
              Read Hair Care Protocol
            </button>
          </div>

          {/* 3 Craftsmanship Pillars */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1E1714]">
                01. Direct Single-Donor Sourcing
              </h3>
              <p className="text-sm leading-relaxed text-[#5C4B41]">
                Every bundle, wig, and weft originates from one donor with intact cuticles aligned
                from root to tip—never acid-stripped or masked in synthetic silicone gloss.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1E1714]">
                02. Zero-Bulk Genius Construction
              </h3>
              <p className="text-sm leading-relaxed text-[#5C4B41]">
                Micro-sealed Genius Wefts can be cut cleanly at any point with zero unraveling or
                return hair, resting flat and weightless whether worn daily or sewn into custom wigs.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1E1714]">
                03. Worldwide Insured Dispatch
              </h3>
              <p className="text-sm leading-relaxed text-[#5C4B41]">
                Every Maison Malwi online order ships within 24 hours in our signature silk garment
                pouch, with multi-currency checkout in EUR, USD, GBP, and CAD.
              </p>
            </div>
          </div>

          {/* Adjacent Attributable Client Reviews */}
          <div id="reviews" className="mt-16 pt-12 border-t border-[#DFD3C3]">
            <p className="text-xs tracking-wide text-[#7D6A5E]">Verified Client Reviews</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {CLIENT_REVIEWS.map((review) => (
                <blockquote
                  key={review.id}
                  className="p-6 bg-[#F1EAE0] border border-[#DFD3C3] flex flex-col justify-between gap-6"
                >
                  <p className="text-sm leading-relaxed text-[#1E1714]">“{review.quote}”</p>
                  <footer className="space-y-1.5 pt-4 border-t border-[#DFD3C3]">
                    <p className="text-xs font-semibold text-[#1E1714]">{review.author}</p>
                    <p className="text-xs text-[#5C4B41]">
                      {review.role} · {review.location}
                    </p>
                    <p className="text-xs text-[#8F5E38]">{review.outcome}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* QUIET LUXURY FOOTER */}
      <footer className="bg-[#1E1714] text-[#FAF7F2] border-t border-[#362923]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <span className="font-display text-2xl tracking-[0.12em] block">MAISON MALWI</span>
            <p className="text-xs leading-relaxed text-[#C4AC90] max-w-sm">
              Online house of single-donor human hair extensions, Genius Wefts, seamless clip-ins,
              raw bundles, K-tips, and luxury wigs shipped worldwide.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrency(c.code)}
                  className={`px-2.5 py-1 text-[11px] border transition-colors ${
                    currency === c.code
                      ? 'border-[#D5C0A7] bg-[#D5C0A7] text-[#1E1714] font-medium'
                      : 'border-[#473831] text-[#C4AC90] hover:border-[#D5C0A7]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-3 text-xs">
            <p className="font-medium text-[#FAF7F2]">Shop</p>
            <ul className="space-y-2 text-[#C4AC90]">
              <li>
                <a
                  href="#collections"
                  onClick={() => setActiveCategory('Honey Chestnut')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Honey Chestnut
                </a>
              </li>
              <li>
                <a
                  href="#collections"
                  onClick={() => setActiveCategory('Genius Wefts')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Genius Wefts
                </a>
              </li>
              <li>
                <a
                  href="#collections"
                  onClick={() => setActiveCategory('Seamless Clip-Ins')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Seamless Clip-Ins
                </a>
              </li>
              <li>
                <a
                  href="#collections"
                  onClick={() => setActiveCategory('Raw Bundles')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Raw Bundles
                </a>
              </li>
              <li>
                <a
                  href="#collections"
                  onClick={() => setActiveCategory('K-Tips & Pro')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  K-Tips &amp; Pro
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsCareOpen(true)}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Hair Care Protocol
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs">
            <p className="font-medium text-[#FAF7F2]">Private Client List</p>
            <p className="text-[#C4AC90] leading-relaxed">
              Receive shade restock alerts and use code <strong className="text-[#FAF7F2]">MALWI10</strong>{' '}
              at checkout for 10% courtesy on your first order.
            </p>
            {newsletterJoined ? (
              <p className="py-2.5 text-xs text-[#DFCBB3]">
                You are registered on the Maison Malwi Private Client List.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address for private client list"
                  className="flex-1 px-3 py-2 bg-[#2B211D] border border-[#473831] text-xs text-[#FAF7F2] placeholder:text-[#9A897B] focus:outline-none focus:border-[#D5C0A7]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D5C0A7] text-[#1E1714] text-xs font-medium hover:bg-[#E6DACB] transition-colors whitespace-nowrap"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-[#362923] px-6 md:px-10 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9A897B]">
          <span>© {new Date().getFullYear()} Maison Malwi. All rights reserved.</span>
          <span>Single-Donor Cuticle-Aligned Hair Extensions &amp; Wigs</span>
        </div>
      </footer>

      {/* Modals & Slide-Over Bag Drawer */}
      <ProductDetailModal
        product={selectedProduct}
        currency={currency}
        initialShadeId={pdpInitialShade}
        initialTextureId={pdpInitialTexture}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToBag}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        currency={currency}
        onCurrencyChange={setCurrency}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <CareGuideModal isOpen={isCareOpen} onClose={() => setIsCareOpen(false)} />
    </div>
  );
}
