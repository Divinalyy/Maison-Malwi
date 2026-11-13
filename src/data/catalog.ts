export type ProductCategory =
  | 'All'
  | 'Honey Chestnut'
  | 'Genius Wefts'
  | 'Seamless Clip-Ins'
  | 'Raw Bundles'
  | 'K-Tips & Pro';

export type VisualForm =
  | 'genius-weft'
  | 'seamless-clip'
  | 'raw-bundle'
  | 'keratin-ktip'
  | 'sample-ring';

export type TextureId = 'silky-straight' | 'body-wave' | 'natural-spiral' | 'yaki-blowout';

export interface HairShade {
  id: string;
  code: string;
  name: string;
  description: string;
  undertone: string;
  imageUrl?: string;
  rootColor: string;
  midColor: string;
  highlightColor: string;
  tipColor: string;
  sheenColor: string;
}

export interface HairTexture {
  id: TextureId;
  name: string;
  subtitle: string;
  matchNote: string;
  density: string;
}

export interface LengthOption {
  inches: number;
  grams: number;
  priceDelta: number;
}

export interface HairProduct {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'All'>;
  visualForm: VisualForm;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'center' | 'top';
  basePrice: number;
  kicker: string;
  shortDesc: string;
  craftNote: string;
  defaultTexture: TextureId;
  availableTextures: TextureId[];
  availableShades: string[];
  lengths: LengthOption[];
  isSampleRing?: boolean;
  highlightTag?: string;
}

export interface ReviewItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  outcome: string;
}

export const HAIR_SHADES: HairShade[] = [
  {
    id: 'honey-chestnut',
    code: '2/30',
    name: 'Honey Chestnut',
    description: 'Deep espresso base ribboned with warm honey-chestnut face-framing dimension.',
    undertone: 'Warm Golden Neutral',
    imageUrl: '/assets/aistudio/683913893450174250_befadac7.jpeg',
    rootColor: '#1E1410',
    midColor: '#3A2318',
    highlightColor: '#8B5A36',
    tipColor: '#694025',
    sheenColor: '#C59365',
  },
  {
    id: 'espresso-silk',
    code: '2',
    name: 'Espresso Silk',
    description: 'Rich, mirror-gloss dark brown with subtle roasted cacao warmth in daylight.',
    undertone: 'Neutral Warm',
    rootColor: '#17100D',
    midColor: '#2B1B15',
    highlightColor: '#483025',
    tipColor: '#2E1D16',
    sheenColor: '#7A5847',
  },
  {
    id: 'mocha-balayage',
    code: '1B/6',
    name: 'Mocha Balayage',
    description: 'Soft shadow root melting seamlessly into roasted mocha and toasted almond lengths.',
    undertone: 'Balanced Neutral',
    rootColor: '#1A1310',
    midColor: '#3D291F',
    highlightColor: '#7A543B',
    tipColor: '#8E664A',
    sheenColor: '#B58B6C',
  },
  {
    id: 'raw-obsidian',
    code: '1B',
    name: 'Raw Obsidian',
    description: 'Unprocessed natural off-black with authentic single-donor luster and zero blue cast.',
    undertone: 'Natural Off-Black',
    rootColor: '#100C0B',
    midColor: '#1C1614',
    highlightColor: '#342925',
    tipColor: '#1A1412',
    sheenColor: '#5B4B44',
  },
  {
    id: 'caramel-melt',
    code: '4/27',
    name: 'Caramel Melt',
    description: 'Warm sable mid-shaft transitioning into sunlit caramel ribbons for luminous movement.',
    undertone: 'Warm Amber',
    rootColor: '#2E1E16',
    midColor: '#5C3B26',
    highlightColor: '#A97343',
    tipColor: '#B88454',
    sheenColor: '#DAB184',
  },
  {
    id: 'champagne-blonde',
    code: '18/60',
    name: 'Champagne Silk',
    description: 'Beige-sand ivory bronde rooted delicately for lived-in dimensional radiance.',
    undertone: 'Cool Beige',
    rootColor: '#6B5440',
    midColor: '#9E8264',
    highlightColor: '#D6BE9E',
    tipColor: '#E3CFB3',
    sheenColor: '#F6EADF',
  },
];

export const HAIR_TEXTURES: HairTexture[] = [
  {
    id: 'silky-straight',
    name: 'Silky Straight',
    subtitle: 'Glass-cuticle flow',
    matchNote: 'Designed for sleek silk presses, fine-to-medium strands, and sharp editorial lines.',
    density: 'Double-drawn · Full root to tip',
  },
  {
    id: 'body-wave',
    name: 'Body Wave',
    subtitle: 'Effortless S-curve',
    matchNote: 'Holds blowout volume effortlessly and blends naturally with loose waves.',
    density: 'Double-drawn · Weightless movement',
  },
  {
    id: 'natural-spiral',
    name: 'Natural Spiral',
    subtitle: '3B–3C spring definition',
    matchNote: 'Steam-set curl pattern that retains bounce after washing with zero silicone coating.',
    density: 'Single-donor · High elasticity',
  },
  {
    id: 'yaki-blowout',
    name: 'Yaki Blowout',
    subtitle: 'Micro-textured silk press',
    matchNote: 'Mimics freshly blown-out natural 4A–4C hair with authentic micro-density.',
    density: 'Single-donor · Natural luster',
  },
];

export const PRODUCTS: HairProduct[] = [
  {
    id: 'honey-chestnut-hd-wig',
    name: 'Honey Chestnut HD Lace Wig',
    category: 'Honey Chestnut',
    visualForm: 'genius-weft',
    imageUrl: '/assets/aistudio/683913893450174250_befadac7.jpeg',
    imageAlt: 'Maison Malwi Honey Chestnut HD Lace Front Wig with silky straight dimension',
    imagePosition: 'top',
    basePrice: 460,
    kicker: '13x6 Transparent HD Lace · 180% Density',
    shortDesc:
      'Pre-plucked 13x6 HD lace wig in signature Honey Chestnut (2/30) with glass-cuticle silkiness and natural root depth.',
    craftNote:
      'Crafted from 100% single-donor hair with bleached micro-knots and an adjustable glueless elastic band.',
    defaultTexture: 'silky-straight',
    availableTextures: ['silky-straight', 'body-wave'],
    availableShades: ['honey-chestnut', 'espresso-silk', 'mocha-balayage', 'caramel-melt'],
    lengths: [
      { inches: 18, grams: 190, priceDelta: 0 },
      { inches: 20, grams: 210, priceDelta: 45 },
      { inches: 22, grams: 230, priceDelta: 95 },
      { inches: 24, grams: 250, priceDelta: 145 },
    ],
    highlightTag: 'Honey Chestnut',
  },
  {
    id: 'silky-genius-weft',
    name: 'Signature Silky Genius Weft',
    category: 'Genius Wefts',
    visualForm: 'genius-weft',
    imageUrl: '/assets/aistudio/What_are_Genius_Weft_Hair_Extensions__cdfe023b.jpeg',
    imageAlt: 'Maison Malwi Signature Silky Genius Weft hair extensions with ultra-thin seamless track',
    basePrice: 285,
    kicker: 'Cut-Anywhere Micro Track · 100% Remy',
    shortDesc:
      'Paper-thin, zero-return-hair weft engineered to lie completely flat against the scalp without shedding when cut.',
    craftNote:
      'Un-acid-bathed single-donor cuticles preserve silky movement and natural luster for 12+ months of wear.',
    defaultTexture: 'silky-straight',
    availableTextures: ['silky-straight', 'body-wave'],
    availableShades: ['champagne-blonde', 'honey-chestnut', 'espresso-silk', 'mocha-balayage', 'raw-obsidian'],
    lengths: [
      { inches: 18, grams: 60, priceDelta: 0 },
      { inches: 20, grams: 65, priceDelta: 40 },
      { inches: 22, grams: 75, priceDelta: 85 },
      { inches: 24, grams: 85, priceDelta: 130 },
    ],
    highlightTag: 'Bestseller',
  },
  {
    id: 'wavy-genius-weft',
    name: 'Wavy Dimensional Genius Weft',
    category: 'Genius Wefts',
    visualForm: 'genius-weft',
    imageUrl: '/assets/aistudio/BEAUTIFUL_WAVY_GENIUS_WEFT_1a266e24.jpeg',
    imageAlt: 'Maison Malwi Wavy Dimensional Genius Weft bundles in sunlit blonde and mocha highlight blends',
    basePrice: 295,
    kicker: 'Featherlight Body Wave · Double-Drawn',
    shortDesc:
      'Multi-tonal wavy Genius Weft designed for soft, airy volume and effortless dimensional blending.',
    craftNote:
      'Zero heavy seam bulk and custom-blended ribbons allow seamless multi-row or custom wig construction.',
    defaultTexture: 'body-wave',
    availableTextures: ['body-wave', 'silky-straight'],
    availableShades: ['caramel-melt', 'champagne-blonde', 'mocha-balayage', 'honey-chestnut'],
    lengths: [
      { inches: 18, grams: 60, priceDelta: 0 },
      { inches: 20, grams: 65, priceDelta: 45 },
      { inches: 22, grams: 75, priceDelta: 90 },
    ],
    highlightTag: 'Campaign Look',
  },
  {
    id: 'seamless-clip-set',
    name: 'Seamless Chestnut Clip-In Set',
    category: 'Seamless Clip-Ins',
    visualForm: 'seamless-clip',
    imageUrl: '/assets/aistudio/How_to_Install_Philocaly_Clip-In_Hair_Extensions_2f4e84b3.jpeg',
    imageAlt: 'Maison Malwi 7-piece Seamless Clip-In Hair Extension Set with ultra-flat PU tracks',
    basePrice: 310,
    kicker: '7-Piece Silicone Band · Instant Volume',
    shortDesc:
      'Ultra-flat PU-bonded clip-in tracks with color-matched micro clips that disappear even in fine hairlines.',
    craftNote:
      'Includes 7 graduated wefts (160g–220g) for full-head volume and length in five minutes at home.',
    defaultTexture: 'silky-straight',
    availableTextures: ['silky-straight', 'body-wave', 'yaki-blowout'],
    availableShades: ['honey-chestnut', 'espresso-silk', 'mocha-balayage', 'raw-obsidian', 'champagne-blonde'],
    lengths: [
      { inches: 16, grams: 160, priceDelta: 0 },
      { inches: 18, grams: 180, priceDelta: 35 },
      { inches: 20, grams: 200, priceDelta: 75 },
      { inches: 22, grams: 220, priceDelta: 115 },
    ],
    highlightTag: '7-Piece Full Set',
  },
  {
    id: 'bouncy-curl-clip-set',
    name: 'Bouncy Wave Clip-In & Care Set',
    category: 'Seamless Clip-Ins',
    visualForm: 'seamless-clip',
    imageUrl: '/assets/aistudio/Curly_Hair_Extensions___Bouncy_Curls__All_Shades_c866b1c8.jpeg',
    imageAlt: 'Maison Malwi Bouncy Wave Hair Extensions paired with silk scrunchie and detangling brushes',
    basePrice: 325,
    kicker: 'Sculpted Wave Pattern · Silk Scrunchie Included',
    shortDesc:
      'Springy, high-elasticity wave extensions engineered to hold natural movement without crunch or frizz.',
    craftNote:
      'Steam-set single-donor strands shipped with a mulberry silk tie so your waves stay defined wash after wash.',
    defaultTexture: 'natural-spiral',
    availableTextures: ['natural-spiral', 'body-wave'],
    availableShades: ['mocha-balayage', 'champagne-blonde', 'caramel-melt', 'honey-chestnut'],
    lengths: [
      { inches: 16, grams: 160, priceDelta: 0 },
      { inches: 18, grams: 180, priceDelta: 35 },
      { inches: 20, grams: 200, priceDelta: 75 },
    ],
  },
  {
    id: 'single-donor-raw-bundle',
    name: 'Ivory Highlighted Raw Bundle',
    category: 'Raw Bundles',
    visualForm: 'raw-bundle',
    imageUrl: '/assets/aistudio/______Ivory_Blond_Highlights_Bundles_That_Match_Black_Hair_02189e22.jpeg',
    imageAlt: 'Maison Malwi Ivory Highlighted Single-Donor Raw Human Hair Bundle',
    basePrice: 240,
    kicker: 'Unprocessed Single-Donor · 110g Bundle',
    shortDesc:
      'Collected from one donor with intact cuticles, rich ivory-blonde ribbons, and full double-drawn ends.',
    craftNote:
      'Ideal for custom lace wigs, sew-ins, or tonal highlights—free of heavy silicone coatings.',
    defaultTexture: 'silky-straight',
    availableTextures: ['silky-straight', 'body-wave', 'natural-spiral', 'yaki-blowout'],
    availableShades: ['champagne-blonde', 'mocha-balayage', 'honey-chestnut', 'raw-obsidian'],
    lengths: [
      { inches: 16, grams: 110, priceDelta: 0 },
      { inches: 18, grams: 110, priceDelta: 30 },
      { inches: 20, grams: 115, priceDelta: 65 },
      { inches: 24, grams: 120, priceDelta: 120 },
    ],
    highlightTag: 'Single-Donor',
  },
  {
    id: 'italian-keratin-ktips',
    name: 'Precision Italian K-Tip Strands',
    category: 'K-Tips & Pro',
    visualForm: 'keratin-ktip',
    imageUrl: '/assets/aistudio/K_tips_in_stock_80cccf44.jpeg',
    imageAlt: 'Maison Malwi Precision Italian Keratin K-Tip Strands in dimensional bronde with micro-beads',
    basePrice: 265,
    kicker: '25g Pack (25 Strands) · Italian Keratin',
    shortDesc:
      'Pre-bonded with medical-grade clear Italian keratin for 360-degree natural movement and discreet parting.',
    craftNote:
      'Engineered for seamless crown and hairline placement where weft tracks cannot reach.',
    defaultTexture: 'silky-straight',
    availableTextures: ['silky-straight', 'body-wave'],
    availableShades: ['mocha-balayage', 'champagne-blonde', 'caramel-melt', 'honey-chestnut', 'raw-obsidian'],
    lengths: [
      { inches: 18, grams: 25, priceDelta: 0 },
      { inches: 20, grams: 25, priceDelta: 35 },
      { inches: 22, grams: 30, priceDelta: 70 },
    ],
    highlightTag: 'In Stock',
  },
  {
    id: 'atelier-shade-ring',
    name: 'Maison Malwi Dimensional Shade Ring',
    category: 'K-Tips & Pro',
    visualForm: 'sample-ring',
    basePrice: 25,
    kicker: '6 Real Hair Swatches · Credit Toward First Order',
    shortDesc:
      'Evaluate all six signature Maison Malwi dimensional tones in natural daylight before ordering your full set.',
    craftNote:
      'Crafted from real single-donor strands. Includes a $25 store credit voucher inside your box.',
    defaultTexture: 'silky-straight',
    availableTextures: ['silky-straight'],
    availableShades: ['honey-chestnut'],
    lengths: [{ inches: 8, grams: 30, priceDelta: 0 }],
    isSampleRing: true,
    highlightTag: 'Shade Match Tool',
  },
];

export const CLIENT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    quote:
      'Ordering my Genius Wefts online from Maison Malwi was seamless. The Honey Chestnut dimension matched my hair right out of the silk pouch and stayed silky through three washes.',
    author: 'Camille Laurent',
    role: 'Verified Maison Malwi Client',
    location: 'Los Angeles',
    outcome: '11-month wear with zero shedding or tangling',
  },
  {
    id: 'rev-2',
    quote:
      'Most clip-ins feel bulky at the crown. The Seamless Chestnut Clip-In Set lies completely flat, washes clean, and blends into my fine layers in under five minutes.',
    author: 'Nadia Okafor',
    role: 'Verified Maison Malwi Client',
    location: 'London',
    outcome: '5-minute home install with undetectable tracks',
  },
  {
    id: 'rev-3',
    quote:
      'True single-donor bundles are rare to find online. The Ivory Highlighted Raw Bundle had full ends from root to tip and zero synthetic gloss coating.',
    author: 'Sora Takahashi',
    role: 'Verified Maison Malwi Client',
    location: 'New York',
    outcome: 'Double-drawn fullness across 22-inch bundles',
  },
];

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.92 },
  { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1.0 },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.79 },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)', rate: 1.38 },
];

export function formatPrice(usdAmount: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[1];
  const converted = usdAmount * cfg.rate;
  if (currency === 'EUR') {
    return `${converted.toFixed(2).replace('.', ',')} €`;
  }
  return `${cfg.symbol}${converted.toFixed(2)}`;
}

export function getShadeById(id: string): HairShade {
  return HAIR_SHADES.find((s) => s.id === id) ?? HAIR_SHADES[0];
}

export function getTextureById(id: TextureId): HairTexture {
  return HAIR_TEXTURES.find((t) => t.id === id) ?? HAIR_TEXTURES[0];
}

