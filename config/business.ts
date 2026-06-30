// ============================================================
// BUSINESS CONFIGURATION
// ============================================================
// This is the ONLY file you need to update to customise
// this template for a new cleaning business.
// All pages, emails, and SEO pull from this config.
// ============================================================

export const BUSINESS = {
  // Core identity
  name: "Taspro Cleaning Solutions",
  shortName: "Taspro",
  tagline: "Perth's trusted cleaning service",
  description: "Professional home, end of lease, commercial, NDIS and deep cleaning services.",

  // Contact
  phone: "+61870816811",
  phoneFormatted: "(08) 7081 6811",
  whatsapp: "+61488853112",
  email: "info@tasprocleaning.com.au",
  adminEmail: "info@tasprocleaning.com.au",

  // Domain & URLs
  domain: "tasprocleaning.com.au",
  url: "https://tasprocleaning.com.au",

  // Address
  city: "Perth",
  state: "Western Australia",
  stateCode: "WA",
  country: "Australia",

  // Credibility
  googleRating: 5.0,
  reviewCount: 50,
  yearsExperience: 5,
  cleanersCount: 20,
  jobsCompleted: 2000,

  // Legal
  abn: "44 396 201 155",
  foundedYear: 2020,

  // Social (leave empty string if not applicable — it won't appear in the footer)
  facebook:  "https://www.facebook.com/profile.php?id=61553367031598",
  instagram: "https://www.instagram.com/tasprocleaning/",
  tiktok:    "https://www.tiktok.com/@tasprocleaning",
  youtube:   "https://www.youtube.com/@tasprocleaningsolutions",
  linkedin:  "https://www.linkedin.com/showcase/104814236/",
  twitter:   "https://x.com/tasprocleaning",
  pinterest: "https://au.pinterest.com/tasprocleaning/",
} as const;

// ============================================================
// SERVICES
// Toggle true/false to enable or disable each service
// ============================================================

export const SERVICES = {
  homeCleaning: true,
  endOfLease:   true,
  commercial:   true,
  deepClean:    true,
  ndis:         true,
  airbnb:       true,
} as const;

// ============================================================
// CITIES & SUBURBS
// Add all cities and their suburbs here.
// The first city in the array is the PRIMARY city (used in
// meta titles and SEO priority).
// fullService: true = all services available
// fullService: false = recurring cleans only
// ============================================================

export const CITIES = [
  {
    name: "Perth",
    slug: "perth",
    state: "WA",
    fullService: true,
    heroImage: "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=1920&q=80",
    suburbs: [
      "Perth CBD", "East Perth", "West Perth", "Northbridge", "Leederville",
      "Subiaco", "Claremont", "Cottesloe", "Fremantle", "Victoria Park",
      "Bentley", "Cannington", "Canning Vale", "Rockingham", "Mandurah",
      "Joondalup", "Wanneroo", "Scarborough", "Karrinyup", "Midland",
      "Bassendean", "Bayswater", "Morley", "Mount Lawley", "Belmont",
      "Armadale", "Thornlie", "Gosnells", "Balga", "Mirrabooka",
    ],
  },
  {
    name: "Launceston",
    slug: "launceston",
    state: "TAS",
    fullService: true,
    heroImage: "https://images.unsplash.com/photo-1598393700990-5e98f3d27eb7?w=1920&q=80",
    suburbs: [
      "Launceston CBD", "Newstead", "Invermay", "Newnham", "Prospect",
      "South Launceston", "Riverside", "Trevallyn", "Mayfield", "Mowbray",
      "Kings Meadows", "Youngtown", "St Leonards", "Summerhill", "Legana",
    ],
  },
  {
    name: "Melbourne",
    slug: "melbourne",
    state: "VIC",
    fullService: false,
    heroImage: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1920&q=80",
    suburbs: [
      "Melbourne CBD", "Southbank", "Docklands", "St Kilda", "South Yarra",
      "Prahran", "Richmond", "Fitzroy", "Carlton", "Collingwood",
      "Brunswick", "Coburg", "Northcote", "Footscray", "Sunshine",
    ],
  },
  {
    name: "Sydney",
    slug: "sydney",
    state: "NSW",
    fullService: false,
    heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80",
    suburbs: [
      "Sydney CBD", "Surry Hills", "Newtown", "Glebe", "Pyrmont",
      "Darlinghurst", "Paddington", "Woollahra", "Bondi", "Coogee",
      "Manly", "Chatswood", "North Sydney", "Parramatta", "Liverpool",
    ],
  },
] as const;

// ============================================================
// PRICING
// ============================================================

export const PRICING = {
  // Base price (1 bed / 1 bath)
  base: 197,

  // Bedroom add-ons (index = bedroom count: [studio/1, 2, 3, 4, 5, 6])
  bedrooms: [0, 30, 65, 90, 110, 140],

  // Bathroom add-ons (index = bathroom count - 1: [1, 2, 3, 4, 5, 6])
  bathrooms: [0, 25, 50, 75, 100, 125],

  // Service multipliers
  endOfLeaseMultiplier: 0.25,
  deepCleanMultiplier:  0.15,

  // Frequency discounts
  weeklyDiscount:      0.15,
  fortnightlyDiscount: 0.10,
  monthlyDiscount:     0.05,

  // Hourly rates
  hourlyRate:     85,
  hourlyMinHours: 3,
  ndisRate:       58.03,
  ndisMinHours:   3,

  // Commercial
  commercialDuringHours: 82.50,
  commercialAfterHours:  94.00,
  commercialMinHours:    2,

  // Currency
  currency:       "AUD",
  currencySymbol: "$",
} as const;

// ============================================================
// BRANDING
// ============================================================

export const BRANDING = {
  // Primary colour (navy blue)
  primaryColor: "#1B3A6B",
  // Accent colour (teal)
  accentColor: "#14B8A6",
  // These map to Tailwind classes used throughout the template
  // If you change colours, update tailwind.config.ts as well
} as const;

// ============================================================
// SEO DEFAULTS
// ============================================================

export const SEO = {
  defaultTitle:       `${BUSINESS.name} | Professional Cleaning Services`,
  titleTemplate:      `%s | ${BUSINESS.name}`,
  defaultDescription: `${BUSINESS.name} — professional home cleaning, end of lease, commercial, NDIS and deep cleaning. Police-checked, fully insured, 5-star rated. Book online instantly.`,
  twitterHandle:      "",
} as const;
